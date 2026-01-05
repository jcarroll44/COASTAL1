// app/components/ui/Section.tsx
import React from "react";

export default function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="text-[11px] uppercase tracking-[0.14em] text-sky-800/70">
          Overview
        </div>
        <h2 className="text-xl font-semibold text-sky-900">{title}</h2>
      </div>
      {action ? <div className="flex items-center gap-2">{action}</div> : null}
      {children ? <div className="sm:col-span-2">{children}</div> : null}
    </div>
  );
}