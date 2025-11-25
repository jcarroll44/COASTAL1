"use client";

/**
 * Watches the Suite page inputs and saves a compact context to localStorage.
 * No UI, no layout changes.
 * Keys it saves: { market, partnerId, propertyId, start, end, qty }
 */
import { useEffect } from "react";

type Props = {
  market: "pcb" | "30a";
  // how to resolve the property & partner from the current Suite page
  // for PCB suites: both are the selected condo slug (from #condoSelect)
  // for 30A suites: property = selected access, partner = "coastal-public"
  mode: "pcb" | "30a";
};

export default function SuiteContextSync({ market, mode }: Props) {
  useEffect(() => {
    const read = (sel: string) => {
      const el = document.querySelector(sel) as
        | HTMLInputElement
        | HTMLElement
        | null;
      if (!el) return "";
      // @ts-ignore
      if ("value" in el && typeof (el as any).value !== "undefined")
        return String((el as any).value || "").trim();
      return (el.textContent || "").trim();
    };

    const save = () => {
      // Try both legacy & new ids; your Suite already uses these names in prior work
      const start = read("#startDate") || read('input[name="start"]');
      const end = read("#endDate") || read('input[name="end"]');
      const qty = read("#qty") || read('input[name="qty"]');

      let propertyId = "";
      let partnerId = "";

      if (mode === "pcb") {
        propertyId = read("#condoSelect") || read('select[name="condo"]');
        partnerId = propertyId; // PCB rule
      } else {
        propertyId = read("#accessSelect") || read('select[name="access"]');
        partnerId = "coastal-public"; // 30A rule
      }

      const ctx = {
        market,
        partnerId,
        propertyId,
        start,
        end,
        qty: qty ? Number(qty) || 0 : 0,
        savedAt: Date.now(),
      };

      try {
        localStorage.setItem("coastal:suite", JSON.stringify(ctx));
        // console.debug("Saved suite ctx", ctx);
      } catch {}
    };

    // Save immediately and on common user interactions
    save();
    const handler = () => save();
    document.addEventListener("change", handler, true);
    document.addEventListener("input", handler, true);
    document.addEventListener("click", handler, true);

    return () => {
      document.removeEventListener("change", handler, true);
      document.removeEventListener("input", handler, true);
      document.removeEventListener("click", handler, true);
    };
  }, [market, mode]);

  return null;
}