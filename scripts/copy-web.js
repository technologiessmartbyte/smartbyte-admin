const fs = require('fs');
const path = require('path');
const root = process.cwd();
const out = path.join(root, 'www');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const file of ['index.html', 'manifest.webmanifest', 'sw.js', 'icon-512.png']) {
  const src = path.join(root, file);
  if (!fs.existsSync(src)) throw new Error('Missing required web file: ' + file);
  fs.copyFileSync(src, path.join(out, file));
}
console.log('SmartByte web app copied to www/');
