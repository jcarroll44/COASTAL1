export type LatLng = { lat: number; lng: number };

function toRad(n: number) {
  return (n * Math.PI) / 180;
}

export function distanceMeters(a: LatLng, b: LatLng) {
  const R = 6371000; // meters
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function findNearestAccess(
  home: LatLng,
  accesses: { name: string; lat: number; lng: number }[]
) {
  let best: { item: any; dist: number } | null = null;
  for (const item of accesses) {
    const dist = distanceMeters(home, { lat: item.lat, lng: item.lng });
    if (!best || dist < best.dist) best = { item, dist };
  }
  return best;
}
