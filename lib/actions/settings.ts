"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

// Helper to validate URL
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export async function updateRecruiterProfile(formData: FormData) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "RECRUITER") {
      return { error: "Unauthorized." };
    }

    const name = formData.get("name") as string;
    const companyName = formData.get("companyName") as string;
    const companyWebsite = formData.get("companyWebsite") as string;
    const aboutCompany = formData.get("aboutCompany") as string;

    if (!name || name.trim().length < 2 || name.length > 50) {
      return { error: "Name must be between 2 and 50 characters." };
    }

    if (!companyName || companyName.trim().length < 2 || companyName.length > 100) {
      return { error: "Company Name must be between 2 and 100 characters." };
    }

    if (companyWebsite && !isValidUrl(companyWebsite)) {
      return { error: "Invalid website URL format (must include http/https)." };
    }

    if (!aboutCompany || aboutCompany.trim().length < 50 || aboutCompany.length > 2000) {
      return { error: "About Company description must be between 50 and 2000 characters." };
    }

    // Update in transaction to preserve consistency
    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: { name },
      }),
      prisma.recruiter.update({
        where: { userId: session.user.id },
        data: {
          companyName,
          companyWebsite: companyWebsite || null,
          aboutCompany,
        },
      }),
    ]);

    return { success: true };
  } catch (error: any) {
    console.error("[UPDATE_RECRUITER_SETTINGS_ERROR]", error);
    return { error: "Failed to update profile details. Please try again." };
  }
}

export async function updateCandidateProfile(formData: FormData) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "JOB_SEEKER") {
      return { error: "Unauthorized." };
    }

    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const resumeUrl = formData.get("resumeUrl") as string;
    const skillsString = formData.get("skills") as string;

    if (!name || name.trim().length < 2 || name.length > 50) {
      return { error: "Name must be between 2 and 50 characters." };
    }

    if (!bio || bio.trim().length < 50 || bio.length > 2000) {
      return { error: "Bio must be between 50 and 2000 characters." };
    }

    if (resumeUrl && !isValidUrl(resumeUrl)) {
      return { error: "Invalid resume URL format (must include http/https)." };
    }

    const skills = skillsString
      ? skillsString.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    if (skills.length === 0) {
      return { error: "Please register at least one skill." };
    }

    if (skills.length > 20) {
      return { error: "Maximum of 20 skills allowed." };
    }

    // Update inside a database transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: { name },
      }),
      prisma.candidate.update({
        where: { userId: session.user.id },
        data: {
          bio,
          resumeUrl: resumeUrl || null,
          skills,
        },
      }),
    ]);

    return { success: true };
  } catch (error: any) {
    console.error("[UPDATE_CANDIDATE_SETTINGS_ERROR]", error);
    return { error: "Failed to update profile details. Please try again." };
  }
}

export async function changeUserPassword(formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      return { error: "Unauthorized." };
    }

    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return { error: "All password fields are required." };
    }

    if (newPassword !== confirmPassword) {
      return { error: "New passwords do not match." };
    }

    if (newPassword.length < 8 || newPassword.length > 100) {
      return { error: "New password must be between 8 and 100 characters long." };
    }

    // Get the user from the database to check current password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.passwordHash) {
      return { error: "User or current password could not be verified." };
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isPasswordCorrect) {
      return { error: "Incorrect current password." };
    }

    // Update with newly hashed password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash },
    });

    return { success: true };
  } catch (error: any) {
    console.error("[CHANGE_PASSWORD_ERROR]", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
