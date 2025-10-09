import ServiceBookingPage, {
  ServiceBookingConfig,
} from "@/components/ServiceBookingPage";

const config: ServiceBookingConfig = {
  title: "PCB Paddleboard",
  blurb: "Calm-water cruising by the shore.",
  hero: "/cards/paddleboard.jpg",
  supportsDateRange: false,
  quantityLabel: "boards",
  pricePerUnit: 35,
  scope: "pcb",
};

export default function Page() {
  return <ServiceBookingPage config={config} />;
}
