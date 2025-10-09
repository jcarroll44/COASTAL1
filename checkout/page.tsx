"use client";

import { useEffect, useMemo, useState } from "react";

export default function CheckoutPage() {
  const [order, setOrder] = useState<any | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const cached = sessionStorage.getItem("coastal.checkout");
    if (cached) setOrder(JSON.parse(cached));
  }, []);

  const formatted = useMemo(() => {
    if (!order) return null;
    const fmt = (iso?: string) =>
      iso ? new Date(iso).toLocaleDateString() : "—";
    return {
      condo: order.condo || "Selected property",
      chairSets: order.chairSets || 0,
      start: fmt(order.startDate),
      end: fmt(order.endDate),
      bonfire: fmt(order.bonfireDay),
      photo: fmt(order.photoDay),
      total: order.total || 0,
    };
  }, [order]);

  return (
    <main className="mx-auto max-w-5xl px-5 md:px-8 py-10">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-sky-950">
        Checkout
      </h1>

      {!formatted ? (
        <p className="mt-6 text-sky-700">
          No order in progress. Start from an Amenity Suite page.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                (Stub) Integrate your payment processor here.
              </p>
            </div>

            <button
              className="mt-6 rounded-xl bg-sky-700 px-5 py-3 text-white font-semibold shadow hover:bg-sky-800"
              onClick={() => alert("Payment flow to be integrated")}
            >
              Pay & Confirm
            </button>
          </section>

          <aside className="rounded-2xl border border-sky-100 bg-white/95 p-6 shadow-[0_22px_70px_-30px_rgba(9,30,66,0.12)]">
            <h3 className="text-lg font-semibold text-sky-900">
              Order Summary
            </h3>
            <dl className="mt-3 space-y-2 text-sky-800 text-sm">
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
                <dd className="font-medium">{formatted.bonfire}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Photography</dt>
                <dd className="font-medium">{formatted.photo}</dd>
              </div>
            </dl>
            <div className="mt-4 border-t border-sky-100 pt-4 space-y-1 text-sky-900">
              <div className="flex justify-between">
                <span>Total</span>
                <span className="font-semibold">${formatted.total}</span>
              </div>
              <p className="mt-2 text-xs text-sky-600">
                You’ll see final details after payment integration.
              </p>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
