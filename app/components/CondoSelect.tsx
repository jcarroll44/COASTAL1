"use client";

import * as React from "react";
import type { LocationOption } from "@/data/locations";

export default function CondoSelect({
  options,
  value,
  onChange,
  placeholder = "Select your condo",
  id = "condo",
}: {
  options: LocationOption[];
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  id?: string;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full rounded-xl border border-sky-200 bg-white px-3 text-[14px] outline-none focus:ring-2 focus:ring-sky-200"
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
