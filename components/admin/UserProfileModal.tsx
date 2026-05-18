"use client";

import { X, Mail, Calendar, Shield, Briefcase, FileText, Bookmark, Info } from "lucide-react";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: string;
    recruiter?: {
      companyName: string;
      companyLogoUrl?: string | null;
    } | null;
    candidate?: {
      bio: string | null;
      skills: string[];
      resumeUrl?: string | null;
    } | null;
  };
}

export default function UserProfileModal({
  isOpen,
  onClose,
  user,
}: UserProfileModalProps) {
  if (!isOpen) return null;

  const initials = user.name
    ? user.name.substring(0, 2).toUpperCase()
    : user.email.substring(0, 2).toUpperCase();

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-650 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Main User Card */}
          <div className="flex gap-4 items-center pb-6 border-b border-zinc-100 dark:border-zinc-850 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-650 dark:text-red-400 border border-red-100 dark:border-red-500/20 flex items-center justify-center font-bold text-lg shrink-0">
              {initials}
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{user.name || "N/A"}</h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1 mt-0.5">
                <Mail className="w-3.5 h-3.5" />
                {user.email}
              </p>
              <span className={`inline-flex px-2 py-0.5 text-[9px] font-bold rounded mt-2 uppercase tracking-wide ${
                user.role === "ADMIN"
                  ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                  : user.role === "RECRUITER"
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                    : "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
              }`}>
                {user.role === "JOB_SEEKER" ? "Candidate" : user.role === "RECRUITER" ? "Recruiter" : "Admin"}
              </span>
            </div>
          </div>

          <div className="space-y-5">
            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Joined On</span>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  {joinedDate}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Account ID</span>
                <p className="text-xs font-mono text-zinc-450 dark:text-zinc-400 truncate" title={user.id}>
                  {user.id}
                </p>
              </div>
            </div>

            {/* Recruiter Details View */}
            {user.role === "RECRUITER" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                  <Briefcase className="w-4 h-4 text-indigo-500" />
                  Recruiter Profile Details
                </h4>
                <div className="bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-4 space-y-3">
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Affiliated Company</span>
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      {user.recruiter?.companyName || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Candidate Details View */}
            {user.role === "JOB_SEEKER" && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                  <Info className="w-4 h-4 text-violet-500" />
                  Candidate Profile Details
                </h4>
                <div className="bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-4 space-y-4">
                  {user.candidate?.bio ? (
                    <div>
                      <span className="text-[10px] text-zinc-400 block mb-1">Professional Biography</span>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed italic border-l-2 border-violet-500/35 pl-3">
                        "{user.candidate.bio}"
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400">No biography details provided.</p>
                  )}

                  {user.candidate?.skills && user.candidate.skills.length > 0 && (
                    <div>
                      <span className="text-[10px] text-zinc-400 block mb-2">Skills Tags</span>
                      <div className="flex flex-wrap gap-1">
                        {user.candidate.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-[9px] font-bold px-2 py-0.5 bg-violet-50 dark:bg-violet-500/10 text-violet-750 dark:text-violet-400 rounded border border-violet-100 dark:border-violet-500/10"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {user.candidate?.resumeUrl && (
                    <div className="pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50">
                      <a
                        href={user.candidate.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-violet-650 hover:underline font-semibold"
                      >
                        <FileText className="w-4 h-4" />
                        Download Attached Resume File
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-5 border-t border-zinc-100 dark:border-zinc-850 mt-6">
            <button
              onClick={onClose}
              className="h-10 px-5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-650 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors"
            >
              Close Profile View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
