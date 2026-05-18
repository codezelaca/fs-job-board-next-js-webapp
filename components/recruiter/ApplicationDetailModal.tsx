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
  UserX,
  Calendar,
  Link as LinkIcon,
  MessageSquare
} from "lucide-react";
import { updateApplicationStatus } from "@/lib/actions/applications";

interface ApplicationDetailModalProps {
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

export default function ApplicationDetailModal({
  isOpen,
  onClose,
  application,
  onStatusUpdated,
}: ApplicationDetailModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Sub-form state: null | "SHORTLIST" | "REJECT"
  const [activeSubForm, setActiveSubForm] = useState<null | "SHORTLIST" | "REJECT">(null);

  // Form input fields
  const [interviewDate, setInterviewDate] = useState("");
  const [meetLink, setMeetLink] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  if (!isOpen) return null;

  const handleStatusChange = async (newStatus: "ACCEPTED" | "REJECTED") => {
    setError("");
    setSuccessMsg("");

    // Validations
    if (newStatus === "ACCEPTED") {
      if (!interviewDate) {
        setError("Please choose a valid interview date and time.");
        return;
      }
      const parsedDate = new Date(interviewDate);
      if (isNaN(parsedDate.getTime()) || parsedDate <= new Date()) {
        setError("Interview date must be scheduled in the future.");
        return;
      }
      if (!meetLink || !meetLink.trim()) {
        setError("Please enter a meeting link for the interview.");
        return;
      }
      if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(meetLink.trim())) {
        setError("Please enter a valid meeting URL (e.g. starting with http:// or https://).");
        return;
      }
    }

    startTransition(async () => {
      const payload = {
        rejectionReason: newStatus === "REJECTED" ? rejectionReason.trim() : undefined,
        interviewDate: newStatus === "ACCEPTED" ? interviewDate : undefined,
        meetLink: newStatus === "ACCEPTED" ? meetLink.trim() : undefined,
      };

      const res = await updateApplicationStatus(application.id, newStatus, payload);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccessMsg(`Application status has been updated to ${newStatus.toLowerCase()}!`);
        onStatusUpdated(newStatus);
        
        // Wait a second, then close modal
        setTimeout(() => {
          onClose();
          setSuccessMsg("");
          setActiveSubForm(null);
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
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-indigo-900/10 relative animate-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-650 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header Profile Card */}
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center pb-6 border-b border-zinc-100 dark:border-zinc-800 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center font-bold text-xl shrink-0">
              {initials}
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{applicant.name || "Candidate"}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Mail className="w-4 h-4" /> {applicant.email}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Applied for <span className="font-semibold text-indigo-600 dark:text-indigo-400">{job.title}</span> on {formattedDate}
              </p>
            </div>

            {/* Current Status Badge */}
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

          {/* Error / Success feedback */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 rounded-2xl flex items-start gap-3 text-red-650 dark:text-red-400 animate-in fade-in duration-150">
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
            {/* Left Content Area (2/3 width) */}
            <div className="md:col-span-2 space-y-6">
              {/* Bio snapshot */}
              {applicant.candidate?.bio && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Candidate Bio</h4>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed border-l-2 border-indigo-500/20 pl-4 italic">
                    "{applicant.candidate.bio}"
                  </p>
                </div>
              )}

              {/* Cover Letter */}
              {application.coverLetter && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Application Note / Cover Letter</h4>
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                    {application.coverLetter}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar Area (1/3 width) */}
            <div className="space-y-6">
              {/* Skills block */}
              {applicant.candidate?.skills && applicant.candidate.skills.length > 0 && (
                <div className="space-y-2 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">Registered Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {applicant.candidate.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 rounded border border-indigo-100 dark:border-indigo-500/10"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links Block */}
              <div className="space-y-3">
                {application.resumeUrl && (
                  <a
                    href={application.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 h-10 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/30 bg-zinc-50 dark:bg-zinc-900 hover:bg-indigo-50/20 text-sm font-semibold rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm"
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
                    className="inline-flex w-full items-center justify-center gap-2 h-10 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/30 bg-zinc-50 dark:bg-zinc-900 hover:bg-indigo-50/20 text-sm font-semibold rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm"
                  >
                    <Linkedin className="w-4 h-4 text-blue-650 dark:text-blue-400" />
                    LinkedIn Profile
                  </a>
                )}

                {application.portfolioUrl && (
                  <a
                    href={application.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 h-10 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/30 bg-zinc-50 dark:bg-zinc-900 hover:bg-indigo-50/20 text-sm font-semibold rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm"
                  >
                    <Globe className="w-4 h-4 text-zinc-555" />
                    Portfolio / GitHub
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons (only for PENDING applications) */}
          {application.status === "PENDING" && (
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 mt-8">
              
              {/* Secondary sub forms */}
              {activeSubForm === "SHORTLIST" ? (
                <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-850 p-6 rounded-2xl space-y-4 animate-in slide-in-from-bottom duration-250">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-650 dark:text-indigo-400 flex items-center gap-1.5">
                    <BookmarkCheck className="w-4 h-4" /> Shortlisting & Scheduling Specifications
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase mb-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Date & Time (Future)
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={interviewDate}
                        onChange={(e) => setInterviewDate(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600/50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase mb-1 flex items-center gap-1">
                        <LinkIcon className="w-3.5 h-3.5" /> Meeting Link (Google Meet / Video Link)
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="e.g. https://meet.google.com/abc-defg-hij"
                        value={meetLink}
                        onChange={(e) => setMeetLink(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600/50"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSubForm(null);
                        setError("");
                      }}
                      className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange("ACCEPTED")}
                      disabled={isPending}
                      className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-md shadow-indigo-500/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                      Confirm & Schedule Interview
                    </button>
                  </div>
                </div>
              ) : activeSubForm === "REJECT" ? (
                <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-850 p-6 rounded-2xl space-y-4 animate-in slide-in-from-bottom duration-250">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-650 dark:text-red-400 flex items-center gap-1.5">
                    <UserX className="w-4 h-4" /> Rejection Specifications
                  </h4>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase mb-1.5 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" /> Rejection Feedback Reason (Optional)
                    </label>
                    <textarea
                      placeholder="e.g. Thank you for your application, however we require more experience in React and Node.js..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600/50 h-20 resize-none"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSubForm(null);
                        setError("");
                      }}
                      className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange("REJECTED")}
                      disabled={isPending}
                      className="h-10 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white shadow-md shadow-red-500/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    onClick={() => setActiveSubForm("REJECT")}
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50/50 hover:bg-red-50 dark:bg-red-950/10 text-red-600 dark:text-red-400 px-6 font-semibold text-sm transition-all cursor-pointer"
                  >
                    <UserX className="w-4 h-4 mr-2" />
                    Reject Candidate
                  </button>
                  
                  <button
                    onClick={() => setActiveSubForm("SHORTLIST")}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-6 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all text-sm cursor-pointer"
                  >
                    <BookmarkCheck className="w-4 h-4 mr-2" />
                    Shortlist Candidate
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
