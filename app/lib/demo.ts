// app/lib/demo.ts

export type PropertyMetrics = {
    partnerId: string;
    propertyId: string;
    name: string;
    breakdown: {
      chairs: number;
      bonfire: number;
      photography: number;
      other: number;
    };
  };
  
  const round = (n: number) => Math.round(n);
  
  export const DEMO_PROPERTIES: Record<
    string,
    Record<string, PropertyMetrics>
  > = {
    // 30A Escapes portfolio
    "30a-escapes": {
      "bella-vita": {
        partnerId: "30a-escapes",
        propertyId: "bella-vita",
        name: "Bella Vita",
        breakdown: {
          chairs: 18000,
          bonfire: 6500,
          photography: 2100,
          other: 1400,
        },
      },
      // add more 30A homes here as needed…
    },
    // Aqua Vista portfolio (as an example condo)
    "aqua-vista": {
      "aqua-vista": {
        partnerId: "aqua-vista",
        propertyId: "aqua-vista",
        name: "Aqua Vista",
        breakdown: {
          chairs: 22500,
          bonfire: 3200,
          photography: 900,
          other: 600,
        },
      },
    },
  };
  
  export function getPropertyMetrics(partnerId: string, propertyId: string) {
    const prop = DEMO_PROPERTIES[partnerId]?.[propertyId];
    if (!prop) return null;
  
    const { chairs, bonfire, photography, other } = prop.breakdown;
    const gross = chairs + bonfire + photography + other;
    const eligible = bonfire + photography + other; // commissionable
    const commission = round(eligible * 0.05);
  
    return {
      name: prop.name,
      partnerId,
      propertyId,
      totals: { gross, eligible, commission },
      breakdown: { chairs, bonfire, photography, other },
    };
  }