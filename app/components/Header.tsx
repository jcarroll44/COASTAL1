"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import AppMenu from "./AppMenu";
import NavDropdown from "./NavDropdown";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-colors ${
          scrolled
            ? "bg-white/70 backdrop-blur-md shadow-sm"
            : "bg-white/90 supports-[backdrop-filter]:bg-white/70"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 h-[68px] grid grid-cols-[auto,1fr,auto] items-center gap-6">
          {/* LEFT: Hamburger + Wordmark */}
          <div className="flex items-center gap-5">
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-[12px] border border-slate-200 bg-white hover:bg-slate-50 shadow-sm"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <Link
              href="/"
              className="select-none font-black tracking-tight text-[36px] leading-none text-sky-600"
            >
              COASTAL
            </Link>
          </div>

          {/* CENTER NAV */}
          <nav className="hidden md:flex items-center justify-center gap-12 text-[15px] font-medium">
            <NavDropdown
              label={<Link href="/pcb">Panama City Beach</Link>}
              items={[
                { label: "Chairs & Umbrellas", href: "/pcb/chairs" },
                { label: "Watersports", href: "/pcb/water-sports" },
                { label: "Beach Bonfires", href: "/pcb/bonfires" },
                { label: "Family Photography", href: "/pcb/photography" },
              ]}
            />

            <NavDropdown
              label={<Link href="/30a">30A / South Walton</Link>}
              items={[
                { label: "Chairs & Umbrellas", href: "/30a/chairs" },
                { label: "Beach Bonfires", href: "/30a/bonfires" },
                { label: "Family Photography", href: "/30a/photography" },
                { label: "Beach Better Box", href: "/30a/beach-better-box" },
              ]}
            />

            <Link href="/about" className="text-slate-700 hover:text-slate-900">
              About
            </Link>

            {/* NEW: Jobs link */}
            <Link href="/jobs" className="text-slate-700 hover:text-slate-900">
              Jobs
            </Link>
          </nav>

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:8503121551"
              className="inline-flex h-11 items-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              850-312-1551
            </a>
            <Link
              href="/suite"
              className="inline-flex h-10 items-center rounded-full bg-sky-600 px-5 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(2,132,199,0.28)] hover:bg-sky-800"
            >
              Build Your Week
            </Link>
          </div>
        </div>
      </header>

      {/* Drawer unchanged */}
      <AppMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
