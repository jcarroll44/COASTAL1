// app/components/Itinerary.tsx
"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";

type Item = {
  id: string;
  title: string;
  market: "30a" | "pcb";
  qty: number;
  price: number; // in USD
};

type ItineraryCtx = {
  items: Item[];
  open: boolean;
  addItem: (i: Item) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  total: number;
  setOpen: (v: boolean) => void;
};

const Ctx = createContext<ItineraryCtx | null>(null);

export function ItineraryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);

  const addItem = (i: Item) => {
    setItems((prev) => {
      // merge by title + market
      const key = `${i.title}-${i.market}`;
      const idx = prev.findIndex((p) => `${p.title}-${p.market}` === key);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + i.qty };
        return copy;
      }
      return [...prev, i];
    });
    setOpen(true);
  };

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((p) => p.id !== id));
  const clear = () => setItems([]);
  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );

  const value = { items, open, addItem, removeItem, clear, total, setOpen };

  return (
    <Ctx.Provider value={value}>
      {children}
      <ItineraryDrawer />
    </Ctx.Provider>
  );
}

export function useItinerary() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useItinerary must be used within ItineraryProvider");
  return ctx;
}

function ItineraryDrawer() {
  const { open, setOpen, items, total, removeItem, clear } = useItinerary();
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[80] bg-black/20 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-[90] h-full w-[90%] max-w-[360px] bg-white shadow-2xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Your Itinerary
          </h3>
          <button
            className="rounded-md border px-2 py-1 text-sm hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
        <div className="p-4 space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-slate-600">
              No items yet. Add a service to begin.
            </p>
          ) : (
            items.map((i) => (
              <div key={i.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {i.title}
                    </div>
                    <div className="text-xs text-slate-600 uppercase">
                      {i.market === "30a" ? "30A" : "PCB"}
                    </div>
                  </div>
                  <div className="text-sm text-slate-900">
                    ${(i.price * i.qty).toFixed(2)}
                  </div>
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  Qty: {i.qty} @ ${i.price.toFixed(2)}
                </div>
                <button
                  className="mt-2 text-xs text-sky-700 hover:underline"
                  onClick={() => removeItem(i.id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        <div className="mt-auto border-t p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Total</span>
            <span className="font-semibold text-slate-900">
              ${total.toFixed(2)}
            </span>
          </div>
          <button className="mt-3 w-full rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800">
            Continue
          </button>
          <button
            className="mt-2 w-full rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
            onClick={clear}
          >
            Clear
          </button>
        </div>
      </aside>
    </>
  );
}
