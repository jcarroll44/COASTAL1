// app/lib/pcbCondos.ts
import raw from "../data/condos.json";

export type Condo = {
  name: string;
  address: string;
  market: "pcb";
  slug: string;
};

const str = (v: any) => (typeof v === "string" ? v : "");

export const PCB_CONDOS: Condo[] = (raw as any[])
  .filter(Boolean)
  .map((c) => ({
    name: str(c.name) || str(c.title) || str(c.property) || str(c.slug),
    address: str(c.address) || "",
    market: "pcb" as const,
    slug: str(c.slug).toLowerCase(),
  }))
  .filter((c) => c.slug);

// helpers
export function isPcbCondo(slug: string) {
  const id = (slug || "").toLowerCase();
  return PCB_CONDOS.some((c) => c.slug === id);
}

export function getCondo(slug: string) {
  const id = (slug || "").toLowerCase();
  return PCB_CONDOS.find((c) => c.slug === id);
}
