# SMARTBYTE Cash Subscription & Activation

## Approved business rules
- One-service annual plan: INR 999 for 365 days.
- Two-service annual plan: INR 1,499 for 365 days.
- Payment method: CASH ONLY. Do not show Razorpay, UPI, card, net banking, or online payment options.
- Customer chooses a plan and submits name, mobile number, and preferred visit details.
- Customer pays only after meeting an authorized SMARTBYTE TECHNOLOGIES representative in person and verifying company identity.
- The representative gives an official receipt.
- Customer cannot mark their own order as paid or activate the license.

## Customer flow
1. Customer selects one-service or two-service annual plan.
2. Customer submits name, mobile number, and visit/contact preference.
3. App displays the Cash on Visit safety notice and creates a request with status PENDING.
4. An authorized representative visits the customer. Customer verifies the representative's company identity before handing over cash.
5. Representative records the payment in the authenticated owner/admin system.
6. Owner confirms receipt. The server records amount, plan, date, representative, and receipt/reference number.
7. Only after owner confirmation, the server issues a unique activation code/license valid for 365 days from the confirmed payment date.
8. App validates the license with the server. Expired or revoked licenses are locked.

## Customer safety notice
**Cash payment only:** Please pay only after an authorized SMARTBYTE TECHNOLOGIES representative meets you in person and you verify their company identity. Ask for an official receipt. Do not send money online, transfer money to a personal UPI ID, or share OTPs, passwords, or banking PINs. Your app is activated only after SMARTBYTE confirms receipt of cash.

## Owner/admin requirements
- Owner-only authenticated login; never hard-code owner passwords or master activation keys in the app.
- List customer requests with PENDING, PAID, ACTIVATED, EXPIRED, and CANCELLED statuses.
- Owner confirmation required before activation.
- Record payment amount, plan, date/time, representative, and receipt number; maintain an audit log.
- Generate unique, non-guessable activation codes on the server; store hashes where practical.
- Support expiry, renewal, revocation, device binding, and rate-limited activation attempts.
- Owner can correct mistakes with an auditable action; customers cannot change payment status.

## Current repository / implementation status
The repository currently contains a static HTML/JavaScript admin app packaged with Capacitor. It does not currently contain a backend API, database, owner authentication, cash-payment ledger, or activation/license service. A static frontend alone cannot securely enforce payment confirmation or a one-year activation lock. Do not claim these features are live or distribute an APK as production-ready until the backend is deployed and the complete flow is tested.

## Remaining implementation work
1. Choose and provision a secure backend/database (for example, a managed database plus server-side functions).
2. Implement owner authentication and role-protected admin endpoints.
3. Implement customer cash-payment requests and owner-only payment confirmation.
4. Implement server-side license issuance, 365-day expiry, renewal, revocation, and device binding.
5. Connect the Android app to the API; remove any client-side trust for paid/activated states.
6. Test pending cash requests, owner confirmation, duplicate confirmation prevention, incorrect codes, expiry, renewal, revoked licenses, and offline behavior.
7. Build a new APK and verify it on a real Android phone before release.

## Security and privacy
- Never commit API secrets, signing keys, passwords, OTPs, or customer identity documents to this public repository.
- Do not collect Aadhaar/PAN or other KYC data inside the app unless legally necessary and appropriately secured.
- Keep only the minimum customer details needed to arrange the visit and issue a receipt.
