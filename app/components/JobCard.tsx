import Link from "next/link";
import type { Job } from "@/data/jobs";

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="rounded-xl border border-sky-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-sky-900">{job.title}</h3>
        <div className="flex gap-2 text-[11px]">
          <span className="rounded-full bg-sky-50 px-2 py-0.5 font-medium text-sky-700">
            {job.market}
          </span>
          <span className="rounded-full bg-slate-50 px-2 py-0.5 text-slate-700">
            {job.type}
          </span>
          {job.season && (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">
              {job.season}
            </span>
          )}
        </div>
      </div>
      {job.payRange && (
        <div className="mt-1 text-sm text-sky-700">Pay: {job.payRange}</div>
      )}
      {job.locationNote && (
        <div className="text-xs text-slate-500">{job.locationNote}</div>
      )}
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
        {job.bullets.slice(0, 3).map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
      <div className="mt-3 flex gap-2">
        <Link
          href={`/jobs/${job.slug}`}
          className="rounded-lg bg-sky-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-sky-800"
        >
          Apply Now
        </Link>
        <Link
          href={`/jobs/${job.slug}`}
          className="rounded-lg border border-sky-200 px-3 py-1.5 text-sm text-sky-800 hover:bg-sky-50"
        >
          View details
        </Link>
      </div>
    </div>
  );
}
