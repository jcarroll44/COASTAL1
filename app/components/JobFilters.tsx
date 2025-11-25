"use client";

import { useMemo } from "react";
import { JOBS } from "@/data/jobs";

type Props = {
  market: string;
  setMarket: (v: string) => void;
  dept: string;
  setDept: (v: string) => void;
  type: string;
  setType: (v: string) => void;
};

export default function JobFilters({
  market,
  setMarket,
  dept,
  setDept,
  type,
  setType,
}: Props) {
  const depts = useMemo(
    () => Array.from(new Set(JOBS.map((j) => j.department))),
    []
  );
  const types = useMemo(() => Array.from(new Set(JOBS.map((j) => j.type))), []);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        className="rounded-lg border border-sky-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
        value={market}
        onChange={(e) => setMarket(e.target.value)}
      >
        <option value="">All Markets</option>
        <option value="PCB">PCB</option>
        <option value="30A">30A</option>
      </select>
      <select
        className="rounded-lg border border-sky-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
        value={dept}
        onChange={(e) => setDept(e.target.value)}
      >
        <option value="">All Departments</option>
        {depts.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <select
        className="rounded-lg border border-sky-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="">All Types</option>
        {types.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}
