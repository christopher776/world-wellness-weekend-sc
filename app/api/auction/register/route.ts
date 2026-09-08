import { NextResponse } from "next/server";
import { newId, upsertRow } from "@/lib/cms";
import {
  AUCTION_BIDDERS_SHEET,
  bidderDisplayName,
  signBidderSession,
} from "@/lib/auction";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: { name?: string; email?: string; phone?: string; website?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (body.website?.trim()) return NextResponse.json({ ok: true });

  const name = body.name?.trim() || "";
  const email = body.email?.trim().toLowerCase() || "";
  const phone = body.phone?.trim() || "";
  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: "Your name is required." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "A valid email address is required." }, { status: 400 });
  }
  if (phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json({ ok: false, error: "A valid phone number is required." }, { status: 400 });
  }

  const bidderId = newId("bidder");
  const displayName = bidderDisplayName(name);
  const row = {
    ID: bidderId,
    Name: name,
    DisplayName: displayName,
    Email: email,
    Phone: phone,
    RegisteredAt: new Date().toISOString(),
    Status: "ACTIVE",
  };
  const result = await upsertRow(AUCTION_BIDDERS_SHEET, row);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error || "Registration could not be saved." }, { status: 502 });
  }

  try {
    const token = signBidderSession({ bidderId, displayName, email, issuedAt: Date.now() });
    return NextResponse.json({ ok: true, token, bidder: { bidderId, displayName } });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Registration could not be completed." },
      { status: 500 }
    );
  }
}
