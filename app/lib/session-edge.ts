// app/lib/session-edge.ts
// Edge-safe session decoder for middleware (no node:crypto).

export type EdgeSession = {
    email: string;
    role: "admin" | "partner" | "attendant";
    partnerId?: string | null;
  };
  
  // Base64url → JSON (no signature verification for MVP)
  export function decodeSessionLite(
    token: string | undefined | null
  ): EdgeSession | null {
    if (!token) return null;
    try {
      // base64url → base64
      const b64 = token.replace(/-/g, "+").replace(/_/g, "/");
      // Pad to multiple of 4
      const pad = b64.length % 4 ? 4 - (b64.length % 4) : 0;
      const b64p = b64 + "=".repeat(pad);
      const json = atob(b64p);
      return JSON.parse(json);
    } catch {
      return null;
    }
  }