"use client";
import { useState } from "react";

export default function CoastalAdminLogin() {
  const [email, setEmail] = useState("coastal@coastal");
  const [password, setPassword] = useState("coastal2025");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const j = await r.json();
    if (!r.ok) return setErr(j?.error || "Login failed");
    // cookie is set by the API; just navigate
    window.location.href = "/coastal/accounts";
  }

  return (
    <main className="mx-auto max-w-md px-5 py-12">
      <h1 className="text-2xl font-semibold text-sky-900 mb-6">
        Coastal Admin
      </h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border px-3 py-2"
          placeholder="Email"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border px-3 py-2"
          type="password"
          placeholder="Password"
        />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="rounded-xl bg-[#0D5374] text-white px-4 py-2">
          Sign in
        </button>
      </form>
    </main>
  );
}
