# SMARTBYTE Activation & Annual Subscription

## Customer flow
1. Customer selects one-service or two-service annual plan.
2. Customer enters name, mobile number and email.
3. Customer chooses Online Payment or Cash on Visit.
4. Online orders are activated only after the server verifies the payment gateway signature/webhook.
5. Cash on Visit requests remain PENDING until an owner-authorized account confirms receipt.
6. On confirmed payment, the server issues a unique activation code/license valid for 365 days from confirmation.
7. The app validates the license with the server and binds it to the permitted device(s). Expired or revoked licenses are locked.

## Customer trust notice
**Pay safely:** To avoid online fraud, you may choose Cash on Visit. Pay only after meeting and verifying an authorized SMARTBYTE TECHNOLOGIES representative in person. Ask for an official receipt. Do not pay an unknown person or share OTPs, passwords or banking PINs. Activation is issued only after payment is confirmed by SMARTBYTE.

## Required security design
- No activation master key, payment secret, or owner credential may be shipped in the Android app or public frontend.
- The public app must never be trusted to mark an order as paid.
- Payment order creation, signature/webhook verification, license issuance, expiry checks, revocation and device binding must run on a trusted backend.
- Cash requests must be owner-confirmed on an authenticated owner dashboard.
- Store only hashed activation codes where practical; rate-limit activation attempts and audit owner actions.
- Do not store card, UPI PIN, OTP, or bank-login credentials.

## Current implementation status
This repository currently contains a local/offline admin app and does not have a server API, database, owner authentication, activation service, or payment gateway. Therefore this document is a design/implementation checklist, not a working activation system. Do not advertise activation or online payment as live until the backend and payment verification are deployed and tested.

## Decisions/configuration still needed before production
- Owner-approved prices for the one-service and two-service annual plans (both 365 days).
- Payment gateway merchant account and KYC (Razorpay is a candidate; not connected yet).
- A secure backend/database deployment and owner-only authentication.
- Policy for device limit and temporary offline validation.
