import { createHmac, timingSafeEqual } from "node:crypto";
import { fetchRows, type CmsRow } from "@/lib/cms";

export const AUCTION_ITEMS_SHEET = "AuctionItems";
export const AUCTION_BIDDERS_SHEET = "AuctionBidders";
export const AUCTION_BIDS_SHEET = "AuctionBids";

export interface AuctionItem {
  ID: string;
  Title: string;
  PhotoURL: string;
  Description: string;
  DonorName: string;
  RetailValue: string;
  StartingBid: string;
  BidIncrement: string;
  OpensAt: string;
  ClosesAt: string;
  PickupDetails: string;
  Terms: string;
  Featured: string;
  Published: string;
}

export interface AuctionBid {
  ID: string;
  ItemID: string;
  BidderID: string;
  BidderDisplay: string;
  Amount: string;
  Timestamp: string;
}

export interface BidderSession {
  bidderId: string;
  displayName: string;
  email: string;
  issuedAt: number;
}

function truthy(value?: string) {
  return ["true", "yes", "1", "y"].includes((value || "").trim().toLowerCase());
}

export function asAuctionItem(row: CmsRow): AuctionItem {
  return {
    ID: row.ID || "",
    Title: row.Title || "",
    PhotoURL: row.PhotoURL || "",
    Description: row.Description || "",
    DonorName: row.DonorName || "",
    RetailValue: row.RetailValue || "",
    StartingBid: row.StartingBid || "0",
    BidIncrement: row.BidIncrement || "5",
    OpensAt: row.OpensAt || "",
    ClosesAt: row.ClosesAt || "",
    PickupDetails: row.PickupDetails || "",
    Terms: row.Terms || "",
    Featured: row.Featured || "FALSE",
    Published: row.Published || "FALSE",
  };
}

export function asAuctionBid(row: CmsRow): AuctionBid {
  return {
    ID: row.ID || "",
    ItemID: row.ItemID || "",
    BidderID: row.BidderID || "",
    BidderDisplay: row.BidderDisplay || "Bidder",
    Amount: row.Amount || "0",
    Timestamp: row.Timestamp || "",
  };
}

export async function fetchAuctionItems(opts: { publishedOnly?: boolean; revalidate?: number } = {}) {
  const rows = await fetchRows(AUCTION_ITEMS_SHEET, { revalidate: opts.revalidate ?? 30 });
  const items = rows.map(asAuctionItem);
  return opts.publishedOnly ? items.filter((item) => truthy(item.Published)) : items;
}

export async function fetchAuctionBids(revalidate = 0) {
  const rows = await fetchRows(AUCTION_BIDS_SHEET, { revalidate });
  return rows.map(asAuctionBid).filter((bid) => bid.ItemID && Number.isFinite(Number(bid.Amount)));
}

export function numberValue(value: string | undefined, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function currentBidForItem(item: AuctionItem, bids: AuctionBid[]) {
  const startingBid = numberValue(item.StartingBid, 0);
  const itemBids = bids.filter((bid) => bid.ItemID === item.ID);
  if (!itemBids.length) return startingBid;
  return Math.max(startingBid, ...itemBids.map((bid) => numberValue(bid.Amount, 0)));
}

export function minimumNextBid(item: AuctionItem, bids: AuctionBid[]) {
  const current = currentBidForItem(item, bids);
  const increment = Math.max(1, numberValue(item.BidIncrement, 5));
  return current + increment;
}

export function bidCountForItem(itemId: string, bids: AuctionBid[]) {
  return bids.filter((bid) => bid.ItemID === itemId).length;
}

/**
 * Auction admin values are entered as Charleston local time. Google Sheets
 * may return those strings with either a T or a space and without a zone.
 * During the September event Charleston is on EDT (UTC-04:00), so attach
 * that offset explicitly rather than letting Vercel interpret the value as UTC.
 */
export function parseAuctionDateTime(value?: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const hasZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(trimmed);
  const normalized = trimmed.replace(" ", "T");
  const parsed = new Date(hasZone ? normalized : `${normalized}:00-04:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function auctionItemIsOpen(item: AuctionItem, now = new Date()) {
  const opens = parseAuctionDateTime(item.OpensAt);
  const closes = parseAuctionDateTime(item.ClosesAt);
  if (opens && now < opens) return false;
  if (closes && now >= closes) return false;
  return true;
}

export function bidderDisplayName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "Bidder";
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

function sessionSecret() {
  return process.env.ADMIN_API_SECRET || process.env.ADMIN_PASSWORD || "";
}

export function signBidderSession(session: BidderSession) {
  const secret = sessionSecret();
  if (!secret) throw new Error("Auction bidder sessions are not configured.");
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyBidderSession(token?: string | null): BidderSession | null {
  if (!token) return null;
  const secret = sessionSecret();
  if (!secret) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as BidderSession;
    if (!parsed.bidderId || !parsed.email || !parsed.displayName) return null;
    // Bidder sessions last through the event but expire after 30 days.
    if (!parsed.issuedAt || Date.now() - parsed.issuedAt > 30 * 24 * 60 * 60 * 1000) return null;
    return parsed;
  } catch {
    return null;
  }
}
