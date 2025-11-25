// app/components/HomeBookingBar.tsx
"use client";

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
  const [service, setService] = useState<string>("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const serviceOptions = useMemo(() => {
    if (!market) return [];
    return SERVICES[market];
  }, [market]);

  function handleSelectMarket(next: "" | "pcb" | "30a") {
    setMarket(next);
    if (next) {
      const first = SERVICES[next][0];
      setService(first?.slug ?? "");
    } else {
      setService("");
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!market || !service) return;
    const path = `/${market}/${service}`;
    const params = new URLSearchParams();
    if (start) params.set("start", start);
    if (end) params.set("end", end);
    router.push(params.toString() ? `${path}?${params.toString()}` : path);
  }

  const disabledUntilMarket = !market;

  return (
    <div
      className="
        mx-auto w-full max-w-5xl
        rounded-2xl bg-white/75 backdrop-blur-lg
        ring-1 ring-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.06)]
        px-4 py-5 md:px-5 md:py-6
      "
      role="region"
      aria-label="Coastal booking"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[15px] font-semibold tracking-[.10em] uppercase text-[#0584C7]">
          Coastal Beach Company
        </span>
        <a
          href="/suite"
          className="hidden text-[12.5px] md:block text-[#0584C7] font-medium tracking-wide hover:underline hover:text-[#046FB0] transition-colors"
        >
          Explore Our Coastal Experiences →
        </a>
      </div>

      <form
        onSubmit={submit}
        className="
          grid gap-3
          grid-cols-1 sm:grid-cols-2
          lg:grid-cols-[minmax(160px,180px)_minmax(240px,1fr)_minmax(150px,1fr)_minmax(150px,1fr)_minmax(160px,180px)]
        "
      >
        {/* Location */}
        <div>
          <label className="mb-1 block text-[11.5px] font-semibold text-slate-700">
            Location
          </label>
          {/* Segmented (desktop) */}
          <div className="hidden overflow-hidden rounded-full ring-1 ring-slate-200 lg:flex">
            {(["pcb", "30a"] as const).map((m, i) => {
              const active = market === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleSelectMarket(m)}
                  className={[
                    "h-10 flex-1 text-[13px] font-medium transition-colors relative",
                    active
                      ? "bg-[#0584C7] text-white"
                      : "bg-white text-slate-700 hover:bg-slate-50",
                    i === 0 ? "rounded-l-full" : "rounded-r-full",
                  ].join(" ")}
                  aria-pressed={active}
                >
                  {m.toUpperCase()}
                  {i === 0 && (
                    <span className="absolute right-0 top-[15%] h-[70%] w-[1px] bg-slate-200" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Select (mobile) */}
          <select
            value={market}
            onChange={(e) =>
              handleSelectMarket(e.target.value as "" | "pcb" | "30a")
            }
            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[14px] outline-none focus:border-[#0584C7] focus:ring-2 focus:ring-[#B9E2F8] lg:hidden"
          >
            <option value="">Select location…</option>
            <option value="pcb">PCB</option>
            <option value="30a">30A</option>
          </select>
        </div>

        {/* Service */}
        <div>
          <label className="mb-1 block text-[11.5px] font-semibold text-slate-700">
            Service
          </label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            disabled={disabledUntilMarket}
            className={[
              "h-10 w-full rounded-lg border px-3 text-[14px] outline-none focus:border-[#0584C7] focus:ring-2 focus:ring-[#B9E2F8]",
              disabledUntilMarket
                ? "border-slate-200 bg-slate-50 text-slate-400"
                : "border-slate-300 bg-white",
            ].join(" ")}
          >
            {disabledUntilMarket ? (
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

        {/* Start */}
        <div>
          <label className="mb-1 block text-[11.5px] font-semibold text-slate-700">
            Start
          </label>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            disabled={disabledUntilMarket}
            className={[
              "h-10 w-full rounded-lg border px-3 text-[14px] outline-none focus:border-[#0584C7] focus:ring-2 focus:ring-[#B9E2F8]",
              disabledUntilMarket
                ? "border-slate-200 bg-slate-50 text-slate-400"
                : "border-slate-300 bg-white",
            ].join(" ")}
          />
        </div>

        {/* End */}
        <div>
          <label className="mb-1 block text-[11.5px] font-semibold text-slate-700">
            End
          </label>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            disabled={disabledUntilMarket}
            className={[
              "h-10 w-full rounded-lg border px-3 text-[14px] outline-none focus:border-[#0584C7] focus:ring-2 focus:ring-[#B9E2F8]",
              disabledUntilMarket
                ? "border-slate-200 bg-slate-50 text-slate-400"
                : "border-slate-300 bg-white",
            ].join(" ")}
          />
        </div>

        {/* CTA */}
        <div className="flex items-end">
          <button
            type="submit"
            disabled={!market || !service}
            className={[
              "h-10 w-full rounded-lg text-[14px] font-semibold transition-colors",
              !market || !service
                ? "bg-slate-200 text-slate-500"
                : "bg-[#0584C7] text-white hover:bg-[#046FB0] shadow-[0_10px_22px_-12px_rgba(5,132,199,0.45)]",
            ].join(" ")}
            aria-disabled={!market || !service}
          >
            Reserve Now
          </button>
        </div>
      </form>
    </div>
  );
}