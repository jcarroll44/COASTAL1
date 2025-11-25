// Condo "Overview" page (beautiful branded landing). Partners like 30A redirect to properties.
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import condos from "../../data/condos.json";

export const dynamic = "force-dynamic";

const pretty = (s: string) =>
  s.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

export default function PartnerOverviewPage({
  params,
}: {
  params: { partnerId: string };
}) {
  const id = params.partnerId;
  // If it's NOT a condo (e.g., 30a-escapes), send to properties.
  const isCondo = (condos as any[]).some((c) => c?.slug === id);
  if (!isCondo) {
    redirect(`/partners/${id}/properties`);
  }

  const condo = (condos as any[]).find((c) => c?.slug === id);
  const title = condo?.name || pretty(id);
  const address = condo?.address || "Address unavailable";

  return (
    <main className="max-w-6xl mx-auto py-14 px-4">
      <div className="flex flex-col items-center text-center gap-6 mb-8">
        <div className="w-56 h-24 relative">
          <Image
            src={`/logos/${id}.png`}
            alt={title}
            fill
            sizes="224px"
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-brand">{title}</h1>
          <p className="text-gray-600">{address}</p>
        </div>

        {/* Overview / Dashboard toggle */}
        <div className="inline-flex items-center rounded-full border border-sky-200 bg-white p-1">
          <span className="px-4 py-1.5 text-sm rounded-full bg-sky-100 text-sky-900">
            Overview
          </span>
          <Link
            href={`/partners/${id}/dashboard`}
            className="px-4 py-1.5 text-sm rounded-full text-sky-700 hover:bg-sky-50 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>

      {/* Hero cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-sky-100 bg-white/90 backdrop-blur-sm p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-sky-900 mb-2">This Week</h3>
          <p className="text-sm text-gray-600 mb-4">
            View chair service, bonfires, and orders happening now.
          </p>
          <Link
            href={`/partners/${id}/dashboard`}
            className="inline-flex items-center rounded-lg bg-sky-700 px-4 py-2 text-white hover:bg-sky-800"
          >
            Open Dashboard →
          </Link>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white/90 backdrop-blur-sm p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-sky-900 mb-2">
            Reports & Exports
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Export CSVs and monthly summaries for accounting.
          </p>
          <a
            href="#"
            className="inline-flex items-center rounded-lg bg-sky-100 px-4 py-2 text-sky-800 hover:bg-sky-200"
          >
            Coming Soon
          </a>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white/90 backdrop-blur-sm p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-sky-900 mb-2">Support</h3>
          <p className="text-sm text-gray-600 mb-4">
            Special requests or large groups? We’ll arrange it.
          </p>
          <a
            href="tel:850-312-1551"
            className="inline-flex items-center rounded-lg bg-sky-100 px-4 py-2 text-sky-800 hover:bg-sky-200"
          >
            850-312-1551
          </a>
        </div>
      </div>
    </main>
  );
}
