// app/components/ServiceCard.tsx
"use client";

import Image from "next/image";
import { useState, useId } from "react";
import SelectLocationModal from "./SelectLocationModal";
import { useItinerary } from "./Itinerary";

type Props = {
  title: string;
  image: string;
  desc?: string;
  price: number; // base unit price
};

export default function ServiceCard({ title, image, desc, price }: Props) {
  const [open, setOpen] = useState(false);
  const { addItem } = useItinerary();
  const id = useId();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <Image
        src={image}
        alt={title}
        width={1200}
        height={800}
        className="h-56 w-full object-cover"
      />
      <div className="p-5">
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <div className="text-sm font-medium text-slate-700">
            ${price.toFixed(2)}
          </div>
        </div>
        {desc && <p className="mt-2 text-sm text-slate-600">{desc}</p>}
        <button
          className="mt-4 rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
          onClick={() => setOpen(true)}
        >
          Include
        </button>
      </div>

      <SelectLocationModal
        open={open}
        onClose={() => setOpen(false)}
        title={`Add ${title}`}
        onConfirm={({ market, qty }) =>
          addItem({
            id: `${id}-${market}`,
            title,
            market,
            qty,
            price,
          })
        }
      />
    </div>
  );
}