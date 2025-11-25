// app/partners/login/page.tsx
import Image from "next/image";
import LoginFormClient from "./LoginFormClient";

export const dynamic = "force-dynamic";

export default function PartnerLoginPage() {
  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-50/60 via-white to-white" />

      <section className="relative mx-auto max-w-6xl px-5 md:px-8 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 items-stretch translate-y-4 md:translate-y-8">
          {/* Left: brand image */}
          <figure className="overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5 h-full">
            <Image
              src="/hero123.jpg"
              alt="Coastal partners — chairs on the beach"
              width={1200}
              height={900}
              priority
              className="h-full w-full object-cover"
            />
          </figure>

          {/* Right: form card */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-3xl border border-sky-100 bg-white/80 backdrop-blur-sm shadow-md">
              <div className="p-6 md:p-8">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-sky-800">
                  Partner Access
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-sky-900">
                  Sign in to Coastal
                </h1>
                <p className="mt-2 text-sky-700">
                  Use your partner credentials to view dashboards and reports.
                </p>

                <div className="mt-6">
                  <LoginFormClient />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
