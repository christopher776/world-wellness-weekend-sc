import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";
import { upsertRow } from "@/lib/cms";
import {
  fetchMarketplaceItems,
  marketplaceItemIsReserved,
  saveMarketplaceItem,
} from "@/lib/marketplace";
import { restartedCountdown } from "@/lib/marketplace-pricing";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!(await verifySessionToken(request.cookies.get(COOKIE_NAME)?.value)))
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  let body: { itemId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }
  const itemId = String(body.itemId || "").trim();
  if (!itemId)
    return NextResponse.json({ ok: false, error: "Item ID is required." }, { status: 400 });
  try {
    const current = (await fetchMarketplaceItems()).find((item) => item.ID === itemId);
    if (!current)
      return NextResponse.json({ ok: false, error: "Marketplace item not found." }, { status: 404 });
    if (current.PricingMode === "FIXED")
      return NextResponse.json({ ok: false, error: "Only countdown listings can be restarted." }, { status: 409 });
    if (await marketplaceItemIsReserved(itemId))
      return NextResponse.json({ ok: false, error: "This listing has a reservation or order and cannot be restarted." }, { status: 409 });
    const now = new Date();
    const times = restartedCountdown(current, now);
    const item = {
      ...current,
      ...times,
      RestartedAt: times.LaunchAt,
      RestartedBy: "admin",
      RestartCount: (current.RestartCount || 0) + 1,
      UpdatedAt: times.LaunchAt,
    };
    await saveMarketplaceItem(item);
    await upsertRow("MarketplaceItems", {
      ID: item.ID,
      Title: item.Title,
      PhotoURL: item.PhotoURL,
      Description: item.Description,
      DonorName: item.DonorName,
      RetailValue: item.RetailValue,
      LaunchAt: item.LaunchAt,
      EndAt: item.EndAt,
      FloorPercent: item.FloorPercent,
      PricingMode: item.PricingMode || "COUNTDOWN",
      Quantity: item.Quantity,
      Inventory: "1 unique item per listing",
      PickupDetails: item.PickupDetails,
      Terms: item.Terms,
      TaxCategory: item.TaxCategory,
      Featured: item.Featured,
      Published: item.Published,
      RestartedAt: item.RestartedAt,
      RestartedBy: item.RestartedBy,
      RestartCount: String(item.RestartCount),
      UpdatedAt: item.UpdatedAt,
    }).catch(() => ({ ok: false }));
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Could not restart price drop." }, { status: 502 });
  }
}
