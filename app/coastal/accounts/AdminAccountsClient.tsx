"use client";

import { useMemo, useState } from "react";
import Card from "../../components/ui/Card";
import Section from "../../components/ui/Section";
import Stat from "../../components/ui/Stat";
import { Donut } from "../../components/ui/Donut"; // (ok to keep even if unused yet)

type KPIs = { gross: number; eligible: number; commission: number };
type Account = {
  id: string;
  name: string;
  kind: "pm" | "condo";
  kpis?: Partial<KPIs>;
};

function k(a?: Partial<KPIs>): KPIs {
  return {
    gross: a?.gross ?? 0,
    eligible: a?.eligible ?? 0,
    commission: a?.commission ?? 0,
  };
}

export default function AdminAccountsClient({
  accounts = [],
}: {
  accounts?: Account[];
}) {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<"all" | "pm" | "condo">("all");

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    return (accounts || []).filter((a) => {
      const matchesText =
        !text ||
        a.name.toLowerCase().includes(text) ||
        a.id.toLowerCase().includes(text);
      const matchesKind = kind === "all" || a.kind === kind;
      return matchesText && matchesKind;
    });
  }, [accounts, q, kind]);

  const totals = useMemo(
    () =>
      filtered.reduce(
        (acc, a) => {
          const kk = k(a.kpis);
          acc.gross += kk.gross;
          acc.eligible += kk.eligible;
          acc.commission += kk.commission;
          return acc;
        },
        { gross: 0, eligible: 0, commission: 0 }
      ),
    [filtered]
  );

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Section
        title="Overview"
        action={
          <div className="flex gap-2">
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as any)}
              className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            >
              <option value="all">All types</option>
              <option value="pm">Property Managers</option>
              <option value="condo">Condos</option>
            </select>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search accounts…"
              className="h-10 w-56 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            />
          </div>
        }
      >
        <p className="text-slate-600 text-sm">
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </p>
      </Section>

      {/* KPI bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Gross" value={`$${totals.gross.toLocaleString()}`} />
        <Stat
          label="Eligible (excl. chairs)"
          value={`$${totals.eligible.toLocaleString()}`}
        />
        <Stat
          label="Commission (5%)"
          value={`$${totals.commission.toLocaleString()}`}
        />
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-sky-50/60 text-sky-900/80">
            <tr>
              <th className="px-4 py-3 text-left">Account</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-right">Gross</th>
              <th className="px-4 py-3 text-right">Eligible</th>
              <th className="px-4 py-3 text-right">Commission</th>
              <th className="px-4 py-3 text-right">Open</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => {
              const kk = k(a.kpis);
              return (
                <tr key={a.id} className="border-t border-slate-100/60">
                  <td className="px-4 py-3">{a.name}</td>
                  <td className="px-4 py-3 capitalize">{a.kind}</td>
                  <td className="px-4 py-3 text-right">
                    ${kk.gross.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    ${kk.eligible.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    ${kk.commission.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {a.kind === "pm" ? (
                      <a
                        className="inline-flex items-center rounded-full border border-sky-200 px-3 py-1.5 text-sky-800 hover:bg-sky-50"
                        href={`/partners/${a.id}/dashboard`}
                      >
                        View
                      </a>
                    ) : (
                      <a
                        className="inline-flex items-center rounded-full border border-sky-200 px-3 py-1.5 text-sky-800 hover:bg-sky-50"
                        href={`/partners/aqua-vista/properties/${a.id}`}
                      >
                        View
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
