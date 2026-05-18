"use client";

import { useState } from "react";
import { 
  ArrowUpRight, 
  Calendar, 
  Briefcase, 
  User, 
  Mail, 
  Clock, 
  AlertCircle 
} from "lucide-react";
import ApplicationDetailModal from "./ApplicationDetailModal";

interface ApplicationRow {
  id: string;
  coverLetter: string | null;
  resumeUrl: string | null;
  linkedInUrl: string | null;
  portfolioUrl: string | null;
  status: string;
  createdAt: string;
  job: {
    title: string;
  };
  applicant: {
    name: string | null;
    email: string;
    candidate: {
      bio: string | null;
      skills: string[];
    } | null;
  };
}

interface ApplicationsTableProps {
  initialApplications: ApplicationRow[];
}

export default function ApplicationsTable({ initialApplications }: ApplicationsTableProps) {
  const [applications, setApplications] = useState<ApplicationRow[]>(initialApplications);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationRow | null>(null);

  // Sync internal state when server props update
  if (applications.length !== initialApplications.length && initialApplications.length === 0) {
    setApplications(initialApplications);
  }

  const handleStatusUpdated = (applicationId: string, newStatus: "ACCEPTED" | "REJECTED") => {
    setApplications((prev) =>
      prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app))
    );
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              <th className="p-5 font-semibold">Candidate</th>
              <th className="p-5 font-semibold">Role Applied</th>
              <th className="p-5 font-semibold">Date Applied</th>
              <th className="p-5 font-semibold">Status</th>
              <th className="p-5 text-right font-semibold">Review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
            {applications.length > 0 ? (
              applications.map((app) => {
                const dateApplied = new Date(app.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                
                const initials = app.applicant.name
                  ? app.applicant.name.substring(0, 2).toUpperCase()
                  : app.applicant.email.substring(0, 2).toUpperCase();

                return (
                  <tr 
                    key={app.id} 
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors group"
                  >
                    {/* Candidate */}
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-700 dark:text-zinc-300">
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-zinc-50">{app.applicant.name || "Candidate"}</p>
                          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{app.applicant.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role Applied */}
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-zinc-400" />
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">{app.job.title}</span>
                      </div>
                    </td>

                    {/* Date Applied */}
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-zinc-500">
                        <Calendar className="w-4 h-4 text-zinc-400" />
                        <span>{dateApplied}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="p-5">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                        app.status === "PENDING"
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                          : app.status === "ACCEPTED"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                      }`}>
                        {app.status === "PENDING" ? "In Review" : app.status === "ACCEPTED" ? "Shortlisted" : "Rejected"}
                      </span>
                    </td>

                    {/* Review Button */}
                    <td className="p-5 text-right">
                      <button
                        onClick={() => setSelectedApplication(app)}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/30 transition-all cursor-pointer shadow-sm"
                      >
                        Review
                        <ArrowUpRight className="w-3.5 h-3.5" />
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
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">No applications found</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">There are no applications matching your active filters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Profile/Application Popup Modal */}
      {selectedApplication && (
        <ApplicationDetailModal
          isOpen={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
          application={selectedApplication}
          onStatusUpdated={(newStatus) => handleStatusUpdated(selectedApplication.id, newStatus)}
        />
      )}
    </div>
  );
}
