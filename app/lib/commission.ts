// app/lib/commission.ts

/** ---------- Public types used by API/UI ---------- */
export type PartnerSummary = {
    gross: number;
    eligible: number; // everything but chairs
    rate: number; // e.g., 0.05
    commission: number;
  };
  
  export type PartnerRow = {
    property: string;
    period: string; // "YYYY-MM"
    chairs?: number;
    bonfire?: number;
    photography?: number;
    other?: number;
    gross: number;
    eligible: number;
    commission: number;
  };
  
  export type PartnerAggregate = {
    lastUpdated: string;
    summary: PartnerSummary;
    rows: PartnerRow[];
  };
  
  /** ---------- Helpers ---------- */
  function toMoney(n: number | undefined) {
    return typeof n === "number" && Number.isFinite(n) ? n : 0;
  }
  
  function sum<T>(arr: T[], pick: (t: T) => number): number {
    return arr.reduce((s, t) => s + pick(t), 0);
  }
  
  /** compute row fields consistently */
  function buildRow(
    rate: number,
    data: Omit<PartnerRow, "gross" | "eligible" | "commission">
  ): PartnerRow {
    const chairs = toMoney(data.chairs);
    const bonfire = toMoney(data.bonfire);
    const photography = toMoney(data.photography);
    const other = toMoney(data.other);
  
    const gross = chairs + bonfire + photography + other;
    const eligible = bonfire + photography + other; // exclude chairs
    const commission = Math.round(eligible * rate);
  
    return {
      ...data,
      chairs,
      bonfire,
      photography,
      other,
      gross,
      eligible,
      commission,
    };
  }
  
  /** ---------- Demo data so pages render now ---------- */
  const DEFAULT_RATE_BY_PARTNER: Record<string, number> = {
    "aqua-vista": 0.05,
    "30a-escapes": 0.05,
  };
  
  const DEMO_ROWS_BY_PARTNER: Record<
    string,
    Array<Omit<PartnerRow, "gross" | "eligible" | "commission">>
  > = {
    "aqua-vista": [
      {
        property: "Aqua Vista (All Units)",
        period: "2025-10",
        chairs: 1800,
        bonfire: 900,
        photography: 450,
        other: 120,
      },
      {
        property: "Aqua Vista (All Units)",
        period: "2025-09",
        chairs: 1400,
        bonfire: 600,
        photography: 300,
        other: 80,
      },
    ],
    "30a-escapes": [
      {
        property: "Bella Vita",
        period: "2025-10",
        chairs: 1800,
        bonfire: 900,
        photography: 450,
        other: 120,
      },
      {
        property: "Sea Glass",
        period: "2025-09",
        chairs: 1400,
        bonfire: 600,
        photography: 300,
        other: 80,
      },
    ],
  };
  
  /** ---------- Main entry used by the API ---------- */
  export async function aggregateForPartner(
    partnerId: string
  ): Promise<PartnerAggregate> {
    const rate = DEFAULT_RATE_BY_PARTNER[partnerId] ?? 0.05;
    const seed = DEMO_ROWS_BY_PARTNER[partnerId] ?? [];
    const rows = seed.map((r) => buildRow(rate, r));
  
    const gross = sum(rows, (r) => r.gross);
    const eligible = sum(rows, (r) => r.eligible);
    const commission = Math.round(eligible * rate);
  
    return {
      lastUpdated: new Date().toISOString(),
      summary: { gross, eligible, rate, commission },
      rows,
    };
  }