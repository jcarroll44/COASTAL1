// app/lib/data.ts
// Tiny data helpers for 30A homes + beach accesses.
// NOTE: no path aliases; only relative imports.

export type Home30A = {
  id: string;
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
};

export type Access30A = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

import homes30ARaw from "../data/properties.json";
import accesses30ARaw from "../data/30a-accesses.json";

const homes30A: Home30A[] = (homes30ARaw as any[]).map((h) => ({
  id: String(h.id ?? h.slug ?? h.name),
  name: String(h.name ?? ""),
  address: (h.address ?? h.addr ?? "") as string,
  lat: typeof h.lat === "number" ? h.lat : undefined,
  lng: typeof h.lng === "number" ? h.lng : undefined,
}));

const accesses30A: Access30A[] = (accesses30ARaw as any[]).map((a, i) => ({
  id: String(a.id ?? i),
  name: String(a.name ?? a.label ?? "Beach Access"),
  lat: Number(a.lat),
  lng: Number(a.lng),
}));

export function list30AHomes(): Home30A[] {
  return homes30A;
}
export function get30AHomeById(id: string): Home30A | undefined {
  return homes30A.find((h) => h.id === id);
}
export function listAccesses30A(): Access30A[] {
  return accesses30A;
}
