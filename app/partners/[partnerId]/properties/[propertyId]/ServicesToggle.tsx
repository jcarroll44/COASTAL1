"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function ServicesToggle() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = (searchParams.get("view") || "grid").toLowerCase();

  const to = (next: "grid" | "list") => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("view", next);
    return `${pathname}?${sp.toString()}`;
  };

  return (
    <div className="mb-6 flex justify-end">
      <div className="inline-flex items-center rounded-full border border-sky-100 bg-white p-1 shadow-sm">
        <Link
          href={to("grid")}
          className={[
            "px-3 py-1.5 rounded-full text-sm",
            view === "grid"
              ? "bg-sky-50 text-sky-800"
              : "text-sky-700 hover:bg-sky-50",
          ].join(" ")}
        >
          Grid
        </Link>
        <Link
          href={to("list")}
          className={[
            "px-3 py-1.5 rounded-full text-sm",
            view === "list"
              ? "bg-sky-50 text-sky-800"
              : "text-sky-700 hover:bg-sky-50",
          ].join(" ")}
        >
          List
        </Link>
      </div>
    </div>
  );
}
