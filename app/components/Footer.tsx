// app/components/Footer.tsx
"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer
      data-testid="global-footer"
      className="bg-sky-950 text-white pt-16 pb-10 mt-20"
    >
      <div className="coastal-container grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">COASTAL</h2>
          <p className="mt-3 text-sm text-sky-200/90 leading-relaxed max-w-xs">
            Crafted beach experiences on Florida’s Emerald Coast — refined,
            discreet, unforgettable.
          </p>
        </div>

        {/* Areas */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-sky-300">
            Areas
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/30a" className="hover:text-sky-200">
                30A / South Walton
              </Link>
            </li>
            <li>
              <Link href="/pcb" className="hover:text-sky-200">
                Panama City Beach
              </Link>
            </li>
            <li>
              <Link href="/destin" className="hover:text-sky-200">
                Destin
              </Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-sky-300">
            Services
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/30a/chairs" className="hover:text-sky-200">
                Chairs & Umbrellas
              </Link>
            </li>
            <li>
              <Link href="/pcb/bonfires" className="hover:text-sky-200">
                Beach Bonfires
              </Link>
            </li>
            <li>
              <Link href="/pcb/photography" className="hover:text-sky-200">
                Family Photography
              </Link>
            </li>
            <li>
              <Link href="/30a/beachbox" className="hover:text-sky-200">
                Beach Better Box
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-sky-300">
            Company
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-sky-200">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/suite" className="hover:text-sky-200">
                Build Your Week
              </Link>
            </li>
            <li>
              <Link href="/conditions" className="hover:text-sky-200">
                Beach Conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="coastal-container mt-14 border-t border-sky-800/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-xs text-sky-300">
          © {new Date().getFullYear()} Coastal Beach Company · All Rights
          Reserved
        </p>
        <p className="text-xs italic text-sky-400">
          Crafted with care on the Emerald Coast
        </p>
      </div>
    </footer>
  );
}
