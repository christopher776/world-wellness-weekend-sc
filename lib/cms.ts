import { CONTENT_TYPES, type ContentTypeSlug } from "@/lib/cms-schema";

// Same Google Apps Script Web App already used for the RSVP form's Google
// Sheets logging. It has been extended (see docs/apps-script.md) to also
// support `?action=list&sheet=...` (public read) and
// `action: "upsert"` POST bodies (admin write, secret-gated).
const CMS_URL = process.env.CMS_WEBHOOK_URL || process.env.GOOGLE_SHEETS_WEBHOOK_URL;

export type CmsRow = Record<string, string>;

function truthy(v: string | undefined): boolean {
  if (!v) return false;
  return ["true", "yes", "1", "y"].includes(v.trim().toLowerCase());
}

export { truthy };

/**
 * Reads every row from a content tab. Returns [] (never throws) if the CMS
 * isn't configured yet or the request fails, so pages still render.
 */
export async function fetchRows(
  sheetName: string,
  opts: { publishedOnly?: boolean; revalidate?: number } = {}
): Promise<CmsRow[]> {
  if (!CMS_URL) return [];
  try {
    const url = `${CMS_URL}?action=list&sheet=${encodeURIComponent(sheetName)}`;
    const res = await fetch(url, {
      next: { revalidate: opts.revalidate ?? 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const rows: CmsRow[] = Array.isArray(data?.rows) ? data.rows : [];
    if (opts.publishedOnly) {
      return rows.filter((r) => truthy(r.Published));
    }
    return rows;
  } catch {
    return [];
  }
}

export async function fetchContentRows(
  type: ContentTypeSlug,
  opts: { publishedOnly?: boolean; revalidate?: number } = {}
): Promise<CmsRow[]> {
  const def = CONTENT_TYPES[type];
  if (!def) return [];
  return fetchRows(def.sheetName, opts);
}

export async function fetchRowById(
  type: ContentTypeSlug,
  id: string
): Promise<CmsRow | null> {
  const rows = await fetchContentRows(type);
  return rows.find((r) => r.ID === id) ?? null;
}

/**
 * Writes (creates or updates) a row via the Apps Script webhook. Only ever
 * called from server-side admin API routes, never from the browser, since
 * it requires the ADMIN_API_SECRET.
 */
export async function upsertRow(
  sheetName: string,
  row: CmsRow
): Promise<{ ok: boolean; error?: string }> {
  if (!CMS_URL) {
    return { ok: false, error: "CMS_WEBHOOK_URL is not configured." };
  }
  const secret = process.env.ADMIN_API_SECRET;
  if (!secret) {
    return { ok: false, error: "ADMIN_API_SECRET is not configured." };
  }
  try {
    const res = await fetch(CMS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "upsert", sheet: sheetName, secret, row }),
      redirect: "follow",
    });
    if (!res.ok) {
      return { ok: false, error: `CMS responded with status ${res.status}` };
    }
    const data = await res.json().catch(() => ({}));
    if (data?.ok === false) {
      return { ok: false, error: data?.error || "Unknown CMS error" };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
