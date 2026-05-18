import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { JobStatus, JobType, LocationType } from "@prisma/client";
import { validateJobPayload } from "@/lib/validations/job";
import { auth } from "@/auth";

// ─── GET: Fetch single recruiter job ──────────────────────────────────────────

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await auth();
    if (!session || session.user.role !== "RECRUITER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        recruiter: true,
        category: true,
        _count: { select: { applications: true } },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.recruiter.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      id: job.id,
      slug: job.slug,
      title: job.title,
      company: job.recruiter.companyName,
      companyLogoUrl: job.recruiter.companyLogoUrl,
      location: job.location ?? "Remote",
      locationType: job.locationType,
      jobType: job.jobType,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      status: job.status,
      category: job.category.name,
      categoryId: job.categoryId,
      skills: job.skills,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      about: job.about,
      term: job.term,
      applicationsCount: job._count.applications,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
      expiresAt: job.expiresAt?.toISOString() ?? null,
    });
  } catch (error) {
    console.error("[RECRUITER_JOB_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── PATCH: Update a job ─────────────────────────────────────────────────────

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const errors = validateJobPayload(body);
    if (errors.length > 0) return NextResponse.json({ errors }, { status: 422 });

    const {
      title, about, term, categoryId, jobType, locationType,
      skills, responsibilities, requirements,
      expiresAt, status,
    } = body;

    const location = locationType === "REMOTE" ? null : (body.location?.trim() || null);
    const salaryMin = (body.salaryMin !== "" && body.salaryMin != null) ? Number(body.salaryMin) : null;
    const salaryMax = (body.salaryMax !== "" && body.salaryMax != null) ? Number(body.salaryMax) : null;

    const session = await auth();
    if (!session || session.user.role !== "RECRUITER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify job exists and belongs to user
    const existingJob = await prisma.job.findUnique({ 
      where: { id },
      include: { recruiter: true }
    });
    
    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (existingJob.recruiter.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Verify category exists
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) return NextResponse.json(
      { errors: [{ field: "categoryId", message: "Selected category does not exist." }] }, { status: 422 }
    );

    const job = await prisma.job.update({
      where: { id },
      data: {
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
      },
    });

    return NextResponse.json({
      success: true,
      message: `Job "${job.title}" updated successfully.`,
      slug: job.slug,
      id: job.id,
    });
  } catch (error: unknown) {
    console.error("[RECRUITER_JOB_PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later.", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// ─── DELETE: Remove a job ────────────────────────────────────────────────────

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await auth();
    if (!session || session.user.role !== "RECRUITER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify existence
    const job = await prisma.job.findUnique({ 
      where: { id },
      include: { recruiter: true }
    });
    if (!job) {
      return NextResponse.json({ error: "Job already deleted or not found." }, { status: 404 });
    }

    if (job.recruiter.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.job.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Job deleted successfully.",
    });
  } catch (error) {
    console.error("[RECRUITER_JOB_DELETE]", error);
    return NextResponse.json({ error: "Failed to delete job. It may have active applications." }, { status: 500 });
  }
}
