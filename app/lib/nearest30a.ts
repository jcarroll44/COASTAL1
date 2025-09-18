import accesses from "@/data/30a-accesses.json";
import { findNearestAccess } from "./nearestAccess";

export function nearestFor(coords?: [number, number]) {
  if (!coords) return null;
  const best = findNearestAccess(
    { lat: coords[1], lng: coords[0] },
    accesses as any
  );
  return best
    ? {
        label: best.item.name,
        coords: [best.item.lng, best.item.lat] as [number, number],
      }
    : null;
}
