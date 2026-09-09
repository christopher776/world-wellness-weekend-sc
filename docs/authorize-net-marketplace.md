# Authorize.Net marketplace checkout

The Make It Mine marketplace uses Authorize.Net Accept Hosted for immediate payment after a shopper freezes a declining marketplace price.

## Environment variables
Set these in the SC Wellness Weekend Vercel project for Production (and Preview only if deliberately testing with sandbox credentials):

- `AUTHORIZENET_API_LOGIN_ID`
- `AUTHORIZENET_TRANSACTION_KEY`
- `AUTHORIZENET_SIGNATURE_KEY`
- `AUTHORIZENET_ENVIRONMENT=production`

Never commit gateway credentials to GitHub.

## Checkout flow
1. Shopper submits Make This Mine.
2. Server recalculates the live price and writes the encrypted reservation, freezing inventory and price.
3. Server requests an Authorize.Net Accept Hosted token for that frozen amount.
4. Shopper receives a Pay Now action that POSTs the token directly to Authorize.Net.
5. Authorize.Net handles card entry and payment.
6. Authorize.Net sends a signed `net.authorize.payment.authcapture.created` webhook to SC Wellness Weekend.
7. The webhook is HMAC-SHA512 verified with the Signature Key and marks the matching marketplace order PAID using the merchant reference ID.
8. Payment is logged to the operational Google Sheet and payment confirmation emails are sent.

## Authorize.Net webhook
Create an active webhook in the Authorize.Net Merchant Interface with endpoint:

`https://scwellness.org/api/marketplace/authorize-net/webhook`

Subscribe to **Payment > Authcapture Created**. The production Signature Key in Vercel must match the active Authorize.Net Signature Key.

## Safety
- A reservation remains SOLD / RESERVED before payment.
- A verified payment changes admin status to PAID.
- Unpaid/test reservations can be released from Marketplace Admin.
- PAID reservations cannot be released through the simple reset action; gateway refund/void handling must occur first.
