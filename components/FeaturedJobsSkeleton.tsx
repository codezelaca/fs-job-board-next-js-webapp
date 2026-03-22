export function FeaturedJobsSkeleton() {
  return (
    <div className="grid gap-4 w-full">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-background border border-purple-500/10 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center h-auto min-h-[148px]">
          <div className="flex gap-4 w-full">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg shrink-0 animate-pulse"></div>
            <div className="space-y-4 w-full">
              <div className="h-6 bg-purple-100 dark:bg-purple-800/30 rounded w-3/4 max-w-sm animate-pulse"></div>
              <div className="flex gap-3">
                <div className="h-4 bg-purple-50 dark:bg-purple-800/20 rounded w-24 animate-pulse"></div>
                <div className="h-4 bg-purple-50 dark:bg-purple-800/20 rounded w-32 animate-pulse"></div>
              </div>
              <div className="flex gap-2 pt-2">
                <div className="h-7 border border-purple-100 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-900/10 rounded-md w-20 animate-pulse"></div>
                <div className="h-7 border border-purple-100 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-900/10 rounded-md w-24 animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="shrink-0 flex items-center md:items-start md:justify-end mt-4 md:mt-0">
             <div className="h-10 border border-purple-500/20 bg-purple-50 dark:bg-purple-900/20 rounded-md w-full md:w-32 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
