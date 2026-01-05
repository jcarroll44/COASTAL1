// app/register/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/partners";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [role, setRole] = useState<"partner" | "attendant">("partner");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role,
          partnerId: partnerId || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      // auto-login after registration
      const login = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!login.ok) throw new Error("Auto login failed");
      router.replace(next);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center p-6">
      <h1 className="mb-2 text-2xl font-semibold text-sky-900">
        Create a partner account
      </h1>
      <p className="mb-6 text-sky-700">
        Register to access your property dashboards.
      </p>

      <form
        onSubmit={onSubmit}
        className="rounded-xl border border-slate-200 bg-white p-5"
      >
        <label className="block text-sm text-slate-700">
          Email
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            type="text"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company"
          />
        </label>

        <label className="mt-4 block text-sm text-slate-700">
          Password
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
          />
        </label>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm text-slate-700">
            Role
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
            >
              <option value="partner">Partner (default)</option>
              <option value="attendant">Attendant</option>
            </select>
          </label>

          <label className="block text-sm text-slate-700">
            Partner ID (optional)
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              type="text"
              value={partnerId}
              onChange={(e) => setPartnerId(e.target.value)}
              placeholder="e.g., aqua-resort or 30a-escapes"
            />
          </label>
        </div>

        {err && (
          <div className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {err}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full rounded-lg bg-sky-700 px-4 py-2 font-semibold text-white hover:bg-sky-800 disabled:opacity-60"
        >
          {busy ? "Creating account..." : "Create account"}
        </button>

        <div className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <a
            href={`/login?next=${encodeURIComponent(next)}`}
            className="text-sky-700 hover:underline"
          >
            Sign in
          </a>
        </div>
      </form>
    </main>
  );
}
