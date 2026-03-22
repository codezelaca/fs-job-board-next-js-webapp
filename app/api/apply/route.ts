import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, linkedInUrl, portfolioUrl, coverLetter } = body;

    // Server-Side Validation
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

    // Simulate database insertion or third-party API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate success response
    return NextResponse.json(
      { success: true, message: "Application submitted successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Apply API Error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
