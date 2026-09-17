import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";
import { del, list, put } from "@vercel/blob";
import { marketplacePrice } from "@/lib/marketplace-pricing";
import { marketplaceTotal } from "@/lib/marketplace-tax";
export const MARKETPLACE_ITEM_PREFIX = "sc-wellness-marketplace/items/";
export const MARKETPLACE_CLAIM_PREFIX = "sc-wellness-marketplace/claims/";
export interface MarketplaceItem {
  ID: string;
  Title: string;
  PhotoURL: string;
  Description: string;
  DonorName: string;
  RetailValue: string;
  LaunchAt: string;
  EndAt: string;
  FloorPercent: string;
  PricingMode?: "FIXED" | "COUNTDOWN";
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
  lockedPrice?: number;
  orderId?: string;
  claimedAt?: string;
  paymentStatus?: "PENDING" | "PAID" | "REFUNDED";
  transactionId?: string;
  paidAt?: string;
  refundedAt?: string;
  refundTransactionId?: string;
  orders?: Array<{
    orderId: string;
    slot: number;
    price: number;
    subtotal?: number;
    salesTax?: number;
    paymentStatus: "PENDING" | "PAID" | "REFUNDED";
    transactionId?: string;
  }>;
}
export interface MarketplaceOrderPayload {
  orderId: string;
  itemId: string;
  slot?: number;
  itemTitle: string;
  price: number;
  subtotal?: number;
  salesTax?: number;
  salesTaxRate?: number;
  retailValue: number;
  claimedAt: string;
  name: string;
  email: string;
  phone: string;
  paymentStatus?: "PENDING" | "PAID" | "REFUNDED";
  transactionId?: string;
  paidAt?: string;
  refundedAt?: string;
  refundTransactionId?: string;
}
function truthy(value?: string) {
  return ["true", "yes", "1", "y"].includes((value || "").trim().toLowerCase());
}
function storageId(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}
function claimPath(itemId: string, slot = 1) {
  return `${MARKETPLACE_CLAIM_PREFIX}${storageId(itemId)}${slot === 1 ? "" : `-${slot}`}.enc`;
}
function quantity(item: MarketplaceItem) {
  const value = Number(item.Quantity);
  return item.PricingMode === "FIXED" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 100
    ? value
    : 1;
}
function itemClaimBlobs(
  itemId: string,
  blobs: Array<{ pathname: string; url: string; uploadedAt?: Date }>,
) {
  const hash = storageId(itemId);
  return blobs.filter(
    (blob) =>
      blob.pathname === `${MARKETPLACE_CLAIM_PREFIX}${hash}.enc` ||
      new RegExp(`^${MARKETPLACE_CLAIM_PREFIX}${hash}-[2-9][0-9]*\\.enc$`).test(
        blob.pathname,
      ),
  );
}
function requireStorage() {
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID)
    throw new Error("Marketplace storage is not configured.");
}
async function listBlobs(prefix: string) {
  const blobs: Awaited<ReturnType<typeof list>>["blobs"] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix, limit: 1000, cursor });
    blobs.push(...page.blobs);
    cursor = page.cursor;
  } while (cursor);
  return blobs;
}
async function readJson<T>(url: string, uploadedAt?: Date): Promise<T> {
  const separator = url.includes("?") ? "&" : "?";
  const response = await fetch(
    `${url}${separator}v=${uploadedAt?.getTime() || Date.now()}`,
    { cache: "no-store" },
  );
  if (!response.ok)
    throw new Error("Marketplace listing storage could not be read.");
  return (await response.json()) as T;
}
function normalizeItem(item: MarketplaceItem) {
  return { ...item, FloorPercent: String(item.FloorPercent || "15") };
}
function isMarketplaceItem(value: unknown): value is MarketplaceItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<MarketplaceItem>;
  return (
    typeof item.ID === "string" &&
    typeof item.Title === "string" &&
    typeof item.RetailValue === "string" &&
    Number(item.RetailValue) > 0 &&
    typeof item.LaunchAt === "string" &&
    typeof item.EndAt === "string" &&
    typeof item.Published === "string"
  );
}
export async function fetchMarketplaceItems(
  options: { publishedOnly?: boolean } = {},
) {
  requireStorage();
  const blobs = await listBlobs(MARKETPLACE_ITEM_PREFIX);
  const items = (
    await Promise.all(
      blobs.map((blob) => readJson<unknown>(blob.url, blob.uploadedAt)),
    )
  )
    .filter(isMarketplaceItem)
    .map(normalizeItem)
    .sort(
      (a, b) =>
        Number(b.Featured === "TRUE") - Number(a.Featured === "TRUE") ||
        a.Title.localeCompare(b.Title),
    );
  return options.publishedOnly
    ? items.filter((item) => truthy(item.Published))
    : items;
}
export async function saveMarketplaceItem(item: MarketplaceItem) {
  requireStorage();
  await put(
    `${MARKETPLACE_ITEM_PREFIX}${storageId(item.ID)}.json`,
    JSON.stringify(item),
    {
      access: "public",
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    },
  );
}
function encryptionKey() {
  const secret =
    process.env.ADMIN_API_SECRET || process.env.ADMIN_PASSWORD || "";
  if (!secret)
    throw new Error("Marketplace reservation encryption is not configured.");
  return createHash("sha256").update(secret).digest();
}
function encryptOrder(payload: MarketplaceOrderPayload) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ]);
  return JSON.stringify({
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    data: encrypted.toString("base64"),
  });
}
function decryptOrder(raw: string): MarketplaceOrderPayload {
  const envelope = JSON.parse(raw) as { iv: string; tag: string; data: string };
  const decipher = createDecipheriv(
    "aes-256-gcm",
    encryptionKey(),
    Buffer.from(envelope.iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(envelope.tag, "base64"));
  const plain = Buffer.concat([
    decipher.update(Buffer.from(envelope.data, "base64")),
    decipher.final(),
  ]).toString("utf8");
  return JSON.parse(plain) as MarketplaceOrderPayload;
}
async function orderFromBlob(url: string, uploadedAt?: Date) {
  const separator = url.includes("?") ? "&" : "?";
  const response = await fetch(
    `${url}${separator}v=${uploadedAt?.getTime() || Date.now()}`,
    { cache: "no-store" },
  );
  if (!response.ok)
    throw new Error("Marketplace reservation could not be read.");
  return decryptOrder(await response.text());
}
export async function marketplaceAvailability(
  items: MarketplaceItem[],
  options: { includeOrders?: boolean } = {},
) {
  requireStorage();
  const claims = await listBlobs(MARKETPLACE_CLAIM_PREFIX);
  return Promise.all(
    items.map(async (item) => {
      const total = quantity(item);
      const blobs = itemClaimBlobs(item.ID, claims);
      if (!blobs.length)
        return {
          itemId: item.ID,
          claimed: 0,
          quantity: total,
          remaining: total,
          orders: [],
        };
      if (!options.includeOrders)
        return { itemId: item.ID, claimed: blobs.length, quantity: total, remaining: Math.max(0, total - blobs.length) };
      try {
        const orders = await Promise.all(
          blobs.map((blob) => orderFromBlob(blob.url, blob.uploadedAt)),
        );
        const order = orders[0];
        return {
          itemId: item.ID,
          claimed: blobs.length,
          quantity: total,
          remaining: Math.max(0, total - blobs.length),
          ...(options.includeOrders
            ? {
                orders: orders.map((entry, index) => ({
                  orderId: entry.orderId,
                  slot: entry.slot || index + 1,
                  price: entry.price,
                  subtotal: entry.subtotal,
                  salesTax: entry.salesTax,
                  paymentStatus: entry.paymentStatus || ("PENDING" as const),
                  transactionId: entry.transactionId,
                })),
              }
            : {}),
          ...(options.includeOrders ? {
            lockedPrice: order.price,
            orderId: order.orderId,
            claimedAt: order.claimedAt,
            paymentStatus: order.paymentStatus || "PENDING",
            transactionId: order.transactionId,
            paidAt: order.paidAt,
            refundedAt: order.refundedAt,
            refundTransactionId: order.refundTransactionId,
          } : {}),
        };
      } catch {
        return {
          itemId: item.ID,
          claimed: blobs.length,
          quantity: total,
          remaining: Math.max(0, total - blobs.length),
        };
      }
    }),
  );
}
export async function marketplaceItemIsReserved(itemId: string) {
  requireStorage();
  const blobs = await listBlobs(MARKETPLACE_CLAIM_PREFIX + storageId(itemId));
  return itemClaimBlobs(itemId, blobs).length > 0;
}
export async function getMarketplaceOrder(itemId: string, orderId?: string) {
  requireStorage();
  const blobs = await listBlobs(MARKETPLACE_CLAIM_PREFIX + storageId(itemId));
  const matches = itemClaimBlobs(itemId, blobs);
  if (!orderId && matches.length > 1)
    throw new Error("Select a specific order for this multi-unit listing.");
  for (const blob of matches) {
    const order = await orderFromBlob(blob.url, blob.uploadedAt);
    if (!orderId || order.orderId === orderId) return order;
  }
  return null;
}
export async function findMarketplaceOrderByOrderId(orderId: string) {
  requireStorage();
  const claims = await listBlobs(MARKETPLACE_CLAIM_PREFIX);
  for (const blob of claims) {
    try {
      const order = await orderFromBlob(blob.url, blob.uploadedAt);
      if (order.orderId === orderId) return order;
    } catch {}
  }
  return null;
}
export async function releaseMarketplaceItem(itemId: string, orderId?: string) {
  requireStorage();
  const blobs = itemClaimBlobs(itemId, await listBlobs(MARKETPLACE_CLAIM_PREFIX + storageId(itemId)));
  if (!orderId && blobs.length > 1) throw new Error("Select a specific order for this multi-unit listing.");
  for (const blob of blobs) {
    const order = await orderFromBlob(blob.url, blob.uploadedAt);
    if (orderId && order.orderId !== orderId) continue;
    await del(blob.url);
    return true;
  }
  return false;
}
export async function markMarketplaceOrderPaid(
  orderId: string,
  transactionId: string,
  paidAt = new Date().toISOString(),
) {
  requireStorage();
  const claims = await listBlobs(MARKETPLACE_CLAIM_PREFIX);
  for (const blob of claims) {
    try {
      const order = await orderFromBlob(blob.url, blob.uploadedAt);
      if (order.orderId !== orderId) continue;
      const updated: MarketplaceOrderPayload = {
        ...order,
        paymentStatus: "PAID",
        transactionId,
        paidAt,
      };
      await put(
        claimPath(order.itemId, order.slot || 1),
        encryptOrder(updated),
        {
          access: "public",
          allowOverwrite: true,
          addRandomSuffix: false,
          contentType: "application/octet-stream",
          cacheControlMaxAge: 60,
        },
      );
      return updated;
    } catch {}
  }
  return null;
}
export async function markMarketplaceOrderRefunded(
  itemId: string,
  refundTransactionId: string,
  refundedAt = new Date().toISOString(),
  orderId?: string,
) {
  const order = await getMarketplaceOrder(itemId, orderId);
  if (!order) return null;
  const updated: MarketplaceOrderPayload = {
    ...order,
    paymentStatus: "REFUNDED",
    refundTransactionId,
    refundedAt,
  };
  await put(claimPath(itemId, order.slot || 1), encryptOrder(updated), {
    access: "public",
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: "application/octet-stream",
    cacheControlMaxAge: 60,
  });
  return updated;
}
export async function claimMarketplaceItem(
  item: MarketplaceItem,
  contact: { name: string; email: string; phone: string },
) {
  requireStorage();
  encryptionKey();
  const pricing = marketplacePrice(item, new Date());
  const total = marketplaceTotal(pricing.price, item.TaxCategory);
  const orderId = `order-${Date.now().toString(36)}-${randomBytes(3).toString("hex")}`;
  const claimedAt = new Date().toISOString();
  const payload: MarketplaceOrderPayload = {
    orderId,
    itemId: item.ID,
    itemTitle: item.Title,
    price: total.total,
    subtotal: total.subtotal,
    salesTax: total.salesTax,
    salesTaxRate: total.salesTaxRate,
    retailValue: Number(item.RetailValue),
    claimedAt,
    name: contact.name.trim(),
    email: contact.email.trim().toLowerCase(),
    phone: contact.phone.trim(),
    paymentStatus: "PENDING",
  };
  let slot = 0;
  for (let candidate = 1; candidate <= quantity(item); candidate++) {
    try {
      payload.slot = candidate;
      await put(claimPath(item.ID, candidate), encryptOrder(payload), {
        access: "public",
        allowOverwrite: false,
        addRandomSuffix: false,
        contentType: "application/octet-stream",
        cacheControlMaxAge: 60,
      });
      slot = candidate;
      break;
    } catch (error) {
      if (candidate === quantity(item))
        throw new Error(
          "This listing is sold out or could not be reserved. Refresh before trying again.",
          { cause: error },
        );
    }
  }
  let remaining = 0;
  try {
    const claims = await listBlobs(MARKETPLACE_CLAIM_PREFIX + storageId(item.ID));
    remaining = Math.max(0, quantity(item) - itemClaimBlobs(item.ID, claims).length);
  } catch {
    // The reservation succeeded; a failed follow-up count must not lose its order ID.
  }
  return {
    ok: true as const,
    orderId,
    slot,
    price: payload.price,
    remaining,
    payload,
  };
}
