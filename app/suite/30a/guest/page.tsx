// app/suite/30a/guest/page.tsx
import GuestAddressSearch, {
  type GuestHome,
} from "@/components/GuestAddressSearch";
import properties from "@/data/properties.json";

export default async function Page() {
  // Use ONLY 30A homes (any PM or none)
  const homes: GuestHome[] = (properties as any[])
    .filter((p) => p.market === "30a")
    .map((p) => ({
      id: p.id,
      name: p.name,
      address: p.address,
      pm: p.pm, // optional; fine if missing
    }));

  return (
    <main className="min-h-[70vh] grid place-items-center px-4">
      <div className="w-full max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold">
          30A · <span className="text-sky-800">Find Your Home</span>
        </h1>

        <div className="rounded-2xl border border-sky-200 bg-white p-4 shadow-sm">
          <GuestAddressSearch market="30a" homes={homes} />
        </div>

        <p className="text-sm text-sky-700">
          Don’t see your home? Continue and we’ll show a standard 30A Amenity
          Suite. You can add your address at checkout.
        </p>
      </div>
    </main>
  );
}
