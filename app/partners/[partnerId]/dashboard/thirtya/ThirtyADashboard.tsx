// app/partners/[partnerId]/dashboard/thirtya/ThirtyADashboard.tsx
"use client";

// Rich, branded 30A Escapes account dashboard (filler numbers, full widgets).
import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";

const KPI = ({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) => (
  <div className="rounded-2xl border border-sky-100 bg-white/80 backdrop-blur-sm p-5 shadow-sm">
    <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
    <div className="text-2xl font-bold text-sky-900">{value}</div>
    {sub ? <div className="text-xs text-sky-700 mt-1">{sub}</div> : null}
  </div>
);

const Bar = ({ h }: { h: number }) => (
  <div
    className="w-6 rounded-md bg-sky-500/80 hover:bg-sky-600 transition-colors"
    style={{ height: `${h}px` }}
    aria-hidden
  />
);

const StatRow = ({
  label,
  gross,
  orders,
  rate,
}: {
  label: string;
  gross: string;
  orders: number;
  rate: string;
}) => (
  <div className="flex items-center justify-between py-2.5 border-b last:border-0 text-sm">
    <div className="font-medium text-sky-900">{label}</div>
    <div className="text-gray-600">{orders} orders</div>
    <div className="font-semibold">{gross}</div>
    <div className="text-sky-700">{rate} CR</div>
  </div>
);

export default function ThirtyADashboard() {
  const partnerId = "30a-escapes";
  const commissionRate = 0.2;

  // Filler totals (can wire to API later)
  const totals = useMemo(
    () => ({
      gross: 482_750,
      orders: 1384,
      chairs: 198_400,
      bonfires: 112_300,
      beachBox: 74_600,
      paddleboard: 22_900,
      photography: 18_650,
      jetSki: 31_900,
      parasail: 15_300,
      bananaBoat: 8_650,
    }),
    []
  );

  const commission = Math.round(totals.gross * commissionRate);
  const payout = totals.gross - commission;

  const weekly = [36, 64, 52, 88, 72, 94, 60, 78, 54, 102, 96, 84]; // svg-like bars (px heights)

  return (
    <main className="max-w-6xl mx-auto py-10 px-4">
      {/* Header + toggle */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/logos/30a-escapes1.png"
            alt="30A Escapes"
            width={150}
            height={150}
            className="rounded-lg object-contain"
          />
          <h1 className="text-2xl md:text-3xl font-bold text-brand">
            30A Escapes — Account Dashboard
          </h1>
        </div>

        <div className="inline-flex items-center rounded-full border border-sky-200 bg-white p-1">
          <Link
            href={`/partners/${partnerId}/properties`}
            className="px-3 md:px-4 py-1.5 text-sm rounded-full text-sky-700 hover:bg-sky-50 transition-colors"
          >
            Properties
          </Link>
          <span className="px-3 md:px-4 py-1.5 text-sm rounded-full bg-sky-100 text-sky-900">
            Dashboard
          </span>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <KPI
          label="Gross Revenue"
          value={`$${totals.gross.toLocaleString()}`}
        />
        <KPI
          label={`Commission (${Math.round(commissionRate * 100)}%)`}
          value={`$${commission.toLocaleString()}`}
        />
        <KPI label="Total Payout" value={`$${payout.toLocaleString()}`} />
      </div>

      {/* Revenue trend + Product mix */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <div className="md:col-span-2 rounded-2xl border border-sky-100 bg-white/90 backdrop-blur-sm p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-sky-900">
              Weekly Revenue
            </h3>
            <div className="text-xs text-gray-500">Last 12 weeks</div>
          </div>
          <div className="flex items-end gap-3 h-40">
            {weekly.map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <Bar h={h} />
                <div className="text-[10px] text-gray-500">W{i + 1}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white/90 backdrop-blur-sm p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-sky-900 mb-3">
            Product Mix
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Chairs</span>
              <span className="font-semibold">
                ${totals.chairs.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Bonfires</span>
              <span className="font-semibold">
                ${totals.bonfires.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Beach Box</span>
              <span className="font-semibold">
                ${totals.beachBox.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Paddleboard</span>
              <span className="font-semibold">
                ${totals.paddleboard.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Photography</span>
              <span className="font-semibold">
                ${totals.photography.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Jet Ski</span>
              <span className="font-semibold">
                ${totals.jetSki.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Parasail</span>
              <span className="font-semibold">
                ${totals.parasail.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Banana Boat</span>
              <span className="font-semibold">
                ${totals.bananaBoat.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed breakdowns */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-sky-100 bg-white/90 backdrop-blur-sm p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-sky-900 mb-3">
            Category Breakdown
          </h3>
          <div className="divide-y">
            <StatRow
              label="Chairs"
              gross={`$${totals.chairs.toLocaleString()}`}
              orders={620}
              rate="7.4%"
            />
            <StatRow
              label="Bonfires"
              gross={`$${totals.bonfires.toLocaleString()}`}
              orders={210}
              rate="5.8%"
            />
            <StatRow
              label="Beach Box"
              gross={`$${totals.beachBox.toLocaleString()}`}
              orders={190}
              rate="4.9%"
            />
            <StatRow
              label="Paddleboard"
              gross={`$${totals.paddleboard.toLocaleString()}`}
              orders={118}
              rate="3.1%"
            />
            <StatRow
              label="Photography"
              gross={`$${totals.photography.toLocaleString()}`}
              orders={92}
              rate="2.9%"
            />
            <StatRow
              label="Jet Ski"
              gross={`$${totals.jetSki.toLocaleString()}`}
              orders={86}
              rate="2.2%"
            />
            <StatRow
              label="Parasail"
              gross={`$${totals.parasail.toLocaleString()}`}
              orders={49}
              rate="1.9%"
            />
            <StatRow
              label="Banana Boat"
              gross={`$${totals.bananaBoat.toLocaleString()}`}
              orders={19}
              rate="1.2%"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white/90 backdrop-blur-sm p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-sky-900 mb-3">
            Top Properties (Revenue)
          </h3>
          <div className="space-y-3 text-sm">
            {[
              { name: "Seaside Dunes", rev: 35650 },
              { name: "Blue Pearl", rev: 31980 },
              { name: "Driftwood Haven", rev: 29840 },
              { name: "Gulf Serenade", rev: 27420 },
              { name: "Emerald Sands", rev: 23110 },
            ].map((p) => (
              <div
                key={p.name}
                className="flex items-center justify-between border-b last:border-0 pb-2"
              >
                <div className="font-medium text-sky-900">{p.name}</div>
                <div className="font-semibold">${p.rev.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
