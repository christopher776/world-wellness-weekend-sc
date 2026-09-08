import { NextResponse } from "next/server";
import { newId, upsertRow } from "@/lib/cms";
import { AUCTION_ITEMS_SHEET } from "@/lib/auction";

const requiredFields = ["Title", "StartingBid", "BidIncrement", "ClosesAt"];

export async function POST(request: Request) {
  let body: { id?: string; fields?: Record<string, string> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const fields = body.fields || {};
  for (const field of requiredFields) {
    if (!fields[field]?.trim()) {
      return NextResponse.json({ ok: false, error: `${field} is required.` }, { status: 400 });
    }
  }

  const startingBid = Number(fields.StartingBid);
  const bidIncrement = Number(fields.BidIncrement);
  if (!Number.isFinite(startingBid) || startingBid < 0) {
    return NextResponse.json({ ok: false, error: "Starting bid must be a valid number." }, { status: 400 });
  }
  if (!Number.isFinite(bidIncrement) || bidIncrement <= 0) {
    return NextResponse.json({ ok: false, error: "Bid increment must be greater than zero." }, { status: 400 });
  }

  const id = body.id?.trim() || newId("auction");
  const result = await upsertRow(AUCTION_ITEMS_SHEET, {
    ID: id,
    Title: fields.Title || "",
    PhotoURL: fields.PhotoURL || "",
    Description: fields.Description || "",
    DonorName: fields.DonorName || "",
    RetailValue: fields.RetailValue || "",
    StartingBid: startingBid.toFixed(2),
    BidIncrement: bidIncrement.toFixed(2),
    OpensAt: fields.OpensAt || "",
    ClosesAt: fields.ClosesAt || "",
    PickupDetails: fields.PickupDetails || "",
    Terms: fields.Terms || "",
    Featured: fields.Featured === "TRUE" ? "TRUE" : "FALSE",
    Published: fields.Published === "TRUE" ? "TRUE" : "FALSE",
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error || "Auction item could not be saved." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, id });
}
