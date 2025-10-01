// app/components/OfferCards.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  href: string;
  image: string; // e.g. "/cards/chairs-week.jpg"
  eyebrow?: string;
  blurb?: string;
};

export default function OfferCards({
  title,
  href,
  image,
  eyebrow,
  blurb,
}: Props) {
  return (
    <Link
      href={href}
      className="group relative block w-[320px] shrink-0 overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm ring-1 ring-black/[0.02] transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={image}
          alt={title}
          fill
          priority={false}
          sizes="(max-width: 768px) 80vw, 320px"
          className="object-cover"
        />
      </div>

      <div className="space-y-1 p-4">
        {eyebrow && (
          <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
            {eyebrow}
          </div>
        )}
        <div className="text-[16px] font-semibold text-slate-900">{title}</div>
        {blurb && (
          <div className="text-[13px] text-slate-600/90 leading-snug">
            {blurb}
          </div>
        )}

        <div className="pt-2 text-[13px] font-medium text-sky-900">
          View details <span aria-hidden>→</span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5" />
    </Link>
  );
}
