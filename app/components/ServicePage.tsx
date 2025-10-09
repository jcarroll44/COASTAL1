// app/components/ServicePage.tsx
"use client";

import React from "react";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import type { ServiceDef, Market } from "@/data/services";

const MARKET_LABEL: Record<Market, string> = {
  "30a": "30A / South Walton",
  pcb: "Panama City Beach",
};

type Props = {
  service: ServiceDef;
  initialMarket?: Market; // NEW: allow caller to force the default market
};

export default function ServicePage({ service, initialMarket }: Props) {
  // if initialMarket isn’t supplied, fall back to first available market
  const defaultMarket =
    initialMarket && service.markets.includes(initialMarket)
      ? initialMarket
      : service.markets[0] ?? "30a";

  const [market, setMarket] = useState<Market>(defaultMarket);
  const [date, setDate] = useState<string>("");
  const [qty, setQty] = useState<number>(1);
  const [optionId, setOptionId] = useState<string>(
    service.options[0]?.id ?? ""
  );
  const [addons, setAddons] = useState<Record<string, boolean>>({});

  // Keep market in sync if route changes to a different market page
  useEffect(() => {
    setMarket(defaultMarket);
  }, [defaultMarket]);

  const selectedOption = useMemo(
    () => service.options.find((o) => o.id === optionId) ?? service.options[0],
    [service.options, optionId]
  );

  const addonsTotal = useMemo(
    () =>
      (service.addons ?? [])
        .filter((a) => addons[a.id])
        .reduce((sum, a) => sum + a.price, 0),
    [service.addons, addons]
  );

  const base = selectedOption?.price ?? 0;
  const total = base * qty + addonsTotal;

  return (
    <main className="mx-auto max-w-7xl px-5 md:px-8 pb-16 pt-8">
      {/* Hero + Title row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden min-h-[280px]">
          {service.heroImage ? (
            <Image
              src={service.heroImage}
              alt={service.title}
              width={1800}
              height={1200}
              className="h-[280px] w-full object-cover"
              priority
            />
          ) : (
            <div className="grid h-[280px] place-items-center text-slate-500">
              No image
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            {service.title}
          </h1>
          {service.subtitle && (
            <p className="mt-1 text-slate-600">{service.subtitle}</p>
          )}

          {/* Controls */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <select
              value={market}
              onChange={(e) => setMarket(e.target.value as Market)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              {service.markets.map((m) => (
                <option key={m} value={m}>
                  {MARKET_LABEL[m]}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />

            <div className="inline-flex items-center gap-2">
              <button
                className="h-8 w-8 rounded-full border border-slate-300 text-slate-700"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease"
              >
                −
              </button>
              <span className="min-w-[1.5ch] text-center font-semibold">
                {qty}
              </span>
              <button
                className="h-8 w-8 rounded-full border border-slate-300 text-slate-700"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase"
              >
                +
              </button>
              <span className="text-xs text-slate-500">
                {service.quantityLabel ?? "Qty"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Options + Summary */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[1.2fr_1fr]">
        {/* Packages */}
        <section>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Choose your package
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {service.options.map((opt) => {
              const active = optionId === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setOptionId(opt.id)}
                  className={[
                    "text-left rounded-xl border bg-white p-3 transition",
                    active
                      ? "border-sky-400 ring-2 ring-sky-200"
                      : "border-slate-200 hover:border-slate-300",
                  ].join(" ")}
                >
                  {opt.image && (
                    <Image
                      src={opt.image}
                      alt={opt.name}
                      width={800}
                      height={500}
                      className="mb-2 h-28 w-full rounded-lg object-cover"
                    />
                  )}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">
                        {opt.name}
                      </div>
                      {opt.blurb && (
                        <div className="text-xs text-slate-500">
                          {opt.blurb}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-slate-700">
                      ${opt.price.toFixed(2)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Add-ons */}
          {service.addons && service.addons.length > 0 && (
            <>
              <div className="mt-8 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Enhance it
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {service.addons.map((a) => (
                  <label
                    key={a.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3"
                  >
                    <div>
                      <div className="font-medium text-slate-900">{a.name}</div>
                      <div className="text-xs text-slate-500">
                        ${a.price.toFixed(2)}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!addons[a.id]}
                      onChange={(e) =>
                        setAddons((prev) => ({
                          ...prev,
                          [a.id]: e.target.checked,
                        }))
                      }
                      className="h-4 w-4"
                    />
                  </label>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Summary */}
        <aside className="h-max rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Estimated Total
          </div>
          <div className="mt-1 text-2xl font-bold">${total.toFixed(2)}</div>

          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <div className="flex justify-between">
              <span>{selectedOption?.name}</span>
              <span>${(selectedOption?.price ?? 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{service.quantityLabel ?? "Qty"}</span>
              <span>× {qty}</span>
            </div>
            <div className="flex justify-between">
              <span>Location</span>
              <span>{MARKET_LABEL[market]}</span>
            </div>

            {service.addons?.some((a) => addons[a.id]) && (
              <div className="pt-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Add-Ons
                </div>
                {(service.addons ?? [])
                  .filter((a) => addons[a.id])
                  .map((a) => (
                    <div key={a.id} className="flex justify-between">
                      <span>{a.name}</span>
                      <span>${a.price.toFixed(2)}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <button className="mt-4 w-full rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800">
            Add to Itinerary
          </button>
          <p className="mt-2 text-[11px] text-slate-500">
            You can edit details before checkout. Daily setup & takedown
            included where applicable.
          </p>
        </aside>
      </div>
    </main>
  );
}
