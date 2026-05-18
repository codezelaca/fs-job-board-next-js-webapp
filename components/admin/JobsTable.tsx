"use client";

import { useState, useTransition, useEffect } from "react";
import { Briefcase, Trash2, ShieldAlert, AlertCircle, Check, Loader2, Clock, Globe } from "lucide-react";
import { adminDeleteJob } from "@/lib/actions/admin";

interface JobRow {
  id: string;
  title: string;
  location: string | null;
  jobType: string;
  status: string;
  createdAt: string;
  recruiter: {
    companyName: string;
  } | null;
}

interface JobsTableProps {
  initialJobs: JobRow[];
}

export default function JobsTable({ initialJobs }: JobsTableProps) {
  const [jobs, setJobs] = useState<JobRow[]>(initialJobs);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Sync internal state when server props update
  useEffect(() => {
    setJobs(initialJobs);
  }, [initialJobs]);

  const handleDelete = (jobId: string) => {
    if (!confirm("Are you absolutely sure you want to permanently delete this job listing? All applicant submissions linked to this job will also be removed immediately.")) {
      return;
    }

    setError("");
    setSuccess("");
    setDeletingId(jobId);

    startTransition(async () => {
      const res = await adminDeleteJob(jobId);
      if (res?.error) {
        setError(res.error);
        setDeletingId(null);
      } else {
        setSuccess("Job listing deleted successfully.");
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
        setDeletingId(null);
        setTimeout(() => setSuccess(""), 1500);
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 rounded-2xl flex items-start gap-3 text-red-650 dark:text-red-455 text-sm animate-in fade-in duration-150">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-200 dark:border-emerald-900/30 rounded-2xl flex items-start gap-3 text-emerald-600 dark:text-emerald-400 text-sm animate-in fade-in duration-150">
          <Check className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="font-semibold">{success}</p>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                <th className="p-5 font-semibold">Job Listing</th>
                <th className="p-5 font-semibold">Employer</th>
                <th className="p-5 font-semibold">Listing Status</th>
                <th className="p-5 font-semibold">Published</th>
                <th className="p-5 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
              {jobs.length > 0 ? (
                jobs.map((job) => {
                  const createdDate = new Date(job.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <tr key={job.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors group">
                      {/* Job details */}
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-700 dark:text-zinc-300 shrink-0">
                            <Briefcase className="w-4 h-4 text-zinc-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-zinc-900 dark:text-zinc-50">{job.title}</p>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                              {job.location || "Anywhere"} • <span className="font-medium">{job.jobType}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Recruiter employer */}
                      <td className="p-5 font-medium text-zinc-700 dark:text-zinc-300">
                        {job.recruiter?.companyName || "Unknown Employer"}
                      </td>

                      {/* Status */}
                      <td className="p-5">
                        <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full ${
                          job.status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : job.status === "DRAFT"
                              ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}>
                          {job.status === "PUBLISHED" ? "Live" : job.status === "DRAFT" ? "Draft" : "Closed"}
                        </span>
                      </td>

                      {/* Created date */}
                      <td className="p-5 text-zinc-500 dark:text-zinc-400">
                        {createdDate}
                      </td>

                      {/* Actions */}
                      <td className="p-5 text-right">
                        <button
                          onClick={() => handleDelete(job.id)}
                          disabled={deletingId === job.id}
                          title="Delete Listing"
                          className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-650 hover:text-red-600 hover:border-red-500/30 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                        >
                          {deletingId === job.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500 dark:text-zinc-400">
                    <div className="flex flex-col items-center justify-center">
                      <Clock className="w-10 h-10 opacity-20 mb-3" />
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100">No jobs found</p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">There are no job postings matching your active filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
