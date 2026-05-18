"use client";

import { X, Briefcase, MapPin, DollarSign, Clock, Calendar, CheckCircle2, ChevronRight, Info } from "lucide-react";

interface JobDetailSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: string;
    title: string;
    location: string | null;
    locationType: string;
    jobType: string;
    salaryMin: number | null;
    salaryMax: number | null;
    about: string;
    term: string;
    skills: string[];
    responsibilities: string[];
    requirements: string[];
    createdAt: string;
    recruiter?: {
      companyName: string;
    } | null;
  } | null;
}

export default function JobDetailSidePanel({
  isOpen,
  onClose,
  job,
}: JobDetailSidePanelProps) {
  if (!isOpen || !job) return null;

  const publishedDate = new Date(job.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedLocType = job.locationType
    ? job.locationType.charAt(0) + job.locationType.slice(1).toLowerCase()
    : "";

  const formattedJobType = job.jobType
    ? job.jobType.replace("_", " ").toLowerCase()
    : "";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="pointer-events-auto w-screen max-w-lg transform bg-white dark:bg-zinc-900 shadow-2xl border-l border-zinc-200 dark:border-zinc-800 transition-transform duration-300 ease-in-out animate-in slide-in-from-right duration-300 flex flex-col h-full">
          
          {/* Side Panel Header */}
          <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-red-650 dark:text-red-400" />
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">Job Specifications</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-zinc-400 hover:text-zinc-650 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Details Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Header info */}
            <div>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">
                {job.recruiter?.companyName || "Unknown Employer"}
              </span>
              <h1 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-snug tracking-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap gap-1.5 mt-3">
                <span className="text-[9px] font-bold px-2 py-0.5 bg-red-50 dark:bg-red-500/10 text-red-650 dark:text-red-400 rounded uppercase">
                  {formattedJobType}
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 rounded uppercase">
                  {formattedLocType}
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded">
                  {job.term}
                </span>
              </div>
            </div>

            {/* Quick Meta Stats Grid */}
            <div className="grid grid-cols-2 gap-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-4">
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block">Salary Range</span>
                <p className="text-xs text-zinc-700 dark:text-zinc-350 font-bold flex items-center">
                  <DollarSign className="w-3.5 h-3.5 text-zinc-400 mr-0.5" />
                  {job.salaryMin !== null && job.salaryMax !== null
                    ? `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} / year`
                    : job.salaryMin !== null
                      ? `From $${job.salaryMin.toLocaleString()} / year`
                      : job.salaryMax !== null
                        ? `Up to $${job.salaryMax.toLocaleString()} / year`
                        : "Salary Negotiable"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block">Location</span>
                <p className="text-xs text-zinc-700 dark:text-zinc-350 font-semibold flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 mr-0.5" />
                  {job.location || "Fully Remote"}
                </p>
              </div>

              <div className="space-y-1 col-span-2 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60">
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block">Published On</span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium flex items-center">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400 mr-1" />
                  {publishedDate}
                </p>
              </div>
            </div>

            {/* About / Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Role Overview
              </h3>
              <p className="text-xs text-zinc-650 dark:text-zinc-300 leading-relaxed whitespace-pre-line bg-zinc-50/50 dark:bg-zinc-950/10 border border-zinc-200 dark:border-zinc-850 p-4 rounded-2xl">
                {job.about}
              </p>
            </div>

            {/* Required Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Required Technologies & Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-semibold px-2.5 py-0.5 bg-red-50/30 dark:bg-red-500/5 text-red-750 dark:text-red-400 border border-red-100/40 dark:border-red-500/10 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="space-y-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Responsibilities & Scope
                </h3>
                <ul className="space-y-2">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="flex gap-2.5 items-start text-xs text-zinc-650 dark:text-zinc-300">
                      <ChevronRight className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="space-y-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Candidate Requirements
                </h3>
                <ul className="space-y-2">
                  {job.requirements.map((r, i) => (
                    <li key={i} className="flex gap-2.5 items-start text-xs text-zinc-650 dark:text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* Footer Action */}
          <div className="px-6 py-4 border-t border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-end">
            <button
              onClick={onClose}
              className="h-10 px-5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-650 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-all cursor-pointer"
            >
              Close Specification Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
