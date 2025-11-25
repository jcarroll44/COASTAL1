// app/components/ui/Card.tsx
import React from "react";

export default function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        "rounded-2xl border border-sky-100 bg-white shadow-[0_18px_60px_-40px_rgba(0,93,156,0.25)] " +
        className
      }
    >
      {children}
    </div>
  );
}