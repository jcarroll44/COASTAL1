// app/[market]/[service]/page.tsx
import { notFound } from "next/navigation";
import ServiceBookingPage, {
  ServiceBookingConfig,
} from "@/components/ServiceBookingPage";
import { getServiceConfig } from "@/lib/services";

type Params = {
  market: "30a" | "pcb";
  service: "chairs" | "bonfires" | "photography" | "beach-better-box";
};

export default function ServicePage({ params }: { params: Params }) {
  const { market, service } = params;

  const config = getServiceConfig(market, service);
  if (!config) return notFound();

  // This keeps every page IDENTICAL to /30a/chairs because they all use the same component + config.
  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8 py-8">
      <ServiceBookingPage service={config as ServiceBookingConfig} />
    </div>
  );
}
