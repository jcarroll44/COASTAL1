// app/lib/auth.ts
// Zero-dependency HS256 signing using Web Crypto (works in Edge & Node)

export const COOKIE_NAME = "cb_session";
const SECRET = process.env.COASTAL_SECRET || "dev-secret-change-me";

const te = new TextEncoder();
function b64url(buf: ArrayBuffer | string) {
  const b =
    typeof buf === "string"
      ? Buffer.from(buf, "utf8")
      : Buffer.from(new Uint8Array(buf));
  return b
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

async function importKey(secret: string) {
  // WebCrypto (Edge/Node 18+) — no node:crypto import needed
  return crypto.subtle.importKey(
    "raw",
    te.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function hmacSign(input: string) {
  const key = await importKey(SECRET);
  const sig = await crypto.subtle.sign("HMAC", key, te.encode(input));
  return b64url(sig);
}

async function hmacVerify(input: string, signatureB64Url: string) {
  const key = await importKey(SECRET);
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    Buffer.from(signatureB64Url.replace(/-/g, "+").replace(/_/g, "/"), "base64"),
    te.encode(input)
  );
  return ok;
}

type Payload = Record<string, any> & { exp?: number; iat?: number };

/** Create a compact token header.payload.signature (HS256). */
export async function signSession(payload: Payload): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 60 * 60 * 24 * 7; // 7 days
  const header = { alg: "HS256", typ: "JWT" };
  const body = { ...payload, iat: now, exp };

  const hPart = b64url(JSON.stringify(header));
  const pPart = b64url(JSON.stringify(body));
  const data = `${hPart}.${pPart}`;
  const sPart = await hmacSign(data);
  return `${data}.${sPart}`;
}

/** Verify signature & expiration. Returns payload or null. */
export async function verifySession(token: string): Promise<Payload | null> {
  try {
    const [hPart, pPart, sPart] = token.split(".");
    if (!hPart || !pPart || !sPart) return null;

    const data = `${hPart}.${pPart}`;
    const ok = await hmacVerify(data, sPart);
    if (!ok) return null;

    const payload: Payload = JSON.parse(
      Buffer.from(pPart.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString(
        "utf8"
      )
    );

    if (payload?.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}