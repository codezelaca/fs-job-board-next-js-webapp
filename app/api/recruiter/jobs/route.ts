import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { JobStatus, JobType, LocationType } from "@prisma/client";

// ─── GET: list all recruiter jobs ────────────────────────────────────────────

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        recruiter: true,
        category: true,
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const mapped = jobs.map((j) => ({
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
      applicationsCount: j._count.applications,
      createdAt: j.createdAt.toISOString(),
      updatedAt: j.updatedAt.toISOString(),
      expiresAt: j.expiresAt?.toISOString() ?? null,
    }));

    return NextResponse.json({ jobs: mapped });
  } catch (error) {
    console.error("[RECRUITER_JOBS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function isValidUrl(url: string): boolean {
  try { new URL(url); return true; } catch { return false; }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Validation ───────────────────────────────────────────────────────────────

interface ValidationError { field: string; message: string; }

function validatePayload(body: Record<string, unknown>): ValidationError[] {
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

  const salaryMin = (body.salaryMin !== undefined && body.salaryMin !== "") ? Number(body.salaryMin) : null;
  const salaryMax = (body.salaryMax !== undefined && body.salaryMax !== "") ? Number(body.salaryMax) : null;
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

// ─── POST: create a new job ───────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const errors = validatePayload(body);
    if (errors.length > 0) return NextResponse.json({ errors }, { status: 422 });

    const {
      title, about, term, categoryId, jobType, locationType,
      skills, responsibilities, requirements,
      expiresAt, status = "DRAFT",
    } = body;

    const location = locationType === "REMOTE" ? null : (body.location?.trim() || null);
    const salaryMin = (body.salaryMin !== "" && body.salaryMin != null) ? Number(body.salaryMin) : null;
    const salaryMax = (body.salaryMax !== "" && body.salaryMax != null) ? Number(body.salaryMax) : null;

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) return NextResponse.json(
      { errors: [{ field: "categoryId", message: "Selected category does not exist." }] }, { status: 422 }
    );

    // Use first recruiter until auth is implemented
    const recruiter = await prisma.recruiter.findFirst();
    if (!recruiter) return NextResponse.json(
      { error: "No recruiter account found. Please set up your recruiter profile first." }, { status: 403 }
    );

    // Unique slug generation
    let baseSlug = generateSlug(title.trim());
    let slug = baseSlug;
    let suffix = 1;
    while (await prisma.job.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const job = await prisma.job.create({
      data: {
        slug,
        title: title.trim(),
        about: about.trim(),
        term: term.trim(),
        categoryId,
        jobType: jobType as JobType,
        locationType: locationType as LocationType,
        location,
        salaryMin,
        salaryMax,
        skills: (skills as string[]).map((s) => s.trim()).filter(Boolean),
        responsibilities: (responsibilities as string[]).map((r) => r.trim()).filter(Boolean),
        requirements: (requirements as string[]).map((r) => r.trim()).filter(Boolean),
        status: status as JobStatus,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        recruiterId: recruiter.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Job "${job.title}" ${status === "PUBLISHED" ? "published" : "saved as draft"} successfully.`,
        slug: job.slug,
        id: job.id,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[RECRUITER_JOBS_POST]", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later.", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
