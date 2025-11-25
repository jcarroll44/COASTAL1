// /lib/flags.ts
import * as cheerio from "cheerio";

export type FlagResponse = {
  ok: boolean;
  source: string;
  fetchedAt: string;     // ISO string
  flagText: string | null;
  colors: Array<"double red" | "red" | "yellow" | "green" | "purple">;
  severity?: "closed" | "high" | "medium" | "low";
  note?: string;
};

export const FLAG_WORDS = ["double red", "red", "yellow", "green", "purple"] as const;

export function extractFlagWords(input: string): FlagResponse["colors"] {
  const s = input.toLowerCase();
  const found: FlagResponse["colors"] = [];

  // “double red” must be checked before “red”
  if (/\b(double\s*red)\b/i.test(s)) found.push("double red");
  if (/\b(red)\b/i.test(s) && !found.includes("double red")) found.push("red");
  if (/\b(yellow)\b/i.test(s)) found.push("yellow");
  if (/\b(green)\b/i.test(s)) found.push("green");
  if (/\b(purple)\b/i.test(s)) found.push("purple");

  return found;
}

export function colorsToSeverity(colors: FlagResponse["colors"]): FlagResponse["severity"] {
  if (colors.includes("double red")) return "closed";
  if (colors.includes("red")) return "high";
  if (colors.includes("yellow")) return "medium";
  if (colors.includes("green")) return "low";
  return undefined;
}

/**
 * Generic HTML scraper:
 * - Loads HTML with cheerio
 * - Looks for likely text containers and tries to extract a “flag text”
 * - Falls back to scanning the whole page
 */
export function scrapeFlagFromHtml(html: string): { text: string | null } {
  const $ = cheerio.load(html);

  // Check common places where the “flag text” usually appears
  const candidates: string[] = [];

  // Headings / badges / buttons that often hold “YELLOW / PURPLE”, “RED”, etc.
  $("h1,h2,h3,h4,button,span,div,em,strong,b")
    .each((_, el) => {
      const t = $(el).text().trim();
      if (t && /red|yellow|green|purple/i.test(t)) candidates.push(t);
    });

  // Return the shortest plausible candidate (usually the clean “YELLOW / PURPLE”)
  const clean = candidates
    .map((t) => t.replace(/\s+/g, " "))
    .filter((t) => /red|yellow|green|purple/i.test(t))
    .sort((a, b) => a.length - b.length)[0];

  if (clean) return { text: clean };

  // Fallback: scan body text
  const body = $("body").text().replace(/\s+/g, " ");
  const m = body.match(/(double\s*red|red|yellow(?:\s*\/\s*purple)?|green|purple)/i);
  return { text: m ? m[0] : null };
}

/** Helper to build a standard response */
export function buildFlagResponse(params: {
  source: string;
  flagText: string | null;
  note?: string;
}): FlagResponse {
  const colors = params.flagText ? extractFlagWords(params.flagText) : [];
  return {
    ok: !!params.flagText,
    source: params.source,
    fetchedAt: new Date().toISOString(),
    flagText: params.flagText,
    colors,
    severity: colorsToSeverity(colors),
    note: params.note,
  };
}

```


---

## app/conditions/page.tsx

```tsx
// app/conditions/page.tsx
"use client";

import { useEffect, useState } from "react";
import ConditionsSection from "@/components/ConditionsSection";
import ForecastStrip from "@/components/ForecastStrip";

type FlagResp = {
  status?: string; // e.g. "RED – High Hazard" or "DOUBLE RED – Water Closed"
  notes?: string; // e.g. "PURPLE – Marine Pests"
  sourceName?: string;
  sourceUrl?: string;
};

async function getJSON<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/* ========================== Realistic Rect Flag ========================== */

type PrimaryColor = "double-red" | "red" | "yellow" | "green" | "unknown";

function primaryFromStatus(status?: string): PrimaryColor {
  const t = (status ?? "").toLowerCase();
  if (t.includes("double") && t.includes("red")) return "double-red";
  if (t.includes("red")) return "red";
  if (t.includes("yellow")) return "yellow";
  if (t.includes("green")) return "green";
  return "unknown";
}

