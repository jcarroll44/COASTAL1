// app/admin/pcb-condos/page.tsx
import Link from "next/link";
import condos from "../../data/condos.json";
import CondosListClient from "./CondosListClient";

export const dynamic = "force-dynamic";

const pretty = (s: string) =>
  s.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

export default function PCBCondosPage({
  searchParams,
}: {
  searchParams?: { view?: "grid" | "list" };
}) {
  const view = (searchParams?.view || "grid") as "grid" | "list";

  return (
    <main className="max-w-6xl mx-auto py-16 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-brand">PCB Condos</h1>

        {/* toggle styled to match amenity suite */}
        <div className="inline-flex items-center rounded-full border border-sky-200 bg-white p-1">
          <Link
            href={`/admin/pcb-condos?view=grid`}
            className={`px-3 md:px-4 py-1.5 text-sm rounded-full transition-colors ${
              view === "grid"
                ? "bg-sky-100 text-sky-900"
                : "text-sky-700 hover:bg-sky-50"
            }`}
          >
            Grid
          </Link>
          <Link
            href={`/admin/pcb-condos?view=list`}
            className={`px-3 md:px-4 py-1.5 text-sm rounded-full transition-colors ${
              view === "list"
                ? "bg-sky-100 text-sky-900"
                : "text-sky-700 hover:bg-sky-50"
            }`}
          >
            List
          </Link>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {(condos as any[]).map((c, i) => {
            const slug = c?.slug || `condo-${i}`;
            const title = c?.name || pretty(slug);
            const address = c?.address || "Address unavailable";

            return (
              <Link
                key={slug}
                href={`/partners/${slug}/dashboard`}
                className="group rounded-3xl border border-sky-100 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-6 flex flex-col items-center text-center"
              >
                <div className="w-28 h-28 mb-4 flex items-center justify-center">
                  <img
                    src={`/logos/${slug}.png`}
                    alt={title}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex flex-col items-center gap-1">
                  <h2 className="text-lg font-semibold text-sky-900">
                    {title}
                  </h2>
                  <p className="text-sm text-gray-500">{address}</p>
                </div>

                <div className="mt-4 text-sm font-medium text-sky-700 hover:text-sky-900 transition">
                  View Dashboard →
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <CondosListClient condos={condos as any[]} />
      )}
    </main>
  );
}
