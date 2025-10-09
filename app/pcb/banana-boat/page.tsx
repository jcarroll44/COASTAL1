import ServiceBookingPage, {
  ServiceBookingConfig,
} from "@/components/ServiceBookingPage";

const config: ServiceBookingConfig = {
  title: "PCB Banana Boat",
  blurb: "Group fun with pro drivers.",
  hero: "/cards/banana.jpg",
  supportsDateRange: false,
  quantityLabel: "riders",
  pricePerUnit: 25,
  extras: [{ id: "gopro", name: "GoPro Clip", price: 20 }],
  scope: "pcb",
};

export default function Page() {
  return <ServiceBookingPage config={config} />;
}
