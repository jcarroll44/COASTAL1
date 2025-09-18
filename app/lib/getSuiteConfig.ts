// app/lib/getSuiteConfig.ts
import properties from "@/data/properties.json";

export type Item = { id: string; name: string; price: number };

export function isValidMarket(m?: string | null) {
  const v = (m || "").toLowerCase();
  return v === "pcb" || v === "30a";
}

export function getMarketProperties(market: string) {
  const m = (market || "").toLowerCase();
  // ✅ only filter by market; do NOT require coords/images/etc.
  return (properties as any[]).filter(
    (p) => (p.market || "").toLowerCase() === m
  );
}

export function findProperty(market: string, id: string) {
  const m = (market || "").toLowerCase();
  const i = (id || "").toLowerCase();
  return (properties as any[]).find(
    (p) =>
      (p.market || "").toLowerCase() === m && (p.id || "").toLowerCase() === i
  );
}

export function getSuiteConfig(market: string) {
  const base: Record<string, Item[]> = {
    pcb: [
      { id: "chairs", name: "Beach Chairs & Umbrellas", price: 55 },
      { id: "bonfire", name: "Beach Bonfire", price: 500 },
      { id: "photo", name: "Family Photography", price: 300 },
      { id: "watersports", name: "Water Sports", price: 30 },
    ],
    "30a": [
      { id: "chairs", name: "Beach Chairs & Umbrellas", price: 55 },
      { id: "box", name: "Beach Better Box", price: 375 },
      { id: "bonfire", name: "Beach Bonfires", price: 500 },
      { id: "photo", name: "Family Photography", price: 300 },
    ],
  };
  return base[(market || "").toLowerCase()] || base.pcb;
}
