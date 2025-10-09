import ServiceBookingPage, { Service } from "@/components/ServiceBookingPage";
const HERO = "/cards/photo-full.jpg";
const svc: Service = {
  title: "30A Family Photography",
  blurb: "Golden-hour beach sessions with edited image delivery.",
  hero: HERO,
  quantityLabel: "sessions",
  askDate: true,
  askTime: true,
  packages: [
    { id: "mini", name: "Mini Session", price: 300, details: "20–30 minutes" },
    {
      id: "full",
      name: "Full Session",
      price: 500,
      details: "45–60 minutes",
      badge: "Popular",
    },
  ],
};
export default function Page() {
  return <ServiceBookingPage service={svc} />;
}
