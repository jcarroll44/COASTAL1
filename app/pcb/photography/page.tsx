import ServiceBookingPage, {
  ServiceBookingConfig,
} from "@/components/ServiceBookingPage";

const config: ServiceBookingConfig = {
  title: "PCB Family Photography",
  blurb: "Golden-hour sessions on the beach. Edited & delivered online.",
  hero: "/cards/photo.jpg",
  supportsDateRange: false, // single date session
  quantityLabel: "session",
  packages: [
    {
      id: "std",
      name: "Standard Session (45–60 min)",
      price: 300,
      details: "One location • golden hour",
    },
    {
      id: "ext",
      name: "Extended Session (75–90 min)",
      price: 450,
      details: "Multiple groupings",
    },
  ],
  extras: [{ id: "photos", name: "Rush Edits", price: 60 }],
  scope: "pcb",
};

export default function Page() {
  return <ServiceBookingPage config={config} />;
}
