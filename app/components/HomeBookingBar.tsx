// app/components/HomeBookingBar.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const SERVICES: Record<"pcb" | "30a", { label: string; slug: string }[]> = {
  pcb: [
    { label: "Chairs & Umbrellas", slug: "chairs" },
    { label: "Beach Bonfires", slug: "bonfires" },
    { label: "Family Photography", slug: "photography" },
    { label: "Paddleboard", slug: "paddleboard" },
    { label: "Jet Skis", slug: "jetskis" },
    { label: "Banana Boat", slug: "banana-boat" },
    { label: "Parasail", slug: "parasail" },
    { label: "Boat Rentals", slug: "boat-rentals" },
  ],
  "30a": [
    { label: "Chairs & Umbrellas", slug: "chairs" },
    { label: "Beach Bonfires", slug: "bonfires" },
    { label: "Family Photography", slug: "photography" },
    { label: "Beach Better Box", slug: "beach-better-box" },
  ],
};

export default function HomeBookingBar() {
  const router = useRouter();
  const [market, setMarket] = useState<"" | "pcb" | "30a">("");
  const [service, setService] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const serviceOptions = useMemo(
    () => (market ? SERVICES[market] : []),
    [market]
  );

  function handleSelectMarket(next: "" | "pcb" | "30a") {
    setMarket(next);
    setService(next ? SERVICES[next][0]?.slug ?? "" : "");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!market || !service) return;

    const params = new URLSearchParams();
    if (start) params.set("start", start);
    if (end) params.set("end", end);

    router.push(
      params.toString()
        ? `/${market}/${service}?${params.toString()}`
        : `/${market}/${service}`
    );
  }

  const inputBase =
    "h-11 w-full rounded-xl border px-4 text-[14px] outline-none transition " +
    "focus:border-[#0170BF] focus:ring-2 focus:ring-[#A1D9FF]";

  const inputDisabled =
    "border-slate-200 bg-white/70 text-slate-400 placeholder:text-slate-400 cursor-not-allowed";

  const inputEnabled = "border-slate-300 bg-white text-slate-700";

  return (
    <div
      className="
        mx-auto w-full max-w-6xl
        rounded-3xl bg-white/85 backdrop-blur-sm
        shadow-[0_12px_40px_rgba(0,0,0,0.08)]
        px-6 py-6 md:px-8 md:py-7
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Image
            src="/coastal-logo.png"
            alt="Coastal Beach Company"
            width={22}
            height={22}
            className="opacity-90"
            unoptimized
          />
          <span className="text-[14px] font-semibold tracking-[0.18em] uppercase text-[#0170BF]">
            Coastal Beach Company
          </span>
        </div>

        <a
          href="/suite"
          className="hidden md:inline text-[14px] font-medium text-[#0170BF] hover:underline"
        >
          Explore Our Coastal Experiences →
        </a>
      </div>

      {/* FORM */}
      <form
        onSubmit={submit}
        className="
          grid gap-4
          grid-cols-1
          md:grid-cols-[180px_1fr_180px_180px_200px]
        "
      >
        {/* LOCATION */}
        <div>
          <label className="mb-1 block text-[12px] font-medium text-slate-700">
            Location
          </label>

          <div className="flex rounded-full border border-slate-300 overflow-hidden h-11 bg-white">
            {(["pcb", "30a"] as const).map((m) => {
              const active = market === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleSelectMarket(m)}
                  className={`flex-1 text-[13px] font-medium transition ${
                    active
                      ? "bg-[#0170BF] text-white"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {m.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* SERVICE */}
        <div>
          <label className="mb-1 block text-[12px] font-medium text-slate-700">
            Service
          </label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            disabled={!market}
            className={`${inputBase} ${
              market ? inputEnabled : inputDisabled
            }`}
          >
            {!market ? (
              <option value="">Choose location first…</option>
            ) : (
              serviceOptions.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.label}
                </option>
              ))
            )}
          </select>
        </div>

        {/* START */}
        <div>
          <label className="mb-1 block text-[12px] font-medium text-slate-700">
            Start
          </label>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            disabled={!market}
            className={`${inputBase} ${
              market ? inputEnabled : inputDisabled
            }`}
          />
        </div>

        {/* END */}
        <div>
          <label className="mb-1 block text-[12px] font-medium text-slate-700">
            End
          </label>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            disabled={!market}
            className={`${inputBase} ${
              market ? inputEnabled : inputDisabled
            }`}
          />
        </div>

        {/* CTA */}
        <div className="flex items-end">
          <button
            type="submit"
            disabled={!market || !service}
            className={`h-11 w-full rounded-xl text-[15px] font-semibold transition ${
              !market || !service
                ? "bg-slate-200 text-slate-500"
                : "bg-[#0170BF] text-white hover:bg-[#015EA3]"
            }`}
          >
            Reserve Now
          </button>
        </div>
      </form>
    </div>
  );
}
