import { ArrowLeft, Sparkles } from "lucide-react";

export default function JobDetailsLoading() {
  return (
    <div className="flex-1 w-full bg-slate-50/50 dark:bg-background">
      {/* Header Banner Skeleton */}
      <div className="w-full bg-white dark:bg-zinc-900/50 border-b border-purple-500/10 pt-8 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="inline-flex items-center text-sm font-medium text-purple-600/50 mb-8">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to jobs
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-6 w-full">
              {/* Logo Skeleton */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-purple-100 dark:bg-purple-900/20 shrink-0 border border-purple-500/10 animate-pulse"></div>
              
              <div className="space-y-4 w-full max-w-xl">
                {/* Title Skeleton */}
                <div className="h-8 md:h-10 bg-purple-100 dark:bg-purple-800/30 rounded-lg w-3/4 animate-pulse"></div>
                
                {/* Meta Skeleton */}
                <div className="flex flex-wrap items-center gap-4 py-1">
                  <div className="h-5 bg-purple-50 dark:bg-purple-900/20 rounded w-32 animate-pulse"></div>
                  <div className="h-5 bg-purple-50 dark:bg-purple-900/20 rounded w-32 animate-pulse"></div>
                </div>

                {/* Badges Skeleton */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <div className="h-7 border border-purple-100 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-900/10 rounded-md w-24 animate-pulse"></div>
                  <div className="h-7 border border-purple-100 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-900/10 rounded-md w-32 animate-pulse"></div>
                  <div className="h-5 bg-purple-50/50 dark:bg-zinc-800/50 rounded w-32 ml-2 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Buttons UI (Not fully pulsing to maintain structure visual) */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 pt-4 md:pt-0 shrink-0 w-full md:w-auto">
              <button disabled className="inline-flex h-12 w-full md:w-48 items-center justify-center rounded-lg bg-purple-600/50 px-6 font-semibold text-white/70 shadow-sm cursor-not-allowed">
                Apply Now
                <Sparkles className="w-4 h-4 ml-2 opacity-50" />
              </button>
              <button disabled className="inline-flex h-12 w-full md:w-48 items-center justify-center rounded-lg border-2 border-purple-200/50 bg-white/50 dark:bg-zinc-900/50 px-6 font-semibold text-purple-700/50 dark:text-purple-300/50 cursor-not-allowed">
                Save for later
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Detailed Job Desc Left Col */}
          <div className="lg:col-span-2 space-y-10">
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground/30">About the Role</h2>
              <div className="space-y-3">
                <div className="h-5 bg-purple-50 dark:bg-zinc-800/50 rounded w-full animate-pulse"></div>
                <div className="h-5 bg-purple-50 dark:bg-zinc-800/50 rounded w-full animate-pulse"></div>
                <div className="h-5 bg-purple-50 dark:bg-zinc-800/50 rounded w-11/12 animate-pulse"></div>
                <div className="h-5 bg-purple-50 dark:bg-zinc-800/50 rounded w-4/5 animate-pulse"></div>
              </div>
            </section>

            {/* Responsibilities Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground/30">Responsibilities</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-2.5 h-2.5 mt-1.5 bg-purple-200 dark:bg-purple-900/50 rounded-full shrink-0 animate-pulse"></div>
                    <div className="h-5 bg-purple-50 dark:bg-zinc-800/50 rounded w-full max-w-md animate-pulse"></div>
                  </div>
                ))}
              </div>
            </section>

            {/* Requirements Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground/30">Requirements & Qualifications</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-2.5 h-2.5 mt-1.5 bg-purple-200 dark:bg-purple-900/50 rounded-full shrink-0 animate-pulse"></div>
                    <div className="h-5 bg-purple-50 dark:bg-zinc-800/50 rounded w-full max-w-lg animate-pulse"></div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Col / Sidebar Skeleton */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-purple-500/10 shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-foreground/30">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-8 w-16 md:w-20 bg-purple-50 dark:bg-purple-900/20 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
