import { prisma } from "@/lib/prisma";
import { RecruiterJob } from "@/types/recruiter-job";
import JobsTable from "@/components/recruiter/JobsTable";
import Link from "next/link";
import { Plus, Briefcase } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Jobs | CCA Recruiter",
  description: "View, manage and track all your job postings.",
};

// Fetch directly in server component for best performance & type safety
async function getRecruiterJobs(): Promise<RecruiterJob[]> {
  const jobs = await prisma.job.findMany({
    include: {
      recruiter: true,
      category: true,
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return jobs.map((j) => ({
    id: j.id,
    slug: j.slug,
    title: j.title,
    company: j.recruiter.companyName,
    companyLogoUrl: j.recruiter.companyLogoUrl,
    location: j.location ?? "Remote",
    locationType: j.locationType,
    jobType: j.jobType,
    salaryMin: j.salaryMin,
    salaryMax: j.salaryMax,
    status: j.status,
    category: j.category.name,
    skills: j.skills,
    responsibilities: j.responsibilities,
    requirements: j.requirements,
    about: j.about,
    term: j.term,
    applicationUrl: j.applicationUrl,
    applicationEmail: j.applicationEmail,
    applicationsCount: j._count.applications,
    createdAt: j.createdAt.toISOString(),
    updatedAt: j.updatedAt.toISOString(),
    expiresAt: j.expiresAt?.toISOString() ?? null,
  }));
}

export default async function ManageJobsPage() {
  const jobs = await getRecruiterJobs();

  const published = jobs.filter((j) => j.status === "PUBLISHED").length;
  const drafts = jobs.filter((j) => j.status === "DRAFT").length;
  const closed = jobs.filter((j) => j.status === "CLOSED").length;

  return (
    <div className="container mx-auto px-4 xl:px-8 py-8 md:py-10 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-indigo-500" />
            Manage Jobs
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
            Review, search and manage all your job postings.
          </p>
        </div>
        <Link
          href="/post-job"
          id="post-job-btn"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/40 hover:shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Post New Job
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
            Total
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{jobs.length}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-1">
            Published
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{published}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1">
            Drafts
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{drafts}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
            Closed
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{closed}</p>
        </div>
      </div>

      {/* Table */}
      <JobsTable data={jobs} />
    </div>
  );
}
