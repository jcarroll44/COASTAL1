"use client";

import { getSuiteConfig } from "@/lib/getSuiteConfig";

export default function AmenitySuite({
  market,
  property,
}: {
  market: string;
  property: string | null;
}) {
  const cfg = getSuiteConfig(market, property);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">
          Amenity Suite — {market.toUpperCase()}{" "}
          {property ? `· ${property}` : ""}
        </h1>
        {cfg.propertyMeta && (
          <p className="text-sm text-sky-700">
            {cfg.propertyMeta.name} — {cfg.propertyMeta.address}
          </p>
        )}
      </header>

      <section className="rounded-2xl border border-sky-100 bg-white/90 p-4">
        <div className="text-sm text-sky-700">Available this stay:</div>
        <ul className="mt-2 grid gap-2 md:grid-cols-2">
          {cfg.items.map((it) => (
            <li
              key={it.id}
              className="flex items-center justify-between rounded-xl border border-sky-100 bg-white px-3 py-2"
            >
              <div className="font-semibold">{it.name}</div>
              <div className="text-sky-800">${it.price}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
