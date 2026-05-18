"use client";

import { useState } from "react";
import { 
  Clock, 
  ArrowUpRight, 
  X, 
  Calendar, 
  Video, 
  BookOpen, 
  Briefcase, 
  Sparkles, 
  AlertCircle, 
  Heart,
  ChevronRight,
  Info
} from "lucide-react";
import Link from "next/link";

interface Application {
  id: string;
  coverLetter: string | null;
  resumeUrl: string | null;
  linkedInUrl: string | null;
  portfolioUrl: string | null;
  status: string;
  rejectionReason: string | null;
  interviewDate: Date | string | null;
  meetLink: string | null;
  createdAt: Date | string;
  job: {
    title: string;
    slug: string;
    recruiter: {
      companyName: string;
    };
  };
}

interface CandidateApplicationsListProps {
  initialApplications: Application[];
}

export default function CandidateApplicationsList({ initialApplications }: CandidateApplicationsListProps) {
  const [applications] = useState<Application[]>(initialApplications);
  const [selectedResponse, setSelectedResponse] = useState<Application | null>(null);

  const formatDateTime = (dateVal: Date | string) => {
    return new Date(dateVal).toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Applications Submitted</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Review the active progress of your candidate profile. Click status badges to check response details.</p>
          </div>
        </div>

        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {applications.length > 0 ? (
            applications.map((app) => {
              const companyInitials = app.job.recruiter.companyName
                ? app.job.recruiter.companyName.substring(0, 2).toUpperCase()
                : "CO";
              
              const appliedDate = new Date(app.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              const hasResponse = app.status === "ACCEPTED" || app.status === "REJECTED";

              return (
                <div key={app.id} className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold text-sm text-zinc-700 dark:text-zinc-300 shrink-0">
                      {companyInitials}
                    </div>
                    <div>
                      <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors">
                        {app.job.title}
                      </h4>
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{app.job.recruiter.companyName}</p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Applied on {appliedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    {/* Interactive Response Badge */}
                    <button
                      onClick={() => hasResponse && setSelectedResponse(app)}
                      disabled={!hasResponse}
                      title={hasResponse ? "Click to view response details" : "Pending employer review"}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1 transition-all ${
                        app.status === "PENDING"
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 cursor-default"
                          : app.status === "ACCEPTED"
                            ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 cursor-pointer shadow-sm hover:scale-[1.02]"
                            : "bg-red-50 text-red-650 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 cursor-pointer shadow-sm hover:scale-[1.02]"
                      }`}
                    >
                      {app.status === "PENDING" ? "In Review" : app.status === "ACCEPTED" ? "Shortlisted" : "Rejected"}
                      {hasResponse && <Info className="w-3 h-3 opacity-70" />}
                    </button>
                    
                    <Link 
                      href={`/jobs/${app.job.slug}`}
                      className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-indigo-650 dark:hover:text-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
                      title="View Job Details"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-zinc-500 dark:text-zinc-400">
              <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-25" />
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">No applications yet</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 mb-6">Explore listings and apply to start tracking them here.</p>
              <Link 
                href="/jobs"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-indigo-600 px-5 font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors text-sm cursor-pointer"
              >
                Find Jobs
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Response Details Popover Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Custom status-colored background panel splash */}
            <div className={`h-2.5 w-full ${selectedResponse.status === "ACCEPTED" ? "bg-emerald-500" : "bg-red-500"}`} />

            <button
              onClick={() => setSelectedResponse(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-650 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8">
              {/* Shortlist details */}
              {selectedResponse.status === "ACCEPTED" ? (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                      <Sparkles className="w-6 h-6 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Congratulations!</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      You have been shortlisted for the <span className="font-semibold text-indigo-600 dark:text-indigo-400">{selectedResponse.job.title}</span> position at <strong>{selectedResponse.job.recruiter.companyName}</strong>!
                    </p>
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-450 dark:text-zinc-500">Scheduled Interview Invite</h4>
                    
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-zinc-400 uppercase font-semibold">Date & Time</p>
                        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                          {selectedResponse.interviewDate ? formatDateTime(selectedResponse.interviewDate) : "TBD"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pt-2 border-t border-zinc-150 dark:border-zinc-800/80">
                      <Video className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-zinc-400 uppercase font-semibold">Interview Location</p>
                        <p className="text-sm font-semibold text-zinc-850 dark:text-zinc-300 mt-0.5">Google Meet / Video Link</p>
                      </div>
                    </div>
                  </div>

                  {selectedResponse.meetLink && (
                    <div className="pt-2">
                      <a
                        href={selectedResponse.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all cursor-pointer text-sm"
                      >
                        <Video className="w-4 h-4" />
                        Join Video Interview
                      </a>
                    </div>
                  )}

                  <div className="bg-indigo-50/30 dark:bg-indigo-500/5 border border-indigo-100/50 dark:border-indigo-500/10 rounded-2xl p-4 flex gap-3 text-xs text-indigo-750 dark:text-indigo-350">
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-indigo-500" />
                    <p className="leading-relaxed">
                      Please test your internet connection, microphone, and video settings before the scheduled time. Ensure you arrive in a quiet workspace.
                    </p>
                  </div>
                </div>
              ) : (
                /* Rejection details */
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 text-red-650 dark:text-red-400 flex items-center justify-center mx-auto mb-2">
                      <Heart className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Application Feedback</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      An update regarding your application for the <span className="font-semibold text-zinc-800 dark:text-zinc-200">{selectedResponse.job.title}</span> position at <strong>{selectedResponse.job.recruiter.companyName}</strong>.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm text-zinc-600 dark:text-zinc-350 leading-relaxed">
                      Thank you so much for taking the time to apply and for interest in joining their team. After thorough consideration, the recruitment team has decided not to move forward with your application for this vacancy.
                    </p>

                    {selectedResponse.rejectionReason ? (
                      <div className="bg-red-50/30 dark:bg-red-500/5 border border-red-100/50 dark:border-red-500/10 rounded-2xl p-5 space-y-2.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-red-650 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Employer Feedback Notes
                        </h4>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed italic pl-3 border-l-2 border-red-400/40">
                          "{selectedResponse.rejectionReason}"
                        </p>
                      </div>
                    ) : (
                      <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 text-xs text-zinc-500 dark:text-zinc-400 italic">
                        No specific candidate feedback notes were provided by the hiring team.
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-center">
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                      Keep going! Every application is another opportunity to refine your skill profile. Good luck on your next search!
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedResponse(null)}
                  className="h-10 px-5 rounded-xl border border-zinc-200 dark:border-zinc-850 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer shadow-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
