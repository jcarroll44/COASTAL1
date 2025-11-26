"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import condos from "../../../data/condos.json";

export default function PartnerScopedLoginPage({
  params,
}: {
  params: { partnerId: string };
}) {
  const router = useRouter();
  const partnerId = params.partnerId;

  // If partnerId is a condo slug (exists in condos.json) we’ll hit the condo login API,
  // otherwise if it's "30a-escapes" we’ll hit the partner login API.
  const isCondo = (condos as any[]).some((c) => c?.slug === partnerId);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const url = isCondo
        ? `/api/auth/condos/${partnerId}`
        : `/api/auth/partners/${partnerId}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        setErr(data?.error || "Invalid credentials");
        setLoading(false);
        return;
      }

      // Redirect targets:
      if (isCondo) {
        router.replace(`/partners/${partnerId}`); // Condo Overview
      } else if (partnerId === "30a-escapes") {
        router.replace(`/partners/30a-escapes/properties`);
      } else {
        router.replace(`/partners/${partnerId}/dashboard`);
      }
    } catch (e: any) {
      setErr("Login failed");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-5 md:px-8 py-16">
      <h1 className="text-2xl font-semibold text-center mb-6">
        {isCondo ? "Condo Login" : "Partner Login"}
      </h1>
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-sky-100 bg-white/90 backdrop-blur-sm p-6 shadow-sm space-y-4"
      >
        {/* Email is optional for condos; fine to leave it empty */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-200"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Password</label>
          <input
            className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-200"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {err ? (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
            {err}
          </div>
        ) : null}

        <button
          disabled={loading}
          className="w-full rounded-lg bg-sky-700 text-white py-2.5 hover:bg-sky-800 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}