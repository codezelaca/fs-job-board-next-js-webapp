import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles,
  FileText,
  Bookmark,
  ChevronRight,
  User,
  GraduationCap
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function CandidateDashboardPage() {
  const session = await auth();
  if (!session || session.user.role !== "JOB_SEEKER") {
    redirect("/login");
  }

  // 1. Fetch Candidate profile and skills
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      candidate: true,
    },
  });

  if (!dbUser || !dbUser.candidate) {
    redirect("/onboarding/candidate");
  }

  const candidate = dbUser.candidate;

  // 2. Fetch application metrics and actual lists
  const [
    totalApplicationsCount,
    pendingApplicationsCount,
    acceptedApplicationsCount,
    applications,
  ] = await Promise.all([
    // Total Applications
    prisma.application.count({
      where: { applicantId: session.user.id },
    }),
    // Pending
    prisma.application.count({
      where: { applicantId: session.user.id, status: "PENDING" },
    }),
    // Accepted
    prisma.application.count({
      where: { applicantId: session.user.id, status: "ACCEPTED" },
    }),
    // All Applications with Jobs and Recruiters
    prisma.application.findMany({
      where: { applicantId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        job: {
          include: {
            recruiter: true,
          },
        },
      },
    }),
  ]);

  return (
    <div className="container mx-auto px-4 xl:px-8 py-8 md:py-12 max-w-7xl">
      {/* Welcome Section */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
            Welcome back, <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">{session.user.name || "Candidate"}!</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg">
            Track your job applications and showcase your skills to employers.
          </p>
        </div>
        <Link 
          href="/jobs"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-6 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all text-sm shrink-0"
        >
          Explore New Jobs
          <Sparkles className="w-4 h-4 ml-2 opacity-80" />
        </Link>
      </div>

      {/* KPI Cards (Bento Box Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Card 1: Total Applications */}
        <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div>
            <h3 className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">Total Applications</h3>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{totalApplicationsCount}</p>
          </div>
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/10 rounded-2xl transition-colors pointer-events-none" />
        </div>

        {/* Card 2: Pending Applications */}
        <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div>
            <h3 className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">Applications Pending</h3>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{pendingApplicationsCount}</p>
          </div>
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-500/10 rounded-2xl transition-colors pointer-events-none" />
        </div>

        {/* Card 3: Hired / Accepted */}
        <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div>
            <h3 className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">Offers & Successes</h3>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{acceptedApplicationsCount}</p>
          </div>
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-emerald-500/10 rounded-2xl transition-colors pointer-events-none" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Applications list (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Applications Submitted</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Review the active progress of your candidate profile.</p>
              </div>
            </div>

            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {applications.length > 0 ? (
                applications.map((app) => {
                  const companyInitials = app.job.recruiter.companyName
                    ? app.job.recruiter.companyName.substring(0, 2).toUpperCase()
                    : "CO";
                  
                  const appliedDate = new Date(app.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <div key={app.id} className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold text-sm text-zinc-700 dark:text-zinc-300 shrink-0">
                          {companyInitials}
                        </div>
                        <div>
                          <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {app.job.title}
                          </h4>
                          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{app.job.recruiter.companyName}</p>
                          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> Applied on {appliedDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          app.status === "PENDING"
                            ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                            : app.status === "ACCEPTED"
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                        }`}>
                          {app.status === "PENDING" ? "In Review" : app.status === "ACCEPTED" ? "Accepted" : "Rejected"}
                        </span>
                        
                        <Link 
                          href={`/jobs/${app.job.slug}`}
                          className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors"
                          title="View Job Details"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center text-zinc-500 dark:text-zinc-400">
                  <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-25" />
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">No applications yet</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 mb-6">Explore listings and apply to start tracking them here.</p>
                  <Link 
                    href="/jobs"
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-indigo-600 px-5 font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors text-sm"
                  >
                    Find Jobs
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Profile Summary & quick items (1/3 width) */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" />
              Candidate Profile
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-1">REGISTERED BIO</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed italic border-l-2 border-indigo-500/20 pl-3">
                  "{candidate.bio || "No bio registered yet."}"
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-2">MY SKILLS</p>
                {candidate.skills && candidate.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.skills.map((skill) => (
                      <span 
                        key={skill}
                        className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 rounded-lg border border-indigo-100 dark:border-indigo-500/10"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500">No skills registered.</p>
                )}
              </div>

              {candidate.resumeUrl && (
                <div className="pt-2">
                  <a 
                    href={candidate.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 h-10 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/30 bg-zinc-50 dark:bg-zinc-900 hover:bg-indigo-50/20 text-sm font-semibold rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    View Uploaded Resume
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Tips / Info box */}
          <div className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-500/10 rounded-2xl p-6">
            <h4 className="font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-2 mb-2 text-sm">
              <Sparkles className="w-4 h-4" />
              Pro Tip
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              When applying for jobs on our board, your onboarding resume and registered skills are automatically linked to your applications. Keeping your profile details updated ensures recruiters always see your latest achievements!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
