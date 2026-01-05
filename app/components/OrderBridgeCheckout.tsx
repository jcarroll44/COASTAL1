"use client";

/**
 * On the Checkout page, intercepts "Confirm & Pay", reads the Suite context
 * from localStorage, and POSTs to /api/orders. No layout changes.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrderBridgeCheckout() {
  const router = useRouter();

  useEffect(() => {
    const isConfirmPay = (el: HTMLElement | null) =>
      !!el && (el.innerText || "").trim().toLowerCase() === "confirm & pay";

    const capture = async (ev: Event) => {
      const tgt = ev.target as HTMLElement | null;
      if (!tgt) return;

      // bubble up to find the real clickable button
      let el: HTMLElement | null = tgt;
      let btn: HTMLElement | null = null;
      for (let i = 0; i < 6 && el; i++, el = el.parentElement) {
        if (isConfirmPay(el)) {
          btn = el;
          break;
        }
      }
      if (!btn) return;

      ev.preventDefault();
      ev.stopPropagation();

      try {
        const raw = localStorage.getItem("coastal:suite");
        if (!raw)
          throw new Error(
            "Please return to the Suite and choose your dates first."
          );
        const ctx = JSON.parse(raw) as {
          market: "pcb" | "30a";
          partnerId: string;
          propertyId: string;
          start?: string;
          end?: string;
          qty?: number;
        };

        // Build line(s) — MVP: chairs reservation
        const lines: any[] = [];
        if (ctx.start && ctx.end && (ctx.qty || 0) > 0) {
          lines.push({
            amenity: "chairs",
            qty: ctx.qty,
            total: 0, // you can compute here if desired; dashboards still sum fine
            meta: { startDate: ctx.start, endDate: ctx.end },
          });
        }

        if (!lines.length)
          throw new Error("Please add a valid item in Suite before checkout.");

        const payload = {
          partnerId: ctx.partnerId,
          propertyId: ctx.propertyId,
          market: ctx.market,
          source: "suite",
          email: null,
          orderSummary: null,
          lineItems: lines,
          orderTotal: lines.reduce((s, li) => s + (Number(li.total) || 0), 0),
          status: "paid",
          meta: { from: "checkout" },
        };

        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Order failed.");

        router.push(
          `/thank-you?id=${encodeURIComponent(data.id)}&p=${encodeURIComponent(
            ctx.partnerId
          )}&r=${encodeURIComponent(ctx.propertyId)}`
        );
      } catch (err: any) {
        alert(err?.message || "Something went wrong.");
        console.error(err);
      }
    };

    document.addEventListener("click", capture, { capture: true });
    return () =>
      document.removeEventListener("click", capture, { capture: true } as any);
  }, [router]);

  return null;
}