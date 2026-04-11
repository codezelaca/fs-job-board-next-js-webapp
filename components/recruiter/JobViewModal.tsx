"use client";

import { RecruiterJob } from "@/types/recruiter-job";
import {
  X,
  MapPin,
  Briefcase,
  Clock,
  Users,
  ExternalLink,
  Mail,
  CalendarDays,
  Tag,
  DollarSign,
} from "lucide-react";

const JOB_TYPE_LABELS: Record<RecruiterJob["jobType"], string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

const LOCATION_TYPE_LABELS: Record<RecruiterJob["locationType"], string> = {
  ONSITE: "On-site",
  HYBRID: "Hybrid",
  REMOTE: "Remote",
};

const STATUS_CONFIG: Record<
  RecruiterJob["status"],
  { label: string; className: string }
> = {
  PUBLISHED: {
    label: "Published",
    className:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  DRAFT: {
    label: "Draft",
    className:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },
  CLOSED: {
    label: "Closed",
    className:
      "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  },
};

interface JobViewModalProps {
  job: RecruiterJob | null;
  onClose: () => void;
}

export default function JobViewModal({ job, onClose }: JobViewModalProps) {
  if (!job) return null;

  const statusCfg = STATUS_CONFIG[job.status];

  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax) return null;
    const fmt = (n: number) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(n);
    if (job.salaryMin && job.salaryMax)
      return `${fmt(job.salaryMin)} – ${fmt(job.salaryMax)}`;
    if (job.salaryMin) return `From ${fmt(job.salaryMin)}`;
    return `Up to ${fmt(job.salaryMax!)}`;
  };

  const salary = formatSalary();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end"
      aria-modal="true"
      role="dialog"
      aria-labelledby="job-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-2xl h-full overflow-y-auto bg-white dark:bg-zinc-900 shadow-2xl flex flex-col"
        style={{ animation: "slideInFromRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-lg select-none">
              {job.company.charAt(0)}
            </div>
            <div>
              <h2
                id="job-modal-title"
                className="text-base font-semibold text-zinc-900 dark:text-zinc-50 leading-tight"
              >
                {job.title}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {job.company}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 px-6 py-6 space-y-8">
          {/* Quick Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${statusCfg.className}`}>
              {statusCfg.label}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
              <Briefcase className="w-3 h-3" />
              {JOB_TYPE_LABELS[job.jobType]}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              <MapPin className="w-3 h-3" />
              {LOCATION_TYPE_LABELS[job.locationType]}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              <Tag className="w-3 h-3" />
              {job.category}
            </span>
          </div>

          {/* Meta Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <MapPin className="w-4 h-4 shrink-0 text-zinc-400" />
              {job.location}
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <Users className="w-4 h-4 shrink-0 text-zinc-400" />
              {job.applicationsCount} applicant{job.applicationsCount !== 1 ? "s" : ""}
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <CalendarDays className="w-4 h-4 shrink-0 text-zinc-400" />
              Posted {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
            {salary && (
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <DollarSign className="w-4 h-4 shrink-0 text-zinc-400" />
                {salary}
              </div>
            )}
            {job.term && (
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Clock className="w-4 h-4 shrink-0 text-zinc-400" />
                {job.term}
              </div>
            )}
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2 uppercase tracking-wide">
              About This Role
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
              {job.about}
            </p>
          </div>

          {/* Skills */}
          {job.skills.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3 uppercase tracking-wide">
                Skills Required
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-100 dark:border-indigo-500/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Responsibilities */}
          {job.responsibilities.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3 uppercase tracking-wide">
                Responsibilities
              </h3>
              <ul className="space-y-2">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3 uppercase tracking-wide">
                Requirements
              </h3>
              <ul className="space-y-2">
                {job.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Application Links */}
          {(job.applicationUrl || job.applicationEmail) && (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50/50 dark:bg-zinc-950/50">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3 uppercase tracking-wide">
                Application Details
              </h3>
              <div className="space-y-2">
                {job.applicationUrl && (
                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {job.applicationUrl}
                  </a>
                )}
                {job.applicationEmail && (
                  <a
                    href={`mailto:${job.applicationEmail}`}
                    className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <Mail className="w-4 h-4" />
                    {job.applicationEmail}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            Close
          </button>
          <a
            href={`/jobs/${job.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
          >
            <ExternalLink className="w-4 h-4" />
            View Public Listing
          </a>
        </div>
      </div>
    </div>
  );
}
