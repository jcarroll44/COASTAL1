// app/suite/pcb/[slug]/page.tsx
import { getPropertyBySlug } from "@/data/properties";
import PropertySuite from "@/components/PropertySuite";

export default function PCBSuitePage({ params }: { params: { slug: string } }) {
  const property = getPropertyBySlug(params.slug);

  if (!property) {
    return <div className="p-10 text-red-600">Property not found.</div>;
  }

  return <PropertySuite property={property} />;
}
