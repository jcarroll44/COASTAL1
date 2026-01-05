"use client";

import { useEffect, useMemo, useState } from "react";

function parseCSV(raw: string): string[] {
  // very forgiving CSV → list of names (first column); ignores header if present
  return raw
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(",")[0]?.trim())
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i);
}

export function useCondosCSV(path = "/condos_pcb.csv") {
  const [all, setAll] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    async function run() {
      try {
        setLoading(true);
        const res = await fetch(path, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load ${path}`);
        const text = await res.text();
        if (!alive) return;
        setAll(parseCSV(text));
      } catch (e: any) {
        setErr(e?.message || "Failed to load condos.");
      } finally {
        if (alive) setLoading(false);
      }
    }
    run();
    return () => {
      alive = false;
    };
  }, [path]);

  return { condos: all, loading, error: err };
}

export function useFiltered(list: string[], query: string) {
  const q = query.trim().toLowerCase();
  return useMemo(() => {
    if (!q) return list;
    return list.filter((n) => n.toLowerCase().includes(q));
  }, [list, q]);
}
