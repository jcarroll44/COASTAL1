import ServiceBookingPage from "@/components/ServiceBookingPage";
import { SERVICES } from "@/config/services";
import { notFound } from "next/navigation";
// pull 30A accesses from your JSON in /public
import coastalAccess from "@/../public/CoastalAccess.json";

export default function Page({
  params,
  searchParams,
}: {
  params: { service: string };
  searchParams?: Record<string, string | undefined>;
}) {
  const data = SERVICES[params.service];
  if (!data) return notFound();

  // If this is the 30A chairs flow, turn the access JSON into dropdown options
  const locations =
    data.scope === "30a" || params.service === "chairs"
      ? (coastalAccess as any[])
          .filter((a) => a?.name && a?.lat && a?.lng)
          .map((a) => ({ value: a.slug || a.name, label: a.name }))
      : undefined;

  return <ServiceBookingPage config={{ ...data, locations }} />;
}
