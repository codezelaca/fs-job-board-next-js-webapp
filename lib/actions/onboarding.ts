"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function submitRecruiterOnboarding(formData: FormData) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "RECRUITER") {
      return { error: "Unauthorized." };
    }

    const companyName = formData.get("companyName") as string;
    const companyWebsite = formData.get("companyWebsite") as string;
    const aboutCompany = formData.get("aboutCompany") as string;

    if (!companyName || !aboutCompany) {
      return { error: "Company Name and About Company are required." };
    }

    // Create recruiter profile
    await prisma.recruiter.create({
      data: {
        userId: session.user.id,
        companyName,
        companyWebsite: companyWebsite || null,
        aboutCompany,
      },
    });

    // Update user onboarding status
    await prisma.user.update({
      where: { id: session.user.id },
      data: { onboardingCompleted: true },
    });

    return { success: true };
  } catch (error) {
    console.error("[RECRUITER_ONBOARDING_ERROR]", error);
    return { error: "An error occurred during onboarding." };
  }
}

export async function submitCandidateOnboarding(formData: FormData) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "JOB_SEEKER") {
      return { error: "Unauthorized." };
    }

    const bio = formData.get("bio") as string;
    const resumeUrl = formData.get("resumeUrl") as string;
    const skillsString = formData.get("skills") as string;

    const skills = skillsString
      ? skillsString.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    if (!bio || skills.length === 0) {
      return { error: "Bio and at least one skill are required." };
    }

    // Create candidate profile
    await prisma.candidate.create({
      data: {
        userId: session.user.id,
        bio,
        resumeUrl: resumeUrl || null,
        skills,
      },
    });

    // Update user onboarding status
    await prisma.user.update({
      where: { id: session.user.id },
      data: { onboardingCompleted: true },
    });

    return { success: true };
  } catch (error) {
    console.error("[CANDIDATE_ONBOARDING_ERROR]", error);
    return { error: "An error occurred during onboarding." };
  }
}
