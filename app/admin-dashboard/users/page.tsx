import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import UsersTable from "@/components/admin/UsersTable";
import Link from "next/link";
import { 
  Home, 
  ChevronRight, 
  Users, 
  ChevronLeft, 
  Search, 
  ShieldCheck,
  Filter 
} from "lucide-react";
import { Role } from "@prisma/client";

export default async function AdminUsersPage(props: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    role?: string;
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
  const role = resolvedSearchParams.role || "";
  const limit = 8; // items per page

  // 2. Construct Prisma Query Filters
  const whereClause: any = {};

  if (q) {
    whereClause.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  if (role) {
    whereClause.role = role as Role;
  }

  // 3. Parallel DB count & fetch
  const [totalItems, dbUsers] = await Promise.all([
    prisma.user.count({ where: whereClause }),
    prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  const totalPages = Math.ceil(totalItems / limit) || 1;

  // Convert Date objects to strings for Client Component compatibility
  const serializableUsers = dbUsers.map((user) => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
  }));

  // Helper for generating query links
  const createQueryUrl = (params: { page?: number; q?: string; role?: string }) => {
    const newParams = new URLSearchParams();
    if (params.page !== undefined ? params.page > 1 : page > 1) {
      newParams.set("page", String(params.page !== undefined ? params.page : page));
    }
    const searchVal = params.q !== undefined ? params.q : q;
    if (searchVal) newParams.set("q", searchVal);
    
    const roleVal = params.role !== undefined ? params.role : role;
    if (roleVal) newParams.set("role", roleVal);

    const qs = newParams.toString();
    return `/admin-dashboard/users${qs ? `?${qs}` : ""}`;
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
          <Users className="w-3.5 h-3.5" />
          Manage Users
        </span>
      </nav>

      {/* Header Title */}
      <div className="mb-8 px-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            Users Panel
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Global administrative control to search, edit roles, reset passwords, or delete platform users.
          </p>
        </div>
      </div>

      {/* Search & Dynamic Filter Panel */}
      <form method="GET" action="/admin-dashboard/users" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 mb-8 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Text Search */}
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search users by name or email..."
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-950/20 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-650/50 transition-all text-xs"
          />
        </div>

        {/* Role Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-3 w-4 h-4 text-zinc-400 pointer-events-none" />
          <select
            name="role"
            defaultValue={role}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-950/20 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-650/50 transition-all text-xs appearance-none cursor-pointer"
          >
            <option value="">All Platform Roles</option>
            <option value="JOB_SEEKER">Candidate</option>
            <option value="RECRUITER">Recruiter</option>
            <option value="ADMIN">System Administrator</option>
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

      {/* Interactive Users Table */}
      <UsersTable initialUsers={serializableUsers} />

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
