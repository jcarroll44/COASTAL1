"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AppMenu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Hamburger (tight bars), fixed top-left */}
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-[60] grid h-10 w-10 place-items-center rounded-xl bg-white shadow-md ring-1 ring-sky-200/80 hover:bg-white/90"
      >
        <div className="space-y-[3px]">
          <span className="block h-[2px] w-5 bg-sky-900" />
          <span className="block h-[2px] w-5 bg-sky-900" />
          <span className="block h-[2px] w-5 bg-sky-900" />
        </div>
      </button>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-[60]">
          {/* Backdrop */}
          <button
            aria-label="Close menu"
            onClick={close}
            className="absolute inset-0 bg-black/30"
          />

          {/* Panel */}
          <aside
            className="absolute left-0 top-0 flex h-full w-[340px] max-w-[85vw] flex-col bg-white shadow-2xl ring-1 ring-sky-200
                       translate-x-0 transition-transform duration-300 will-change-transform"
          >
            {/* Header row */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-sky-100">
              <div className="text-[12px] font-semibold tracking-wide text-sky-700">
                MENU
              </div>
              <button
                onClick={close}
                aria-label="Close"
                className="rounded p-1 text-sky-900 hover:bg-sky-50"
              >
                ✕
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 overflow-y-auto">
              {[
                { href: "/30a", label: "30A / South Walton" },
                { href: "/pcb", label: "Panama City Beach" },
                { href: "/suite", label: "Coastal – Build Your Week" },
                {
                  href: "https://sowal.com/live-webcams",
                  label: "Beach Cams",
                  external: true,
                },
                {
                  href: "https://www.swfd.org/",
                  label: "Current Beach Conditions",
                  external: true,
                },
                { href: "/about", label: "About Us" },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className="border-b border-sky-100/80 last:border-0"
                >
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={close}
                      className="block px-5 py-4 text-[16px] font-medium text-sky-900 hover:bg-sky-50"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={close}
                      className="block px-5 py-4 text-[16px] font-medium text-sky-900 hover:bg-sky-50"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Footer pinned bottom */}
            <div className="border-t border-sky-100 px-5 py-4 text-[12px] text-sky-700/75">
              © {new Date().getFullYear()} Coastal Beach Company
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
