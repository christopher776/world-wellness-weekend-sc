import { NextResponse } from "next/server";
import {
  bidCountForItem,
  currentBidForItem,
  fetchAuctionBids,
  fetchAuctionItems,
  minimumNextBid,
} from "@/lib/auction";

export const dynamic = "force-dynamic";

export async function GET() {
  const [items, bids] = await Promise.all([
    fetchAuctionItems({ publishedOnly: true, revalidate: 0 }),
    fetchAuctionBids(0),
  ]);

  const status = items.map((item) => ({
    itemId: item.ID,
    currentBid: currentBidForItem(item, bids),
    minimumNextBid: minimumNextBid(item, bids),
    bidCount: bidCountForItem(item.ID, bids),
  }));

  return NextResponse.json({ ok: true, status }, { headers: { "Cache-Control": "no-store" } });
}
