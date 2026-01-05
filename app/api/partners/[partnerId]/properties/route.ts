// app/api/partners/[partnerId]/properties/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

/** Safe JSON reader. Returns [] on any issue. */
async function readJsonArray<T = any>(rel: string): Promise<T[]> {
  try {
    const p = path.join(process.cwd(), "app", "data", rel);
    const raw = await fs.readFile(p, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as T[];
    if (Array.isArray(parsed?.data)) return parsed.data as T[];
    if (Array.isArray(parsed?.properties)) return parsed.properties as T[];
    return [];
  } catch {
    return [];
  }
}

/** Slugify helper (for id fallback). */
function slugify(s: string) {
  return String(s || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type ApiProperty = {
  id: string;
  name: string;
  type: "home" | "condo" | "access";
  partnerId: string;
  market?: "30a" | "pcb";
  zone?: string;
};

/**
 * GET /api/partners/:partnerId/properties
 *
 * - For 30A Escapes, we adapt your existing app/data/30a-homes.json
 *   (shape with "Home Name", "Slug", "PM Company", etc.)
 * - For other partners, we also look into app/data/properties.json if present.
 */
export async function GET(
  _req: Request,
  { params }: { params: { partnerId: string } }
) {
  const partnerId = decodeURIComponent(params.partnerId);

  // Always try the generic properties list if present
  const generic: any[] = await readJsonArray("properties.json");

  // Special adapter: 30A Escapes uses the big list you already maintain
  let adaptedFrom30aHomes: ApiProperty[] = [];
  if (partnerId === "30a-escapes") {
    const homes = await readJsonArray<any>("30a-homes.json");
    adaptedFrom30aHomes = homes
      .filter((h) =>
        String(h["PM Company"] || "")
          .toLowerCase()
          .includes("30a escapes")
      )
      .map<ApiProperty>((h) => {
        const homeName = h["Home Name"] || h.name || h.title || "Home";
        const id = slugify(h["Slug"] || homeName);
        return {
          id,
          name: homeName.includes("30A Escapes")
            ? homeName
            : `${homeName} (30A Escapes)`,
          type: "home",
          partnerId: "30a-escapes",
          market: "30a",
        };
      });
  }

  // Merge any generic entries for this partner too (if your properties.json has them)
  const adaptedFromGeneric: ApiProperty[] = generic
    .filter(
      (p) => (p?.partnerId || "").toLowerCase() === partnerId.toLowerCase()
    )
    .map((p) => ({
      id: p.id || slugify(p.slug || p.name),
      name: p.name,
      type: (p.type as ApiProperty["type"]) || "home",
      partnerId: p.partnerId,
      market: p.market,
      zone: p.zone,
    }));

  // Combine, de-dupe by id, sort by name
  const map = new Map<string, ApiProperty>();
  for (const r of [...adaptedFrom30aHomes, ...adaptedFromGeneric]) {
    if (!map.has(r.id)) map.set(r.id, r);
  }
  const properties = Array.from(map.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return NextResponse.json({
    partnerId,
    count: properties.length,
    properties,
  });
}