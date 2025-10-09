// app/components/Itinerary.tsx
"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  id: string;
  title: string;
  market: "pcb" | "30a";
  qty: number;
  price: number; // unit price (already includes per-order add-ons)
  meta?: Record<string, any>;
};

type Ctx = {
  items: CartItem[];
  addItem: (i: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (b: boolean) => void;
};

const ItineraryContext = createContext<Ctx | null>(null);

export function ItineraryProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (i: CartItem) =>
    setItems((prev) => {
      // merge same line if id matches
      const idx = prev.findIndex((p) => p.id === i.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...prev[idx], qty: prev[idx].qty + i.qty };
        return next;
      }
      return [...prev, i];
    });

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((p) => p.id !== id));

  const clear = () => setItems([]);

  const value = useMemo<Ctx>(
    () => ({ items, addItem, removeItem, clear, open, setOpen }),
    [items, open]
  );

  return (
    <ItineraryContext.Provider value={value}>
      {children}
      <Drawer />
    </ItineraryContext.Provider>
  );
}

export function useItinerary() {
  const ctx = useContext(ItineraryContext);
  if (!ctx)
    throw new Error("useItinerary must be used within ItineraryProvider");
  return ctx;
}

function Drawer() {
  const router = useRouter();
  const { items, removeItem, clear, open, setOpen } = useItinerary();
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  function onContinue() {
    // Minimal payload → Checkout
    const payload = {
      items: items.map((i) => ({
        title: i.title,
        qty: i.qty,
        unitPrice: i.price,
        market: i.market,
        meta: i.meta || {},
      })),
      total,
      // Helpful denormalizations (optional)
      chairSets:
        items
          .filter((i) => /chairs/i.test(i.title))
          .reduce((s, i) => s + i.qty, 0) || 0,
      startDate: items.find((i) => i.meta?.startDate)?.meta?.startDate || null,
      endDate: items.find((i) => i.meta?.endDate)?.meta?.endDate || null,
      condo: items.find((i) => i.meta?.location)?.meta?.location || "",
    };
    sessionStorage.setItem("coastal.checkout", JSON.stringify(payload));
    setOpen(false);
    router.push("/checkout");
  }

  return (
    <div
      className={`fixed inset-y-0 right-0 z-[2000] w-[92vw] max-w-md transform bg-white shadow-2xl ring-1 ring-sky-100 transition-transform ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* header */}
      <div className="flex items-center justify-between border-b border-sky-100 p-4">
        <div className="text-lg font-semibold text-sky-900">Your Itinerary</div>
        <button
          className="rounded-md px-3 py-1 text-sky-700 hover:bg-sky-50"
          onClick={() => setOpen(false)}
        >
          Close
        </button>
      </div>

      {/* items */}
      <div className="h-[calc(100vh-190px)] overflow-y-auto p-4">
        {!items.length ? (
          <div className="text-sky-600">Your cart is empty.</div>
        ) : (
          <div className="space-y-3">
            {items.map((i) => (
              <div
                key={i.id}
                className="rounded-lg border border-sky-100 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-sky-900">{i.title}</div>
                    <div className="text-sm text-sky-700">
                      {i.market.toUpperCase()}
                    </div>
                    <div className="mt-1 text-sm text-sky-700">
                      Qty: {i.qty} @ ${i.price.toFixed(2)}
                    </div>
                    {i.meta?.location && (
                      <div className="mt-0.5 text-xs text-sky-600">
                        {i.meta.location}
                      </div>
                    )}
                    {i.meta?.startDate && i.meta?.endDate && (
                      <div className="mt-0.5 text-xs text-sky-600">
                        {i.meta.startDate} → {i.meta.endDate}
                      </div>
                    )}
                  </div>
                  <button
                    className="text-sm text-sky-600 hover:text-sky-800"
                    onClick={() => removeItem(i.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* footer */}
      <div className="border-t border-sky-100 p-4">
        <div className="mb-3 flex items-center justify-between text-sky-900">
          <span className="font-medium">Total</span>
          <span className="text-lg font-semibold">${total.toFixed(2)}</span>
        </div>
        <button
          disabled={!items.length}
          onClick={onContinue}
          className="w-full rounded-lg bg-sky-700 px-4 py-3 font-semibold text-white hover:bg-sky-800 disabled:opacity-60"
        >
          Continue
        </button>
        <button
          onClick={clear}
          className="mt-2 w-full rounded-lg border border-sky-200 px-4 py-2 text-sky-800 hover:bg-sky-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
