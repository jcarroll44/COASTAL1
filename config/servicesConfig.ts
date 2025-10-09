// config/services.ts
import type { Service } from "@/components/ServiceBookingPage";

const HERO = "/cards/watersports.jpg"; // use same image for all (for now)

export const SERVICES: Record<string, Service> = {
  bonfire: {
    title: "Beach Bonfires",
    blurb: "Permits, setup, seating & s’mores—handled by our crew.",
    hero: HERO,
    quantityLabel: "events",
    askDate: true,
    packages: [
      {
        id: "std",
        name: "Standard Bonfire (up to 10)",
        price: 500,
        details: "2 hours · sunset",
      },
      {
        id: "sig",
        name: "Signature Bonfire (up to 20)",
        price: 800,
        details: "Lounge seating · lanterns",
      },
    ],
    addons: [
      { id: "smores", name: "S’mores Kit", price: 40 },
      { id: "guitar", name: "Acoustic Guitarist", price: 250 },
    ],
  },
  chairs: {
    title: "Chairs & Umbrellas",
    blurb: "Daily setup & takedown. Two chairs + one umbrella per set.",
    hero: HERO,
    quantityLabel: "sets",
    askDate: true,
    packages: [
      {
        id: "week",
        name: "Weekly Setup",
        price: 300,
        details: "Mon–Fri · 9am setup",
        badge: "Best Value",
      },
      {
        id: "day",
        name: "Single Day",
        price: 55,
        details: "Daily setup & takedown",
      },
    ],
    addons: [{ id: "extra-umb", name: "Extra Umbrella", price: 20 }],
  },
  box: {
    title: "Beach Better Box",
    blurb: "Weekly bundle: towels, cooler, toys — refreshed and ready.",
    hero: HERO,
    quantityLabel: "weeks",
    packages: [
      {
        id: "std",
        name: "Weekly Box",
        price: 375,
        details: "Doorstep delivery",
      },
    ],
    addons: [{ id: "refill", name: "Mid-week Refill", price: 60 }],
  },
  photo: {
    title: "Family Photography",
    blurb: "Golden-hour sessions with delivery of edited images.",
    hero: HERO,
    quantityLabel: "sessions",
    askDate: true,
    askTime: true,
    packages: [
      {
        id: "mini",
        name: "Mini Session",
        price: 300,
        details: "20–30 minutes",
      },
      {
        id: "full",
        name: "Full Session",
        price: 500,
        details: "45–60 minutes",
        badge: "Popular",
      },
    ],
  },
  paddleboard: {
    title: "Paddleboard",
    blurb: "Stable, fun paddleboards for exploring calm waters.",
    hero: HERO,
    quantityLabel: "boards",
    askDate: true,
    packages: [
      {
        id: "hour",
        name: "Per Hour",
        price: 65,
        details: "Pick up or delivery",
      },
    ],
  },
  parasail: {
    title: "Parasail",
    blurb: "Soar above PCB with pro operators and safety gear.",
    hero: HERO,
    quantityLabel: "riders",
    askDate: true,
    askTime: true,
    packages: [{ id: "ride", name: "Per Rider", price: 95 }],
  },
  jetski: {
    title: "Jet Skis",
    blurb: "Fast, fun. Safety briefing included.",
    hero: HERO,
    quantityLabel: "hours",
    askDate: true,
    askTime: true,
    packages: [{ id: "hour", name: "Per Hour", price: 125 }],
  },
  boat: {
    title: "Boat Rentals",
    blurb: "Pontoons for the bay. Fuel and safety gear included.",
    hero: HERO,
    quantityLabel: "hours",
    askDate: true,
    askTime: true,
    packages: [{ id: "pontoon", name: "Pontoon (per hour)", price: 120 }],
  },
  banana: {
    title: "Banana Boat",
    blurb: "Group rides with a pro captain.",
    hero: HERO,
    quantityLabel: "riders",
    askDate: true,
    askTime: true,
    packages: [{ id: "ride", name: "Per Rider", price: 35 }],
  },
};
