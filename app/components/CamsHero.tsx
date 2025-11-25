// app/components/CamsHero.tsx
"use client";

import Image from "next/image";
import { useMemo } from "react";

type Props = {
  market: "30A" | "PCB";
  onMarketChange: (m: "30A" | "PCB") => void;
  search: string;
  onSearch: (v: string) => void;
};

const MARKET_BG: Record<"30A" | "PCB", string> = {
  "30A": "/hero-30a-soft.jpg", // use your existing 30A banner or any soft aerial
  PCB: "/hero-pcb-soft.jpg", // use your existing PCB banner or any soft aerial
};

export default function CamsHero({
  market,
  onMarketChange,
  search,
  onSearch,
}: Props) {
  const title = useMemo(
    () => `Beach Cams — ${market === "30A" ? "30A" : "Panama City Beach"}`,
    [market]
  );

  return (
    <section className="relative mx-auto mt-6 max-w-7xl px-5 md:px-8">
      {/* Canvas */}
      <div className="relative overflow-hidden rounded-3xl border border-sky-100 bg-[#F5F9FE]">
        {/* Background image with airy gradient & vignette */}
        <div className="absolute inset-0">
          <Image
            src={MARKET_BG[market]}
            alt=""
            fill
            priority={false}
            className="object-cover opacity-[0.45]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/30 to-white/60" />
          <div className="absolute inset-0 [mask-image:radial-gradient(1200px_450px_at_70%_15%,black,transparent_70%)]" />
        </div>

        {/* Content */}
        <div className="relative grid gap-5 p-6 md:p-8">
          {/* Logo row */}
          <div className="inline-flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/80 ring-1 ring-white/60 shadow-sm">
              {/* tiny CBS mark; swap to your /coastal-mark.svg if you prefer */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0B5CAB">
                <circle cx="12" cy="12" r="10" fill="currentColor" />
              </svg>
            </span>
            <span className="text-[12px] font-semibold tracking-[0.16em] text-sky-700">
              COASTAL
            </span>
          </div>

          {/* Headline & copy in a subtle glass block */}
          <div className="max-w-3xl rounded-2xl bg-white/60 p-4 backdrop-blur supports-[backdrop-filter]:bg-white/45">
            <h1 className="text-[26px] font-semibold leading-tight text-sky-900 md:text-[30px]">
              {title}
            </h1>
            <p className="mt-1 text-[14px] leading-6 text-sky-900/85">
              Check the emerald water in real time. When you’re ready, Coastal
              can arrange your chairs, bonfire, or a full beach day.
            </p>
          </div>

          {/* Controls row */}
          <div className="flex flex-col items-start gap-3 md:flex-row md:items-center">
            {/* Search */}
            <label className="relative w-full md:max-w-md">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sky-500">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" />
                  <path d="m20 20-3.5-3.5" stroke="currentColor" />
                </svg>
              </span>
              <input
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search town or cam name…"
                className="h-10 w-full rounded-xl border border-sky-200 bg-white/90 pl-9 pr-3 text-[14px] text-sky-900 outline-none ring-0 placeholder:text-sky-700/60 focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              />
            </label>

            {/* Market toggle */}
            <div className="inline-flex rounded-full border border-sky-200 bg-white/80 p-1 backdrop-blur">
              {(["30A", "PCB"] as const).map((m) => {
                const active = m === market;
                return (
                  <button
                    key={m}
                    onClick={() => onMarketChange(m)}
                    className={[
                      "min-w-[56px] rounded-full px-3 py-1.5 text-[13px] font-medium transition",
                      active
                        ? "bg-sky-700 text-white shadow-sm"
                        : "text-sky-800 hover:bg-sky-50",
                    ].join(" ")}
                    aria-pressed={active}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}