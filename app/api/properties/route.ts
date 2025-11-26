// app/api/properties/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const partnerId = url.searchParams.get("partnerId") || undefined;
  const file = path.join(process.cwd(), "data", "properties.json");
  const raw = await fs.readFile(file, "utf8").catch(() => '{"properties":[]}');
  let { properties = [] } = JSON.parse(raw) as { properties: any[] };

  if (partnerId)
    properties = properties.filter((p) => p.partnerId === partnerId);
  return NextResponse.json({ properties });
}