// app/api/orders/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

type Order = {
  id: string;
  createdAt: string;
  market: "30a" | "pcb";
  partnerId: string;
  propertyId: string;
  startDate?: string;
  endDate?: string;
  items: Array<{ id: string; qty: number; price: number }>;
  gross: number;
  channel?: string; // e.g., "qr", "link", "direct"
};

const filePath = () => path.join(process.cwd(), "data", "orders.json");

async function readOrders(): Promise<{ orders: Order[] }> {
  try {
    return JSON.parse(await fs.readFile(filePath(), "utf8"));
  } catch {
    return { orders: [] };
  }
}
async function writeOrders(data: { orders: Order[] }) {
  await fs.mkdir(path.dirname(filePath()), { recursive: true });
  await fs.writeFile(filePath(), JSON.stringify(data, null, 2), "utf8");
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const market = url.searchParams.get("market");
  const partnerId = url.searchParams.get("partnerId");
  const propertyId = url.searchParams.get("propertyId");
  let { orders } = await readOrders();
  if (market) orders = orders.filter((o) => o.market === market);
  if (partnerId) orders = orders.filter((o) => o.partnerId === partnerId);
  if (propertyId) orders = orders.filter((o) => o.propertyId === propertyId);
  return NextResponse.json({ count: orders.length, orders });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const {
    market,
    partnerId,
    propertyId,
    startDate,
    endDate,
    items,
    gross,
    channel,
  } = body || {};
  if (
    !market ||
    !partnerId ||
    !propertyId ||
    !Array.isArray(items) ||
    typeof gross !== "number"
  ) {
    return NextResponse.json(
      { ok: false, error: "invalid_payload" },
      { status: 400 }
    );
  }
  const now = new Date().toISOString();
  const order: Order = {
    id: `ord_${Math.random().toString(36).slice(2, 10)}`,
    createdAt: now,
    market,
    partnerId,
    propertyId,
    startDate,
    endDate,
    items,
    gross,
    channel,
  };
  const data = await readOrders();
  data.orders.unshift(order);
  await writeOrders(data);
  return NextResponse.json({ ok: true, order }, { status: 201 });
}
