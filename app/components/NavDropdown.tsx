// app/components/NavDropdown.tsx
"use client";

import Link from "next/link";
import { useRef, useState } from "react";

export default function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openNow = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  };

  // small delay prevents flicker when moving from trigger to panel
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  return (
    <div
      className="relative z-50"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
    >
      <button
        className={`px-1 py-2 text-slate-700 hover:text-sky-600 transition-colors ${
          open ? "text-sky-600" : ""
        }`}
      >
        {label}
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-2 w-60 rounded-xl bg-white/90 backdrop-blur-md shadow-xl ring-1 ring-black/5 pointer-events-auto"
          onMouseEnter={openNow}
          onMouseLeave={closeSoon}
        >
          <ul className="py-2">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block px-4 py-2 text-[15px] text-slate-700 hover:bg-sky-50 hover:text-sky-600 rounded-md transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
