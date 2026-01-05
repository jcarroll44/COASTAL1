"use client";

import { useMemo, useState } from "react";
import { JOBS } from "@/data/jobs";

type Props = { className?: string };

export default function QuickApplyCard({ className = "" }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [market, setMarket] = useState<"PCB" | "30A" | "">("");
  const [role, setRole] = useState("");
  const [start, setStart] = useState("");
  const [availability, setAvailability] = useState<
    "Days" | "Evenings" | "Weekends" | "Flexible" | ""
  >("");

  const roles = useMemo(
    () => Array.from(new Set(JOBS.map((j) => j.title))).sort(),
    []
  );

  const disabled = !name || (!phone && !email) || !market;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Client-only for now: open mailto with prefilled body (no plugins).
    const lines = [
      `Name: ${name}`,
      `Phone: ${phone || "-"}`,
      `Email: ${email || "-"}`,
      `Market: ${market || "-"}`,
      `Role Interest: ${role || "Any"}`,
      `Start Date: ${start || "-"}`,
      `Availability: ${availability || "-"}`,
    ].join("%0A");
    window.location.href = `mailto:careers@coastalbeach.co?subject=Quick%20Apply%20-%20${encodeURIComponent(
      name
    )}&body=${lines}`;
  };

  return (
    <aside
      className={`rounded-2xl border border-sky-100 bg-white/95 p-4 shadow-[0_22px_70px_-30px_rgba(9,30,66,0.12)] ${className}`}
    >
      <div className="mb-2 text-sm font-semibold text-sky-900">Quick Apply</div>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full rounded-lg border border-sky-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
          placeholder="Full name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            className="rounded-lg border border-sky-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            className="rounded-lg border border-sky-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <select
            className="rounded-lg border border-sky-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
            value={market}
            onChange={(e) => setMarket(e.target.value as any)}
          >
            <option value="">Preferred market *</option>
            <option value="PCB">Panama City Beach (PCB)</option>
            <option value="30A">30A / South Walton</option>
          </select>
          <select
            className="rounded-lg border border-sky-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Role interest (Any)</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            type="date"
            className="rounded-lg border border-sky-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
          <select
            className="rounded-lg border border-sky-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
            value={availability}
            onChange={(e) => setAvailability(e.target.value as any)}
          >
            <option value="">Availability</option>
            <option>Days</option>
            <option>Evenings</option>
            <option>Weekends</option>
            <option>Flexible</option>
          </select>
        </div>
        <button
          disabled={disabled}
          className={`w-full rounded-lg px-4 py-2 text-sm font-semibold text-white ${
            disabled ? "bg-sky-300" : "bg-sky-700 hover:bg-sky-800"
          }`}
        >
          Send Interest
        </button>
        <p className="text-[11px] text-sky-500">We reply within 24–48 hours.</p>
      </form>
    </aside>
  );
}