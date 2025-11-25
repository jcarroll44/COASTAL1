// app/components/HeroCTA.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroCTA() {
  const router = useRouter();
  const [market, setMarket] = useState<"30a" | "pcb">("30a");
  const [location, setLocation] = useState<string>("");
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");

  function submit(e: React.FormEvent) {
    e.preventDefault();

    // Build target route by market
    const to = market === "pcb" ? "/pcb/chairs" : "/30a/chairs";

    const params = new URLSearchParams();
    if (location) {
      // Chairs page reads accessName to prefill location
      params.set("accessName", location);
    }
    if (start) params.set("start", start);
    if (end) params.set("end", end);

    const href = params.toString() ? `${to}?${params.toString()}` : to;
    router.push(href);
  }

  return (
    <form
      onSubmit={submit}
      className="
  pointer-events-auto
  mx-auto w-[min(980px,calc(100%-24px))]
  rounded-2xl bg-white/85 backdrop-blur-md
  shadow-[0_6px_24px_rgba(2,132,199,0.15)]
  ring-1 ring-sky-100
  px-4 py-3 md:px-6 md:py-4
"
    >
      <div
        className="
          grid items-center gap-2
          md:grid-cols-[140px_minmax(0,1fr)_180px_180px_160px]
        "
      >
        {/* Market */}
        <div className="flex items-center gap-2 px-2 md:px-3">
          <label className="text-[12px] font-semibold tracking-wide text-sky-900">
            Market
          </label>
          <select
            value={market}
            onChange={(e) => setMarket(e.target.value as "30a" | "pcb")}
            className="
              w-full rounded-full border-0 bg-transparent px-2 py-2 text-sm
              text-sky-900 outline-none
              focus:ring-0
            "
            aria-label="Select market"
          >
            <option value="30a">30A</option>
            <option value="pcb">PCB</option>
          </select>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 px-2 md:border-l md:border-sky-100 md:px-4">
          <span aria-hidden className="hidden md:inline text-sky-700/80">
            📍
          </span>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={
              market === "pcb"
                ? "Your PCB condo / resort"
                : "Nearest 30A beach access"
            }
            className="
              w-full rounded-full border-0 bg-transparent py-2 text-sm
              placeholder:text-sky-700/60 text-sky-900 outline-none focus:ring-0
            "
            aria-label="Location"
          />
        </div>

        {/* Start */}
        <div className="flex items-center gap-2 px-2 md:border-l md:border-sky-100 md:px-4">
          <label className="hidden md:block text-[12px] font-semibold text-sky-900">
            Start
          </label>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="
              w-full rounded-full border-0 bg-transparent py-2 text-sm
              text-sky-900 outline-none focus:ring-0
            "
            aria-label="Start date"
          />
        </div>

        {/* End */}
        <div className="flex items-center gap-2 px-2 md:border-l md:border-sky-100 md:px-4">
          <label className="hidden md:block text-[12px] font-semibold text-sky-900">
            End
          </label>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="
              w-full rounded-full border-0 bg-transparent py-2 text-sm
              text-sky-900 outline-none focus:ring-0
            "
            aria-label="End date"
          />
        </div>

        {/* CTA */}
        <div className="mt-2 md:mt-0 md:border-l md:border-sky-100 md:pl-4">
          <button
            type="submit"
            className="
              w-full rounded-full bg-sky-700 px-5 py-3 text-sm font-semibold text-white
              shadow-[0_10px_30px_rgba(2,132,199,0.35)]
              hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-300
            "
          >
            Check Availability
          </button>
        </div>
      </div>
    </form>
  );
}