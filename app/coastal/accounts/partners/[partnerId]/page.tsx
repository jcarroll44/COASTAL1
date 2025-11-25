=import PropertyPolishedClient from "./PropertyPolishedClient";

export default function PropertyPage({
  params,
}: {
  params: { partnerId: string; propertyId: string };
}) {
  return (
    <main className="mx-auto max-w-6xl px-5 md:px-8 py-8">
      <PropertyPolishedClient
        partnerId={params.partnerId}
        propertyId={params.propertyId}
      />
    </main>
  );
}