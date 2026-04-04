import { prisma } from "./prisma";
import { Job } from "@/types/job";
import { JobType } from "@prisma/client";

export interface GetAllJobsParams {
  q?: string;
  location?: string;
  type?: string;
  page?: string | number;
  limit?: string | number;
}

export interface PaginatedJobs {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function mapJobTypeToString(jobType: JobType): string {
  if (jobType === "FULL_TIME") return "Full-time";
  if (jobType === "PART_TIME") return "Part-time";
  if (jobType === "CONTRACT") return "Contract";
  if (jobType === "INTERNSHIP") return "Internship";
  return jobType.replace("_", " ");
}

export async function getAllJobs(params: GetAllJobsParams): Promise<PaginatedJobs> {
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const location = typeof params.location === "string" ? params.location.trim() : "";
  const typeParam = typeof params.type === "string" ? params.type.trim() : "";

  const page = typeof params.page === "string" ? parseInt(params.page, 10) : (params.page || 1);
  const limit = typeof params.limit === "string" ? parseInt(params.limit, 10) : (params.limit || 7);

  const whereClause: any = {};

  if (query) {
    whereClause.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { about: { contains: query, mode: "insensitive" } },
      { recruiter: { companyName: { contains: query, mode: "insensitive" } } },
    ];
  }

  if (location) {
    whereClause.location = { contains: location, mode: "insensitive" };
  }

  if (typeParam) {
    const t = typeParam.toLowerCase();
    let pType: JobType | undefined;
    if (t.includes("internship")) pType = "INTERNSHIP";
    else if (t.includes("part-time") || t.includes("part time")) pType = "PART_TIME";
    else if (t.includes("contract")) pType = "CONTRACT";
    else if (t.includes("full-time") || t.includes("full time")) pType = "FULL_TIME";
    
    if (pType) {
      whereClause.jobType = pType;
    }
  }

  const [total, jobs] = await Promise.all([
    prisma.job.count({ where: whereClause }),
    prisma.job.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      include: { recruiter: true, category: true },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  const mappedJobs: Job[] = jobs.map(j => ({
    id: j.slug,
    title: j.title,
    company: j.recruiter.companyName,
    companyInitial: j.recruiter.companyName.charAt(0).toUpperCase(),
    location: j.location || "Unknown",
    type: mapJobTypeToString(j.jobType),
    term: j.term,
    skills: j.skills,
    postedAt: j.createdAt.toISOString(),
    about: j.about,
    responsibilities: j.responsibilities,
    requirements: j.requirements,
  }));

  return {
    jobs: mappedJobs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getJobById(id: string): Promise<Job | null> {
  const job = await prisma.job.findUnique({
    where: { slug: id },
    include: { recruiter: true }
  });

  if (!job) return null;

  return {
    id: job.slug,
    title: job.title,
    company: job.recruiter.companyName,
    companyInitial: job.recruiter.companyName.charAt(0).toUpperCase(),
    location: job.location || "Unknown",
    type: mapJobTypeToString(job.jobType),
    term: job.term,
    skills: job.skills,
    postedAt: job.createdAt.toISOString(),
    about: job.about,
    responsibilities: job.responsibilities,
    requirements: job.requirements,
  };
}

export async function getUniqueLocations(): Promise<string[]> {
  const locationGroups = await prisma.job.groupBy({
    by: ["location"]
  });
  return locationGroups.map(g => g.location).filter(Boolean) as string[];
}
