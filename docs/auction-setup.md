# Auction activation setup

The auction feature reuses the website's existing Google Sheets CMS webhook and protected admin authentication. No new Vercel environment variables are required if the current CMS/admin setup is already working.

## Required Google Sheets tabs

Create these three tabs in the same spreadsheet already used by `CMS_WEBHOOK_URL` / `GOOGLE_SHEETS_WEBHOOK_URL`. The existing generic Apps Script `list` and authenticated `upsert` handlers support them without code changes.

### AuctionItems

Header row, columns A–N:

`ID | Title | PhotoURL | Description | DonorName | RetailValue | StartingBid | BidIncrement | OpensAt | ClosesAt | PickupDetails | Terms | Featured | Published`

Admin route: `/admin/auction`

Public route: `/auction`

### AuctionBidders

Header row, columns A–G:

`ID | Name | DisplayName | Email | Phone | RegisteredAt | Status`

Bidder contact details are never rendered publicly. The public UI uses only `DisplayName`, which is reduced to first name + last initial.

### AuctionBids

Header row, columns A–F:

`ID | ItemID | BidderID | BidderDisplay | Amount | Timestamp`

Each accepted bid is stored as its own immutable row ID. Public status is calculated from the highest accepted `Amount` for each `ItemID`.

## Admin workflow

1. Sign in at `/admin`.
2. Open **Auction Listings**.
3. Upload the primary photo or paste an image URL.
4. Enter title, description, donor, retail value, starting bid, bid increment, opening/closing times, pickup details and item terms.
5. Check **Published / visible** when the listing is ready.
6. The item appears on `/auction` immediately; no redeploy is required for catalog changes.

## Bidder workflow

1. Visitor opens `/auction`.
2. Visitor registers once with name, email and mobile phone.
3. The server writes the bidder record and returns a signed bidder session stored in the visitor's browser for 30 days.
4. Each bid is validated server-side against the published item, opening/closing window, current high bid and configured increment.
5. Accepted bids are stored in `AuctionBids`; the public page refreshes bidding status every 15 seconds.

## Time zone

Auction opening and closing values are treated as Charleston, South Carolina local time. For the September 2026 event, the backend explicitly evaluates those values as EDT (UTC-04:00) so Vercel's server timezone cannot shift a closing deadline.

## Recommended next enhancement before a very high-volume auction

The current implementation is suitable for event-scale bidding and validates every bid immediately before saving it. If the auction is expected to receive many simultaneous bids on the same item, move the final bid comparison + write into an Apps Script `LockService` transaction (or a transactional database) to make same-millisecond competing bids strictly atomic.
