// app/components/ConciergeCTA.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ConciergeCTA() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [market, setMarket] = useState<"pcb" | "30a">("pcb");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // you can wire this to your actual suite logic later
    const params = new URLSearchParams({ market, address });
    router.push(`/suite?${params.toString()}`);
  }

  return (
    <section className="mt-4 mb-14 px-6">
      <div className="coastal-container max-w-[1120px]">
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-sky-100 bg-white/70 p-3 backdrop-blur shadow-sm"
        >
          <div className="mb-2 text-[13px] font-medium text-sky-900">
            Already booked a home?
          </div>
          <div className="flex gap-2">
            <input
              placeholder="Enter your rental address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-10 w-full rounded-xl border border-sky-200 bg-white px-3 text-[14px] outline-none focus:ring-2 focus:ring-sky-200"
            />
            <select
              value={market}
              onChange={(e) => setMarket(e.target.value as "pcb" | "30a")}
              className="h-10 rounded-xl border border-sky-200 bg-white px-2 text-[14px]"
            >
              <option value="pcb">PCB</option>
              <option value="30a">30A</option>
            </select>
            <button
              type="submit"
              className="grid h-10 place-items-center rounded-xl bg-sky-900 px-4 text-sm font-semibold text-white hover:bg-sky-950"
            >
              Open Suite
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
