"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function PropertyViewToggle() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = (searchParams.get("view") || "dashboard").toLowerCase();

  function href(nextView: "overview" | "dashboard") {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("view", nextView);
    return `${pathname}?${sp.toString()}`;
  }

  return (
    <div className="mb-6 flex justify-end">
      <div className="inline-flex items-center rounded-full border border-sky-100 bg-white p-1 shadow-sm">
        <Link
          href={href("overview")}
          className={[
            "px-3 py-1.5 rounded-full text-sm",
            view === "overview"
              ? "bg-sky-50 text-sky-800"
              : "text-sky-700 hover:bg-sky-50",
          ].join(" ")}
        >
          Overview
        </Link>
        <Link
          href={href("dashboard")}
          className={[
            "px-3 py-1.5 rounded-full text-sm",
            view === "dashboard"
              ? "bg-sky-50 text-sky-800"
              : "text-sky-700 hover:bg-sky-50",
          ].join(" ")}
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}