const COLORS: Record<PrimaryColor, string> = {
  "double-red": "#E53935",
  red: "#E53935",
  yellow: "#F59E0B",
  green: "#0EA572",
  unknown: "#94A3B8",
};

function FlagSVG({
  status,
  hasPurple,
}: {
  status?: string;
  hasPurple?: boolean;
}) {
  const primary = primaryFromStatus(status);
  const main = COLORS[primary];
  const isDouble = primary === "double-red";
  const showPrimary = primary !== "unknown";

  const poleDark = "#7B8794";
  const poleLight = "#B8C2CC";
  const ring = "#CDE0FF";

  // unique ids so gradients/filters don’t collide between cards
  const gid = (suffix: string) => `g-${(main || "#").slice(1)}-${suffix}`;

  // A rectangular flag with a “wave” on the right edge (the look you referenced).
  // yOffset lets us reuse it for the second (double-red) cloth.
  const flagPath = (yOffset: number) =>
    `M16 ${12 + yOffset}
     L36 ${12 + yOffset}
     C38 ${12 + yOffset}, 40 ${14 + yOffset}, 40 ${16 + yOffset}
     C40 ${18 + yOffset}, 38 ${20 + yOffset}, 36 ${20 + yOffset}
     L16 ${20 + yOffset}
     Q14 ${20 + yOffset}, 14 ${18 + yOffset}
     L14 ${14 + yOffset}
     Q14 ${12 + yOffset}, 16 ${12 + yOffset}
     Z`;

  return (
    <div
      className="h-18 w-18 md:h-20 md:w-20 grid place-items-center rounded-full bg-white ring-2 shadow-sm"
      style={{ ringColor: ring }}
      aria-hidden
    >
      <svg width="64" height="64" viewBox="0 0 56 56" role="img">
        <defs>
          {/* cloth gradients */}
          <linearGradient id={gid("cloth")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={main} stopOpacity="0.98" />
            <stop offset="1" stopColor={main} stopOpacity="0.82" />
          </linearGradient>
          <linearGradient id={gid("purple")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7C3AED" stopOpacity="0.98" />
            <stop offset="1" stopColor="#7C3AED" stopOpacity="0.82" />
          </linearGradient>
          {/* soft drop */}
          <filter id={gid("soft")} x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="0.7" />
            <feOffset dx="0" dy="0.6" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.28" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Mast */}
        <rect x="10" y="9" width="4" height="38" rx="2" fill={poleDark} />
        <rect
          x="11.4"
          y="9"
          width="1.7"
          height="38"
          rx="0.85"
          fill={poleLight}
        />

        {/* Grommets */}
        {[14, 20, 26].map((y) => (
          <circle
            key={y}
            cx="12"
            cy={y}
            r="1.05"
            fill="#E2E8F0"
            stroke="#CBD5E1"
            strokeWidth="0.5"
          />
        ))}

        {/* Halyard curve */}
        <path
          d="M13.5,14 C15.5,15.7 15.5,18.3 13.5,20 C15.5,21.7 15.5,24.3 13.5,26"
          stroke="#D1D5DB"
          strokeWidth="0.9"
          fill="none"
          strokeLinecap="round"
        />

        {/* Primary cloth (upper) */}
        {showPrimary && (
          <g filter={`url(#${gid("soft")})`}>
            <path
              d={flagPath(0)}
              fill={`url(#${gid("cloth")})`}
              stroke={main}
              strokeWidth="0.7"
            />
            {/* top stitch near mast */}
            <path
              d="M16.2 12.3 L16.2 19.7"
              stroke="#fff"
              strokeOpacity="0.55"
              strokeWidth="0.9"
            />
            {/* subtle highlight */}
            <path
              d="M18.5 13.2 C24.5 12.2, 30.5 12.9, 35.2 13.4"
              stroke="#ffffff"
              strokeOpacity="0.18"
              strokeWidth="1.1"
              fill="none"
            />
          </g>
        )}

        {/* Second cloth for DOUBLE-RED */}
        {primary === "double-red" && (
          <g filter={`url(#${gid("soft")})`}>
            <path
              d={flagPath(9)}
              fill={`url(#${gid("cloth")})`}
              stroke={main}
              strokeWidth="0.7"
            />
            <path
              d="M16.2 21.3 L16.2 28.7"
              stroke="#fff"
              strokeOpacity="0.55"
              strokeWidth="0.9"
            />
            <path
              d="M18.2 22.3 C23.5 21.6, 29 22.0, 33.4 22.5"
              stroke="#ffffff"
              strokeOpacity="0.16"
              strokeWidth="1.1"
              fill="none"
            />
          </g>
        )}

        {/* Purple (marine pests) cloth sits below */}
        {hasPurple && (
          <g filter={`url(#${gid("soft")})`}>
            <path
              d={flagPath(primary === "double-red" ? 18 : 9)}
              fill={`url(#${gid("purple")})`}
              stroke="#7C3AED"
              strokeWidth="0.7"
            />
            <path
              d="M16.2 30.3 L16.2 33.7"
              stroke="#fff"
              strokeOpacity="0.55"
              strokeWidth="0.9"
            />
            {/* small round badge accent */}
            <circle
              cx="39.5"
              cy={primary === "double-red" ? 24.8 : 15.8}
              r="4.2"
              fill="#fff"
              opacity="0.9"
            />
            <circle
              cx="39.5"
              cy={primary === "double-red" ? 24.8 : 15.8}
              r="3.2"
              fill="#7C3AED"
            />
          </g>
        )}
      </svg>
    </div>
  );
}

/* ========================== Card ========================== */

function FlagCard({ title, data }: { title: string; data: FlagResp | null }) {
  const hasPurple = Boolean(
    data?.notes && data.notes.toLowerCase().includes("purple")
  );

  return (
    <div className="rounded-[22px] border border-[var(--coast-line,#D9E9F7)] bg-white p-6 shadow-[0_6px_28px_rgba(2,57,115,.06)]">
      <div className="text-[11px] font-semibold tracking-[.16em] text-[#2E6DA3]/70 mb-2">
        BEACH SAFETY
      </div>

      <div className="flex items-start gap-4">
        <FlagSVG status={data?.status} hasPurple={hasPurple} />

        <div className="min-w-0 flex-1">
          <div className="text-[20px] leading-6 font-semibold text-slate-900">
            {title}
          </div>

          <div className="mt-2 text-[16px] text-slate-800">
            {data?.status ?? "Unavailable"}
          </div>

          {hasPurple ? (
            <div className="mt-1 text-[14px] text-slate-700">{data?.notes}</div>
          ) : null}

          <div className="mt-4 h-px bg-gradient-to-r from-sky-100 to-transparent" />

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-slate-500">
            <span>Source: {data?.sourceName ?? "—"}</span>
            {data?.sourceUrl ? (
              <a
                href={data.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-[#CFE6F8] px-3 py-1.5 text-[13px] font-medium text-[#0D4775] hover:bg-[#F3F9FF]"
              >
                Open official source
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================== Page ========================== */

export default function ConditionsPage() {
  const [sw30a, setSw30a] = useState<FlagResp | null>(null);
  const [pcb, setPcb] = useState<FlagResp | null>(null);

  useEffect(() => {
    getJSON<FlagResp>("/api/flags/swfd").then(setSw30a);
    getJSON<FlagResp>("/api/flags/pcb").then(setPcb);
  }, []);

  return (
    <div className="coastal-container space-y-10">
      {/* On-brand header */}
      <header className="pt-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1">
          <span className="text-[11px] font-semibold tracking-[.16em] text-sky-700">
            BEACH SAFETY
          </span>
        </div>
        <h1 className="mt-2 text-[34px] md:text-[38px] leading-[1.15] font-extrabold tracking-tight text-[#0D4775]">
          Current Beach Flags
        </h1>
        <p className="mt-2 text-[15px] md:text-[17px] text-slate-600">
          Live status for South Walton (30A) and Panama City Beach. Check flags
          before you head out.
        </p>
      </header>

      {/* Flag cards */}
      <section className="mt-2 grid gap-6 md:grid-cols-2">
        <FlagCard title="South Walton (30A)" data={sw30a} />
        <FlagCard title="Panama City Beach (Bay County)" data={pcb} />
      </section>

      {/* Existing conditions + forecast (unchanged) */}
      <ConditionsSection defaultLocation="30a" ForecastStrip={ForecastStrip} />
    </div>
  );
}