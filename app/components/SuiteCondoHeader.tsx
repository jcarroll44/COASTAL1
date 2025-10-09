"use client";

import Image from "next/image";
import { useState } from "react";

type Dates = { start?: string; end?: string };

export default function SuiteCondoHeader({
  condoName,
  address,
  logoSrc, // optional: /public path to a condo logo
  showChangeLink = false, // default false (you asked to remove it)
  onChangeCondo, // optional callback if you DO want the link
  initialDates, // optional prefilled dates
  onDatesChange, // optional callback when dates change
}: {
  condoName: string;
  address: string;
  logoSrc?: string;
  showChangeLink?: boolean;
  onChangeCondo?: () => void;
  initialDates?: Dates;
  onDatesChange?: (d: Dates) => void;
}) {
  const [dates, setDates] = useState<Dates>(initialDates ?? {});

  function update<K extends keyof Dates>(key: K, value: string) {
    const next = { ...dates, [key]: value || undefined };
    setDates(next);
    onDatesChange?.(next);
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="rounded-2xl border border-sky-100 bg-white/95 p-5 md:p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Left: Identity */}
          <div className="flex items-start gap-4">
            {logoSrc ? (
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                <Image
                  src={logoSrc}
                  alt={`${condoName} logo`}
                  fill
                  className="object-contain p-1.5"
                />
              </div>
            ) : null}
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-sky-900">
                {condoName}
              </h1>
              <div className="text-[13px] text-slate-600">{address}</div>
              {showChangeLink && onChangeCondo ? (
                <button
                  onClick={onChangeCondo}
                  className="mt-1 text-[12px] font-semibold text-sky-700 hover:text-sky-900"
                >
                  Change condo
                </button>
              ) : null}
            </div>
          </div>

          {/* Right: Dates in header */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-[12px] font-medium text-slate-700">
                Check-in
              </span>
              <input
                type="date"
                value={dates.start ?? ""}
                onChange={(e) => update("start", e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-sky-200"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-[12px] font-medium text-slate-700">
                Check-out
              </span>
              <input
                type="date"
                value={dates.end ?? ""}
                onChange={(e) => update("end", e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-sky-200"
              />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
