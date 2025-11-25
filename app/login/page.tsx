// app/login/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok || !data?.ok) {
      setError(data?.error || "Invalid credentials");
      return;
    }

    router.replace(data.redirect || next);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-sky-50">
      <form
        onSubmit={handleLogin}
        className="coastal-glass rounded-2xl p-8 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          Coastal Admin Login
        </h1>
        <input
          type="email"
          placeholder="Email (coastal@coastal)"
          className="w-full mb-3 rounded-lg border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password (coastal2025)"
          className="w-full mb-4 rounded-lg border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand text-white font-semibold py-2.5 rounded-lg hover:opacity-90"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
