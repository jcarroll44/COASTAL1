"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight } from "lucide-react";

/* ---------- Hover menu helper (prevents flicker) ---------- */
function useHoverDelay() {
  const [openKey, setOpenKey] = useState<null | "pcb" | "30a">(null);
  const timer = useRef<number | null>(null);

  const open = (key: "pcb" | "30a") => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    setOpenKey(key);
  };

  const scheduleClose = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpenKey(null), 140);
  };

  return { openKey, open, scheduleClose };
}

/* ----------------------------- Header ----------------------------- */
export default function SiteHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  /* Lock scroll when drawer is open */
  useEffect(() => {
    const body = document.body;
    if (drawerOpen) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "";
    }
    return () => {
      body.style.overflow = "";
    };
  }, [drawerOpen]);

  /* Close on route change */
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  /* Close on ESC */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75 border-b border-slate-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            {/* Hamburger */}
            <button
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-sky-100 bg-white text-sky-900 ring-1 ring-sky-100/60 hover:bg-sky-50 transition"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link
              href="/"
              className="select-none text-4xl font-extrabold tracking-tight text-sky-600"
            >
              COASTAL
            </Link>
          </div>

          {/* Desktop nav with hover menus */}
          <nav className="relative hidden items-center gap-6 md:flex">
            <HoverMenus />
            <Link
              href="/about"
              className="text-sm text-slate-600 hover:text-sky-700"
            >
              About
            </Link>
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:8503121551"
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              850-312-1551
            </a>
            <Link
              href="/suite"
              className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-950"
            >
              Build Your Week
            </Link>
          </div>
        </div>
      </header>

      {/* -------- Overlay (click to close) -------- */}
      <div
        aria-hidden={!drawerOpen}
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-40 bg-slate-900/40 transition-opacity duration-300 ${
          drawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* -------- Left Drawer -------- */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`fixed left-0 top-0 z-50 h-full w-[360px] max-w-[90vw] border-r border-slate-100 bg-white shadow-2xl
          transition-transform duration-300 ease-out
          ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header row inside drawer */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <span className="text-xs font-semibold tracking-[0.18em] text-slate-500">
            MENU
          </span>
          <button
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer content */}
        <div className="flex h-[calc(100%-56px)] flex-col">
          <nav className="flex-1 overflow-auto px-1 py-2">
            <DrawerLink href="/30a">30A / South Walton</DrawerLink>
            <DrawerLink href="/pcb">Panama City Beach</DrawerLink>
            <DrawerLink href="/suite">Coastal – Build Your Week</DrawerLink>
            <DrawerLink href="https://sowal.com/live-webcams" external>
              Beach Cams
            </DrawerLink>
            <DrawerLink href="https://30a.com/beachflag/" external>
              Current Beach Conditions
            </DrawerLink>
            <DrawerLink href="/about">About Us</DrawerLink>
          </nav>

          <div className="mt-auto border-t border-slate-100 px-5 py-4">
            <p className="text-xs text-slate-500">
              © 2025 Coastal Beach Company
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ------------------------ Hover Menus (desktop) ------------------------ */
function HoverMenus() {
  const { openKey, open, scheduleClose } = useHoverDelay();

  return (
    <div className="relative flex items-center gap-6">
      {/* PCB */}
      <div
        className="relative"
        onMouseEnter={() => open("pcb")}
        onMouseLeave={scheduleClose}
      >
        <button
          className={`text-sm ${
            openKey === "pcb" ? "text-sky-800" : "text-slate-600"
          } hover:text-sky-700`}
          aria-expanded={openKey === "pcb"}
        >
          Panama City Beach
        </button>
        <div
          className={`absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-sky-100 bg-white shadow-xl
            transition-all duration-200 ${
              openKey === "pcb"
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-1 opacity-0"
            }`}
        >
          <ul className="py-1">
            <MenuItem href="/pcb/chairs" label="PCB Chairs & Umbrellas" />
            <MenuItem href="/pcb/bonfires" label="Beach Bonfires" />
            <MenuItem href="/pcb/photography" label="Family Photography" />
            <MenuItem href="/pcb/water-sports" label="Watersports" />
          </ul>
        </div>
      </div>

      {/* 30A */}
      <div
        className="relative"
        onMouseEnter={() => open("30a")}
        onMouseLeave={scheduleClose}
      >
        <button
          className={`text-sm ${
            openKey === "30a" ? "text-sky-800" : "text-slate-600"
          } hover:text-sky-700`}
          aria-expanded={openKey === "30a"}
        >
          30A / South Walton
        </button>
        <div
          className={`absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-sky-100 bg-white shadow-xl
            transition-all duration-200 ${
              openKey === "30a"
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-1 opacity-0"
            }`}
        >
          <ul className="py-1">
            <MenuItem href="/30a/chairs" label="30A Chairs & Umbrellas" />
            <MenuItem href="/30a/bonfires" label="Beach Bonfires" />
            <MenuItem href="/30a/better-box" label="Beach Better Box" />
            <MenuItem href="/30a/photography" label="Family Photography" />
          </ul>
        </div>
      </div>
    </div>
  );
}

function MenuItem({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="block px-3 py-2 text-[14px] text-slate-800 hover:bg-sky-50"
      >
        {label}
      </Link>
    </li>
  );
}

/* ---------------------------- Drawer link ---------------------------- */
function DrawerLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const content = (
    <span className="flex w-full items-center justify-between">
      <span>{children}</span>
      <ChevronRight className="h-4 w-4 text-slate-300" />
    </span>
  );

  const base =
    "group flex w-full items-center rounded-xl px-4 py-4 text-[15px] font-medium text-slate-800 hover:bg-sky-50";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={base}>
      {content}
    </Link>
  );
}
