import ServiceBookingPage, {
  ServiceBookingConfig,
} from "@/components/ServiceBookingPage";

const config: ServiceBookingConfig = {
  title: "PCB Jet Skis",
  blurb: "Thrill rides on the emerald water.",
  hero: "/cards/jetski.jpg",
  supportsDateRange: false, // pick one date (you can add time later)
  quantityLabel: "skis",
  packages: [
    { id: "30", name: "30 minutes", price: 65 },
    { id: "60", name: "1 hour", price: 120 },
  ],
  extras: [{ id: "cam", name: "Photo Package", price: 40 }],
  scope: "pcb",
};

export default function Page() {
  return <ServiceBookingPage config={config} />;
}
