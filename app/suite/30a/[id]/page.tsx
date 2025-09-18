import properties from "@/data/properties.json";
import AmenitySuitePro from "@/components/AmenitySuitePro";
import { nearestFor } from "@/lib/nearest30a";

type Params = { params: { id: string } };
type P = {
  id: string;
  market: string;
  name: string;
  address?: string;
  coords?: [number, number];
  homeIncludedSets?: number;
  amenities?: Record<string, boolean>;
};

export default function ThirtyASuiteById({ params }: Params) {
  const p = (properties as P[]).find(
    (x) =>
      x.market.toLowerCase() === "30a" &&
      x.id.toLowerCase() === params.id.toLowerCase()
  );
  if (!p)
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">Unknown property.</main>
    );

  const access = nearestFor(p.coords) || undefined;

  return (
    <main className="pb-10">
      <div className="mx-auto w-full max-w-6xl px-4 pt-6">
        <AmenitySuitePro
          market="30a"
          property={{
            name: p.name,
            address: p.address,
            homeIncludedSets: p.homeIncludedSets || 0,
            coords: p.coords,
            access,
            amenities: {
              box: true,
              bonfire: true,
              photo: true,
              ...(p.amenities || {}),
            },
          }}
        />
      </div>
    </main>
  );
}
