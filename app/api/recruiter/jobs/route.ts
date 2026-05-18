import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { JobStatus, JobType, LocationType } from "@prisma/client";
import { validateJobPayload } from "@/lib/validations/job";
import { auth } from "@/auth";

// ─── GET: list all recruiter jobs ────────────────────────────────────────────

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "RECRUITER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: session.user.id },
    });

    if (!recruiter) {
      return NextResponse.json({ error: "Recruiter profile not found" }, { status: 404 });
    }

    const jobs = await prisma.job.findMany({
      where: { recruiterId: recruiter.id },
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



// ─── POST: create a new job ───────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const errors = validateJobPayload(body);
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

    const session = await auth();
    if (!session || session.user.role !== "RECRUITER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the recruiter linked to the authenticated user
    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: session.user.id }
    });
    
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
