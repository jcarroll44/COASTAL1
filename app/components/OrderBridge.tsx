"use client";

/**
 * Invisible bridge that reads values from existing DOM elements
 * and posts an order to /api/orders when your target button is clicked.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type BuilderInput = {
  start?: string | null;
  end?: string | null;
  qty?: number | null;
  location?: string | null;
};

type Props = {
  buttonSelector: string;
  selectors?: {
    start?: string;
    end?: string;
    qty?: string;
    location?: string;
  };
  market: "pcb" | "30a";
  resolveRoute: () => { partnerId: string; propertyId: string };
  buildLines: (i: BuilderInput) => Array<any>;
  meta?: Record<string, any>;
  onStart?: () => void;
  onSuccess?: (orderId: string) => void;
  onError?: (message: string) => void;
};

export default function OrderBridge(props: Props) {
  const router = useRouter();

  useEffect(() => {
    const btn = document.querySelector(
      props.buttonSelector
    ) as HTMLElement | null;
    if (!btn) return;

    const readVal = (sel?: string) => {
      if (!sel) return null;
      const el = document.querySelector(sel) as
        | HTMLInputElement
        | HTMLElement
        | null;
      if (!el) return null;
      // @ts-ignore — handle inputs/selects first
      if ("value" in el && typeof (el as any).value !== "undefined")
        return String((el as any).value || "").trim();
      return (el.textContent || "").trim();
    };

    async function handleClick(ev: Event) {
      ev.preventDefault();
      ev.stopPropagation();

      props.onStart?.();

      try {
        const start = readVal(props.selectors?.start);
        const end = readVal(props.selectors?.end);
        const qtyStr = readVal(props.selectors?.qty);
        const loc = readVal(props.selectors?.location);
        const qty = qtyStr ? Number(qtyStr) || 0 : null;

        const lines = props.buildLines({ start, end, qty, location: loc });
        if (!lines.length)
          throw new Error("Please complete your selection before continuing.");

        const { partnerId, propertyId } = props.resolveRoute();

        const orderTotal =
          lines.reduce((sum, li: any) => sum + (Number(li.total) || 0), 0) || 0;

        const payload = {
          partnerId,
          propertyId,
          market: props.market,
          source: "suite",
          email: null,
          orderSummary: null,
          lineItems: normalizeLines(lines),
          orderTotal,
          status: "paid",
          meta: { location: loc || undefined, ...props.meta },
        };

        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Order failed.");

        props.onSuccess?.(data.id);
        router.push(
          `/thank-you?id=${encodeURIComponent(data.id)}&p=${encodeURIComponent(
            partnerId
          )}&r=${encodeURIComponent(propertyId)}`
        );
      } catch (err: any) {
        console.error(err);
        props.onError?.(err?.message || "Something went wrong.");
        alert(err?.message || "Something went wrong.");
      }
    }

    btn.addEventListener("click", handleClick);
    return () => btn.removeEventListener("click", handleClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

function normalizeLines(lines: Array<any>) {
  return lines.map((li) => {
    const amenity = (li.kind || li.amenity || "custom").toString();
    const qty = Number(li.qty ?? li.chairSets ?? 1) || 1;
    const total = Number(li.total ?? 0);
    const unitPrice = total && qty ? total / qty : undefined;

    const { kind, amenity: _a, ...rest } = li;
    return { amenity, qty, total, unitPrice, meta: rest };
  });
}