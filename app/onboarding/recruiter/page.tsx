"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Building2 } from "lucide-react";
import { submitRecruiterOnboarding } from "@/lib/actions/onboarding";
import { useSession } from "next-auth/react";

export default function RecruiterOnboardingPage() {
  const router = useRouter();
  const { update } = useSession();
  
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [aboutCompany, setAboutCompany] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!companyName || !aboutCompany) {
      setError("Company Name and About Company are required.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("companyName", companyName);
    formData.append("companyWebsite", companyWebsite);
    formData.append("aboutCompany", aboutCompany);

    const res = await submitRecruiterOnboarding(formData);

    if (res.error) {
      setError(res.error);
      setIsLoading(false);
    } else {
      // Force NextAuth to update the session token (so onboardingCompleted becomes true)
      await update({ onboardingCompleted: true });
      router.push("/recruiter-dashboard");
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Set up your company profile</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Let candidates know who they are applying to. You can update this later.
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:text-zinc-100 transition-all"
              placeholder="e.g. Acme Corp"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Website URL
            </label>
            <input
              type="url"
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:text-zinc-100 transition-all"
              placeholder="https://acme.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            About Company <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={aboutCompany}
            onChange={(e) => setAboutCompany(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:text-zinc-100 transition-all resize-none"
            placeholder="Tell us about your mission, culture, and what makes your company a great place to work."
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
