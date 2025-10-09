"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import condos from "../../data/condos.json"; // ✅ from app/pcb/condos → ../../.. → data

type Condo = {
  name: string;
  address: string;
  slug: string;
  logo?: string;
  market?: string; // "pcb" | "30a"
};

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function matches(q: string, c: Condo) {
  if (!q) return true;
  const s = q.toLowerCase().trim();
  return (
    c.name.toLowerCase().includes(s) ||
    c.address.toLowerCase().includes(s) ||
    c.slug.toLowerCase().includes(s)
  );
}

function groupByLetter(list: Condo[]) {
  const map: Record<string, Condo[]> = {};
  for (const c of list) {
    const k = (c.name[0] || "#").toUpperCase();
    (map[k] ||= []).push(c);
  }
  for (const k of Object.keys(map)) {
    map[k].sort((a, b) => a.name.localeCompare(b.name));
  }
  return map;
}

function OpenSuiteButton({ condo }: { condo: Condo }) {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        sessionStorage.setItem(
          "coastal.selectedCondo",
          JSON.stringify({
            slug: condo.slug,
            name: condo.name,
            address: condo.address,
            logo: condo.logo ?? `/logos/${condo.slug}.png`,
            market: condo.market ?? "pcb",
          })
        );
        router.push("/suite/pcb?source=condos");
      }}
      className="rounded-xl bg-sky-700 px-4 py-2 text-white shadow hover:bg-sky-800"
    >
      Open Suite
    </button>
  );
}

export default function PCBCondosPage() {
  const [query, setQuery] = useState("");
  const [onlyLetter, setOnlyLetter] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);

  const pcbCondos = useMemo(
    () => (condos as Condo[]).filter((c) => (c.market ?? "pcb") === "pcb"),
    []
  );

  const filtered = useMemo(() => {
    let list = pcbCondos.filter((c) => matches(query, c));
    if (onlyLetter)
      list = list.filter((c) => c.name.toUpperCase().startsWith(onlyLetter));
    return list;
  }, [pcbCondos, query, onlyLetter]);

  const grouped = useMemo(() => groupByLetter(filtered), [filtered]);

  useEffect(() => {
    setShowMap(false);
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-5 md:px-8 py-10">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-sky-950">
          Panama City Beach — All Properties
        </h1>
        <p className="mt-2 text-sky-700">
          Search or browse A–Z. Open a property’s Amenity Suite to book chairs,
          bonfires, photography, and watersports with one checkout.
        </p>
      </header>

      {/* Controls */}
      <section className="rounded-2xl border border-sky-100 bg-white/95 p-4 md:p-5 shadow-[0_22px_70px_-30px_rgba(9,30,66,0.12)] mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="text-sm text-sky-800">Search properties</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type condo name or address…"
              className="mt-1 w-full rounded-xl border border-sky-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
          </div>
          <div>
            <label className="text-sm text-sky-800">View</label>
            <div className="mt-1 flex items-center gap-2">
              <button
                onClick={() => setShowMap(false)}
                className={`rounded-xl px-3 py-2 border ${
                  !showMap
                    ? "bg-sky-700 text-white border-sky-700"
                    : "bg-white text-sky-900 border-sky-200"
                }`}
              >
                List
              </button>
              <button
                onClick={() => setShowMap(true)}
                className={`rounded-xl px-3 py-2 border ${
                  showMap
                    ? "bg-sky-700 text-white border-sky-700"
                    : "bg-white text-sky-900 border-sky-200"
                }`}
              >
                Map
              </button>
            </div>
          </div>
        </div>

        {/* A–Z filter */}
        <div className="mt-4 flex flex-wrap gap-1">
          <button
            onClick={() => setOnlyLetter(null)}
            className={`px-2.5 py-1 text-sm rounded-lg border ${
              onlyLetter === null
                ? "bg-sky-50 text-sky-900 border-sky-200"
                : "bg-white text-sky-700 border-sky-200 hover:bg-sky-50"
            }`}
          >
            All
          </button>
          {LETTERS.map((L) => (
            <button
              key={L}
              onClick={() => setOnlyLetter(L === onlyLetter ? null : L)}
              className={`px-2.5 py-1 text-sm rounded-lg border ${
                L === onlyLetter
                  ? "bg-sky-700 text-white border-sky-700"
                  : "bg-white text-sky-700 border-sky-200 hover:bg-sky-50"
              }`}
            >
              {L}
            </button>
          ))}
        </div>
      </section>

      {/* Map placeholder */}
      {showMap && (
        <div className="mb-6 rounded-2xl border border-sky-100 bg-sky-50 p-6 text-sky-800">
          <p className="text-sm">
            Map view coming next (Mapbox). For now, use the list to open a
            Suite. Pins will reflect this filtered set ({filtered.length}).
          </p>
        </div>
      )}

      {/* List grouped A–Z */}
      {!showMap && (
        <div className="space-y-8">
          {Object.keys(grouped)
            .sort()
            .map((letter) => (
              <section key={letter}>
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-900 font-semibold">
                    {letter}
                  </div>
                  <div className="h-px flex-1 bg-sky-100" />
                </div>

                <ul className="space-y-3">
                  {grouped[letter].map((c) => (
                    <li
                      key={c.slug}
                      className="rounded-xl border border-sky-100 bg-white/95 p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-28 flex items-center justify-center rounded-lg border border-sky-100 bg-white/90">
                          <Image
                            src={c.logo ?? `/logos/${c.slug}.png`}
                            alt={`${c.name} logo`}
                            width={280}
                            height={120}
                            className="h-10 w-auto object-contain"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sky-950 font-medium">
                            {c.name}
                          </p>
                          <p className="truncate text-sm text-sky-700">
                            {c.address}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`/pcb/${c.slug}`}
                            className="rounded-xl border border-sky-200 bg-white px-4 py-2 text-sky-900 hover:bg-sky-50"
                          >
                            View
                          </a>
                          <OpenSuiteButton condo={c} />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

          {filtered.length === 0 && (
            <p className="text-sky-700">
              No properties match “{query}”. Try a different search.
            </p>
          )}
        </div>
      )}
    </main>
  );
}
