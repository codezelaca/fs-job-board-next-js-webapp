import { JobCard } from "@/components/JobCard";
import { JobFilters } from "@/components/JobFilters";
import { jobs } from "@/data/jobs";
import Link from "next/link";
import { Briefcase } from "lucide-react";

type Props = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function JobsPage(props: Props) {
  const searchParams = await props.searchParams;

  // Extract specific search parameters safely
  const query =
    typeof searchParams?.q === "string" ? searchParams.q.toLowerCase() : "";
  const location =
    typeof searchParams?.location === "string"
      ? searchParams.location.toLowerCase()
      : "";
  const type = typeof searchParams?.type === "string" ? searchParams.type : ""; // Exact match or partial depending on logic

  // Parse page
  const pageStr = searchParams?.page;
  const currentPage = typeof pageStr === "string" ? parseInt(pageStr, 10) : 1;
  const ITEMS_PER_PAGE = 7;

  // Filter Data
  const filteredJobs = jobs.filter((job) => {
    // keyword search checks title, company, skills
    if (query) {
      const stringifiedSkills = job.skills.join(" ").toLowerCase();
      if (
        !job.title.toLowerCase().includes(query) &&
        !job.company.toLowerCase().includes(query) &&
        !stringifiedSkills.includes(query)
      ) {
        return false;
      }
    }

    if (location && !job.location.toLowerCase().includes(location)) {
      return false;
    }

    // "Internship", "Co-op", "Full-time"
    if (type && type !== "" && !job.type.includes(type)) {
      return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredJobs.length);
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  return (
    <div className="flex-1 w-full relative">
      <div className="bg-purple-50/50 dark:bg-purple-900/10 border-b border-purple-500/10 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Browse Opportunities
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl">
            Discover roles that fit your skills in software engineering, data,
            and design.
          </p>
        </div>
      </div>

      <section className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar / Filters */}
          <aside className="lg:col-span-1">
            <JobFilters />
          </aside>

          {/* Job Listings Area */}
          <main className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-purple-500/10">
              <h2 className="text-xl font-bold">
                {filteredJobs.length}{" "}
                {filteredJobs.length === 1 ? "Job" : "Jobs"} Found
              </h2>
            </div>

            {paginatedJobs.length > 0 ? (
              <div className="grid gap-4">
                {paginatedJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 px-4 rounded-2xl border-2 border-dashed border-purple-500/20">
                <div className="flex justify-center mb-4 text-purple-400">
                  <Briefcase className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  No jobs match your criteria
                </h3>
                <p className="text-foreground/60 mb-6">
                  Try adjusting your filters or expanding your search terms.
                </p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center justify-center rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-6 h-10 font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                >
                  Clear all filters
                </Link>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2 pb-10">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = pageNum === currentPage;

                  // Construct pagination URL while keeping other search Params
                  const searchParamsString = new URLSearchParams();
                  if (query) searchParamsString.set("q", query);
                  if (location) searchParamsString.set("location", location);
                  if (type) searchParamsString.set("type", type);
                  searchParamsString.set("page", pageNum.toString());

                  return (
                    <Link
                      key={pageNum}
                      href={`/jobs?${searchParamsString.toString()}`}
                      scroll={true}
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
          </main>
        </div>
      </section>
    </div>
  );
}
