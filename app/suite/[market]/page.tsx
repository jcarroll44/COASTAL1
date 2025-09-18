// app/suite/[market]/page.tsx
import Link from "next/link";
import properties from "@/data/properties.json";

type Prop = {
  market: string;
  id: string;
  name: string;
  address?: string;
};

export default async function MarketSuite({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  const m = (market || "").toLowerCase();
  const title =
    m === "pcb" ? "Market: PCB" : m === "30a" ? "Market: 30A" : "Market";

  const all = (properties as Prop[]).filter((p) => p.market === m);
  const sorted = all.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-2xl font-bold text-sky-900">{title}</h1>

      {sorted.length === 0 ? (
        <p className="mt-6 text-sky-800">
          No properties found for this market.
        </p>
      ) : (
        <>
          {/* quick search (clientless – simple anchor filter) */}
          <div className="mt-6 flex flex-wrap gap-2 text-[12px]">
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((ch) => (
              <a
                key={ch}
                href={`#${ch}`}
                className="rounded-full border border-sky-200 px-2.5 py-1 text-sky-800 hover:bg-sky-50"
              >
                {ch}
              </a>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((p) => {
              const anchor = p.name[0]?.toUpperCase() || "A";
              return (
                <div
                  key={p.id}
                  id={anchor}
                  className="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-sky-900">
                        {p.name}
                      </h3>
                      {p.address && (
                        <p className="mt-0.5 text-[12px] text-sky-700/90">
                          {p.address}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/suite/${m}/${p.id}`}
                      className="grid h-9 w-9 place-items-center rounded-full border border-sky-200 text-sky-900 hover:bg-sky-50"
                      aria-label={`Open ${p.name}`}
                    >
                      →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
