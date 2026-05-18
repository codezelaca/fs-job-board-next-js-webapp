import { 
  Briefcase, 
  Users, 
  MessageSquare, 
  CalendarDays, 
  TrendingUp,
  ArrowUpRight,
  Clock
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function RecruiterDashboardPage() {
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

  // Calculate dates for metrics
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));

  // Fetch real metrics
  const [
    activeJobsCount,
    jobsThisWeekCount,
    totalApplicationsCount,
    applicationsTodayCount,
    recentApplications,
    draftsCount,
    closedCount,
  ] = await Promise.all([
    // Active jobs
    prisma.job.count({
      where: { recruiterId: recruiter.id, status: "PUBLISHED" },
    }),
    // Jobs created this week
    prisma.job.count({
      where: { recruiterId: recruiter.id, createdAt: { gte: oneWeekAgo } },
    }),
    // Total applications to this recruiter's jobs
    prisma.application.count({
      where: { job: { recruiterId: recruiter.id } },
    }),
    // Applications today
    prisma.application.count({
      where: { job: { recruiterId: recruiter.id }, createdAt: { gte: startOfDay } },
    }),
    // Recent 5 applications
    prisma.application.findMany({
      where: { job: { recruiterId: recruiter.id } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        applicant: true,
        job: true,
      },
    }),
    // Draft jobs
    prisma.job.count({
      where: { recruiterId: recruiter.id, status: "DRAFT" },
    }),
    // Closed jobs
    prisma.job.count({
      where: { recruiterId: recruiter.id, status: "CLOSED" },
    }),
  ]);

  return (
    <div className="container mx-auto px-4 xl:px-8 py-8 md:py-12 max-w-7xl">
      {/* Welcome Section */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
          Welcome back, <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{recruiter.companyName}!</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg">
          Here's an overview of your recruiting activities today.
        </p>
      </div>

      {/* KPI Cards (Bento Box Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Card 1 */}
        <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            {jobsThisWeekCount > 0 && (
              <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{jobsThisWeekCount} this week
              </span>
            )}
          </div>
          <div>
            <h3 className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">Active Jobs</h3>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{activeJobsCount}</p>
          </div>
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-500/10 rounded-2xl transition-colors pointer-events-none" />
        </div>

        {/* Card 2 */}
        <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            {applicationsTodayCount > 0 && (
              <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{applicationsTodayCount} today
              </span>
            )}
          </div>
          <div>
            <h3 className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">Total Applications</h3>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{totalApplicationsCount}</p>
          </div>
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-violet-500/10 rounded-2xl transition-colors pointer-events-none" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Applications list */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Recent Applications</h2>
            <Link href="/recruiter-dashboard/applications" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center transition-colors">
              View all <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {recentApplications.length > 0 ? (
              recentApplications.map((app) => {
                const initials = app.applicant.name
                  ? app.applicant.name.substring(0, 2).toUpperCase()
                  : app.applicant.email.substring(0, 2).toUpperCase();
                
                // Helper to format time ago
                const diffMs = new Date().getTime() - new Date(app.createdAt).getTime();
                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                const timeAgo = diffHours < 1 
                  ? "Just now" 
                  : diffHours < 24 
                    ? `${diffHours}h ago` 
                    : `${Math.floor(diffHours / 24)}d ago`;

                return (
                  <Link 
                    key={app.id} 
                    href={`/recruiter-dashboard/applications?q=${encodeURIComponent(app.applicant.email)}`}
                    className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors flex items-center justify-between group cursor-pointer border-b last:border-0 border-zinc-100 dark:border-zinc-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm">
                        {initials}
                      </div>
                      <div>
                        <h4 className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {app.applicant.name || app.applicant.email}
                        </h4>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Applied for {app.job.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> {timeAgo}
                      </span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        app.status === "PENDING"
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                          : app.status === "ACCEPTED"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                      }`}>
                        {app.status === "PENDING" ? "In Review" : app.status === "ACCEPTED" ? "Shortlisted" : "Rejected"}
                      </span>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="p-12 text-center text-zinc-500 dark:text-zinc-400">
                <Users className="w-8 h-8 mx-auto mb-3 opacity-20" />
                <p>No applications yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-xl font-bold mb-2">Post a New Job</h3>
            <p className="text-indigo-100 text-sm mb-6">
              Attract top talent from CCA by publishing a new opportunity to the board.
            </p>
            <Link 
              href="/recruiter-dashboard/post-job" 
              className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-white text-indigo-600 hover:bg-indigo-50 font-medium rounded-xl transition-colors shadow-sm"
            >
              Draft Job Post
            </Link>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/recruiter-dashboard/jobs?status=PUBLISHED" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-between group">
                  Active Listings
                  <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded text-xs group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{activeJobsCount}</span>
                </Link>
              </li>
              <li>
                <Link href="/recruiter-dashboard/jobs?status=DRAFT" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-between group">
                  Drafts
                  <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded text-xs group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{draftsCount}</span>
                </Link>
              </li>
              <li>
                <Link href="/recruiter-dashboard/jobs?status=CLOSED" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-between group">
                  Closed Jobs
                  <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded text-xs group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{closedCount}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
