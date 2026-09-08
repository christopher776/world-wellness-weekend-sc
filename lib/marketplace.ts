import { createCipheriv, createHash, randomBytes } from "node:crypto";
import { list, put } from "@vercel/blob";

export const MARKETPLACE_ITEM_PREFIX = "sc-wellness-marketplace/items/";
export const MARKETPLACE_CLAIM_PREFIX = "sc-wellness-marketplace/claims/";
export const MARKETPLACE_ORDER_PREFIX = "sc-wellness-marketplace/orders/";
export const MARKETPLACE_FLOOR_PERCENT = 15;

export interface MarketplaceItem {
  ID: string;
  Title: string;
  PhotoURL: string;
  Description: string;
  DonorName: string;
  RetailValue: string;
  LaunchAt: string;
  EndAt: string;
  Quantity: string;
  PickupDetails: string;
  Terms: string;
  TaxCategory: string;
  Featured: string;
  Published: string;
  UpdatedAt: string;
}

export interface MarketplaceAvailability {
  itemId: string;
  claimed: number;
  quantity: number;
  remaining: number;
}

export interface MarketplaceOrderPayload {
  orderId: string;
  itemId: string;
  itemTitle: string;
  price: number;
  retailValue: number;
  claimedAt: string;
  name: string;
  email: string;
  phone: string;
}

function truthy(value?: string) {
  return ["true", "yes", "1", "y"].includes((value || "").trim().toLowerCase());
}

function safeId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}

export function parseCharlestonDateTime(value?: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const normalized = trimmed.replace(" ", "T");
  const hasZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized);
  const date = new Date(hasZone ? normalized : `${normalized}:00-04:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function marketplacePrice(item: MarketplaceItem, now = new Date()) {
  const retail = Math.max(0, Number(item.RetailValue) || 0);
  const floor = retail * (MARKETPLACE_FLOOR_PERCENT / 100);
  const start = parseCharlestonDateTime(item.LaunchAt);
  const end = parseCharlestonDateTime(item.EndAt);
  if (!retail) return { price: 0, percentBelowRetail: 0, progress: 0, started: false, ended: false };
  if (!start || !end || end <= start) return { price: retail, percentBelowRetail: 0, progress: 0, started: false, ended: false };
  if (now <= start) return { price: retail, percentBelowRetail: 0, progress: 0, started: false, ended: false };
  if (now >= end) return { price: floor, percentBelowRetail: 100 - MARKETPLACE_FLOOR_PERCENT, progress: 1, started: true, ended: true };

  const progress = (now.getTime() - start.getTime()) / (end.getTime() - start.getTime());
  const price = retail - (retail - floor) * progress;
  return {
    price: Math.max(floor, price),
    percentBelowRetail: (1 - price / retail) * 100,
    progress,
    started: true,
    ended: false,
  };
}

async function readJson<T>(url: string, uploadedAt?: Date): Promise<T | null> {
  try {
    const separator = url.includes("?") ? "&" : "?";
    const response = await fetch(`${url}${separator}v=${uploadedAt?.getTime() || Date.now()}`, { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchMarketplaceItems(options: { publishedOnly?: boolean } = {}) {
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) return [] as MarketplaceItem[];
  const result = await list({ prefix: MARKETPLACE_ITEM_PREFIX, limit: 500 });
  const items = (await Promise.all(result.blobs.map((blob) => readJson<MarketplaceItem>(blob.url, blob.uploadedAt))))
    .filter((item): item is MarketplaceItem => Boolean(item?.ID))
    .sort((a, b) => Number(b.Featured === "TRUE") - Number(a.Featured === "TRUE") || a.Title.localeCompare(b.Title));
  return options.publishedOnly ? items.filter((item) => truthy(item.Published)) : items;
}

export async function saveMarketplaceItem(item: MarketplaceItem) {
  const path = `${MARKETPLACE_ITEM_PREFIX}${safeId(item.ID)}.json`;
  await put(path, JSON.stringify(item), {
    access: "public",
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}

export async function marketplaceAvailability(items: MarketplaceItem[]) {
  const claims = await list({ prefix: MARKETPLACE_CLAIM_PREFIX, limit: 1000 });
  return items.map((item) => {
    const quantity = Math.max(1, Math.floor(Number(item.Quantity) || 1));
    const prefix = `${MARKETPLACE_CLAIM_PREFIX}${safeId(item.ID)}-slot-`;
    const claimed = claims.blobs.filter((blob) => blob.pathname.startsWith(prefix)).length;
    return { itemId: item.ID, claimed, quantity, remaining: Math.max(0, quantity - claimed) };
  });
}

function encryptionKey() {
  const secret = process.env.ADMIN_API_SECRET || process.env.ADMIN_PASSWORD || "";
  if (!secret) throw new Error("Admin encryption secret is not configured.");
  return createHash("sha256").update(secret).digest();
}

function encryptOrder(payload: MarketplaceOrderPayload) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(payload), "utf8"), cipher.final()]);
  return JSON.stringify({
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    data: encrypted.toString("base64"),
  });
}

export async function claimMarketplaceItem(item: MarketplaceItem, contact: { name: string; email: string; phone: string }) {
  const quantity = Math.max(1, Math.floor(Number(item.Quantity) || 1));
  const pricing = marketplacePrice(item, new Date());
  const orderId = `order-${Date.now().toString(36)}-${randomBytes(3).toString("hex")}`;
  let slot = 0;

  for (let candidate = 1; candidate <= quantity; candidate++) {
    try {
      await put(`${MARKETPLACE_CLAIM_PREFIX}${safeId(item.ID)}-slot-${candidate}.json`, JSON.stringify({
        itemId: item.ID,
        orderId,
        price: Number(pricing.price.toFixed(2)),
        claimedAt: new Date().toISOString(),
      }), {
        access: "public",
        allowOverwrite: false,
        addRandomSuffix: false,
        contentType: "application/json",
        cacheControlMaxAge: 60,
      });
      slot = candidate;
      break;
    } catch {
      // Occupied slots intentionally fail because overwrite is disabled.
    }
  }

  if (!slot) return { ok: false as const, error: "This item was just claimed by someone else." };

  const payload: MarketplaceOrderPayload = {
    orderId,
    itemId: item.ID,
    itemTitle: item.Title,
    price: Number(pricing.price.toFixed(2)),
    retailValue: Number(item.RetailValue),
    claimedAt: new Date().toISOString(),
    name: contact.name.trim(),
    email: contact.email.trim().toLowerCase(),
    phone: contact.phone.trim(),
  };

  await put(`${MARKETPLACE_ORDER_PREFIX}${orderId}.json`, encryptOrder(payload), {
    access: "public",
    allowOverwrite: false,
    addRandomSuffix: false,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });

  return { ok: true as const, orderId, slot, price: payload.price, remaining: quantity - slot };
}
