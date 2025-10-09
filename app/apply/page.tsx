"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ApplyPage() {
  const params = useSearchParams();
  const defaultRole = params.get("role") || "";
  const defaultMarket = params.get("market") || "";

  const [values, setValues] = useState({
    first: "",
    last: "",
    email: "",
    phone: "",
    market: defaultMarket,
    role: defaultRole,
    start: "",
    availability: "",
    address: "",
    notes: "",
  });

  const update = (k: keyof typeof values, v: string) =>
    setValues((s) => ({ ...s, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Client-only mailto fallback (no plugins/servers required)
    const body = Object.entries(values)
      .map(([k, v]) => `${k}: ${v || "-"}`)
      .join("%0A");
    window.location.href = `mailto:careers@coastalbeach.co?subject=Application%20-%20${encodeURIComponent(
      values.first + " " + values.last
    )}&body=${body}`;
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold text-sky-900">
        Employment Application
      </h1>
      <p className="mt-1 text-sky-700">
        Complete the form below. We’ll follow up within 24–48 hours.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            className="rounded-lg border border-sky-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
            placeholder="First name *"
            value={values.first}
            onChange={(e) => update("first", e.target.value)}
            required
          />
          <input
            className="rounded-lg border border-sky-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
            placeholder="Last name *"
            value={values.last}
            onChange={(e) => update("last", e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            className="rounded-lg border border-sky-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
            placeholder="Email"
            type="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
          />
          <input
            className="rounded-lg border border-sky-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
            placeholder="Phone"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <select
            className="rounded-lg border border-sky-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
            value={values.market}
            onChange={(e) => update("market", e.target.value)}
          >
            <option value="">Market</option>
            <option value="PCB">PCB</option>
            <option value="30A">30A</option>
          </select>
          <input
            className="rounded-lg border border-sky-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
            placeholder="Role"
            value={values.role}
            onChange={(e) => update("role", e.target.value)}
          />
          <input
            type="date"
            className="rounded-lg border border-sky-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
            value={values.start}
            onChange={(e) => update("start", e.target.value)}
          />
        </div>
        <select
          className="w-full rounded-lg border border-sky-2 00 px-3 py-2 text-sm outline-none focus:border-sky-400"
          value={values.availability}
          onChange={(e) => update("availability", e.target.value)}
        >
          <option value="">Availability</option>
          <option>Days</option>
          <option>Evenings</option>
          <option>Weekends</option>
          <option>Flexible</option>
        </select>
        <input
          className="w-full rounded-lg border border-sky-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
          placeholder="Street address"
          value={values.address}
          onChange={(e) => update("address", e.target.value)}
        />
        <textarea
          className="h-32 w-full rounded-lg border border-sky-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
          placeholder="Anything else we should know?"
          value={values.notes}
          onChange={(e) => update("notes", e.target.value)}
        />
        <button className="w-full rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800">
          Submit Application
        </button>
        <p className="text-[11px] text-sky-500">
          By submitting, you consent to being contacted about Coastal employment
          opportunities.
        </p>
      </form>
    </main>
  );
}
