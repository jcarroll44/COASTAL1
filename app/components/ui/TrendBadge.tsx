export function TrendBadge({ delta }: { delta: number }) {
  const up = delta >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        up
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
      }`}
      title={`${up ? "+" : ""}${delta.toFixed(1)}% vs. prior period`}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" className="opacity-80">
        <path d={up ? "M12 5l7 7H5z" : "M12 19l7-7H5z"} fill="currentColor" />
      </svg>
      {up ? "+" : ""}
      {delta.toFixed(1)}%
    </span>
  );
}
