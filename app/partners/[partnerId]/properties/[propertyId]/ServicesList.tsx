type Row = {
    name: string;
    amount: number;
  };
  
  export default function ServicesList({ rows }: { rows: Row[] }) {
    const display = [
      { key: "chairs", label: "Chairs & Umbrellas" },
      { key: "bonfire", label: "Beach Bonfires" },
      { key: "photography", label: "Family Photography" },
      { key: "beach-better-box", label: "Beach Better Box" },
    ];
  
    // normalize incoming rows into our fixed order
    const map = new Map<string, number>();
    for (const r of rows)
      map.set(r.name.toLowerCase(), Math.max(0, Math.round(r.amount)));
  
    const data = display.map((d) => ({
      label: d.label,
      amount: map.get(d.key) || 0,
    }));
  
    return (
      <section className="rounded-2xl border border-sky-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-sky-100">
            <thead className="bg-sky-50/40">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-sky-600">
                  Service
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-sky-600">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100 bg-white">
              {data.map((r) => (
                <tr key={r.label} className="hover:bg-sky-50/40">
                  <td className="px-5 py-3 text-sky-900">{r.label}</td>
                  <td className="px-5 py-3 text-right font-medium text-sky-900">
                    ${r.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }