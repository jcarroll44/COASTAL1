// app/data/properties.ts
export type Market = "pcb" | "30a";

export type PropertyConfig = {
  slug: string; // url-safe
  name: string; // display name
  market: Market;
  // Feature flags — turn these on/off per-property any time
  hasChairs?: boolean;
  hasBonfire?: boolean;
  hasPhotography?: boolean;
  hasWatersports?: boolean; // enables Jet Skis / Parasail / Banana / Paddleboard block
};

export const PROPERTIES: PropertyConfig[] = [
  // --- PCB ---
  {
    slug: "edgewater-beach-resort",
    name: "Edgewater Beach Resort",
    market: "pcb",
    hasChairs: true,
    hasBonfire: true,
    hasPhotography: true,
    hasWatersports: true,
  },
  {
    slug: "long-beach-resort",
    name: "Long Beach Resort",
    market: "pcb",
    hasChairs: true,
    hasBonfire: true,
    hasPhotography: true,
    hasWatersports: true,
  },
  {
    slug: "calypso-resort",
    name: "Calypso Resort",
    market: "pcb",
    hasChairs: true,
    hasBonfire: true,
    hasPhotography: true,
    hasWatersports: true,
  },
  {
    slug: "sterling-breeze",
    name: "Sterling Breeze",
    market: "pcb",
    hasChairs: true,
    hasBonfire: true,
    hasPhotography: true,
    hasWatersports: true,
  },
  // add more PCB properties here...

  // --- 30A (example placeholders, in case you want symmetry later) ---
  // { slug: "blue-mountain",  name: "Blue Mountain",  market: "30a", hasChairs: true, hasBonfire: true, hasPhotography: true, hasWatersports: false },
];

export function getPropertiesByMarket(market: Market) {
  return PROPERTIES.filter((p) => p.market === market);
}

export function getPropertyBySlug(slug: string) {
  return PROPERTIES.find((p) => p.slug === slug) || null;
}
