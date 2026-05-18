import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ApplicationsTable from "@/components/recruiter/ApplicationsTable";
import Link from "next/link";
import { 
  Home, 
  ChevronRight, 
  Users, 
  ChevronLeft, 
  Search, 
  Briefcase, 
  Filter 
} from "lucide-react";

export default async function ManageApplicationsPage(props: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    jobId?: string;
    status?: string;
  }>;
}) {
  const session = await auth();
  if (!session || session.user.role !== "RECRUITER") {
    redirect("/login");
  }

  const recruiter = await prisma.recruiter.findUnique({
    where: { userId: session.user.id },
  });

  if (!recruiter) {
    redirect("/onboarding/recruiter");
  }

  // 1. Resolve Query Parameters safely
  const resolvedSearchParams = await props.searchParams;
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const q = resolvedSearchParams.q || "";
  const jobId = resolvedSearchParams.jobId || "";
  const status = resolvedSearchParams.status || "";
  const limit = 8; // items per page

  // 2. Fetch the Recruiter's jobs to populate the filter dropdown
  const recruiterJobs = await prisma.job.findMany({
    where: { recruiterId: recruiter.id },
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
  });

  // 3. Construct Prisma Filter Clause
  const whereClause: any = {
    job: {
      recruiterId: recruiter.id,
    },
  };

  if (jobId) {
    whereClause.jobId = jobId;
  }

  if (status) {
    whereClause.status = status;
  }

  if (q) {
    whereClause.applicant = {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ],
    };
  }

  // 4. Parallel fetch for performance
  const [totalItems, dbApplications] = await Promise.all([
    prisma.application.count({ where: whereClause }),
    prisma.application.findMany({
      where: whereClause,
      include: {
        job: {
          select: { title: true },
        },
        applicant: {
          select: {
            name: true,
            email: true,
            candidate: {
              select: {
                bio: true,
                skills: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  const totalPages = Math.ceil(totalItems / limit) || 1;

  // Convert Date objects to strings for Client Component compatibility
  const serializableApplications = dbApplications.map((app) => ({
    ...app,
    createdAt: app.createdAt.toISOString(),
  }));

  // Helper for generating query links
  const createQueryUrl = (params: { page?: number; q?: string; jobId?: string; status?: string }) => {
    const newParams = new URLSearchParams();
    if (params.page !== undefined ? params.page > 1 : page > 1) {
      newParams.set("page", String(params.page !== undefined ? params.page : page));
    }
    const searchVal = params.q !== undefined ? params.q : q;
    if (searchVal) newParams.set("q", searchVal);
    
    const jobVal = params.jobId !== undefined ? params.jobId : jobId;
    if (jobVal) newParams.set("jobId", jobVal);
    
    const statusVal = params.status !== undefined ? params.status : status;
    if (statusVal) newParams.set("status", statusVal);

    const qs = newParams.toString();
    return `/recruiter-dashboard/applications${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="container mx-auto px-4 xl:px-8 py-8 md:py-10 max-w-7xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-zinc-500 mb-6 px-1">
        <Link href="/recruiter-dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors flex items-center gap-1">
          <Home className="w-3 h-3" />
          Dashboard
        </Link>
        <ChevronRight className="w-3 h-3 opacity-30" />
        <span className="text-zinc-900 dark:text-zinc-100 font-semibold flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          Manage Applications
        </span>
      </nav>

      {/* Header Banner */}
      <div className="mb-8 px-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Applications Pool</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Review applicant portfolios, resume PDFs, and manage candidates applying to your active job listings.
          </p>
        </div>
      </div>

      {/* Search & Dynamic Filter Panel (GET Form for full server integration) */}
      <form method="GET" action="/recruiter-dashboard/applications" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 mb-8 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Text Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search candidates..."
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-950/20 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all text-xs"
          />
        </div>

        {/* Job filter */}
        <div className="relative">
          <Briefcase className="absolute left-3 top-3 w-4 h-4 text-zinc-400 pointer-events-none" />
          <select
            name="jobId"
            defaultValue={jobId}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-950/20 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all text-xs appearance-none cursor-pointer"
          >
            <option value="">All Posted Jobs</option>
            {recruiterJobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-3 w-4 h-4 text-zinc-400 pointer-events-none" />
          <select
            name="status"
            defaultValue={status}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-950/20 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all text-xs appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">In Review</option>
            <option value="ACCEPTED">Shortlisted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Submit action */}
        <button
          type="submit"
          className="h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold text-white text-xs shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          Apply Filters
        </button>
      </form>

      {/* Main Applications Table */}
      <ApplicationsTable initialApplications={serializableApplications} />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800 mt-8 px-1">
          <p className="text-xs text-zinc-500">
            Showing Page <span className="font-semibold text-zinc-800 dark:text-zinc-200">{page}</span> of <span className="font-semibold text-zinc-800 dark:text-zinc-200">{totalPages}</span>
          </p>

          <div className="flex gap-2">
            <Link
              href={createQueryUrl({ page: Math.max(1, page - 1) })}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-700 transition-all ${
                page === 1 ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>

            <Link
              href={createQueryUrl({ page: Math.min(totalPages, page + 1) })}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-700 transition-all ${
                page === totalPages ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
