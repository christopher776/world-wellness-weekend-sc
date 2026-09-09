# Marketplace payment states

AVAILABLE -> SOLD / RESERVED (price frozen) -> PAID (verified Authorize.Net auth-capture webhook)

Unpaid/test SOLD / RESERVED orders may be released to AVAILABLE by admin. PAID orders are blocked from the simple release action and require gateway void/refund handling first.
