// app/components/AlaCarteTemplate.tsx
"use client";

import Image from "next/image";
import { useId, useMemo, useState } from "react";
import QuantityStepper from "./QuantityStepper";
import { useItinerary } from "./Itinerary"; // already in your project from earlier step

type Market = "30a" | "pcb";

type Option = {
  id: string;
  title: string;
  image: string;
  price: number;
  note?: string;
};

type AddOn = {
  id: string;
  title: string;
  price: number;
};

type Props = {
  title: string;
  tagline: string;
  heroImage: string;
  options: Option[]; // main products (e.g., Chair Set, Sunset Bonfire)
  addons?: AddOn[]; // optional upsells (e.g., Extra S’mores Kit)
  defaultMarket?: Market;
};

export default function AlaCarteTemplate({
  title,
  tagline,
  heroImage,
  options,
  addons = [],
  defaultMarket = "30a",
}: Props) {
  const uid = useId();
  const { addItem, setOpen } = useItinerary();

  const [market, setMarket] = useState<Market>(defaultMarket);
  const [date, setDate] = useState<string>("");
  const [qty, setQty] = useState<number>(1);
  const [selected, setSelected] = useState<Option | null>(options[0] ?? null);
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>(
    {}
  );

  const base = selected?.price ?? 0;
  const addonsTotal = useMemo(
    () =>
      addons
        .filter((a) => selectedAddons[a.id])
        .reduce((s, a) => s + a.price, 0),
    [addons, selectedAddons]
  );
  const total = (base + addonsTotal) * qty;

  const addToItinerary = () => {
    if (!selected) return;
    const lineId = `${uid}-${selected.id}-${market}-${date || "nodate"}`;
    addItem({
      id: lineId,
      title: `${selected.title} ${date ? `• ${date}` : ""}`,
      market,
      qty,
      price: base + addonsTotal,
    });
    setOpen(true);
  };

  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="px-6 pt-8 md:pt-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
              <Image
                src={heroImage}
                alt={title}
                width={1600}
                height={900}
                className="h-[360px] w-full object-cover"
                priority
              />
            </div>
            <div className="lg:col-span-5">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
                {title}
              </h1>
              <p className="mt-2 text-slate-600">{tagline}</p>

              {/* Quick selector */}
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Location
                  </label>
                  <select
                    value={market}
                    onChange={(e) => setMarket(e.target.value as Market)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="30a">30A / South Walton</option>
                    <option value="pcb">Panama City Beach</option>
                  </select>
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Quantity
                  </label>
                  <QuantityStepper value={qty} onChange={setQty} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="px-6 py-10 md:py-14">
        <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-12">
          {/* Left: Options + Addons */}
          <div className="lg:col-span-8 space-y-8">
            {/* OPTIONS */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                Choose your package
              </h2>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                {options.map((opt) => {
                  const active = selected?.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelected(opt)}
                      className={`group overflow-hidden rounded-2xl border bg-white text-left transition ${
                        active
                          ? "border-sky-600 ring-2 ring-sky-100"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <Image
                        src={opt.image}
                        alt={opt.title}
                        width={1200}
                        height={800}
                        className="h-40 w-full object-cover"
                      />
                      <div className="p-5">
                        <div className="flex items-baseline justify-between">
                          <div className="text-base font-semibold text-slate-900">
                            {opt.title}
                          </div>
                          <div className="text-sm font-medium text-slate-700">
                            ${opt.price.toFixed(2)}
                          </div>
                        </div>
                        {opt.note && (
                          <p className="mt-1 text-xs text-slate-600">
                            {opt.note}
                          </p>
                        )}
                        <div className="mt-3 text-xs text-sky-700 opacity-0 transition group-hover:opacity-100">
                          Select
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ADDONS */}
            {addons.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                  Enhance it
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {addons.map((add) => {
                    const checked = !!selectedAddons[add.id];
                    return (
                      <label
                        key={add.id}
                        className={`flex items-center justify-between rounded-2xl border bg-white p-4 transition ${
                          checked
                            ? "border-sky-600 ring-1 ring-sky-100"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {add.title}
                          </div>
                          <div className="text-xs text-slate-600">
                            ${add.price.toFixed(2)}
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-600"
                          checked={checked}
                          onChange={() =>
                            setSelectedAddons((s) => ({
                              ...s,
                              [add.id]: !s[add.id],
                            }))
                          }
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm text-slate-600">Estimated total</div>
              <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                ${total.toFixed(2)}
              </div>

              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li className="flex justify-between">
                  <span>{selected?.title || "—"}</span>
                  <span>${base.toFixed(2)}</span>
                </li>
                {addons
                  .filter((a) => selectedAddons[a.id])
                  .map((a) => (
                    <li key={a.id} className="flex justify-between">
                      <span>{a.title}</span>
                      <span>${a.price.toFixed(2)}</span>
                    </li>
                  ))}
                <li className="flex justify-between text-slate-500">
                  <span>Qty</span>
                  <span>× {qty}</span>
                </li>
                <li className="flex justify-between text-slate-500">
                  <span>Location</span>
                  <span className="uppercase">{market}</span>
                </li>
                {date && (
                  <li className="flex justify-between text-slate-500">
                    <span>Date</span>
                    <span>{date}</span>
                  </li>
                )}
              </ul>

              <button
                onClick={addToItinerary}
                className="mt-6 w-full rounded-xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-800"
              >
                Add to Itinerary
              </button>

              <p className="mt-3 text-xs text-slate-500">
                You can edit details before checkout. Daily setup & takedown
                included where applicable.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}