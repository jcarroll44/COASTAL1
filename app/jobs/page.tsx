"use client";

import QuickApplyCard from "@/components/QuickApplyCard";
import JobList from "@/components/JobList";

export default function JobsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
      {/* Hero */}
      <section className="rounded-3xl border border-sky-100 bg-white/80 p-6 shadow-[0_20px_50px_-30px_rgba(2,132,199,0.25)]">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-sky-900 md:text-4xl">
              Work the Emerald Coast
            </h1>
            <p className="mt-2 text-sky-700">
              Join a hospitality-first crew. Pick your market, share your
              availability, and we’ll be in touch within 24–48 hours.
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="/jobs?market=PCB"
              className="rounded-full border border-sky-200 px-3 py-1.5 text-sm text-sky-800 hover:bg-sky-50"
            >
              PCB
            </a>
            <a
              href="/jobs?market=30A"
              className="rounded-full border border-sky-200 px-3 py-1.5 text-sm text-sky-800 hover:bg-sky-50"
            >
              30A
            </a>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <JobList />
        <div className="self-start">
          <QuickApplyCard />
        </div>
      </div>
    </main>
  );
}
