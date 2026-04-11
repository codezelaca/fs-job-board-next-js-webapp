import { prisma } from "@/lib/prisma";
import { RecruiterJob } from "@/types/recruiter-job";
import JobsTable from "@/components/recruiter/JobsTable";
import JobsFiltersBar from "@/components/recruiter/JobsFiltersBar";
import Link from "next/link";
import { Plus, Briefcase } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { JobStatus, JobType, Prisma } from "@prisma/client";

export const metadata: Metadata = {
  title: "Manage Jobs | CCA Recruiter",
  description: "View, manage and track all your job postings.",
};

// ─── Types ─────────────────────────────────────────────────────────────────

interface SearchParams {
  q?: string;
  status?: string;
  jobType?: string;
  sort?: string;
  order?: string;
  page?: string;
  limit?: string;
}

// Valid sort fields mapped to Prisma orderBy keys
const SORT_FIELDS: Record<string, keyof Prisma.JobOrderByWithRelationInput> = {
  title: "title",
  status: "status",
  createdAt: "createdAt",
  jobType: "jobType",
};

// ─── Data Fetching ─────────────────────────────────────────────────────────

async function getPageData(params: SearchParams) {
  const q = params.q?.trim() ?? "";
  const status = params.status as JobStatus | undefined;
  const jobType = params.jobType as JobType | undefined;
  const sortField = SORT_FIELDS[params.sort ?? ""] ?? "createdAt";
  const sortOrder: "asc" | "desc" = params.order === "asc" ? "asc" : "desc";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const limit = Math.min(50, Math.max(5, parseInt(params.limit ?? "10", 10)));

  // Build WHERE clause
  const where: Prisma.JobWhereInput = {};

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { recruiter: { companyName: { contains: q, mode: "insensitive" } } },
      { location: { contains: q, mode: "insensitive" } },
      { about: { contains: q, mode: "insensitive" } },
    ];
  }

  if (status && Object.values(JobStatus).includes(status)) {
    where.status = status;
  }

  if (jobType && Object.values(JobType).includes(jobType)) {
    where.jobType = jobType;
  }

  // Run count and page query in parallel — only fetches `limit` rows
  const [total, jobs, totals] = await Promise.all([
    prisma.job.count({ where }),
    prisma.job.findMany({
      where,
      include: {
        recruiter: true,
        category: true,
        _count: { select: { applications: true } },
      },
      orderBy: { [sortField]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    // Status group counts for summary cards (full dataset, no filters)
    prisma.job.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const statusCounts = {
    PUBLISHED: 0,
    DRAFT: 0,
    CLOSED: 0,
    TOTAL: 0,
  };
  totals.forEach((g) => {
    statusCounts[g.status as JobStatus] = g._count._all;
    statusCounts.TOTAL += g._count._all;
  });

  const mapped: RecruiterJob[] = jobs.map((j) => ({
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

  return {
    jobs: mapped,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    sortField: params.sort ?? "createdAt",
    sortOrder,
    statusCounts,
  };
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default async function ManageJobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const {
    jobs,
    total,
    page,
    limit,
    totalPages,
    sortField,
    sortOrder,
    statusCounts,
  } = await getPageData(params);

  const summaryCards = [
    { label: "Total Jobs", value: statusCounts.TOTAL, color: "text-zinc-900 dark:text-zinc-50", accent: "text-zinc-500 dark:text-zinc-400" },
    { label: "Published", value: statusCounts.PUBLISHED, color: "text-zinc-900 dark:text-zinc-50", accent: "text-emerald-600 dark:text-emerald-400" },
    { label: "Drafts", value: statusCounts.DRAFT, color: "text-zinc-900 dark:text-zinc-50", accent: "text-amber-600 dark:text-amber-400" },
    { label: "Closed", value: statusCounts.CLOSED, color: "text-zinc-900 dark:text-zinc-50", accent: "text-zinc-500 dark:text-zinc-400" },
  ];

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
            Review, search and manage all your job postings. Results are fetched server-side.
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
        {summaryCards.map(({ label, value, color, accent }) => (
          <div
            key={label}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm"
          >
            <p className={`text-xs font-medium uppercase tracking-wide mb-1 ${accent}`}>
              {label}
            </p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Results summary */}
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
        {params.q || params.status || params.jobType ? (
          <>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">{total}</span> filtered results
          </>
        ) : (
          <>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">{total}</span> total jobs
          </>
        )}
        {" · "}Showing page <span className="font-medium text-zinc-700 dark:text-zinc-300">{page}</span> of{" "}
        <span className="font-medium text-zinc-700 dark:text-zinc-300">{totalPages}</span>
      </p>

      {/* Filters — Client Component, reads/writes URL params */}
      <Suspense>
        <JobsFiltersBar />
      </Suspense>

      {/* Table — Client Component, receives only this page's rows */}
      <Suspense>
        <JobsTable
          data={jobs}
          total={total}
          page={page}
          totalPages={totalPages}
          limit={limit}
          sortField={sortField}
          sortOrder={sortOrder}
        />
      </Suspense>
    </div>
  );
}
