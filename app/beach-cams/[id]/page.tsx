// app/beach-cams/[id]/page.tsx  (server component — no "use client")
import { getCam } from "../cams";
import CamPlayer from "@/components/CamPlayer";
import Link from "next/link";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props) {
  const cam = getCam(params.id);
  return {
    title: cam ? `${cam.title} — Beach Cam | Coastal` : "Beach Cam | Coastal",
    description: cam
      ? `Live beach cam for ${cam.town} (${cam.market}). Watch conditions now with Coastal.`
      : "Live beach cams across 30A and Panama City Beach.",
  };
}

export default function CamPage({ params }: Props) {
  const cam = getCam(params.id);

  if (!cam) {
    return (
      <main className="coastal-container py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-slate-700">Cam not found.</p>
          <Link href="/beach-cams" className="text-sky-700 underline">
            ← Back to Beach Cams
          </Link>
        </div>
      </main>
    );
  }

  const isExternal = cam.provider === "external";

  // Market-aware booking destinations
  const chairsHref = cam.market === "30A" ? "/30a/chairs" : "/pcb/chairs";
  const bonfireHref = cam.market === "30A" ? "/30a/bonfires" : "/pcb/bonfires";

  return (
    <main className="min-h-screen bg-white">
      <section className="coastal-container py-8 md:py-10">
        <div className="mb-4">
          <Link
            href="/beach-cams"
            className="text-sky-700 underline"
            prefetch={false}
          >
            ← Back to Beach Cams
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          {/* Player / Poster */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3 md:p-4 shadow-[0_24px_80px_-40px_rgba(2,132,199,0.20)]">
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
              {isExternal ? (
                <div className="relative h-full w-full">
                  <img
                    src={cam.poster || "/cams/placeholder.jpg"}
                    alt={cam.title}
                    className="h-full w-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-900 ring-1 ring-white/70">
                        Live on Source
                      </span>
                      <a
                        href={cam.externalHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-[#0170BF] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                      >
                        Watch Live
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <CamPlayer cam={cam} />
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[12px] uppercase tracking-wide text-sky-700 font-semibold">
                  {cam.market} • {cam.town}
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                  {cam.title}
                </h1>
              </div>

              {/* Source + contract booking (optional per cam) */}
              <div className="flex items-center gap-2">
                {cam.externalHref && (
                  <a
                    href={cam.externalHref}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-sky-200 px-3 py-1.5 text-sm text-sky-800 hover:bg-sky-50"
                  >
                    Open Source
                  </a>
                )}
                {"contract" in cam &&
                  (cam as any).contract &&
                  (cam as any).bookingHref && (
                    <a
                      href={(cam as any).bookingHref}
                      className="rounded-full bg-[#0170BF] px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
                    >
                      {(cam as any).bookingLabel || "Book Chairs"}
                    </a>
                  )}
              </div>
            </div>
          </div>

          {/* Side CTAs */}
          <aside className="self-start space-y-4">
            <div className="rounded-2xl border border-sky-100 bg-white p-4">
              <h2 className="text-base font-semibold text-slate-900">
                Plan Your Day
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Check the water now, then reserve chairs or a bonfire with
                Coastal.
              </p>
              <div className="mt-3 flex gap-2">
                <a
                  href={chairsHref}
                  className="rounded-full bg-[#0170BF] px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
                >
                  Reserve Chairs
                </a>
                <a
                  href={bonfireHref}
                  className="rounded-full border border-sky-200 px-3 py-1.5 text-sm text-sky-800 hover:bg-sky-50"
                >
                  Book a Bonfire
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-sky-100 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Beach Conditions
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Flags, surf, and wind. Smart plans, no surprises.
              </p>
              <a
                href="/beach-conditions"
                className="mt-2 inline-block rounded-full border border-sky-200 px-3 py-1.5 text-sm text-sky-800 hover:bg-sky-50"
              >
                View Conditions
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* Concierge strip */}
      <section className="mt-10 bg-white">
        <div className="coastal-container">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sky-100 bg-white px-4 py-4 shadow-[0_20px_50px_-30px_rgba(2,132,199,0.25)]">
            <p className="text-[14px] text-slate-700">
              Concierge — Questions, special requests, or large groups? We’ll
              arrange it.
            </p>
            <div className="flex gap-2">
              <a
                href="tel:8503121551"
                className="rounded-full border border-sky-200 px-3 py-1.5 text-sm text-sky-800 hover:bg-sky-50"
              >
                850-312-1551
              </a>
              <a
                href={chairsHref}
                className="rounded-full bg-[#0170BF] px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Build Your Week
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
