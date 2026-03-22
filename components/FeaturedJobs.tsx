import { getAllJobs } from "@/lib/jobs";
import { JobCard } from "@/components/JobCard";
import Link from "next/link";

export default async function FeaturedJobs({ currentPage }: { currentPage: number }) {
  const ITEMS_PER_PAGE = 5;
  const { jobs: paginatedJobs, totalPages } = await getAllJobs({
    page: currentPage,
    limit: ITEMS_PER_PAGE
  });

  return (
    <>
      <div className="grid gap-4">
        {paginatedJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === currentPage;
            return (
              <Link
                key={pageNum}
                href={`/?page=${pageNum}`}
                scroll={false}
                className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                  isActive
                    ? "border-purple-600 bg-purple-600 text-white shadow-sm shadow-purple-500/20"
                    : "border-purple-500/20 bg-background text-foreground hover:border-purple-500/50 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                }`}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
