// app/partners/[partnerId]/dashboard/page.tsx
// Enhanced: PCB condo dashboards now match the 30A account style (toggle + full widgets).
import DashboardClient from "./DashboardClient";
import Image from "next/image";
import Link from "next/link";
import condos from "../../../data/condos.json";

export const dynamic = "force-dynamic";

const pretty = (s: string) =>
  s.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

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

export default function PartnerDashboardPage({
  params,
}: {
  params: { partnerId: string };
}) {
  const id = params.partnerId;

  // PCB Condo rich dashboard (applies to every condo in condos.json)
  const condo = (condos as any[]).find((c) => c?.slug === id);
  if (condo) {
    const title = condo.name || pretty(id);
    const address = condo.address || "Address unavailable";
    const commissionRate = 0.2; // default for condos
    // filler totals (wire real data later)
    const totals = {
      gross: 142_350,
      orders: 384,
      chairs: 71_200,
      bonfires: 24_900,
      beachBox: 11_480,
      paddleboard: 6_700,
      photography: 4_820,
      jetSki: 12_600,
      parasail: 6_050,
      bananaBoat: 4_550,
    };
    const commission = Math.round(totals.gross * commissionRate);
    const payout = totals.gross - commission;
    const weekly = [22, 54, 46, 68, 51, 72, 43, 60, 49, 80, 77, 69];

    return (
      <main className="max-w-6xl mx-auto py-10 px-4">
        {/* Header + toggle */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left: Title + subtitle */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold text-sky-900">
              {title}
            </h1>
            <p className="text-gray-600 text-base font-medium">
              Account Dashboard
            </p>
            <p className="text-gray-500 text-sm">{address}</p>
          </div>

          {/* Right: Large logo */}
          <div className="relative w-56 h-24 shrink-0">
            <Image
              src={`/logos/${id}.png`}
              alt={title}
              fill
              sizes="224px"
              priority
              className="object-contain"
            />
          </div>
        </div>

        {/* Toggle (unchanged) */}
        <div className="mb-6 inline-flex items-center rounded-full border border-sky-200 bg-white p-1 shadow-sm">
          <Link
            href={`/partners/${id}`}
            className="px-3 md:px-4 py-1.5 text-sm rounded-full text-sky-700 hover:bg-sky-50 transition-colors"
          >
            Overview
          </Link>
          <span className="px-3 md:px-4 py-1.5 text-sm rounded-full bg-sky-100 text-sky-900">
            Dashboard
          </span>
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

        {/* Trend + Product mix */}
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
                <span className="text-gray-600">Beach Better Box</span>
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
                orders={210}
                rate="7.4%"
              />
              <StatRow
                label="Bonfires"
                gross={`$${totals.bonfires.toLocaleString()}`}
                orders={62}
                rate="5.8%"
              />
              <StatRow
                label="Beach Box"
                gross={`$${totals.beachBox.toLocaleString()}`}
                orders={45}
                rate="4.9%"
              />
              <StatRow
                label="Paddleboard"
                gross={`$${totals.paddleboard.toLocaleString()}`}
                orders={28}
                rate="3.1%"
              />
              <StatRow
                label="Photography"
                gross={`$${totals.photography.toLocaleString()}`}
                orders={24}
                rate="2.9%"
              />
              <StatRow
                label="Jet Ski"
                gross={`$${totals.jetSki.toLocaleString()}`}
                orders={30}
                rate="2.2%"
              />
              <StatRow
                label="Parasail"
                gross={`$${totals.parasail.toLocaleString()}`}
                orders={18}
                rate="1.9%"
              />
              <StatRow
                label="Banana Boat"
                gross={`$${totals.bananaBoat.toLocaleString()}`}
                orders={12}
                rate="1.2%"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-sky-100 bg-white/90 backdrop-blur-sm p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-sky-900 mb-3">
              Recent Orders
            </h3>
            <div className="space-y-2 text-sm">
              {[
                { id: "#A1042", item: "Chairs (4)", amt: 240 },
                { id: "#A1041", item: "Bonfire (Premium)", amt: 475 },
                { id: "#A1040", item: "Beach Better Box", amt: 90 },
                { id: "#A1039", item: "Jet Ski (1hr)", amt: 160 },
                { id: "#A1038", item: "Photography (30min)", amt: 220 },
              ].map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between border-b last:border-0 pb-2"
                >
                  <div className="text-sky-900 font-medium">{o.id}</div>
                  <div className="text-gray-600">{o.item}</div>
                  <div className="font-semibold">${o.amt.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // 30A account dashboard remains your rich component
  if (id === "30a-escapes") {
    const ThirtyADashboard = require("./thirtya/ThirtyADashboard").default;
    return <ThirtyADashboard />;
  }

  // Fallback for other partners
  return (
    <main className="mx-auto max-w-6xl px-5 md:px-8 py-8">
      <DashboardClient partnerId={id} />
    </main>
  );
}
