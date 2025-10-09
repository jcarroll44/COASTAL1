import ServiceBookingPage, {
  ServiceBookingConfig,
} from "@/components/ServiceBookingPage";

const config: ServiceBookingConfig = {
  title: "PCB Beach Bonfires",
  blurb: "Permits, setup, seating, and s’mores — handled by our crew.",
  hero: "/cards/bonfire.jpg",
  supportsDateRange: false, // single date
  quantityLabel: "package",
  packages: [
    {
      id: "std",
      name: "Standard Bonfire (up to 10)",
      price: 500,
      details: "2 hours • sunset",
    },
    {
      id: "sig",
      name: "Signature Bonfire (up to 20)",
      price: 800,
      details: "Lounge seating • lanterns",
    },
  ],
  extras: [
    { id: "smores", name: "S’mores Kit", price: 40 },
    { id: "guitar", name: "Acoustic Guitarist", price: 250 },
  ],
  scope: "pcb",
};

export default function Page() {
  return <ServiceBookingPage config={config} />;
}
