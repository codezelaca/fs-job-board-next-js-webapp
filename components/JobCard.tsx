import Link from "next/link";
import { Job } from "@/types/job";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="group flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border border-purple-500/10 bg-background hover:border-purple-500/30 transition-all hover:shadow-md hover:shadow-purple-500/5 gap-6">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-xl bg-purple-50 dark:bg-purple-900/10 flex items-center justify-center border border-purple-500/10 shrink-0 shadow-sm shadow-purple-500/5">
          <span className="font-bold text-xl text-purple-600">
            {job.companyInitial}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-bold group-hover:text-purple-600 transition-colors">
            {job.title}
          </h3>
          <p className="text-foreground/60 mt-1 flex flex-wrap gap-1 items-center">
            <span>{job.company}</span>
            <span>•</span>
            <span>{job.location}</span>
            <span>•</span>
            <span>{job.term}</span>
          </p>
          <div className="flex gap-2 mt-3 flex-wrap">
            <span className="inline-flex items-center rounded-md bg-purple-50 dark:bg-purple-900/20 px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-300 ring-1 ring-inset ring-purple-700/10">
              {job.type}
            </span>
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded-md bg-purple-50 dark:bg-purple-900/20 px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-300 ring-1 ring-inset ring-purple-700/10"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
      <Link
        href={`/jobs/${job.id}`}
        className="inline-flex h-10 items-center justify-center rounded-md bg-purple-50 dark:bg-purple-900/20 px-6 text-sm font-medium text-purple-700 dark:text-purple-300 transition-colors hover:bg-purple-100 dark:hover:bg-purple-900/40 w-full md:w-auto shrink-0 shadow-sm ring-1 ring-inset ring-purple-700/10"
      >
        View Details
      </Link>
    </div>
  );
}
