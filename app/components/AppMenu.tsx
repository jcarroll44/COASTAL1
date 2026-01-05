"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

type Props = { open: boolean; onClose: () => void };

const NAV = [
  { label: "30A / South Walton", href: "/30a" },
  { label: "Panama City Beach", href: "/pcb" },
  { label: "Coastal – Build Your Week", href: "/suite" },
  { label: "Beach Cams", href: "/beach-cams" },
  { label: "Current Beach Conditions", href: "/conditions" },
  { label: "About Us", href: "/about" },
];

export default function AppMenu({ open, onClose }: Props) {
  const pathname = usePathname();

  // close on ESC + lock scroll while open
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);

    const el = document.documentElement;
    const prev = el.style.overflow;
    el.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      el.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200]" // <— higher than your header/logo
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Panel */}
      <div
        className="absolute left-0 top-0 z-[210] h-full w-[320px] max-w-[85%] bg-white shadow-2xl ring-1 ring-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <span className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
            Menu
          </span>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="grid place-items-center h-9 w-9 rounded-md border border-slate-200 hover:bg-slate-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M18 6l-12 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto py-2">
          <ul className="px-2">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={[
                      "group flex items-center justify-between rounded-xl px-3 py-3",
                      "hover:bg-sky-50 transition-colors",
                      active ? "bg-sky-50/70" : "",
                    ].join(" ")}
                    onClick={onClose}
                  >
                    <span
                      className={[
                        "text-[15px]",
                        active
                          ? "text-sky-900 font-semibold"
                          : "text-slate-800",
                      ].join(" ")}
                    >
                      {item.label}
                    </span>
                    <svg
                      className="h-4 w-4 text-slate-400 group-hover:text-sky-500 transition-transform group-hover:translate-x-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom actions */}
        <div className="border-t p-4 space-y-3">
          <a
            href="tel:8503121551"
            className="w-full h-11 grid place-items-center rounded-xl border text-[15px] font-medium text-slate-800 hover:bg-slate-50"
          >
            850-312-1551
          </a>
          <Link
            href="/suite"
            onClick={onClose}
            className="w-full h-11 grid place-items-center rounded-xl bg-sky-900 text-white text-[15px] font-semibold hover:bg-sky-950"
          >
            Build Your Week
          </Link>
        </div>
      </div>
    </div>
  );
}
