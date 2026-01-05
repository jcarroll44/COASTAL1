"use client";
import { useState } from "react";

export type AccordionSection = {
  id: string;
  title: string;
  content: React.ReactNode;
};

export default function Accordion({
  sections,
}: {
  sections: AccordionSection[];
}) {
  const [open, setOpen] = useState<string | null>(sections[0]?.id ?? null);
  return (
    <div className="mt-6 rounded-2xl border border-sky-100 bg-white">
      {sections.map((s, i) => (
        <div key={s.id} className={i ? "border-t border-sky-100" : ""}>
          <button
            className="w-full flex items-center justify-between px-4 py-3 text-sky-900"
            onClick={() => setOpen(open === s.id ? null : s.id)}
          >
            <span className="font-semibold">{s.title}</span>
            <span className="text-sky-600">{open === s.id ? "−" : "+"}</span>
          </button>
          {open === s.id && (
            <div className="px-4 pb-4 text-sky-700 text-sm">{s.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}