// app/api/partners/[partnerId]/orders/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { loadOrders } from "@/lib/commission";

type Ctx = { params: { partnerId: string } };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const all = loadOrders();
    const items = all.filter((o) => o.partnerId === params.partnerId);
    return NextResponse.json(items, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed" },
      { status: 500 }
    );
  }
}
