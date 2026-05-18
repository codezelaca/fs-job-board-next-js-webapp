import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminApplicationsTable from "@/components/admin/AdminApplicationsTable";
import Link from "next/link";
import { 
  Home, 
  ChevronRight, 
  FileSpreadsheet, 
  ChevronLeft, 
  Search, 
  Filter 
} from "lucide-react";
import { ApplicationStatus } from "@prisma/client";

export default async function AdminApplicationsPage(props: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    status?: string;
  }>;
}) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // 1. Resolve search params safely
  const resolvedSearchParams = await props.searchParams;
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const q = resolvedSearchParams.q || "";
  const status = resolvedSearchParams.status || "";
  const limit = 8; // items per page

  // 2. Construct Prisma Query Filters
  const whereClause: any = {};

  if (q) {
    whereClause.applicant = {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ],
    };
  }

  if (status) {
    whereClause.status = status as ApplicationStatus;
  }

  // 3. Parallel DB count & fetch
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
  const createQueryUrl = (params: { page?: number; q?: string; status?: string }) => {
    const newParams = new URLSearchParams();
    if (params.page !== undefined ? params.page > 1 : page > 1) {
      newParams.set("page", String(params.page !== undefined ? params.page : page));
    }
    const searchVal = params.q !== undefined ? params.q : q;
    if (searchVal) newParams.set("q", searchVal);
    
    const statusVal = params.status !== undefined ? params.status : status;
    if (statusVal) newParams.set("status", statusVal);

    const qs = newParams.toString();
    return `/admin-dashboard/applications${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="container mx-auto px-4 xl:px-8 py-8 md:py-10 max-w-7xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-zinc-500 mb-6 px-1">
        <Link href="/admin-dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors flex items-center gap-1">
          <Home className="w-3 h-3" />
          Dashboard
        </Link>
        <ChevronRight className="w-3 h-3 opacity-30" />
        <span className="text-zinc-900 dark:text-zinc-100 font-semibold flex items-center gap-1">
          <FileSpreadsheet className="w-3.5 h-3.5" />
          Manage Applications
        </span>
      </nav>

      {/* Header Title */}
      <div className="mb-8 px-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Applications Pool
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Global administrative panel to search, monitor status, and review details of all platform applications.
          </p>
        </div>
      </div>

      {/* Search & Dynamic Filter Panel */}
      <form method="GET" action="/admin-dashboard/applications" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 mb-8 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Text Search */}
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search candidates by name or email..."
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-950/20 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-650/50 transition-all text-xs"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-3 w-4 h-4 text-zinc-400 pointer-events-none" />
          <select
            name="status"
            defaultValue={status}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-950/20 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-650/50 transition-all text-xs appearance-none cursor-pointer"
          >
            <option value="">All Application Statuses</option>
            <option value="PENDING">In Review</option>
            <option value="ACCEPTED">Shortlisted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="sm:col-span-3 h-10 rounded-xl bg-red-600 hover:bg-red-700 font-semibold text-white text-xs shadow-md shadow-red-500/10 hover:shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          Apply Search Filters
        </button>
      </form>

      {/* Dynamic Applications Table */}
      <AdminApplicationsTable initialApplications={serializableApplications} />

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
