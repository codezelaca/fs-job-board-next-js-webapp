"use client";

import { useState } from "react";
import { Sparkles, X, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export function ApplyModal({ jobTitle, companyName, jobSlug }: { jobTitle: string; companyName: string; jobSlug: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      jobSlug,
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      linkedInUrl: formData.get("linkedInUrl"),
      portfolioUrl: formData.get("portfolioUrl"),
      coverLetter: formData.get("coverLetter"),
    };

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to submit application");
      }

      setStatus("success");
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setStatus("error");
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    
    // Reset state after the close animation completes to prevent jumping UI
    setTimeout(() => {
      setStatus("idle");
      setErrorMessage("");
    }, 300);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex h-12 w-full md:w-48 items-center justify-center rounded-lg bg-purple-600 px-6 font-semibold text-white shadow-xl shadow-purple-500/20 transition-all hover:bg-purple-700 hover:shadow-purple-500/40 hover:-translate-y-0.5"
      >
        Apply Now
        <Sparkles className="w-4 h-4 ml-2 opacity-80" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 border border-purple-500/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-purple-900/20 relative animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full hover:bg-purple-50 dark:hover:bg-zinc-900 text-foreground/50 hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-10">
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-2 pr-8">
                  Apply for {jobTitle}
                </h2>
                <p className="text-foreground/70">
                  at <span className="font-semibold text-purple-700 dark:text-purple-400">{companyName}</span>
                </p>
              </div>

              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50 dark:ring-green-900/10">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Application Submitted!</h3>
                  <p className="text-foreground/70 max-w-md mx-auto mb-8">
                    Your application for the <strong>{jobTitle}</strong> role at <strong>{companyName}</strong> has been successfully sent. Keep an eye on your inbox!
                  </p>
                  <button
                    onClick={closeModal}
                    className="inline-flex h-12 w-full sm:w-auto min-w-[200px] items-center justify-center rounded-lg bg-green-600 px-8 font-semibold text-white shadow-lg shadow-green-500/20 transition-all hover:bg-green-700"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {status === "error" && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl flex items-start gap-3 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="text-sm font-medium">{errorMessage}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-sm font-semibold tracking-wide text-foreground/80">
                        FULL NAME <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        disabled={status === "loading"}
                        placeholder="Jane Doe"
                        className="w-full h-11 px-4 rounded-lg border border-purple-200 bg-purple-50/30 dark:bg-zinc-900/50 dark:border-purple-900/50 focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all text-sm disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-semibold tracking-wide text-foreground/80">
                        EMAIL ADDRESS <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        disabled={status === "loading"}
                        placeholder="jane@example.com"
                        className="w-full h-11 px-4 rounded-lg border border-purple-200 bg-purple-50/30 dark:bg-zinc-900/50 dark:border-purple-900/50 focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all text-sm disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="linkedInUrl" className="text-sm font-semibold tracking-wide text-foreground/80">
                        LINKEDIN URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="linkedInUrl"
                        name="linkedInUrl"
                        type="url"
                        required
                        disabled={status === "loading"}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full h-11 px-4 rounded-lg border border-purple-200 bg-purple-50/30 dark:bg-zinc-900/50 dark:border-purple-900/50 focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all text-sm disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="portfolioUrl" className="text-sm font-semibold tracking-wide text-foreground/80">
                        PORTFOLIO / GITHUB URL
                      </label>
                      <input
                        id="portfolioUrl"
                        name="portfolioUrl"
                        type="url"
                        disabled={status === "loading"}
                        placeholder="https://github.com/..."
                        className="w-full h-11 px-4 rounded-lg border border-purple-200 bg-purple-50/30 dark:bg-zinc-900/50 dark:border-purple-900/50 focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all text-sm disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="coverLetter" className="text-sm font-semibold tracking-wide text-foreground/80">
                      COVER LETTER / NOTE <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="coverLetter"
                      name="coverLetter"
                      required
                      rows={5}
                      disabled={status === "loading"}
                      placeholder="Tell the hiring manager why you are a great fit for this role..."
                      className="w-full p-4 rounded-lg border border-purple-200 bg-purple-50/30 dark:bg-zinc-900/50 dark:border-purple-900/50 focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all text-sm resize-y disabled:opacity-50"
                    ></textarea>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="inline-flex h-12 w-full sm:w-auto min-w-[180px] items-center justify-center rounded-lg bg-purple-600 px-8 font-semibold text-white shadow-xl shadow-purple-500/20 transition-all hover:bg-purple-700 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      {status === "loading" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "Submit Application"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
