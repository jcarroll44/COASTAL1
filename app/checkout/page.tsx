"use client";

import { useEffect, useMemo, useState } from "react";

/** Mirror the pricing constants used on the suite page */
const PRICES = {
  chairsDay: 55,
  chairsWeekCap: 300,
  bonfire: 500,
  photo: 300,
};

/** Helpers (defensive around invalid dates) */
function safeFmtDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? String(iso) : d.toLocaleDateString();
}

export default function CheckoutPage() {
  const [order, setOrder] = useState<any | null>(null);
  const [email, setEmail] = useState("");

  // Pull itinerary from sessionStorage (set on the Amenity Suite)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("coastal.checkout");
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  // Derive formatted fields + a cautious total (trust stored total but also compute fallback)
  const formatted = useMemo(() => {
    if (!order) return null;

    const chairSets = Number(order.chairSets || 0);
    const bonfire = order.bonfireDay ? PRICES.bonfire : 0;
    const photo = order.photoDay ? PRICES.photo : 0;

    // prefer what we stored, but have a fallback
    const total =
      typeof order.total === "number"
        ? order.total
        : Math.max(0, chairSets) *
            Math.min(PRICES.chairsWeekCap, PRICES.chairsDay) +
          bonfire +
          photo;

    return {
      condo: order.condo || "Selected property",
      chairSets,
      start: safeFmtDate(order.startDate),
      end: safeFmtDate(order.endDate),
      bonfireDay: order.bonfireDay || null, // day-of-week like "Mon" or null
      photoDay: order.photoDay || null, // day-of-week like "Thu" or null
      subtotalChairs:
        Math.max(0, chairSets) *
        Math.min(PRICES.chairsWeekCap, PRICES.chairsDay), // display hint only
      subtotalBonfire: bonfire,
      subtotalPhoto: photo,
      total,
    };
  }, [order]);

  return (
    <main className="mx-auto max-w-5xl px-5 md:px-8 py-10">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-sky-950">
        Checkout
      </h1>

      {!formatted ? (
        <div className="mt-8 rounded-2xl border border-sky-100 bg-white/95 p-6 text-sky-800">
          <p className="text-sky-800">
            No order in progress. Start from an Amenity Suite page to build your
            itinerary.
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href="/suite/pcb"
              className="inline-block rounded-lg bg-sky-700 px-4 py-2 text-white font-semibold shadow hover:bg-sky-800"
            >
              Browse Suites
            </a>
            <a
              href="/"
              className="inline-block rounded-lg border border-sky-200 px-4 py-2 text-sky-800 hover:bg-sky-50"
            >
              Go Home
            </a>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Contact + Payment stub */}
          <section className="lg:col-span-2 rounded-2xl border border-sky-100 bg-white/95 p-6 shadow-[0_22px_70px_-30px_rgba(9,30,66,0.12)]">
            <h2 className="text-xl font-semibold text-sky-900">Contact</h2>

            <label className="mt-3 block text-sm text-sky-700">Email</label>
            <input
              className="mt-1 w-full rounded-xl border border-sky-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-sky-900">Payment</h2>
              <p className="mt-2 text-sky-700 text-sm">
                This is a placeholder. You can wire in your processor (Stripe,
                Square, etc.) here later.
              </p>
            </div>

            <button
              className="mt-6 rounded-xl bg-sky-700 px-5 py-3 text-white font-semibold shadow hover:bg-sky-800 disabled:opacity-60"
              onClick={() => {
                if (!email) return alert("Please enter an email to continue");
                alert("Payment flow to be integrated");
              }}
            >
              Confirm & Pay
            </button>
          </section>

          {/* Right: Order Summary */}
          <aside className="rounded-2xl border border-sky-100 bg-white/95 p-6 shadow-[0_22px_70px_-30px_rgba(9,30,66,0.12)]">
            <h3 className="text-lg font-semibold text-sky-900">
              Order Summary
            </h3>

            <dl className="mt-3 space-y-3 text-sky-800 text-sm">
              <div className="flex justify-between">
                <dt>Property</dt>
                <dd className="font-medium">{formatted.condo}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Chair sets</dt>
                <dd className="font-medium">{formatted.chairSets}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Dates</dt>
                <dd className="font-medium">
                  {formatted.start} → {formatted.end}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Bonfire</dt>
                <dd className="font-medium">
                  {formatted.bonfireDay || "Not scheduled"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Photography</dt>
                <dd className="font-medium">
                  {formatted.photoDay || "Not scheduled"}
                </dd>
              </div>
            </dl>

            <div className="mt-4 border-t border-sky-100 pt-4 space-y-1 text-sky-900">
              {/* We show totals simply; if you want line items visible, uncomment below */}
              {/* <div className="flex justify-between text-sm text-sky-800">
                <span>Chairs</span>
                <span>${formatted.subtotalChairs}</span>
              </div>
              {formatted.subtotalBonfire > 0 && (
                <div className="flex justify-between text-sm text-sky-800">
                  <span>Bonfire</span>
                  <span>${formatted.subtotalBonfire}</span>
                </div>
              )}
              {formatted.subtotalPhoto > 0 && (
                <div className="flex justify-between text-sm text-sky-800">
                  <span>Photography</span>
                  <span>${formatted.subtotalPhoto}</span>
                </div>
              )} */}
              <div className="flex justify-between font-semibold text-sky-950">
                <span>Total</span>
                <span>${formatted.total}</span>
              </div>
              <p className="mt-2 text-xs text-sky-600">
                Chairs: ${PRICES.chairsDay}/day per set, capped at $
                {PRICES.chairsWeekCap}/week.
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs">
              <a
                href="/suite/pcb"
                className="rounded-lg border border-sky-200 px-3 py-1.5 text-sky-700 hover:bg-sky-50"
              >
                Edit in Suite
              </a>
              <button
                onClick={() => {
                  if (!email) return alert("Please enter an email to continue");
                  alert("Payment flow to be integrated");
                }}
                className="rounded-lg bg-sky-700 px-3 py-1.5 font-semibold text-white hover:bg-sky-800"
              >
                Confirm & Pay
              </button>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
