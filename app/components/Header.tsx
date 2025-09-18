// app/components/Header.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between p-4 border-b bg-white">
        {/* Left: hamburger + logo + desktop nav */}
        <div className="flex items-center gap-6">
          {/* Hamburger (mobile only) */}
          <button
            aria-label="Open menu"
            className="md:hidden grid place-items-center h-9 w-9 rounded-md border border-slate-200"
            onClick={() => setOpen(true)}
          >
            {/* 3-line icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-slate-900"
          >
            COASTAL
          </Link>

          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-700">
            <Link href="/pcb" className="hover:text-slate-900">
              Panama City Beach
            </Link>
            <Link href="/30a" className="hover:text-slate-900">
              30A / South Walton
            </Link>
            <Link href="/about" className="hover:text-slate-900">
              About
            </Link>
          </nav>
        </div>

        {/* Right: phone + CTA (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:8503121551"
            className="px-3 py-1 rounded-full border text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            850-312-1551
          </a>
          <Link
            href="/suite"
            className="bg-brand text-white px-4 py-2 rounded-full text-sm font-semibold hover:brightness-95"
          >
            Build Your Week
          </Link>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute top-0 left-0 h-full w-72 bg-white shadow-lg flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-bold text-lg tracking-tight text-slate-900">
                COASTAL
              </span>
              <button
                aria-label="Close menu"
                className="grid place-items-center h-9 w-9 rounded-md border border-slate-200"
                onClick={() => setOpen(false)}
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

            {/* Drawer links (skinny lines between items) */}
            <nav className="flex flex-col text-base">
              <Link
                href="/30a"
                className="mobile-nav-link"
                onClick={() => setOpen(false)}
              >
                30A / South Walton
              </Link>
              <Link
                href="/pcb"
                className="mobile-nav-link"
                onClick={() => setOpen(false)}
              >
                Panama City Beach
              </Link>
              <Link
                href="/suite"
                className="mobile-nav-link"
                onClick={() => setOpen(false)}
              >
                Coastal – Build Your Week
              </Link>
              <Link
                href="/cams"
                className="mobile-nav-link"
                onClick={() => setOpen(false)}
              >
                Beach Cams
              </Link>
              <Link
                href="/conditions"
                className="mobile-nav-link"
                onClick={() => setOpen(false)}
              >
                Current Beach Conditions
              </Link>
              <Link
                href="/about"
                className="mobile-nav-link"
                onClick={() => setOpen(false)}
              >
                About Us
              </Link>
            </nav>

            {/* Bottom section (phone + CTA pinned at bottom) */}
            <div className="p-4 border-t space-y-3">
              <a href="tel:8503121551" className="mobile-nav-phone">
                850-312-1551
              </a>
              <Link
                href="/suite"
                className="mobile-nav-cta"
                onClick={() => setOpen(false)}
              >
                Build Your Week
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
