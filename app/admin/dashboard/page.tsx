// Grand Coastal Dashboard — aggregate of all partners + condos
import Link from "next/link";
import condos from "../../data/condos.json";

export const dynamic = "force-dynamic";

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

const Row = ({
  name,
  gross,
  orders,
}: {
  name: string;
  gross: number;
  orders: number;
}) => (
  <div className="flex items-center justify-between py-2.5 border-b last:border-0 text-sm">
    <div className="font-medium text-sky-900">{name}</div>
    <div className="text-gray-600">{orders} orders</div>
    <div className="font-semibold">${gross.toLocaleString()}</div>
  </div>
);

export default function CoastalAdminDashboard() {
  // Filler aggregated numbers (replace with real rollups later)
  const totals = {
    gross: 1_284_900,
    orders: 3_980,
    commission: 256_980,
    payout: 1_027_920,
    chairs: 512_300,
    bonfires: 212_400,
    beachBox: 124_600,
    paddleboard: 62_450,
    photography: 54_900,
    jetSki: 170_800,
    parasail: 76_900,
    bananaBoat: 70_950,
  };

  const weekly = [64, 88, 72, 110, 94, 120, 78, 99, 84, 130, 122, 114];

  // Example “top contributors” list: first 8 condos for now
  const list = (condos as any[]).slice(0, 8).map((c: any, i: number) => ({
    name: c.name || c.slug,
    gross: Math.round(80_000 - i * 3_100 + (i % 2 ? 2_000 : 0)),
    orders: Math.round(180 - i * 7),
  }));

  return (
    <main className="max-w-6xl mx-auto py-10 px-4">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-brand">
          Coastal — Company Dashboard
        </h1>

        {/* quick links */}
        <div className="inline-flex gap-2">
          <Link
            href="/admin"
            className="rounded-full border border-sky-200 bg-white px-4 py-1.5 text-sm text-sky-700 hover:bg-sky-50"
          >
            Admin Home
          </Link>
          <Link
            href="/admin/pcb-condos"
            className="rounded-full border border-sky-200 bg-white px-4 py-1.5 text-sm text-sky-700 hover:bg-sky-50"
          >
            PCB Condos
          </Link>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <KPI
          label="Gross Revenue"
          value={`$${totals.gross.toLocaleString()}`}
        />
        <KPI label="Orders" value={totals.orders.toLocaleString()} />
        <KPI
          label="Commission"
          value={`$${totals.commission.toLocaleString()}`}
        />
        <KPI
          label="Total Payout"
          value={`$${totals.payout.toLocaleString()}`}
        />
      </div>

      {/* Trends + Mix */}
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
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Chairs</span>
              <span className="font-semibold">
                ${totals.chairs.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Bonfires</span>
              <span className="font-semibold">
                ${totals.bonfires.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Beach Better Box</span>
              <span className="font-semibold">
                ${totals.beachBox.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Paddleboard</span>
              <span className="font-semibold">
                ${totals.paddleboard.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Photography</span>
              <span className="font-semibold">
                ${totals.photography.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Jet Ski</span>
              <span className="font-semibold">
                ${totals.jetSki.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Parasail</span>
              <span className="font-semibold">
                ${totals.parasail.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Banana Boat</span>
              <span className="font-semibold">
                ${totals.bananaBoat.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contributors + Recent */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-sky-100 bg-white/90 backdrop-blur-sm p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-sky-900 mb-3">
            Top Condo Contributors
          </h3>
          <div className="divide-y">
            {list.map((c) => (
              <Row
                key={c.name}
                name={c.name}
                gross={c.gross}
                orders={c.orders}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white/90 backdrop-blur-sm p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-sky-900 mb-3">
            Recent Orders
          </h3>
          <div className="space-y-2 text-sm">
            {[
              { id: "#G2042", item: "Chairs (6)", amt: 360 },
              { id: "#G2041", item: "Bonfire (Premium)", amt: 475 },
              { id: "#G2040", item: "Beach Better Box", amt: 90 },
              { id: "#G2039", item: "Jet Ski (1hr)", amt: 160 },
              { id: "#G2038", item: "Photography (1hr)", amt: 420 },
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
