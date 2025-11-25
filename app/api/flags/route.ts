// app/api/flags/route.ts
import { NextResponse } from "next/server";
import type { FlagRecord } from "./_util";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export async function GET() {
  const [swfdRes, pcbRes] = await Promise.allSettled([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/flags/swfd`, {
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/flags/pcb`, {
      cache: "no-store",
    }),
  ]);

  const items: FlagRecord[] = [];

  if (swfdRes.status === "fulfilled") {
    items.push(await swfdRes.value.json());
  }
  if (pcbRes.status === "fulfilled") {
    items.push(await pcbRes.value.json());
  }

  return NextResponse.json({ items }, { status: 200 });
}