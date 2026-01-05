// app/components/ui/Stat.tsx
import React from "react";

export default function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-[0_18px_60px_-40px_rgba(0,93,156,0.25)]">
      <div className="text-[11px] uppercase tracking-[0.14em] text-sky-800/70">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold text-sky-900">{value}</div>
    </div>
  );
}