// app/api/partners/[partnerId]/properties/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

type AnyProp = {
  id: string;
  name?: string;
  partnerId?: string;
  type?: string;
  market?: string;
  zone?: string;
};

async function readJson<T = unknown>(p: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(p, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// Normalize different file shapes (array or {properties|homes:[]})
function coerceProps(input: any): AnyProp[] {
  if (!input) return [];
  if (Array.isArray(input)) return input as AnyProp[];
  if (Array.isArray(input?.properties)) return input.properties as AnyProp[];
  if (Array.isArray(input?.homes)) return input.homes as AnyProp[];
  return [];
}

export async function GET(
  _req: Request,
  { params }: { params: { partnerId: string } }
) {
  const partnerId = decodeURIComponent(params.partnerId);

  // Look for any of these sources you mentioned
  const dataDir = path.join(process.cwd(), "app", "data");
  const candidates = [
    path.join(dataDir, "properties.json"),
    path.join(dataDir, "30a-homes.json"),
    path.join(dataDir, "pcb-condos.json"),
  ];

  let all: AnyProp[] = [];
  for (const p of candidates) {
    const j = await readJson<any>(p);
    all = all.concat(coerceProps(j));
  }

  // Filter for this partner
  const props = all.filter(
    (p) => (p.partnerId || "").toLowerCase() === partnerId.toLowerCase()
  );

  // Minimal response (stable fields)
  const payload = {
    partnerId,
    properties: props.map((p) => ({
      id: p.id,
      name: p.name ?? p.id,
      type: p.type ?? "home",
      market: p.market ?? null,
      zone: p.zone ?? null,
    })),
    count: props.length,
  };

  return NextResponse.json(payload);
}