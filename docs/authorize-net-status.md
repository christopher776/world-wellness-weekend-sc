# Authorize.Net integration status

Code path is credential-gated. Without the required Vercel environment variables, marketplace reservations continue to work and buyers receive the existing payment-follow-up fallback. Once the credentials are added and production is redeployed, the same reservation flow produces an immediate Accept Hosted Pay Now action.
