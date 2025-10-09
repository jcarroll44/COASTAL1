import ServiceBookingPage, {
  ServiceBookingConfig,
} from "@/components/ServiceBookingPage";

const config: ServiceBookingConfig = {
  title: "PCB Chairs & Umbrellas",
  blurb: "Daily setup & takedown. Two chairs + one umbrella per set.",
  hero: "/cards/chairs-pcb.jpg",
  supportsDateRange: true, // start + end dates
  quantityLabel: "sets",
  pricePerUnit: 55, // per set per day
  extras: [
    { id: "extra-chair", name: "Extra Chair", price: 10 },
    { id: "extra-umbrella", name: "Extra Umbrella", price: 20 },
  ],
  scope: "pcb",
};

export default function Page() {
  return <ServiceBookingPage config={config} />;
}
