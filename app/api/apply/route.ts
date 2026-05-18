import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "JOB_SEEKER") {
      return NextResponse.json({ error: "Unauthorized. You must be logged in as a Candidate to apply." }, { status: 401 });
    }

    const body = await request.json();
    const { jobSlug, linkedInUrl, portfolioUrl, coverLetter } = body;

    // Server-Side Validation
    if (!jobSlug || typeof jobSlug !== "string") {
      return NextResponse.json({ error: "Missing or invalid job reference." }, { status: 400 });
    }

    if (!linkedInUrl || typeof linkedInUrl !== "string" || !linkedInUrl.startsWith("http")) {
      return NextResponse.json({ error: "Please provide a valid LinkedIn URL (must start with http)." }, { status: 400 });
    }

    if (!coverLetter || typeof coverLetter !== "string" || coverLetter.trim().length < 10) {
      return NextResponse.json({ error: "Please provide a cover letter (at least 10 characters)." }, { status: 400 });
    }

    if (portfolioUrl && (typeof portfolioUrl !== "string" || !portfolioUrl.startsWith("http"))) {
      return NextResponse.json({ error: "Please provide a valid portfolio or GitHub URL." }, { status: 400 });
    }

    // 1. Fetch Job from Database securely using Slug ID
    const job = await prisma.job.findUnique({
      where: { slug: jobSlug },
    });

    if (!job) {
      return NextResponse.json({ error: "The specified job listing no longer exists." }, { status: 404 });
    }

    // 2. Fetch the candidate profile to copy the onboarding resumeUrl
    const candidateProfile = await prisma.candidate.findUnique({
      where: { userId: session.user.id },
    });

    // 3. Create the Database Application connection
    const application = await prisma.application.create({
      data: {
        jobId: job.id,
        applicantId: session.user.id,
        coverLetter,
        linkedInUrl,
        portfolioUrl: portfolioUrl || null,
        resumeUrl: candidateProfile?.resumeUrl || null, // Auto-link their saved resume URL!
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { success: true, message: "Application submitted successfully.", applicationId: application.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Apply API Error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later.", details: error.message || String(error) },
      { status: 500 }
    );
  }
}
