import Link from "next/link";
import { ArrowLeft, SearchX, Briefcase } from "lucide-react";

export default function JobNotFound() {
  return (
    <div className="flex-1 w-full bg-slate-50/50 dark:bg-background h-full min-h-screen">
      {/* Header Banner - Mimicking the Job Details Banner heavily grayed out */}
      <div className="w-full bg-white dark:bg-zinc-900/50 border-b border-purple-500/10 pt-8 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <Link
            href="/jobs"
            className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
            Back to active jobs
          </Link>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-4 md:gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-slate-100 dark:bg-zinc-800/80 flex items-center justify-center border border-slate-200 dark:border-zinc-700 shrink-0">
                <SearchX className="w-8 h-8 md:w-10 md:h-10 text-slate-400 dark:text-zinc-500" />
              </div>
              <div className="space-y-2 pt-1 md:pt-2">
                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground/50">
                  Job Unavailable
                </h1>
                <p className="text-foreground/50 text-base md:text-lg max-w-md hidden sm:block">
                  This position is no longer active or the link is broken.
                </p>
                <div className="flex flex-wrap gap-2 pt-2 md:hidden">
                  <span className="inline-flex rounded-md bg-slate-100 dark:bg-zinc-800 px-3 py-1 font-medium text-foreground/50 shadow-sm text-sm">
                    Expired
                  </span>
                </div>
              </div>
            </div>
            <div className="shrink-0 pt-4 md:pt-0 w-full md:w-auto">
              <Link
                href="/jobs"
                className="inline-flex h-12 w-full md:w-auto items-center justify-center rounded-lg bg-purple-600 px-8 font-semibold text-white shadow-xl shadow-purple-500/20 transition-all hover:bg-purple-700 hover:shadow-purple-500/40 hover:-translate-y-0.5"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Browse All Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Empty State */}
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-20 flex flex-col items-center justify-center text-center">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-10 max-w-2xl border border-purple-500/5 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Looking for something similar?</h2>
          <p className="text-foreground/70 mb-8 leading-relaxed">
            The role you're looking for might have been filled by another great candidate, but companies are constantly posting new opportunities for students and recent grads.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            <Link href="/jobs?q=software+engineering" className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-900/10 border border-purple-500/10 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors group">
              <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-1 group-hover:underline">Software Engineering</h3>
              <p className="text-sm text-foreground/60">Find SWE internships and new grad roles.</p>
            </Link>
            <Link href="/jobs?q=data" className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-500/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
              <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-1 group-hover:underline">Data & Systems</h3>
              <p className="text-sm text-foreground/60">Discover data science and cloud infra roles.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
