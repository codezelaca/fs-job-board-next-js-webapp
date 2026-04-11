import { JobStatus, JobType, LocationType } from "@prisma/client";

export interface ValidationError {
  field: string;
  message: string;
}

export function validateJobPayload(body: Record<string, any>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!body.title || typeof body.title !== "string" || body.title.trim().length < 3)
    errors.push({ field: "title", message: "Job title must be at least 3 characters." });
  else if (body.title.trim().length > 120)
    errors.push({ field: "title", message: "Job title must be under 120 characters." });

  if (!body.about || typeof body.about !== "string" || body.about.trim().length < 50)
    errors.push({ field: "about", message: "Job description must be at least 50 characters." });
  else if (body.about.trim().length > 5000)
    errors.push({ field: "about", message: "Job description must be under 5000 characters." });

  if (!body.term || typeof body.term !== "string" || body.term.trim().length < 2)
    errors.push({ field: "term", message: "Employment term is required (e.g. Full year, 3 months)." });

  if (!body.categoryId || typeof body.categoryId !== "string")
    errors.push({ field: "categoryId", message: "Please select a job category." });

  const validJobTypes = Object.values(JobType) as string[];
  if (!body.jobType || !validJobTypes.includes(body.jobType as string))
    errors.push({ field: "jobType", message: "Please select a valid job type." });

  const validLocationTypes = Object.values(LocationType) as string[];
  if (!body.locationType || !validLocationTypes.includes(body.locationType as string))
    errors.push({ field: "locationType", message: "Please select a valid location type." });

  if (body.locationType !== "REMOTE") {
    if (!body.location || typeof body.location !== "string" || body.location.trim().length < 2)
      errors.push({ field: "location", message: "City/location is required for on-site or hybrid roles." });
  }

  const salaryMin = (body.salaryMin !== undefined && body.salaryMin !== "" && body.salaryMin !== null) ? Number(body.salaryMin) : null;
  const salaryMax = (body.salaryMax !== undefined && body.salaryMax !== "" && body.salaryMax !== null) ? Number(body.salaryMax) : null;
  
  if (salaryMin !== null && (isNaN(salaryMin) || salaryMin < 0))
    errors.push({ field: "salaryMin", message: "Minimum salary must be a positive number." });
  if (salaryMax !== null && (isNaN(salaryMax) || salaryMax < 0))
    errors.push({ field: "salaryMax", message: "Maximum salary must be a positive number." });
  if (salaryMin !== null && salaryMax !== null && !isNaN(salaryMin) && !isNaN(salaryMax) && salaryMax < salaryMin)
    errors.push({ field: "salaryMax", message: "Maximum salary must be greater than minimum." });

  if (!Array.isArray(body.skills) || body.skills.length === 0)
    errors.push({ field: "skills", message: "Please add at least one required skill." });
  else if (body.skills.length > 20)
    errors.push({ field: "skills", message: "Maximum 20 skills allowed." });

  if (!Array.isArray(body.responsibilities) || body.responsibilities.length === 0)
    errors.push({ field: "responsibilities", message: "Please add at least one responsibility." });
  else if (body.responsibilities.length > 20)
    errors.push({ field: "responsibilities", message: "Maximum 20 responsibilities allowed." });

  if (!Array.isArray(body.requirements) || body.requirements.length === 0)
    errors.push({ field: "requirements", message: "Please add at least one requirement." });
  else if (body.requirements.length > 20)
    errors.push({ field: "requirements", message: "Maximum 20 requirements allowed." });

  const validStatuses = Object.values(JobStatus) as string[];
  if (body.status && !validStatuses.includes(body.status as string))
    errors.push({ field: "status", message: "Invalid job status." });

  if (body.expiresAt && typeof body.expiresAt === "string") {
    const date = new Date(body.expiresAt);
    if (isNaN(date.getTime()))
      errors.push({ field: "expiresAt", message: "Expiry date must be a valid date." });
    else if (date < new Date())
      errors.push({ field: "expiresAt", message: "Expiry date must be in the future." });
  }

  return errors;
}
