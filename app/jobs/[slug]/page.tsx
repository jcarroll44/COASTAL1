"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { JOBS } from "@/data/jobs";

export default function JobDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const job = JOBS.find((j) => j.slug === slug);

  if (!job) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-slate-700">Role not found.</p>
        <Link href="/jobs" className="text-sky-700 underline">
          Back to Jobs
        </Link>
      </main>
    );
  }

  const applyHref = `/apply?role=${encodeURIComponent(job.title)}&market=${
    job.market
  }`;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-6">
      <Link href="/jobs" className="text-sky-700 underline">
        ← Back to Jobs
      </Link>
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-sky-900">{job.title}</h1>
        <div className="text-sm text-slate-600">
          {job.market} • {job.department} • {job.type}
          {job.season ? ` • ${job.season}` : ""}
        </div>
        {job.payRange && (
          <div className="text-sm text-sky-700">Pay: {job.payRange}</div>
        )}
      </header>

      <p className="text-slate-700">{job.description}</p>

      <ul className="list-disc space-y-1 pl-5 text-slate-700">
        {job.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>

      <div>
        <a
          href={applyHref}
          className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
        >
          Apply Now
        </a>
      </div>
    </main>
  );
}
