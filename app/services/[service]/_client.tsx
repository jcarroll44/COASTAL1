"use client";

import { useSearchParams } from "next/navigation";
import ServiceBookingPage from "@/components/ServiceBookingPage";
import type { ServiceDef } from "@/config/services";

export default function ClientServicePage({
  service,
}: {
  service: ServiceDef;
}) {
  const sp = useSearchParams();

  const initialAccess = {
    slug: sp.get("access") || null,
    name: sp.get("accessName") || null,
    lat: sp.get("lat") ? Number(sp.get("lat")) : null,
    lng: sp.get("lng") ? Number(sp.get("lng")) : null,
  };

  return <ServiceBookingPage service={service} initialAccess={initialAccess} />;
}
