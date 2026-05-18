"use client";

import { useState, useTransition } from "react";
import { 
  X, 
  Mail, 
  FileText, 
  Linkedin, 
  Globe, 
  Check, 
  AlertCircle, 
  Loader2,
  BookmarkCheck,
  UserX
} from "lucide-react";
import { adminUpdateApplicationStatus } from "@/lib/actions/admin";

interface AdminApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: {
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
  };
  onStatusUpdated: (newStatus: "ACCEPTED" | "REJECTED") => void;
}

export default function AdminApplicationModal({
  isOpen,
  onClose,
  application,
  onStatusUpdated,
}: AdminApplicationModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleStatusChange = async (newStatus: "ACCEPTED" | "REJECTED") => {
    setError("");
    setSuccessMsg("");

    startTransition(async () => {
      // Direct status updating (uses the common status changer which has recruiter checks,
      // wait! We should create a separate admin action or bypass it. But since we want robust controls,
      // let's verify if `updateApplicationStatus` supports admins. Ah! Let's check `updateApplicationStatus` in `lib/actions/applications.ts`!
      // In `lib/actions/applications.ts` we have:
      // if (!session || session.user.role !== "RECRUITER") { return { error: "Unauthorized." }; }
      // Ah! That strictly blocks ADMINS from updating status! That is an incredible detail!
      // So we MUST create a secure admin status updater in `lib/actions/admin.ts` or allow it!
      // Let's create `adminUpdateApplicationStatus` inside `lib/actions/admin.ts`!
      // But first, let's write the AdminApplicationModal code using `adminUpdateApplicationStatus`!
      const res = await adminUpdateApplicationStatus(application.id, newStatus);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccessMsg(`Application status updated to ${newStatus.toLowerCase()} successfully!`);
        onStatusUpdated(newStatus);
        setTimeout(() => {
          onClose();
          setSuccessMsg("");
        }, 1500);
      }
    });
  };

  const { applicant, job } = application;
  const initials = applicant.name
    ? applicant.name.substring(0, 2).toUpperCase()
    : applicant.email.substring(0, 2).toUpperCase();

  const formattedDate = new Date(application.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-650 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center pb-6 border-b border-zinc-100 dark:border-zinc-800 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-500/20 flex items-center justify-center font-bold text-xl shrink-0">
              {initials}
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{applicant.name || "Candidate"}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Mail className="w-4 h-4" /> {applicant.email}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Applied for <span className="font-semibold text-red-650 dark:text-red-400">{job.title}</span> on {formattedDate}
              </p>
            </div>

            {/* Status Badge */}
            <div className="sm:ml-auto">
              <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                application.status === "PENDING"
                  ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                  : application.status === "ACCEPTED"
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
              }`}>
                {application.status === "PENDING" ? "In Review" : application.status === "ACCEPTED" ? "Shortlisted" : "Rejected"}
              </span>
            </div>
          </div>

          {/* Feedback */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 rounded-2xl flex items-start gap-3 text-red-600 dark:text-red-400 animate-in fade-in duration-150">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-semibold">{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-200 dark:border-emerald-900/30 rounded-2xl flex items-start gap-3 text-emerald-600 dark:text-emerald-400 animate-in fade-in duration-150">
              <Check className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-semibold">{successMsg}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Bio & Cover letter */}
            <div className="md:col-span-2 space-y-6">
              {applicant.candidate?.bio && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Candidate Bio</h4>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed border-l-2 border-red-500/20 pl-4 italic">
                    "{applicant.candidate.bio}"
                  </p>
                </div>
              )}

              {application.coverLetter && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Application Cover Letter</h4>
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                    {application.coverLetter}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Skills & Assets */}
            <div className="space-y-6">
              {applicant.candidate?.skills && applicant.candidate.skills.length > 0 && (
                <div className="space-y-2 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">Registered Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {applicant.candidate.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-bold px-2 py-0.5 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 rounded border border-red-100 dark:border-red-500/10"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {application.resumeUrl && (
                  <a
                    href={application.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 h-10 border border-zinc-200 dark:border-zinc-800 hover:border-red-500/30 bg-zinc-50 dark:bg-zinc-900 hover:bg-red-50/20 text-sm font-semibold rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 transition-all shadow-sm"
                  >
                    <FileText className="w-4 h-4" />
                    Download Resume
                  </a>
                )}

                {application.linkedInUrl && (
                  <a
                    href={application.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 h-10 border border-zinc-200 dark:border-zinc-800 hover:border-red-500/30 bg-zinc-50 dark:bg-zinc-900 hover:bg-red-50/20 text-sm font-semibold rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-red-650 dark:hover:text-red-400 transition-all shadow-sm"
                  >
                    <Linkedin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    LinkedIn Profile
                  </a>
                )}

                {application.portfolioUrl && (
                  <a
                    href={application.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 h-10 border border-zinc-200 dark:border-zinc-800 hover:border-red-500/30 bg-zinc-50 dark:bg-zinc-900 hover:bg-red-50/20 text-sm font-semibold rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-red-650 dark:hover:text-red-400 transition-all shadow-sm"
                  >
                    <Globe className="w-4 h-4 text-zinc-500" />
                    Portfolio / GitHub
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons (only for PENDING applications) */}
          {application.status === "PENDING" && (
            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t border-zinc-100 dark:border-zinc-800 mt-8">
              <button
                onClick={() => handleStatusChange("REJECTED")}
                disabled={isPending}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50/50 hover:bg-red-50 dark:bg-red-950/10 text-red-600 dark:text-red-400 px-6 font-semibold text-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <UserX className="w-4 h-4 mr-2" />
                    Reject Candidate
                  </>
                )}
              </button>
              
              <button
                onClick={() => handleStatusChange("ACCEPTED")}
                disabled={isPending}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-red-600 px-6 font-semibold text-white shadow-lg shadow-red-500/10 hover:shadow-red-500/20 hover:-translate-y-0.5 transition-all text-sm disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <BookmarkCheck className="w-4 h-4 mr-2" />
                    Shortlist Candidate
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
