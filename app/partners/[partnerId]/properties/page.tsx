// app/partners/[partnerId]/properties/page.tsx
import Link from "next/link";
import { headers } from "next/headers";
import TableWithSearch from "./TableWithSearch";

type ApiPropertyRow = {
  propertyId?: string;
  slug?: string;
  name?: string;
  type?: string;
  gross?: number;
};

type ApiResponse = {
  partnerId: string;
  totals?: { orders?: number; gross?: number };
  properties?: ApiPropertyRow[];
};

const partnerConfig: Record<
  string,
  { name: string; logo: string; commissionRate: number }
> = {
  "30a-escapes": {
    name: "30A Escapes",
    logo: "/30a-escapes1.png",
    commissionRate: 0.2,
  },
};

async function fetchPartnerData(partnerId: string): Promise<ApiResponse> {
  // 1) Try relative (works in most Next runtimes)
  try {
    const res = await fetch(`/api/partners/${partnerId}/properties`, {
      cache: "no-store",
    });
    if (res.ok) return (await res.json()) as ApiResponse;
  } catch {}

  // 2) Try absolute using incoming headers
  try {
    const h = headers();
    const proto = h.get("x-forwarded-proto") ?? "https";
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
    const origin = `${proto}://${host}`;
    const resAbs = await fetch(
      `${origin}/api/partners/${partnerId}/properties`,
      {
        cache: "no-store",
      }
    );
    if (resAbs.ok) return (await resAbs.json()) as ApiResponse;
  } catch {}

  // 3) Final fallback: empty shell so we never 404
  return { partnerId, totals: { orders: 0, gross: 0 }, properties: [] };
}

export default async function PartnerPropertiesPage({
  params,
}: {
  params: { partnerId: string };
}) {
  const { partnerId } = params;
  const partner = partnerConfig[partnerId];
  const data = await fetchPartnerData(partnerId);

  const commissionRate = partner?.commissionRate ?? 0.2;
  const gross = data?.totals?.gross ?? 0;
  const commission = Math.round(gross * commissionRate);
  const payout = Math.round(gross - commission);
  const propertiesCount = data?.properties?.length ?? 0;

  return (
    <main className="mx-auto max-w-6xl px-5 md:px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          {partner?.logo ? (
            <img
              src={partner.logo}
              alt={partner.name}
              className="h-20 w-auto md:h-24 rounded-none object-contain"
            />
          ) : null}

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-sky-900">
              {partner?.name ?? partnerId}
            </h1>
            <p className="mt-0.5 text-sky-600 text-sm md:text-[15px]">
              {propertiesCount.toLocaleString()} properties
            </p>
          </div>
        </div>

        {/* Toggle (Properties / Dashboard) */}
        <div className="inline-flex items-center rounded-full border border-sky-200 bg-white p-1">
          <span className="px-3 md:px-4 py-1.5 text-sm rounded-full bg-sky-100 text-sky-900">
            Properties
          </span>
          <Link
            href={`/partners/${partnerId}/dashboard`}
            className="px-3 md:px-4 py-1.5 text-sm rounded-full text-sky-700 hover:bg-sky-50 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-sky-100 bg-white/80 backdrop-blur-sm p-5 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Gross
          </div>
          <div className="text-2xl font-bold">${gross.toLocaleString()}</div>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-white/80 backdrop-blur-sm p-5 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Commission ({Math.round((commissionRate ?? 0) * 100)}%)
          </div>
          <div className="text-2xl font-bold">
            ${commission.toLocaleString()}
          </div>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-white/80 backdrop-blur-sm p-5 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Total Payout
          </div>
          <div className="text-2xl font-bold">${payout.toLocaleString()}</div>
        </div>
      </div>

      {/* Properties table */}
      <div className="rounded-2xl border border-sky-100 bg-white/90 backdrop-blur-sm p-4 md:p-6 shadow-sm">
        <TableWithSearch
          rows={data?.properties ?? []}
          partnerId={partnerId}
          commissionRate={commissionRate}
        />
      </div>
    </main>
  );
}
