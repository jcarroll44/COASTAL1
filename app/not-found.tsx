import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[60vh] place-items-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">We couldn’t find that.</h1>
        <p className="text-sky-700">
          The market or property you requested doesn’t exist.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/suite"
            className="rounded-xl border border-sky-200 bg-white px-4 py-2 hover:bg-sky-50"
          >
            Browse suites
          </Link>
          <Link
            href="/"
            className="rounded-xl bg-sky-900 px-4 py-2 font-semibold text-white hover:bg-sky-950"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
