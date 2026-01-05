import { NextResponse } from "next/server";
import { aggregateForPartner } from "@/lib/commission";

export async function GET(
  _req: Request,
  { params }: { params: { partnerId: string } }
) {
  const data = await aggregateForPartner(params.partnerId);
  const header = [
    "Property",
    "Period",
    "Chairs",
    "Bonfire",
    "Photography",
    "Other",
    "Gross",
    "Eligible",
    "Commission",
  ];
  const lines = data.rows.map((r) =>
    [
      r.property,
      r.period,
      r.chairs ?? 0,
      r.bonfire ?? 0,
      r.photography ?? 0,
      r.other ?? 0,
      r.gross,
      r.eligible,
      r.commission,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [header.join(","), ...lines].join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${params.partnerId}-report.csv"`,
    },
  });
}