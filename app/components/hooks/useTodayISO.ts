"use client";

import { useEffect, useState } from "react";

export default function useTodayISO() {
  const [v, setV] = useState<string | null>(null);
  useEffect(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    setV(d.toISOString().slice(0, 10));
  }, []);
  return v;
}