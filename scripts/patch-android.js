const fs = require('fs');
const path = require('path');
const htmlPath = path.join(process.cwd(), 'www', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
const start = html.indexOf('async function deliverJpg(');
const end = html.indexOf('\n\nwindow.downloadQuoteJpg', start);
if (start < 0 || end < 0) throw new Error('Could not locate JPG delivery function');
const replacement = `async function deliverJpg(blob,name,label){
  if(!blob){alert('JPG तयार झाले नाही.');return}
  try{await saveDownloadEntry(blob,name,label)}catch(e){console.error(e)}
  try{
    if(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform()){
      const bridge=window.Capacitor.Plugins&&window.Capacitor.Plugins.JpgDownload;
      if(bridge&&bridge.saveJpg){
        const dataUrl=await blobDataUrl(blob);
        await bridge.saveJpg({name:name,data:dataUrl.split(',')[1]});
        alert('JPG मोबाईलच्या Downloads फोल्डरमध्ये सेव्ह झाले: '+name);
        return;
      }
    }
  }catch(e){console.error('Native JPG save failed',e);alert('Downloads मध्ये सेव्ह करता आले नाही. पुन्हा प्रयत्न करा.');return}
  try{
    const file=new File([blob],name,{type:'image/jpeg'});
    if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){
      await navigator.share({files:[file],title:label,text:'SMARTBYTE TECHNOLOGIES'});return;
    }
  }catch(e){if(e&&e.name==='AbortError')return}
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),30000);
  alert('JPG तयार झाले. Downloads फोल्डर तपासा.');
}`;
html = html.slice(0,start) + replacement + html.slice(end);
fs.writeFileSync(htmlPath, html);
const javaRoot = path.join(process.cwd(),'android','app','src','main','java');
function walk(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,ent.name);if(ent.isDirectory())walk(p);else if(ent.name==='MainActivity.java')patchMain(p)}}
function patchMain(file){
  let s=fs.readFileSync(file,'utf8');
  if(!s.includes('import android.os.Bundle;')) s=s.replace(/(package [^;]+;)/, '$1\\n\\nimport android.os.Bundle;');
  if(!s.includes('JpgDownloadPlugin.class')){
    s=s.replace(/(public void onCreate\\(Bundle savedInstanceState\\)\\s*\\{)/, '$1\\n        registerPlugin(JpgDownloadPlugin.class);');
    if(!s.includes('JpgDownloadPlugin.class')) s=s.replace(/(public class MainActivity extends BridgeActivity \\{)/, '$1\\n    @Override\\n    public void onCreate(Bundle savedInstanceState) {\\n        registerPlugin(JpgDownloadPlugin.class);\\n        super.onCreate(savedInstanceState);\\n    }');
    if(!s.includes('JpgDownloadPlugin.class')) throw new Error('Unable to register JPG plugin in MainActivity');
    fs.writeFileSync(file,s);
  }
}
walk(javaRoot);
const pluginDir=path.join(javaRoot,'com','smartbyte','technologies');
fs.mkdirSync(pluginDir,{recursive:true});
const plugin = `package com.smartbyte.technologies;

import android.content.ContentValues;
import android.net.Uri;
import android.os.Build;
import android.provider.MediaStore;
import android.util.Base64;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.OutputStream;

@CapacitorPlugin(name = "JpgDownload")
public class JpgDownloadPlugin extends Plugin {
  @PluginMethod
  public void saveJpg(PluginCall call) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
      call.reject("Android 10 or newer is required for direct Downloads saving");
      return;
    }
    String name = call.getString("name", "SmartByte.jpg").replaceAll("[^A-Za-z0-9._-]", "_");
    String encoded = call.getString("data");
    if (encoded == null || encoded.isEmpty()) { call.reject("Missing JPG data"); return; }
    Uri uri = null;
    try {
      byte[] bytes = Base64.decode(encoded, Base64.DEFAULT);
      ContentValues values = new ContentValues();
      values.put(MediaStore.MediaColumns.DISPLAY_NAME, name);
      values.put(MediaStore.MediaColumns.MIME_TYPE, "image/jpeg");
      values.put(MediaStore.MediaColumns.RELATIVE_PATH, "Download");
      values.put(MediaStore.MediaColumns.IS_PENDING, 1);
      uri = getContext().getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
      if (uri == null) throw new Exception("Could not create Downloads file");
      try (OutputStream out = getContext().getContentResolver().openOutputStream(uri)) {
        if (out == null) throw new Exception("Could not open Downloads file");
        out.write(bytes);
      }
      ContentValues done = new ContentValues();
      done.put(MediaStore.MediaColumns.IS_PENDING, 0);
      getContext().getContentResolver().update(uri, done, null, null);
      JSObject result = new JSObject();
      result.put("name", name);
      result.put("uri", uri.toString());
      call.resolve(result);
    } catch (Exception e) {
      if (uri != null) getContext().getContentResolver().delete(uri, null, null);
      call.reject("JPG save failed: " + e.getMessage(), e);
    }
  }
}`;
fs.writeFileSync(path.join(pluginDir,'JpgDownloadPlugin.java'),plugin);
console.log('Patched Android native JPG Downloads support.');
