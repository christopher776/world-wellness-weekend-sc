// Uses the Web Crypto API (globalThis.crypto.subtle) rather than Node's
// `crypto` module so this file works in both the Edge middleware runtime
// and regular Node.js API routes.

const COOKIE_NAME = "sc_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSecret(): string {
  return process.env.ADMIN_API_SECRET || "dev-secret-change-me";
}

async function hmacKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function sign(payload: string): Promise<string> {
  const key = await hmacKey();
  const encoder = new TextEncoder();
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(): Promise<string> {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `admin.${expires}`;
  const sig = await sign(payload);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [scope, expiresStr, sig] = parts;
  if (scope !== "admin") return false;
  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;
  const expectedSig = await sign(`${scope}.${expiresStr}`);
  if (sig.length !== expectedSig.length) return false;
  // Constant-time-ish comparison (fine for this low-stakes internal gate).
  let diff = 0;
  for (let i = 0; i < sig.length; i++) {
    diff |= sig.charCodeAt(i) ^ expectedSig.charCodeAt(i);
  }
  return diff === 0;
}

export function checkPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return candidate === expected;
}

export { COOKIE_NAME };
