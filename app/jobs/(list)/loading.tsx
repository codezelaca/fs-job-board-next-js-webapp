export default function JobsLoading() {
  return (
    <div className="flex-1 w-full relative animate-pulse">
      {/* Header Banner Skeleton */}
      <div className="bg-purple-50/50 dark:bg-purple-900/10 border-b border-purple-500/10 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="h-10 md:h-14 bg-purple-200/50 dark:bg-purple-800/30 rounded-lg w-3/4 max-w-md mb-4"></div>
          <div className="h-6 bg-purple-200/30 dark:bg-purple-800/20 rounded-md w-full max-w-2xl"></div>
        </div>
      </div>

      <section className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar / Filters Skeleton */}
          <aside className="lg:col-span-1">
            <div className="bg-background border border-purple-500/10 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="h-6 bg-purple-200/50 dark:bg-purple-800/30 rounded w-1/2 mb-5"></div>
              <div className="space-y-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-purple-200/30 dark:bg-purple-800/20 rounded w-1/3"></div>
                    <div className="h-10 bg-purple-100 dark:bg-purple-900/20 rounded-md w-full"></div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-3 mt-6 border-t border-purple-500/10">
                <div className="h-10 bg-purple-200/50 dark:bg-purple-800/30 rounded-md flex-1"></div>
                <div className="h-10 bg-purple-100 dark:bg-purple-900/20 rounded-md w-20"></div>
              </div>
            </div>
          </aside>

          {/* Job Listings Area Skeleton */}
          <main className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-purple-500/10">
              <div className="h-6 bg-purple-200/40 dark:bg-purple-800/30 rounded w-32"></div>
            </div>

            <div className="grid gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-background border border-purple-500/10 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
                  <div className="flex gap-4 w-full">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg shrink-0"></div>
                    <div className="space-y-3 w-full">
                      <div className="h-5 bg-purple-200/50 dark:bg-purple-800/30 rounded w-1/2 max-w-sm"></div>
                      <div className="flex gap-3">
                        <div className="h-4 bg-purple-100 dark:bg-purple-800/20 rounded w-24"></div>
                        <div className="h-4 bg-purple-100 dark:bg-purple-800/20 rounded w-24"></div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <div className="h-6 bg-purple-100/50 dark:bg-purple-900/20 rounded-md w-16"></div>
                        <div className="h-6 bg-purple-100/50 dark:bg-purple-900/20 rounded-md w-20"></div>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center md:items-start md:justify-end">
                     <div className="h-10 bg-purple-200/30 dark:bg-purple-800/20 rounded-md w-full md:w-28"></div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </section>
    </div>
  );
}
