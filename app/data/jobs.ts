// Simple in-repo data source (replace with CMS later)
export type Job = {
  slug: string;
  title: string;
  market: "PCB" | "30A";
  department: "Beach" | "Bonfires" | "Water Sports" | "Ops" | "Reservations";
  type: "Full-time" | "Part-time" | "Seasonal";
  season?: "Spring" | "Summer" | "Fall" | "Winter";
  payRange?: string;
  locationNote?: string;
  bullets: string[];
  description: string;
};

export const JOBS: Job[] = [
  {
    slug: "beach-attendant-30a",
    title: "Beach Attendant",
    market: "30A",
    department: "Beach",
    type: "Seasonal",
    season: "Summer",
    payRange: "$16–$20/hr",
    locationNote: "Multiple access points along 30A",
    bullets: [
      "Daily setup & takedown of chairs/umbrellas",
      "Guest care with a hospitality-first mindset",
      "Weather-smart operations with the crew",
    ],
    description:
      "Help guests enjoy perfect days on the sand. You’ll set up, care for, and reset premium chair sets with a seasoned Coastal crew.",
  },
  {
    slug: "bonfire-crew-pcb",
    title: "Bonfire Crew (Evenings)",
    market: "PCB",
    department: "Bonfires",
    type: "Part-time",
    payRange: "$18–$22/hr",
    locationNote: "Panama City Beach",
    bullets: [
      "Evening setup/strike for private beach bonfires",
      "Safe handling of permits & equipment",
      "Guest-facing service during events",
    ],
    description:
      "Join our evening crew delivering Coastal’s signature bonfires. You’ll handle equipment, site prep, and guest experience.",
  },
  {
    slug: "water-sports-attendant-pcb",
    title: "Water Sports Attendant",
    market: "PCB",
    department: "Water Sports",
    type: "Full-time",
    payRange: "$17–$21/hr",
    bullets: [
      "Assist with jet ski & paddle ops",
      "Dock/shoreline guest service",
      "Equipment checks + safety briefs",
    ],
    description:
      "Support daily jet ski and paddle operations with an eye for safety and guest care.",
  },
  {
    slug: "reservations-concierge-remote",
    title: "Reservations Concierge",
    market: "30A",
    department: "Reservations",
    type: "Part-time",
    payRange: "$18–$22/hr + bonuses",
    bullets: [
      "Phone & text guest care",
      "Itinerary building",
      "Calendar & vendor coordination",
    ],
    description:
      "Coordinate guest plans, answer questions, and book services with warmth and precision.",
  },
];
