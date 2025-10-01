// app/components/SelectLocationModal.tsx
"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (opts: { market: "30a" | "pcb"; qty: number }) => void;
  title?: string;
};

export default function SelectLocationModal({
  open,
  onClose,
  onConfirm,
  title = "Select Options",
}: Props) {
  const [market, setMarket] = useState<"30a" | "pcb">("30a");
  const [qty, setQty] = useState<number>(1);

  return (
    <>
      <div
        className={`fixed inset-0 z-[70] bg-black/30 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed left-1/2 top-1/2 z-[75] w-[92%] max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-5 shadow-xl transition-transform ${
          open ? "scale-100" : "pointer-events-none scale-95"
        }`}
      >
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Location
            </label>
            <select
              value={market}
              onChange={(e) => setMarket(e.target.value as "30a" | "pcb")}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="30a">30A / South Walton</option>
              <option value="pcb">Panama City Beach</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
            onClick={() => {
              onConfirm({ market, qty });
              onClose();
            }}
          >
            Add
          </button>
        </div>
      </div>
    </>
  );
}
