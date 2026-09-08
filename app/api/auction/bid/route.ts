import { NextResponse } from "next/server";
import { newId, upsertRow } from "@/lib/cms";
import {
  AUCTION_BIDS_SHEET,
  auctionItemIsOpen,
  fetchAuctionBids,
  fetchAuctionItems,
  minimumNextBid,
  verifyBidderSession,
} from "@/lib/auction";

export async function POST(request: Request) {
  if (process.env.AUCTION_BIDDING_ENABLED !== "true") {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Live bidding is not yet open. South Carolina auction licensure and sales-tax setup are being finalized.",
      },
      { status: 503 }
    );
  }

  let body: { token?: string; itemId?: string; amount?: number | string; website?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (body.website?.trim()) return NextResponse.json({ ok: true });

  const bidder = verifyBidderSession(body.token);
  if (!bidder) {
    return NextResponse.json({ ok: false, error: "Please register before bidding." }, { status: 401 });
  }

  const itemId = body.itemId?.trim() || "";
  const amount = Number(body.amount);
  if (!itemId || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ ok: false, error: "Enter a valid bid amount." }, { status: 400 });
  }

  const [items, bids] = await Promise.all([
    fetchAuctionItems({ publishedOnly: true, revalidate: 0 }),
    fetchAuctionBids(0),
  ]);
  const item = items.find((candidate) => candidate.ID === itemId);
  if (!item) {
    return NextResponse.json({ ok: false, error: "Auction item not found." }, { status: 404 });
  }
  if (!auctionItemIsOpen(item)) {
    return NextResponse.json({ ok: false, error: "Bidding is not currently open for this item." }, { status: 409 });
  }

  const minimum = minimumNextBid(item, bids);
  if (amount < minimum) {
    return NextResponse.json(
      { ok: false, error: `The minimum next bid is $${minimum.toFixed(2)}.`, minimum },
      { status: 409 }
    );
  }

  const result = await upsertRow(AUCTION_BIDS_SHEET, {
    ID: newId("bid"),
    ItemID: item.ID,
    BidderID: bidder.bidderId,
    BidderDisplay: bidder.displayName,
    Amount: amount.toFixed(2),
    Timestamp: new Date().toISOString(),
  });
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error || "Bid could not be saved." }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    currentBid: amount,
    minimumNextBid: amount + Math.max(1, Number(item.BidIncrement) || 5),
    bidderDisplay: bidder.displayName,
  });
}
