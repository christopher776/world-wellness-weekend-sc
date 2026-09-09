# Marketplace payment verification checklist

Before live activation:

1. Add the Authorize.Net API Login ID, Transaction Key, Signature Key and `AUTHORIZENET_ENVIRONMENT=production` to Vercel Production environment variables.
2. Redeploy production so the serverless functions receive the new variables.
3. In Authorize.Net, create an Active webhook pointing to `https://scwellness.org/api/marketplace/authorize-net/webhook` and subscribe to Payment > Authcapture Created.
4. Confirm Authorize.Net transaction processing is in Live Mode.
5. Release the prior Christian Lacroix test reservation from Marketplace Admin so the item becomes available again.
6. Perform one controlled low-value marketplace checkout.
7. Verify the Make It Mine amount freezes before checkout.
8. Verify the Authorize.Net hosted page charges the exact frozen amount.
9. Verify Marketplace Admin changes from SOLD / RESERVED to PAID and displays the gateway transaction ID.
10. Verify the claim and payment events appear in the operational Google Sheet and that reservation/payment emails arrive.
11. Do not use the Release/Test Reset action on a PAID order. Use Authorize.Net void/refund handling for completed payments.
