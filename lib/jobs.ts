import { jobs } from "@/data/jobs";
import { Job } from "@/types/job";

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

export async function getAllJobs(params: GetAllJobsParams): Promise<PaginatedJobs> {
  const query = typeof params.q === "string" ? params.q.toLowerCase() : "";
  const location = typeof params.location === "string" ? params.location.toLowerCase() : "";
  const type = typeof params.type === "string" ? params.type : "";

  const page = typeof params.page === "string" ? parseInt(params.page, 10) : (params.page || 1);
  const limit = typeof params.limit === "string" ? parseInt(params.limit, 10) : (params.limit || 7);

  const filteredJobs = jobs.filter((job) => {
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

    if (type && type !== "" && !job.type.includes(type)) {
      return false;
    }

    return true;
  });

  const total = filteredJobs.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, total);
  
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  return {
    jobs: paginatedJobs,
    total,
    page,
    limit,
    totalPages,
  };
}

export async function getJobById(id: string): Promise<Job | null> {
  const job = jobs.find((j) => j.id === id);
  return job || null;
}

export async function getUniqueLocations(): Promise<string[]> {
  const rawLocations = Array.from(new Set(jobs.map((j) => j.location)));
  return rawLocations;
}
