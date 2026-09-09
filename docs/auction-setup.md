# Make It Mine marketplace

SC Wellness Weekend uses a fixed-price declining marketplace rather than an auction.

## Pricing rule
Every listing starts at 100% of the administrator-entered retail value at `LaunchAt`. From that instant until `EndAt`, the offered price declines continuously and linearly with elapsed time. At `EndAt`, the mathematical price reaches exactly 15% of retail and remains at that floor until the listing is manually unpublished or reserved. There are no bids, bid increments, competing offers or discrete discount steps. For the event campaign, administrators should set `EndAt` to the official event close. The browser updates the display every 100ms for a smooth visual decline. The purchase endpoint independently recalculates the price on the server at the instant a shopper submits a reservation; the browser-displayed value is never trusted as the transaction price. Retail value, countdown timing and inventory quantity are locked by the admin API once a price drop has begun so an active offer cannot be repriced or have inventory semantics changed retroactively.

## Inventory
Listings are created at `/admin/marketplace` with photo, description, provider, retail value, launch/end time, quantity, fulfillment, terms, tax category, featured and published status. The live source of truth is Vercel Blob, reusing the Blob store already configured for website image uploads. Each inventory unit has a deterministic reservation slot written with overwrite disabled. The first successful write owns that slot, preventing two shoppers from reserving the same unit. Reserved inventory remains unavailable while payment is pending; failed/abandoned reservations must be released administratively before that unit can be offered again.

Buyer contact information is AES-256-GCM encrypted before storage. The encrypted `.enc` blob may live in the site's existing public-access Blob store for compatibility, but its contents are ciphertext and the decryption key remains server-side in the admin secret. The separate public reservation slot contains no purchaser PII.

## Operational spreadsheet
The workbook `SC Wellness Make It Mine Marketplace` contains `MarketplaceItems`, `MarketplaceCustomers`, `MarketplaceOrders`, and `Compliance`. The site attempts a best-effort mirror of listing updates into `MarketplaceItems` through the existing CMS webhook. Blob remains the live commerce source of truth so marketplace operation does not depend on Apps Script availability.

## Payment
The website's existing Authorize.Net Simple Checkout catalog uses fixed-price payment links and cannot safely accept the continuously changing marketplace price. The Make It Mine action therefore locks the current server price and inventory, captures purchaser contact information, and creates a reserved order for secure payment follow-up. A reservation is not treated as paid until payment is successfully collected. A dynamic Authorize.Net Accept Hosted or equivalent server-side checkout can be added later without changing the pricing or inventory engine.

## Tax / legal display
The public page states that SC Wellness Weekend is not a charitable organization, marketplace purchases are retail transactions, purchases are not represented as tax-deductible contributions, and applicable tax is handled at payment. Item-level tax categories are retained for fulfillment/payment review.
