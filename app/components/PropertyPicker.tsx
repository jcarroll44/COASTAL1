"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function PropertyPicker() {
  const router = useRouter();
  const [market, setMarket] = useState<"pcb" | "30a">("pcb");
  const addressRef = useRef<HTMLInputElement>(null);

  const openSuite = () => {
    // You can later parse address -> property slug.
    router.push(`/suite/${market}`);
  };

  return (
    <div className="flex gap-2">
      <input
        ref={addressRef}
        className="h-10 flex-1 rounded-xl border border-sky-200 px-3 text-[14px] outline-none focus:ring-2 focus:ring-sky-200"
        placeholder="Enter your rental address or home name"
      />
      <select
        className="h-10 rounded-xl border border-sky-200 px-3 text-[14px]"
        value={market}
        onChange={(e) => setMarket(e.target.value as "pcb" | "30a")}
      >
        <option value="pcb">PCB</option>
        <option value="30a">30A</option>
      </select>
      <button
        onClick={openSuite}
        className="grid h-10 place-items-center rounded-xl bg-sky-900 px-4 text-sm font-semibold text-white hover:bg-sky-950"
      >
        Open Suite
      </button>
    </div>
  );
}
