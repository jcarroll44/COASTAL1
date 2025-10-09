import ServiceBookingPage, { Service } from "@/components/ServiceBookingPage";

const HERO = "/cards/chairs-day.jpg";

const svc: Service = {
  title: "30A Chairs & Umbrellas",
  blurb: "Daily setup & takedown. Two chairs + one umbrella per set.",
  hero: HERO,
  quantityLabel: "sets",
  askDate: true,
  packages: [
    {
      id: "day",
      name: "Reserve Per Day",
      price: 55,
      details: "Setup by 9am, takedown at sunset",
    },
    {
      id: "week",
      name: "Reserve Week (Mon–Fri)",
      price: 300,
      details: "9am setup · sunset takedown",
      badge: "Best Value",
    },
  ],
  addons: [
    { id: "extra-chair", name: "Extra Chair", price: 10 },
    { id: "extra-umbrella", name: "Extra Umbrella", price: 20 },
  ],
  bullets: [
    "Choose your nearest 30A beach access",
    "Setup by 9am, takedown at sunset",
    "Weekly discount available",
  ],
  priceNote: "Starting at $55/day",
};

export default function Page() {
  return <ServiceBookingPage service={svc} />;
}
