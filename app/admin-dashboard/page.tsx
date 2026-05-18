import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Users, 
  Briefcase, 
  FileSpreadsheet, 
  ArrowUpRight, 
  ShieldAlert, 
  TrendingUp, 
  ShieldCheck,
  UserCheck
} from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch all counts in parallel for optimal page load speed
  const [
    totalUsers,
    totalRecruiters,
    totalCandidates,
    totalJobs,
    totalApplications,
    recentUsers,
    recentJobs,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.recruiter.count(),
    prisma.candidate.count(),
    prisma.job.count(),
    prisma.application.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { recruiter: true }
    }),
  ]);

  return (
    <div className="container mx-auto px-4 xl:px-8 py-8 md:py-12 max-w-7xl">
      {/* Title */}
      <div className="mb-10 px-1">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
          Admin Console
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-base">
          Platform performance metrics and site-wide user, job, and application management.
        </p>
      </div>

      {/* Metric Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Card 1: Users */}
        <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center border border-red-100 dark:border-red-500/20">
              <Users className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <Link 
              href="/admin-dashboard/users" 
              className="text-xs font-semibold text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-0.5"
            >
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div>
            <h3 className="text-zinc-500 dark:text-zinc-400 font-medium text-xs uppercase tracking-wider">Total Core Users</h3>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-1.5">{totalUsers}</p>
            <div className="flex gap-4 mt-3 text-xs text-zinc-400">
              <span>Recruiters: <strong className="text-zinc-700 dark:text-zinc-300">{totalRecruiters}</strong></span>
              <span>Candidates: <strong className="text-zinc-700 dark:text-zinc-300">{totalCandidates}</strong></span>
            </div>
          </div>
        </div>

        {/* Card 2: Jobs */}
        <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20">
              <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <Link 
              href="/admin-dashboard/jobs" 
              className="text-xs font-semibold text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-0.5"
            >
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div>
            <h3 className="text-zinc-500 dark:text-zinc-400 font-medium text-xs uppercase tracking-wider">Global Job Listings</h3>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-1.5">{totalJobs}</p>
            <p className="text-xs text-zinc-400 mt-3 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500" /> Live listings on the public board
            </p>
          </div>
        </div>

        {/* Card 3: Applications */}
        <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center border border-violet-100 dark:border-violet-500/20">
              <FileSpreadsheet className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <Link 
              href="/admin-dashboard/applications" 
              className="text-xs font-semibold text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center gap-0.5"
            >
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div>
            <h3 className="text-zinc-500 dark:text-zinc-400 font-medium text-xs uppercase tracking-wider">Platform Applications</h3>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-1.5">{totalApplications}</p>
            <p className="text-xs text-zinc-400 mt-3 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-violet-500" /> Submissions submitted by candidates
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Registered Users */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-5 border-b border-zinc-100 dark:border-zinc-800 mb-5">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Users className="w-4 h-4 text-red-500" />
              Recent Signups
            </h3>
            <Link 
              href="/admin-dashboard/users" 
              className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center gap-0.5"
            >
              View Users List
            </Link>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {recentUsers.map((user) => {
              const initials = user.name
                ? user.name.substring(0, 2).toUpperCase()
                : user.email.substring(0, 2).toUpperCase();

              return (
                <div key={user.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-700 dark:text-zinc-400">
                      {initials}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">{user.name || "N/A"}</h4>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500">{user.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    user.role === "ADMIN" 
                      ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                      : user.role === "RECRUITER"
                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                        : "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
                  }`}>
                    {user.role === "JOB_SEEKER" ? "Candidate" : user.role === "RECRUITER" ? "Recruiter" : "Admin"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Jobs Posted */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-5 border-b border-zinc-100 dark:border-zinc-800 mb-5">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-500" />
              Recent Jobs Published
            </h3>
            <Link 
              href="/admin-dashboard/jobs" 
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
            >
              View Jobs List
            </Link>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {recentJobs.map((job) => (
              <div key={job.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                <div>
                  <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">{job.title}</h4>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Posted by <span className="font-semibold">{job.recruiter?.companyName || "Unknown Employer"}</span>
                  </p>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                  job.status === "PUBLISHED"
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : job.status === "DRAFT"
                      ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                }`}>
                  {job.status === "PUBLISHED" ? "Live" : job.status === "DRAFT" ? "Draft" : "Closed"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
