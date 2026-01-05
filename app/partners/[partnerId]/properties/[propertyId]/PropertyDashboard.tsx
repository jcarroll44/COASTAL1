type Totals = { gross: number; eligible: number; commission: number };
type Breakdown = {
  chairs: number;
  bonfire: number;
  photography: number;
  other: number; // Beach Better Box bucket
};

export default function PropertyDashboard({
  totals,
  breakdown,
}: {
  totals: Totals;
  breakdown: Breakdown;
}) {
  const money = (n = 0) => `$${Math.max(0, Math.round(n)).toLocaleString()}`;

  const productMix = [
    { label: "Chairs & Umbrellas", val: breakdown.chairs },
    { label: "Beach Bonfires", val: breakdown.bonfire },
    { label: "Family Photography", val: breakdown.photography },
    { label: "Beach Better Box", val: breakdown.other },
  ];

  return (
    <section className="space-y-5">
      {/* Top metrics */}
      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-sky-600">
            Gross Revenue
          </p>
          <p className="mt-2 text-2xl font-semibold text-sky-900">
            {money(totals.gross)}
          </p>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-sky-600">
            Commission (20%)
          </p>
          <p className="mt-2 text-2xl font-semibold text-sky-900">
            {money(totals.commission)}
          </p>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-sky-600">
            Total Payout
          </p>
          <p className="mt-2 text-2xl font-semibold text-sky-900">
            {money(Math.max(0, totals.gross - totals.commission))}
          </p>
        </div>
      </div>

      {/* Two columns: product mix & category breakdown */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <h3 className="text-sky-900 font-semibold">Product Mix</h3>
          <ul className="mt-3 divide-y divide-sky-100">
            {productMix.map((row) => (
              <li
                key={row.label}
                className="flex items-center justify-between py-2"
              >
                <span className="text-sky-800">{row.label}</span>
                <span className="font-medium text-sky-900">
                  {money(row.val)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <h3 className="text-sky-900 font-semibold">Category Breakdown</h3>
          <div className="mt-3 space-y-3">
            {productMix.map((row) => {
              const total =
                breakdown.chairs +
                  breakdown.bonfire +
                  breakdown.photography +
                  breakdown.other || 1;
              const pct = Math.round((row.val / total) * 100);
              return (
                <div key={row.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-sky-800">{row.label}</span>
                    <span className="text-sky-900 font-medium">{pct}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-sky-50">
                    <div
                      className="h-2 rounded-full bg-sky-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}