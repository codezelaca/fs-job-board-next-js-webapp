"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, UserCircle, Plus, X } from "lucide-react";
import { submitCandidateOnboarding } from "@/lib/actions/onboarding";
import { useSession } from "next-auth/react";

export default function CandidateOnboardingPage() {
  const router = useRouter();
  const { update } = useSession();
  
  const [bio, setBio] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (i: number) => {
    setSkills(skills.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!bio || skills.length === 0) {
      setError("Bio and at least one skill are required.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("resumeUrl", resumeUrl);
    formData.append("skills", skills.join(","));

    const res = await submitCandidateOnboarding(formData);

    if (res.error) {
      setError(res.error);
      setIsLoading(false);
    } else {
      await update({ onboardingCompleted: true });
      router.push("/candidate-dashboard");
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <UserCircle className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Complete your profile</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Let recruiters know what you bring to the table.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-start gap-2.5 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Professional Bio <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:text-zinc-100 transition-all resize-none"
            placeholder="Tell us about your background, goals, and what you're looking for."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Skills <span className="text-red-500">*</span>
          </label>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-2.5 bg-zinc-50 dark:bg-zinc-950 transition-all focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-500">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {skills.map((item, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-500/20">
                  {item}
                  <button type="button" onClick={() => removeSkill(i)} className="hover:text-red-500 transition-colors ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Add a skill (e.g. React, Python) and press Enter"
                className="flex-1 text-sm bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
              />
              <button
                type="button"
                onClick={addSkill}
                disabled={!skillInput.trim()}
                className="p-1.5 rounded-lg bg-indigo-600 disabled:bg-zinc-200 dark:disabled:bg-zinc-700 text-white disabled:text-zinc-400 transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <p className="mt-1.5 text-xs text-zinc-400">Press Enter or comma to add.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Resume URL (Optional)
          </label>
          <input
            type="url"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:text-zinc-100 transition-all"
            placeholder="Link to your Google Drive, Dropbox, or personal site"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto ml-auto flex items-center justify-center gap-2 py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-all shadow-sm shadow-indigo-500/20 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Complete Setup
        </button>
      </form>
    </div>
  );
}
