"use client";

import OrderBridge from "./OrderBridge";
import { useParams } from "next/navigation";

export default function OrderBridge30A() {
  // /30a/[slug]/amenity-suite → slug is the public access id
  const p = useParams() as { slug?: string };
  const access = (p?.slug || "").toString();

  return (
    <OrderBridge
      buttonSelector="#confirmPay"
      selectors={{
        start: "#startDate",
        end: "#endDate",
        qty: "#qty",
        location: "#accessSelect",
      }}
      market="30a"
      resolveRoute={() => ({ partnerId: "coastal-public", propertyId: access })}
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