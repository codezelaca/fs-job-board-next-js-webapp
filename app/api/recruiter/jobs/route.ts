import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
      applicationUrl: j.applicationUrl,
      applicationEmail: j.applicationEmail,
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
