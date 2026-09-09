# Authorize.Net webhook setup

Endpoint: `https://scwellness.org/api/marketplace/authorize-net/webhook`

Event: Payment > Authcapture Created

The endpoint validates `X-ANET-Signature` with HMAC-SHA512 using `AUTHORIZENET_SIGNATURE_KEY`, then matches `merchantReferenceId` to the marketplace order ID and changes that reservation to PAID.
