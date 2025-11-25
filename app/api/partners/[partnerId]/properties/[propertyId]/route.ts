/ app/aip / partners / [partnerId] / properties / [propertyId] / route.ts;
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

type OrderItem = { id: string; qty: number; price: number };
type Order = {
  partnerId: string;
  propertyId: string;
  gross: number;
  createdAt: string; // ISO
  items: OrderItem[];
};

async function readJSON<T>(p: string): Promise<T> {
  const raw = await fs.readFile(p, "utf8").catch(() => "null");
  return JSON.parse(raw) as T;
}

function monthKey(dateIso: string) {
  const d = new Date(dateIso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM
}

export async function GET(
  _req: Request,
  { params }: { params: { partnerId: string; propertyId: string } }
) {
  const { partnerId, propertyId } = params;

  // Properties (for display name)
  const propsPath = path.join(process.cwd(), "data", "properties.json");
  const props = await readJSON<{
    properties: Array<{ id: string; name: string }>;
  }>(propsPath);
  const prop = props?.properties?.find((p) => p.id === propertyId);
  const displayName = prop?.name ?? propertyId;

  // Orders
  const ordersPath = path.join(process.cwd(), "data", "orders.json");
  const ordersFile = await readJSON<{ orders: Order[] }>(ordersPath);
  let orders = (ordersFile?.orders ?? [])
    .filter((o) => o.partnerId === partnerId && o.propertyId === propertyId)
    .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));

  // Totals
  const totals = {
    orders: orders.length,
    gross: orders.reduce((s, o) => s + (Number(o.gross) || 0), 0),
  };

  // Services breakdown (by item.id)
  const servicesMap = new Map<string, number>();
  for (const o of orders) {
    for (const it of o.items || []) {
      const key = String(it.id ?? "Other");
      const line = (Number(it.qty) || 0) * (Number(it.price) || 0);
      servicesMap.set(key, (servicesMap.get(key) || 0) + line);
    }
  }
  const services = Array.from(servicesMap.entries()).map(([name, total]) => ({
    name,
    total,
  }));

  // Monthly breakdown YYYY-MM -> gross
  const salesByMonth: Record<string, number> = {};
  for (const o of orders) {
    const k = monthKey(o.createdAt);
    salesByMonth[k] = (salesByMonth[k] || 0) + (Number(o.gross) || 0);
  }

  // Recent orders (cap 25)
  const recent = orders.slice(0, 25);

  return NextResponse.json({
    partnerId,
    propertyId,
    name: displayName,
    totals,
    services,
    salesByMonth,
    recent,
  });
}
