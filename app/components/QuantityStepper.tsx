// app/components/QuantityStepper.tsx
"use client";

type Props = {
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
};

export default function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
}: Props) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-2 py-1">
      <button
        onClick={dec}
        className="h-8 w-8 rounded-lg border bg-white text-slate-700 hover:bg-slate-50"
      >
        −
      </button>
      <span className="w-6 text-center text-sm font-medium text-slate-900">
        {value}
      </span>
      <button
        onClick={inc}
        className="h-8 w-8 rounded-lg border bg-white text-slate-700 hover:bg-slate-50"
      >
        +
      </button>
    </div>
  );
}
