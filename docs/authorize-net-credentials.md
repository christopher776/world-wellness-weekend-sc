# Secure Authorize.Net credential handling

Do not place Authorize.Net credentials in GitHub, source files, Google Sheets, email, chat, or client-side JavaScript.

The production checkout reads these values only from Vercel server-side environment variables:

- AUTHORIZENET_API_LOGIN_ID
- AUTHORIZENET_TRANSACTION_KEY
- AUTHORIZENET_SIGNATURE_KEY
- AUTHORIZENET_ENVIRONMENT

The browser receives only the short-lived Accept Hosted payment token returned by the server. The API Login ID, Transaction Key and Signature Key remain server-side.
