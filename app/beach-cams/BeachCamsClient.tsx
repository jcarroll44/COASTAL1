// app/beach-cams/BeachCamsClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CAMS } from "./cams";

/** Extract a YouTube video ID from a watch URL, youtu.be URL, or raw ID */
function extractVideoId(input: string) {
  try {
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input; // already an ID
    const url = new URL(input);
    const v = url.searchParams.get("v");
    if (v) return v;
    const parts = url.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    if (last && /^[a-zA-Z0-9_-]{11}$/.test(last)) return last;
  } catch {}
  return "";
}

/** Build relevant YouTube thumbnail URLs for a given video */
function ytThumbUrls(videoIdOrUrl: string) {
  const id = extractVideoId(videoIdOrUrl);
  return {
    live: `https://i.ytimg.com/vi/${id}/hqdefault_live.jpg`,
    maxres: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
    hq: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  };
}

export default function BeachCamsClient() {
  const [market, setMarket] = useState<"30A" | "PCB">("30A");
  const [q, setQ] = useState("");

  // gentle auto-refresh so live thumbnails brighten after sunrise
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setRefreshKey((k) => k + 1), 90_000); // every 90s
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    const base = CAMS.filter((c) => c.market === market);
    if (!q.trim()) return base;
    const s = q.toLowerCase();
    return base.filter(
      (c) =>
        c.title.toLowerCase().includes(s) || c.town.toLowerCase().includes(s)
    );
  }, [market, q]);

  return (
    <main className="min-h-screen bg-white">
      {/* HERO — premium, airy */}
      <section className="coastal-container pt-8 md:pt-10">
        <div className="overflow-hidden rounded-3xl ring-1 ring-slate-200 bg-[#F8FBFF] mb-7 md:mb-10">
          {/* image strip (taller to show a bit more) */}
          <div className="relative h-36 md:h-44 w-full overflow-hidden">
            <img
              src={
                market === "30A"
                  ? "/beach-cams/seagrove-cam.jpg"
                  : "/beach-cams/pineapple-cam.jpg"
              }
              alt={
                market === "30A"
                  ? "30A coastline"
                  : "Panama City Beach coastline"
              }
              className="absolute inset-0 h-full w-full object-cover [object-position:center_65%]"
              aria-hidden
            />
            {/* slightly deeper fade into the card */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-[#F8FBFF]" />
          </div>

          {/* content */}
          <div className="px-5 pb-6 pt-5 md:px-8 md:pb-7">
            {/* brand line */}
            <div className="flex items-center gap-2">
              <img
                src="/coastal-logo.png"
                alt=""
                className="h-7 w-7 rounded-full ring-1 ring-white/60 shadow-sm"
              />
              <span className="text-[12px] font-semibold tracking-[0.14em] uppercase text-sky-700">
                Coastal
              </span>
            </div>

            <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-[28px] md:text-[34px] font-extrabold tracking-tight text-[#0B5FAE]">
                  {market === "30A"
                    ? "Beach Cams — 30A"
                    : "Beach Cams — Panama City Beach"}
                </h1>
                <p className="mt-1 max-w-2xl text-[15px] text-slate-700">
                  Check the emerald water in real time. Book Coastal amenities
                  to enjoy to the fullest!
                </p>
              </div>

              {/* market toggle */}
              <div className="mt-1 flex items-center gap-2 md:mt-0">
                <button
                  onClick={() => setMarket("30A")}
                  className={
                    "rounded-full px-3 py-1.5 text-sm ring-1 transition " +
                    (market === "30A"
                      ? "bg-[#0170BF] text-white ring-[#0170BF]"
                      : "bg-white/90 text-slate-800 ring-slate-200 hover:bg-white")
                  }
                  aria-pressed={market === "30A"}
                >
                  30A
                </button>
                <button
                  onClick={() => setMarket("PCB")}
                  className={
                    "rounded-full px-3 py-1.5 text-sm ring-1 transition " +
                    (market === "PCB"
                      ? "bg-[#0170BF] text-white ring-[#0170BF]"
                      : "bg-white/90 text-slate-800 ring-slate-200 hover:bg-white")
                  }
                  aria-pressed={market === "PCB"}
                >
                  PCB
                </button>
              </div>
            </div>

            {/* search */}
            <div className="mt-3">
              <label className="sr-only" htmlFor="cam-search">
                Search cams
              </label>
              <input
                id="cam-search"
                className="field h-11 w-full md:w-[360px]"
                placeholder="Search town or cam name…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="coastal-container pb-14 md:pb-20">
        {filtered.length === 0 ? (
          <div className="rounded-2xl ring-1 ring-slate-200 bg-white p-6 text-slate-700">
            No cams found. Try a different search or switch markets.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((cam) => {
              const href = `/beach-cams/${cam.id}`;
              return (
                <Link
                  key={cam.id}
                  href={href}
                  prefetch={false}
                  aria-label={`Open ${cam.title}`}
                  className="group block rounded-2xl overflow-hidden ring-1 ring-slate-200 bg-white coastal-lift"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    {/* YouTube vs static thumbnail */}
                    {cam.provider === "youtube" && cam.videoId ? (
                      (() => {
                        const urls = ytThumbUrls(cam.videoId!);
                        return (
                          <img
                            src={`${urls.live}?k=${refreshKey}`}
                            onError={(e) => {
                              const img = e.currentTarget as HTMLImageElement;
                              if (!img.dataset.step) {
                                img.dataset.step = "1";
                                img.src = `${urls.maxres}?k=${refreshKey}`;
                              } else if (img.dataset.step === "1") {
                                img.dataset.step = "2";
                                img.src = `${urls.hq}?k=${refreshKey}`;
                              }
                            }}
                            alt={cam.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                            style={{ objectPosition: "center 40%" }}
                          />
                        );
                      })()
                    ) : (
                      <img
                        src={cam.poster || "/cams/placeholder.jpg"}
                        alt={cam.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                        style={{ objectPosition: "center 40%" }}
                      />
                    )}

                    {/* LIVE pulse only for YouTube */}
                    {cam.provider === "youtube" && (
                      <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-medium text-slate-900 ring-1 ring-white/70 shadow-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600" />
                        </span>
                        Live
                      </div>
                    )}

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  <div className="p-4">
                    <div className="text-[12px] uppercase tracking-wide text-sky-700 font-semibold">
                      {cam.market} • {cam.town}
                    </div>
                    <h3 className="mt-1 text-[16px] font-semibold text-slate-900">
                      {cam.title}
                    </h3>
                    <p className="mt-1 text-[13px] text-slate-600">
                      Opens on Coastal
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Bottom row — market-aware links */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sky-100 bg-white px-4 py-4 shadow-[0_20px_50px_-30px_rgba(2,132,199,0.25)]">
          <p className="text-[14px] text-slate-700">
            Looking for water clarity and surf conditions?
          </p>

          {(() => {
            const chairsHref = market === "30A" ? "/30a/chairs" : "/pcb/chairs";
            return (
              <div className="flex gap-2">
                <a
                  href="/beach-conditions"
                  className="rounded-full border border-sky-200 px-3 py-1.5 text-sm text-sky-800 hover:bg-sky-50"
                >
                  Beach Conditions
                </a>
                <a
                  href={chairsHref}
                  className="rounded-full bg-[#0170BF] px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
                >
                  Reserve Chairs
                </a>
              </div>
            );
          })()}
        </div>
      </section>
    </main>
  );
}
