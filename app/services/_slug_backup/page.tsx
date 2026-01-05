// app/services/[slug]/page.tsx
import ServicePage from "@/components/ServicePage";
import { SERVICES, SERVICES_MAP } from "@/data/services";
import { notFound } from "next/navigation";

export default function Page({ params }: { params: { slug: string } }) {
  const svc = SERVICES_MAP[params.slug];
  if (!svc) return notFound();
  return <ServicePage service={svc} />;
}

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}