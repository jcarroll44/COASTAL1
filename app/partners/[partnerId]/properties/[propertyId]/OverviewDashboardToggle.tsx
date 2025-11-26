"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

// tiny helper to join classes without clsx
function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function OverviewDashboardToggle() {
  const params = useSearchParams();
  const pathname = usePathname();
  const raw = params.get("view");
  const view = (raw ? String(raw) : "overview").toLowerCase();

  const mkHref = (v: "overview" | "dashboard") => {
    const sp = new URLSearchParams(params.toString());
    if (v === "overview") sp.delete("view");
    else sp.set("view", "dashboard");
    const q = sp.toString();
    return q ? `${pathname}?${q}` : pathname;
  };

  return (
    <div className="mt-6 flex justify-center">
      <div className="inline-flex items-center rounded-full bg-sky-50/70 p-1 ring-1 ring-sky-100/80 shadow-[inset_0_1px_0_rgba(255,255,255,.6)]">
        {(["overview", "dashboard"] as const).map((key) => {
          const active =
            view === key ||
            (key === "overview" && (view === "" || view === "overview"));
          return (
            <Link
              key={key}
              href={mkHref(key)}
              className={cx(
                "relative px-4 py-2 text-sm transition-all rounded-full",
                active
                  ? "bg-white text-sky-900 font-medium shadow-sm ring-1 ring-sky-200"
                  : "text-sky-700 hover:text-sky-900 hover:bg-white/60"
              )}
            >
              {key === "overview" ? "Overview" : "Dashboard"}
            </Link>
          );
        })}
      </div>
    </div>
  );
}