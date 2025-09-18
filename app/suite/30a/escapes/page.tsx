import GuestAddressSearch, {
  type GuestHome,
} from "@/components/GuestAddressSearch";
import properties from "@/data/properties.json";

export default async function Page() {
  const homes: GuestHome[] = (properties as any[])
    .filter((p) => p.market === "30a" && p.pm === "30a-escapes")
    .map((p) => ({
      id: p.id,
      name: p.name,
      address: p.address,
      pm: "30A Escapes",
    }));

  return (
    <main className="min-h-[70vh] grid place-items-center px-4">
      <div className="w-full max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold">
          30A Escapes · <span className="text-sky-800">Choose Your Home</span>
        </h1>
        <div className="rounded-2xl border border-sky-200 bg-white p-4 shadow-sm">
          <GuestAddressSearch market="30a" homes={homes} />
        </div>
      </div>
    </main>
  );
}
