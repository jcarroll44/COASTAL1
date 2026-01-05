"use client";

type CurrentSlice = {
  tempF?: number | null;
  feelsF?: number | null;
  windMph?: number | null;
  windDeg?: number | null;
  uv?: number | null;
  rainChancePct?: number | null;
  sunrise?: string | null; // "6:53 AM"
  sunset?: string | null; // "6:04 PM"
};

export default function CurrentConditionsCard({
  data,
  locationLabel = "South Walton (30A)",
}: {
  data: CurrentSlice | null;
  locationLabel?: string;
}) {
  const v = data ?? {};

  return (
    <section className="rounded-2xl border border-[var(--coast-line)] bg-white/90 shadow-[0_10px_30px_rgba(2,57,115,0.06)] backdrop-blur">
      {/* header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--coast-line)]">
        <div className="text-[18px] font-semibold text-[var(--coast-ink)]">
          Current Conditions
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>Updated</span>
          <span className="rounded-full border border-[var(--coast-line)] px-2 py-0.5">
            {locationLabel}
          </span>
        </div>
      </div>

      {/* grid */}
      <div className="grid gap-3 p-4 md:grid-cols-4">
        {/* Temperature */}
        <Tile>
          <Label>Temperature</Label>
          <Value>
            {fmtNum(v.tempF, "°")}{" "}
            <span className="text-slate-500 text-[13px]">
              Feels {fmtNum(v.feelsF, "°")}
            </span>
          </Value>
        </Tile>

        {/* Wind */}
        <Tile>
          <Label>Wind</Label>
          <Value>
            {fmtNum(v.windMph, " mph")}{" "}
            <span className="text-slate-500 text-[13px]">
              → {degToCardinal(v.windDeg)}
            </span>
          </Value>
        </Tile>

        {/* UV */}
        <Tile>
          <Label>UV Index</Label>
          <Value>{fmtNum(v.uv)}</Value>
        </Tile>

        {/* Rain next few hours */}
        <Tile>
          <Label>Chance of Rain (next few hours)</Label>
          <Value>{fmtNum(v.rainChancePct, "%")}</Value>
        </Tile>

        {/* Sunrise / Sunset (span 2) */}
        <Tile className="md:col-span-4">
          <Label>Sunrise / Sunset</Label>
          <Value>
            {v.sunrise ?? "—"} <span className="mx-2 text-slate-400">/</span>
            {v.sunset ?? "—"}
          </Value>
        </Tile>
      </div>

      {/* footer */}
      <div className="px-5 pb-4 pt-1 text-[12px] text-slate-500">
        Updated hourly • Source: Open-Meteo (fallback: NWS)
      </div>
    </section>
  );
}

/* ---------- tiny UI bits ---------- */
function Tile({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        "rounded-xl border border-[var(--coast-line)] bg-white/90 px-4 py-3 " +
        className
      }
    >
      {children}
    </div>
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
      {children}
    </div>
  );
}
function Value({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-1 text-[22px] font-semibold text-[var(--coast-ink)]">
      {children}
    </div>
  );
}

/* ---------- helpers ---------- */
function fmtNum(n?: number | null, suffix = "") {
  if (n == null || !Number.isFinite(n)) return "—";
  const v = Math.round(n);
  return `${v}${suffix}`;
}
function degToCardinal(deg?: number | null) {
  if (deg == null || !Number.isFinite(deg)) return "—";
  const dirs = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
    "N",
  ];
  return dirs[Math.round(deg / 22.5)];
}