import ServiceBookingPage, {
  ServiceBookingConfig,
} from "@/components/ServiceBookingPage";

const config: ServiceBookingConfig = {
  title: "PCB Parasail",
  blurb: "Soar high with the safest crews on the coast.",
  hero: "/cards/parasail.jpg",
  supportsDateRange: false,
  quantityLabel: "riders",
  packages: [
    { id: "single", name: "Single Rider", price: 75 },
    { id: "tandem", name: "Tandem (2 riders)", price: 130 },
  ],
  extras: [{ id: "photos", name: "Photo Package", price: 30 }],
  scope: "pcb",
};

export default function Page() {
  return <ServiceBookingPage config={config} />;
}
