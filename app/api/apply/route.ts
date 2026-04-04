import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobSlug, fullName, email, linkedInUrl, portfolioUrl, coverLetter } = body;

    // Server-Side Validation
    if (!jobSlug || typeof jobSlug !== "string") {
      return NextResponse.json({ error: "Missing or invalid job reference." }, { status: 400 });
    }

    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json({ error: "Please provide a valid full name." }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    if (!linkedInUrl || typeof linkedInUrl !== "string" || !linkedInUrl.startsWith("http")) {
      return NextResponse.json({ error: "Please provide a valid LinkedIn URL (must start with http)." }, { status: 400 });
    }

    if (!coverLetter || typeof coverLetter !== "string" || coverLetter.trim().length < 10) {
      return NextResponse.json({ error: "Please provide a cover letter (at least 10 characters)." }, { status: 400 });
    }

    // 1. Fetch Job from Database securely using Slug ID
    const job = await prisma.job.findUnique({
      where: { slug: jobSlug },
    });

    if (!job) {
      return NextResponse.json({ error: "The specified job listing no longer exists." }, { status: 404 });
    }

    // 2. Identify or Create Applicant (User Identity)
    let applicant = await prisma.user.findUnique({
      where: { email },
    });

    if (!applicant) {
      applicant = await prisma.user.create({
        data: {
          email,
          name: fullName,
          role: "JOB_SEEKER",
        },
      });
    } else if (!applicant.name) {
      applicant = await prisma.user.update({
        where: { id: applicant.id },
        data: { name: fullName },
      });
    }

    // 3. Create the Database Application connection
    const application = await prisma.application.create({
      data: {
        jobId: job.id,
        applicantId: applicant.id,
        coverLetter,
        linkedInUrl,
        portfolioUrl: portfolioUrl && typeof portfolioUrl === "string" ? portfolioUrl : null,
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
