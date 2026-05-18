"use client";

import { useState, useTransition } from "react";
import { 
  User, 
  FileText, 
  Sparkles, 
  Lock, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  GraduationCap
} from "lucide-react";
import { updateCandidateProfile, changeUserPassword } from "@/lib/actions/settings";

interface CandidateSettingsFormProps {
  initialData: {
    name: string;
    bio: string;
    resumeUrl: string;
    skills: string[];
  };
}

export default function CandidateSettingsForm({ initialData }: CandidateSettingsFormProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [isPendingProfile, startTransitionProfile] = useTransition();
  const [isPendingSecurity, startTransitionSecurity] = useTransition();

  // Status states
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [securitySuccess, setSecuritySuccess] = useState(false);
  const [securityError, setSecurityError] = useState("");

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileSuccess(false);
    setProfileError("");

    const formData = new FormData(e.currentTarget);
    startTransitionProfile(async () => {
      const res = await updateCandidateProfile(formData);
      if (res?.error) {
        setProfileError(res.error);
      } else {
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 5000);
      }
    });
  };

  const handleSecuritySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSecuritySuccess(false);
    setSecurityError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    startTransitionSecurity(async () => {
      const res = await changeUserPassword(formData);
      if (res?.error) {
        setSecurityError(res.error);
      } else {
        setSecuritySuccess(true);
        form.reset();
        setTimeout(() => setSecuritySuccess(false), 5000);
      }
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl shadow-zinc-100/50 dark:shadow-none grid grid-cols-1 lg:grid-cols-4 min-h-[500px]">
      
      {/* Sidebar Nav */}
      <div className="p-6 border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20">
        <nav className="flex flex-row lg:flex-col gap-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-4 py-3 text-sm font-semibold rounded-2xl transition-all ${
              activeTab === "profile"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
            }`}
          >
            <User className="w-4 h-4" />
            My Candidate Profile
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-4 py-3 text-sm font-semibold rounded-2xl transition-all ${
              activeTab === "security"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
            }`}
          >
            <Lock className="w-4 h-4" />
            Account Security
          </button>
        </nav>
      </div>

      {/* Forms Area */}
      <div className="col-span-3 p-6 sm:p-10">
        
        {/* TAB 1: Profile Settings */}
        {activeTab === "profile" && (
          <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-2xl animate-in fade-in duration-250">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">My Candidate Profile</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Update your background details, resume, and tags for recruiters.</p>
            </div>

            {/* Notification Banners */}
            {profileSuccess && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl flex items-start gap-3 text-emerald-700 dark:text-emerald-400 animate-in fade-in duration-200">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Changes Saved Successfully</p>
                  <p className="text-xs opacity-90 mt-0.5">Your candidate bio, skills, and resume details are up to date.</p>
                </div>
              </div>
            )}

            {profileError && (
              <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl flex items-start gap-3 text-red-700 dark:text-red-400 animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-semibold">{profileError}</p>
              </div>
            )}

            <div className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    defaultValue={initialData.name}
                    disabled={isPendingProfile}
                    placeholder="Jane Doe"
                    className="w-full h-11 pl-11 pr-4 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-950/20 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all text-sm disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label htmlFor="bio" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Professional Bio
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
                  <textarea
                    id="bio"
                    name="bio"
                    required
                    rows={4}
                    defaultValue={initialData.bio}
                    disabled={isPendingProfile}
                    placeholder="Describe your goals, experience, and professional background..."
                    className="w-full p-4 pl-11 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-950/20 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all text-sm resize-y disabled:opacity-50"
                  ></textarea>
                </div>
              </div>

              {/* Resume URL */}
              <div className="space-y-2">
                <label htmlFor="resumeUrl" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Resume URL (PDF link)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
                  <input
                    id="resumeUrl"
                    name="resumeUrl"
                    type="url"
                    defaultValue={initialData.resumeUrl}
                    disabled={isPendingProfile}
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full h-11 pl-11 pr-4 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-950/20 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all text-sm disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Skills Editor */}
              <div className="space-y-2">
                <label htmlFor="skills" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Skills (Comma Separated)
                </label>
                <div className="relative">
                  <Sparkles className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
                  <input
                    id="skills"
                    name="skills"
                    type="text"
                    required
                    defaultValue={initialData.skills.join(", ")}
                    disabled={isPendingProfile}
                    placeholder="React, Next.js, Node.js, TypeScript"
                    className="w-full h-11 pl-11 pr-4 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-950/20 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all text-sm disabled:opacity-50"
                  />
                </div>
                <p className="text-xs text-zinc-400 mt-1">Separate tags using a comma. Maximum 20 skills allowed.</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isPendingProfile}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-6 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all text-sm disabled:opacity-75 disabled:hover:translate-y-0 cursor-pointer"
              >
                {isPendingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: Security settings */}
        {activeTab === "security" && (
          <form onSubmit={handleSecuritySubmit} className="space-y-6 max-w-md animate-in fade-in duration-250">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">Reset Password</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Update your current account credentials securely.</p>
            </div>

            {/* Notification Banners */}
            {securitySuccess && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl flex items-start gap-3 text-emerald-700 dark:text-emerald-400 animate-in fade-in duration-200">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Password Reset Complete</p>
                  <p className="text-xs opacity-90 mt-0.5">Your credentials have been successfully updated in our database.</p>
                </div>
              </div>
            )}

            {securityError && (
              <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl flex items-start gap-3 text-red-700 dark:text-red-400 animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-semibold">{securityError}</p>
              </div>
            )}

            <div className="space-y-5">
              {/* Old Password */}
              <div className="space-y-2">
                <label htmlFor="oldPassword" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Current Password
                </label>
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  required
                  disabled={isPendingSecurity}
                  placeholder="••••••••"
                  className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-950/20 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all text-sm disabled:opacity-50"
                />
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  disabled={isPendingSecurity}
                  placeholder="Minimum 8 characters"
                  className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-950/20 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all text-sm disabled:opacity-50"
                />
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  disabled={isPendingSecurity}
                  placeholder="••••••••"
                  className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-950/20 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all text-sm disabled:opacity-50"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isPendingSecurity}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-6 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all text-sm disabled:opacity-75 disabled:hover:translate-y-0 cursor-pointer"
              >
                {isPendingSecurity ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>

    </div>
  );
}
