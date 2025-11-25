"use client";

import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-testid="global-footer" className="mt-24">
      {/* Concierge Band */}
      <div className="bg-[#E9F4FA] border-t border-[#0170BF]/70">
        <div className="coastal-container flex flex-col items-start justify-between gap-4 py-7 sm:flex-row sm:items-center">
          <div>
            <div className="text-[11px] uppercase tracking-[0.15em] text-[#0170BF]/80">
              Concierge
            </div>
            <p className="mt-1 text-sm text-slate-700">
              Questions, special requests, or large groups? We’ll arrange it.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:8503121551"
              className="inline-flex items-center gap-2 rounded-full border border-[#0170BF]/30 bg-white px-4 py-2 text-sm font-medium text-[#0170BF] hover:bg-[#0170BF]/10 transition"
            >
              <PhoneIcon className="h-4 w-4" /> 850-312-1551
            </a>
            <Link
              href="/partners/login"
              className="inline-flex items-center gap-2 rounded-full bg-[#0170BF] px-5 py-2 text-sm font-semibold text-white hover:bg-[#026fc2e5] transition"
            >
              Build Your Week
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-[#005D9C] text-white">
        <div className="coastal-container py-14">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-5">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="text-[32px] font-extrabold tracking-tight">
                COASTAL
              </div>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white">
                Refined beach experiences on Florida’s Emerald Coast — discreet,
                unforgettable. Hospitality-first since 1985.
              </p>

              <div className="mt-5 flex items-center gap-3">
                <Social href="https://instagram.com" label="Instagram">
                  <InstagramIcon className="h-4 w-4" />
                </Social>
                <Social href="https://facebook.com" label="Facebook">
                  <FacebookIcon className="h-4 w-4" />
                </Social>
                <Social href="mailto:hello@coastalbeach.co" label="Email">
                  <MailIcon className="h-4 w-4" />
                </Social>
              </div>
            </div>

            <Stack title="Areas">
              <Nav href="/30a">30A / South Walton</Nav>
              <Nav href="/pcb">Panama City Beach</Nav>
              <Nav href="/destin">Destin</Nav>
            </Stack>

            <Stack title="Services">
              <Nav href="/30a/chairs">Chairs &amp; Umbrellas</Nav>
              <Nav href="/pcb/bonfires">Beach Bonfires</Nav>
              <Nav href="/pcb/photography">Family Photography</Nav>
              <Nav href="/30a/beach-better-box">Beach Better Box</Nav>
            </Stack>

            {/* Company + Partner Login pill (glassy/white, constrained width) */}
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
                Company
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                <Nav href="/about">About</Nav>
                <Nav href="/jobs">Jobs</Nav>
                <Nav href="/suite">Build Your Week</Nav>
                <Nav href="/conditions">Beach Conditions</Nav>
              </ul>

              {/* Partner Login (updated) */}
              <div className="mt-4 justify-self-start">
                <Link
                  href="/partners/login"
                  className="inline-flex items-center rounded-full
                             bg-white/95 px-5 py-2.5 text-sm font-semibold text-sky-800
                             ring-1 ring-white/40 shadow-sm
                             hover:bg-white hover:shadow-md hover:ring-sky-100/60
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300
                             transition"
                >
                  Partner Login
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/15">
          <div className="coastal-container flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center">
            <p className="text-xs text-white/80">
              © {year} Coastal Beach Company. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/80">
              <Link href="/terms" className="hover:underline">
                Terms
              </Link>
              <span className="text-white/40">•</span>
              <Link href="/privacy" className="hover:underline">
                Privacy
              </Link>
              <span className="text-white/40">•</span>
              <span className="italic">Crafted on the Emerald Coast</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────── Utility Components ─────────── */

function Stack({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
        {title}
      </h3>
      <ul className="mt-3 space-y-2 text-sm">{children}</ul>
    </div>
  );
}

function Nav({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-white/90 hover:text-white hover:underline underline-offset-4 transition"
      >
        {children}
      </Link>
    </li>
  );
}

function Social({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition"
    >
      {children}
    </a>
  );
}

/* ─────────── Icons ─────────── */

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M3 5c0-1.1.9-2 2-2h2c.8 0 1.5.5 1.8 1.2l1 2.4c.3.8.1 1.7-.5 2.3l-1.1 1.1c1.3 2.5 3.4 4.6 5.9 5.9l1.1-1.1c.6-.6 1.5-.8 2.3-.5l2.4 1c.7.3 1.2 1 1.2 1.8v2c0 1.1-.9 2-2 2h-1C10.6 21 3 13.4 3 4v1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="17" cy="7" r="1.2" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h2.5l.5-3H14V9Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-11Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
