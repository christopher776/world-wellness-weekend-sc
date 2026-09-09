# Make It Mine marketplace

SC Wellness Weekend uses a fixed-price declining marketplace rather than an auction.

## Pricing rule
Every listing starts at 100% of the administrator-entered retail value at `LaunchAt`. From that instant until `EndAt`, the offered price declines continuously and linearly with elapsed time. At `EndAt`, the mathematical price reaches exactly 15% of retail and remains at that floor until the listing is manually unpublished or reserved. There are no bids, bid increments, competing offers or discrete discount steps. For the event campaign, administrators should set `EndAt` to the official event close. The browser updates the display every 100ms for a smooth visual decline. The purchase endpoint independently recalculates the price on the server at the instant a shopper submits a reservation; the browser-displayed value is never trusted as the transaction price. Retail value, countdown timing and core listing details are locked by the admin API once a price drop has begun.

## Inventory
Each marketplace listing represents one unique item, experience, certificate or package. If a partner provides multiple identical units, create a separate listing for each unit. This keeps the first-to-reserve behavior atomic and easy to audit. Listings are created at `/admin/marketplace` with photo, description, provider, retail value, launch/end time, fulfillment, terms, tax category, featured and published status. A photo and an explicit tax category are required before publishing. The live source of truth is Vercel Blob, reusing the Blob store already configured for website image uploads. Each listing has one deterministic reservation record written with overwrite disabled, so two shoppers cannot successfully reserve the same listing.

Buyer contact information is AES-256-GCM encrypted before storage. Encrypted order records use random opaque filenames; the public reservation record contains no purchaser PII and no order identifier. The decryption key remains server-side in the admin secret. Reserved inventory remains unavailable while payment is pending; failed/abandoned reservations must be released administratively before that item can be offered again.

## Operational spreadsheet
The workbook `SC Wellness Make It Mine Marketplace` contains `MarketplaceItems`, `MarketplaceCustomers`, `MarketplaceOrders`, and `Compliance`. The site attempts a best-effort mirror of listing updates into `MarketplaceItems` through the existing CMS webhook. Blob remains the live commerce source of truth so marketplace operation does not depend on Apps Script availability.

## Payment
The website's existing Authorize.Net Simple Checkout catalog uses fixed-price payment links and cannot safely accept the continuously changing marketplace price. The Make It Mine action therefore locks the current server price and inventory, captures purchaser contact information, and creates a reserved order for secure payment follow-up. A reservation is not treated as paid until payment is successfully collected. A dynamic Authorize.Net Accept Hosted or equivalent server-side checkout can be added later without changing the pricing or inventory engine.

## Tax / legal display
The public page states that SC Wellness Weekend is not a charitable organization, marketplace purchases are retail transactions, purchases are not represented as tax-deductible contributions, and applicable tax is handled at payment. Item-level tax categories are retained for fulfillment/payment review.

## Production launch checklist
1. Vercel preview build is `READY` with no build errors.
2. `/marketplace` loads and shows a safe empty state before listings exist.
3. `/admin/marketplace` loads behind the existing admin authentication and confirms Blob storage is ready.
4. Create the first listing as Draft, including photo, description, verified retail value, explicit tax category, launch time and event-close floor time.
5. Review the public card before setting Published.
6. For launch verification, use a controlled test listing and remove/release its reservation after the test. Do not use a live donated item for destructive testing.
7. Confirm the operational process for collecting payment promptly after a reservation and releasing abandoned reservations.
