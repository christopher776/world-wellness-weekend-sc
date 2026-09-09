# Variable Make It Mine price floor

Each marketplace listing now has a `FloorPercent` value controlled in `/admin/marketplace`.

- Default: 15% of verified retail for existing and new listings unless changed by an administrator.
- Allowed range: greater than 0% and less than 100% of retail.
- The displayed price declines continuously and linearly from 100% of retail at `LaunchAt` to `FloorPercent` of retail at `EndAt`.
- The server uses the same item-level floor when locking a reservation price.
- Retail value, `FloorPercent`, launch time and end time are pricing terms and lock once the price drop begins.
- `MarketplaceItems` mirrors `FloorPercent` for operational reporting.

Example: a $1,000 listing with `FloorPercent = 25` reaches a final floor of $250 at the configured end time. A separate listing may use 10%, 35%, or another administrator-approved value.
