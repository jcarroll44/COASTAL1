// app/components/FlagWidget.tsx
"use client";

import { useEffect, useState } from "react";

type FlagColor = "double-red" | "red" | "yellow" | "green" | "unknown";
type Record = {
  area: string;
  primary: FlagColor | "unknown";
  secondary?: "purple";
  sourceUrl: string;
  sourceLabel: string;
  updatedAt: string;
};

function FlagIcon({
  primary,
  hasPurple,
}: {
  primary: FlagColor;
  hasPurple?: boolean;
}) {
  // simple two-swatch vertical flag that matches your mock (primary + optional purple bar)
  const colorMap: Record<FlagColor, string> = {
    "double-red": "#E11D48",
    red: "#EF4444",
    yellow: "#F59E0B",
    green: "#10B981",
    unknown: "#9CA3AF",
  } as const;

  return (
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center shadow-inner">
        <div className="relative h-7 w-5">
          <div className="absolute left-0 top-0 h-7 w-1.5 bg-gray-500 rounded" />
          <div
            className="absolute left-1.5 top-1 h-2.5 w-3 rounded-sm"
            style={{ backgroundColor: colorMap[primary] }}
          />
          {hasPurple && (
            <div
              className="absolute left-1.5 bottom-1 h-2.5 w-3 rounded-sm"
              style={{ backgroundColor: "#7C3AED" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function describe(color: FlagColor) {
  switch (color) {
    case "double-red":
      return "DOUBLE RED – Water Closed to Public Use";
    case "red":
      return "RED – High Hazard";
    case "yellow":
      return "YELLOW – Medium Hazard";
    case "green":
      return "GREEN – Low Hazard";
    default:
      return "Status unavailable";
  }
}

export default function FlagWidget() {
  const [items, setItems] = useState<Record[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/flags", { cache: "no-store" });
        const json = await res.json();
        if (!cancelled) setItems(json.items as Record[]);
      } catch {
        if (!cancelled) setItems([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!items) {
    return <div className="animate-pulse h-40 rounded-2xl bg-gray-100" />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((rec) => (
        <div
          key={rec.area}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="text-xs font-semibold tracking-widest text-gray-500">
            BEACH SAFETY
          </div>

          <div className="mt-2 flex items-start gap-4">
            <FlagIcon
              primary={rec.primary as FlagColor}
              hasPurple={rec.secondary === "purple"}
            />
            <div>
              <div className="text-lg font-semibold">{rec.area}</div>
              <div className="mt-1 text-sm">
                {describe(rec.primary as FlagColor)}
              </div>
              {rec.secondary === "purple" && (
                <div className="text-sm">PURPLE – Marine Pests</div>
              )}
              <div className="mt-3 text-xs text-gray-500">
                Source: {rec.sourceLabel}
              </div>
              <a
                href={rec.sourceUrl}
                target="_blank"
                className="mt-2 inline-flex items-center rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
              >
                Open official source
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}