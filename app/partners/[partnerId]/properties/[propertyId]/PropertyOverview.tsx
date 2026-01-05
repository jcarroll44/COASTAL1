import Link from "next/link";

export default function PropertyOverview({
  dashboardHref = "?view=dashboard",
}: {
  dashboardHref?: string;
}) {
  return (
    <section className="grid gap-5 md:grid-cols-3">
      <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
        <h3 className="text-sky-900 font-semibold">This Week</h3>
        <p className="mt-1 text-sky-700 text-sm">
          View chair service, bonfires, photography, and Beach Better Box orders
          happening now.
        </p>
        <Link
          href={dashboardHref}
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-sky-700 px-4 py-2 text-white hover:bg-sky-800"
        >
          Open Dashboard →
        </Link>
      </div>

      <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
        <h3 className="text-sky-900 font-semibold">Reports &amp; Exports</h3>
        <p className="mt-1 text-sky-700 text-sm">
          Export CSVs and monthly summaries for accounting.
        </p>
        <span className="mt-4 inline-flex rounded-lg bg-sky-50 px-3 py-2 text-sky-700">
          Coming Soon
        </span>
      </div>

      <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
        <h3 className="text-sky-900 font-semibold">Support</h3>
        <p className="mt-1 text-sky-700 text-sm">
          Special requests or large groups? We&apos;ll arrange it.
        </p>
        <a
          href="tel:8503121551"
          className="mt-4 inline-flex rounded-lg bg-sky-50 px-3 py-2 text-sky-700"
        >
          850-312-1551
        </a>
      </div>
    </section>
  );
}