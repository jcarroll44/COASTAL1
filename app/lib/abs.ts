// app/lib/abs.ts
import { headers } from "next/headers";

/**
 * Build an absolute URL for server-side fetches.
 * - On the server, we read proto/host from the incoming request headers.
 * - In the browser/client, we just return the relative path.
 */
export function absPath(p: string) {
  if (!p.startsWith("/")) return p; // already absolute or external
  try {
    const h = headers();
    const proto = h.get("x-forwarded-proto") || "https";
    const host = h.get("x-forwarded-host") || h.get("host");
    if (host) return `${proto}://${host}${p}`;
  } catch {
    // headers() not available -> client or non-request context
  }
  return p;
}