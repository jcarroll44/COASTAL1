// app/partners/[partnerId]/properties/[propertyId]/page.tsx
export const dynamic = "force-dynamic";

import { absPath } from "../../../../lib/abs";
import PropertyHero from "./PropertyHero";
import PropertyOverview from "./PropertyOverview";
import PropertyDashboard from "./PropertyDashboard";
import OverviewDashboardToggle from "./OverviewDashboardToggle";

// ✅ 30A catalog (pretty names + addresses)
import homes30A from "../../../../data/30a-homes.json";

type PartnersMeta = {
  meta?: {
    partnerId: string;
    name?: string;
    commission?: { model: string; rate: number } | null;
  };
};

type ApiProperty = {
  name?: string;
  totals?: { orders?: number; gross?: number };
  services?: Array<{ name: string; total: number }>;
  salesByMonth?: Record<string, number>;
  recent?: Array<{ createdAt: string; gross?: number }>;
};

function money(n = 0) {
  return Math.max(0, Number(n) || 0);
}
function bucketFor(name = ""): "chairs" | "bonfire" | "photography" | "other" {
  const k = name.toLowerCase();
  if (k.includes("chair")) return "chairs";
  if (k.includes("bonfire")) return "bonfire";
  if (k.includes("photo")) return "photography";
  return "other";
}
const titleizeSlug = (slug: string) =>
  slug
    .split("-")
    .map((w) =>
      w.length <= 2 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)
    )
    .join(" ");

export default async function PropertyPage({
  params,
  searchParams,
}: {
  params: { partnerId: string; propertyId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const partnerId = decodeURIComponent(params.partnerId);
  const propertyId = decodeURIComponent(params.propertyId);
  const view = (
    typeof searchParams?.view === "string" ? searchParams.view : "overview"
  ).toLowerCase();

  // --- Fetch the property payload (unchanged) ---
  const propRes = await fetch(
    absPath(`/api/partners/${partnerId}/properties/${propertyId}`),
    { cache: "no-store" }
  );
  if (!propRes.ok) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <h1 className="text-2xl font-semibold text-sky-900">
          Property Not Found
        </h1>
        <p className="mt-2 text-sky-700">
          We couldn’t load data for “{propertyId}”.
        </p>
      </main>
    );
  }
  const prop: ApiProperty = await propRes.json();

  // --- Commission meta (unchanged) ---
  let commissionRate = 0;
  try {
    const partnerRes = await fetch(absPath(`/api/partners/${partnerId}`), {
      cache: "no-store",
    });
    if (partnerRes.ok) {
      const partner: PartnersMeta = await partnerRes.json();
      const r = partner?.meta?.commission?.rate;
      if (typeof r === "number" && r >= 0) commissionRate = r;
    }
  } catch {}

  // --- Rollups (unchanged) ---
  const gross = money(prop?.totals?.gross);
  const buckets: Record<
    "chairs" | "bonfire" | "photography" | "other",
    number
  > = { chairs: 0, bonfire: 0, photography: 0, other: 0 };
  for (const s of prop?.services || []) {
    buckets[bucketFor(s.name)] += money(s.total);
  }
  const eligible = Math.max(0, gross - buckets.chairs);
  const commission = Math.round(eligible * commissionRate) || 0;

  // ✅ Pretty name + address from 30A catalog (if available)
  let prettyName: string | undefined;
  let prettyAddress: string | undefined;
  if (partnerId === "30a-escapes" && Array.isArray(homes30A)) {
    // file uses “Slug”, “Home Name”, “Address”
    const hit = (homes30A as any[]).find(
      (h) => (h?.Slug || h?.slug) === propertyId
    );
    if (hit) {
      prettyName = hit["Home Name"] || hit.name;
      prettyAddress = hit["Address"] || hit.address;
    }
  }

  const propertyDisplayName =
    prettyName || prop?.name || titleizeSlug(propertyId);
  const propertyAddress = prettyAddress || (prop as any)?.address || undefined;

  return (
    <main className="mx-auto max-w-6xl px-5 md:px-8 py-10">
      {/* ✅ Same hero, now fed with Name + Address like PCB condos */}
      <PropertyHero
        partnerId={partnerId}
        propertyName={propertyDisplayName}
        address={propertyAddress}
      />

      <OverviewDashboardToggle />

      {view === "dashboard" ? (
        <div className="mt-6">
          <PropertyDashboard
            totals={{ gross, eligible, commission }}
            breakdown={{
              chairs: buckets.chairs,
              bonfire: buckets.bonfire,
              photography: buckets.photography,
              other: buckets.other,
            }}
          />
        </div>
      ) : (
        <div className="mt-6">
          <PropertyOverview />
        </div>
      )}
    </main>
  );
}
