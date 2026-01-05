"use client";

import { useMemo, useState } from "react";
import { JOBS, Job } from "@/data/jobs";
import JobCard from "./JobCard";
import JobFilters from "./JobFilters";

export default function JobList() {
  const [market, setMarket] = useState("");
  const [dept, setDept] = useState("");
  const [type, setType] = useState("");

  const filtered = useMemo(() => {
    return JOBS.filter(
      (j) =>
        (market ? j.market === market : true) &&
        (dept ? j.department === dept : true) &&
        (type ? j.type === type : true)
    );
  }, [market, dept, type]);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-sky-900">Open Positions</h2>
        <JobFilters
          market={market}
          setMarket={setMarket}
          dept={dept}
          setDept={setDept}
          type={type}
          setType={setType}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filtered.map((job: Job) => (
          <JobCard key={job.slug} job={job} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
          No roles match those filters right now.
        </div>
      )}
    </section>
  );
}
