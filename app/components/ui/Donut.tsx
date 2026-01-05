export function Donut({
    parts,
    totalLabel,
  }: {
    parts: { label: string; value: number; color: string }[];
    totalLabel?: string;
  }) {
    const total = parts.reduce((s, p) => s + p.value, 0) || 1;
    let offset = 25;
    return (
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          {parts.map((p, i) => {
            const len = (p.value / total) * 100;
            const dash = `${len} ${100 - len}`;
            const el = (
              <circle
                key={i}
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke={p.color}
                strokeWidth="12"
                strokeDasharray={dash}
                strokeDashoffset={offset}
              />
            );
            offset -= len;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="text-[11px] uppercase tracking-[0.14em] text-sky-900/60">
              {totalLabel || "Total"}
            </div>
            <div className="text-xl font-semibold text-sky-900">
              ${total.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    );
  }