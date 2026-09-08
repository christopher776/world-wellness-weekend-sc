import { NextResponse } from "next/server";
import { fetchMarketplaceItems, marketplaceAvailability } from "@/lib/marketplace";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await fetchMarketplaceItems({ publishedOnly: true });
    const availability = await marketplaceAvailability(items);
    return NextResponse.json({ ok: true, availability }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Could not load availability." }, { status: 500 });
  }
}
