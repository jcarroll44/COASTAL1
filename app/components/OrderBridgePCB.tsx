"use client";

import OrderBridge from "./OrderBridge";
import { useParams } from "next/navigation";

export default function OrderBridgePCB() {
  // /pcb/[slug]/amenity-suite → slug is the condo id
  const p = useParams() as { slug?: string };
  const condo = (p?.slug || "").toString();

  return (
    <OrderBridge
      buttonSelector="#confirmPay"
      selectors={{
        start: "#startDate",
        end: "#endDate",
        qty: "#qty",
        location: "#condoSelect",
      }}
      market="pcb"
      // These two are now defined on the CLIENT (allowed)
      resolveRoute={() => ({ partnerId: condo, propertyId: condo })}
      buildLines={({ start, end, qty }) => {
        const out: any[] = [];
        if (start && end && qty) {
          out.push({
            kind: "chairs",
            chairSets: qty,
            startDate: start,
            endDate: end,
          });
        }
        return out;
      }}
    />
  );
}