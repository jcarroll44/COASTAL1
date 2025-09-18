// app/suite/[market]/[property]/page.tsx
import { notFound } from "next/navigation";
import AmenitySuitePro from "@/components/AmenitySuitePro";
import properties from "@/data/properties.json";

export default async function PropertySuite({
  params,
}: {
  params: Promise<Record<string, string>>;
}) {
  const { market, property } = await params;

  const m = (market ?? "").toLowerCase();
  const p = (property ?? "").toLowerCase();

  if (m !== "pcb" && m !== "30a") return notFound();

  const meta = (properties as any[]).find((x) => x.market === m && x.id === p);
  if (!meta) return notFound();

  const propData = {
    name: meta.name as string,
    address: meta.address as string | undefined,
    homeIncludedSets: meta.homeIncludedSets ?? 0,
    coords:
      meta.lat != null && meta.lng != null
        ? ([meta.lng, meta.lat] as [number, number])
        : undefined,
    access: meta.access as
      | { label: string; coords: [number, number] }
      | undefined,
    amenities: meta.amenities as any,
  };

  return (
    <main className="min-h-[70vh] grid place-items-center px-4">
      <div className="w-full max-w-7xl">
        {/* @ts-expect-error: client component props */}
        <AmenitySuitePro market={m as "pcb" | "30a"} property={propData} />
      </div>
    </main>
  );
}
