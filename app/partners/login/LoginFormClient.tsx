"use client";
import { useState } from "react";

async function tryLogin(body: any, url: string) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok && json?.ok, json };
}

export default function LoginFormClient() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // normalize like the server expects
    const id = identifier.trim().toLowerCase();

    try {
      // 1) Preferred universal route
      let attempt = await tryLogin(
        { identifier: id, password },
        "/api/auth/universal"
      );

      // 2) Back-compat: partner route (if present)
      if (!attempt.ok) {
        attempt = await tryLogin({ email: id, password }, "/api/auth/partner");
      }

      // 3) Back-compat: original /api/auth/login (if present)
      if (!attempt.ok) {
        attempt = await tryLogin({ email: id, password }, "/api/auth/login");
      }

      if (!attempt.ok) {
        setError(attempt.json?.error || "Invalid credentials");
        setLoading(false);
        return;
      }

      const redirect =
        attempt.json?.redirect ||
        (id === "admin"
          ? "/admin"
          : id === "30a-escapes"
          ? "/partners/30a-escapes/properties"
          : `/partners/${id}`);

      window.location.href = redirect;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        type="text"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        placeholder="Email or Condo ID"
        className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200"
      />
      {error ? <p className="text-red-600 text-sm">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-sky-900 text-white py-3 font-medium hover:bg-sky-800 disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
