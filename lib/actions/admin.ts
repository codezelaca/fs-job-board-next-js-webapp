"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";

// Guard helper to check if active user is an admin
async function ensureAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized. Admin role required.");
  }
  return session;
}

export async function adminUpdateUser(
  userId: string,
  name: string,
  role: "RECRUITER" | "JOB_SEEKER",
  extraData?: {
    companyName?: string;
    bio?: string;
    skills?: string;
    resumeUrl?: string;
  }
) {
  try {
    await ensureAdmin();

    if (!name || name.trim().length < 2 || name.length > 50) {
      return { error: "Name must be between 2 and 50 characters." };
    }

    // Wrap in a transaction to ensure role and profile details are saved together
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          name,
          role: role as Role,
        },
      });

      if (role === "RECRUITER") {
        if (!extraData?.companyName || extraData.companyName.trim().length < 2) {
          throw new Error("Company name is required to transition to Recruiter role.");
        }
        await tx.recruiter.upsert({
          where: { userId },
          update: { companyName: extraData.companyName },
          create: { userId, companyName: extraData.companyName },
        });
      } else if (role === "JOB_SEEKER") {
        const skillsArray = extraData?.skills
          ? extraData.skills.split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0)
          : [];

        await tx.candidate.upsert({
          where: { userId },
          update: {
            bio: extraData?.bio || null,
            skills: skillsArray,
            resumeUrl: extraData?.resumeUrl || null,
          },
          create: {
            userId,
            bio: extraData?.bio || null,
            skills: skillsArray,
            resumeUrl: extraData?.resumeUrl || null,
          },
        });
      }
    });

    revalidatePath("/admin-dashboard/users");
    return { success: true };
  } catch (error: any) {
    console.error("[ADMIN_UPDATE_USER_ERROR]", error);
    return { error: error.message || "Failed to update user profile." };
  }
}

export async function adminResetPassword(userId: string) {
  try {
    await ensureAdmin();

    // Generate a strong 10-character temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-2).toUpperCase();
    
    // Hash the password
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    // Save password
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { success: true, tempPassword };
  } catch (error: any) {
    console.error("[ADMIN_RESET_PASSWORD_ERROR]", error);
    return { error: error.message || "Failed to reset user credentials." };
  }
}

export async function adminDeleteJob(jobId: string) {
  try {
    await ensureAdmin();

    await prisma.job.delete({
      where: { id: jobId },
    });

    revalidatePath("/admin-dashboard/jobs");
    revalidatePath("/recruiter-dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("[ADMIN_DELETE_JOB_ERROR]", error);
    return { error: error.message || "Failed to delete the job listing." };
  }
}

export async function adminDeleteUser(userId: string) {
  try {
    const session = await ensureAdmin();

    if (userId === session.user.id) {
      return { error: "You cannot delete your own admin account!" };
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/admin-dashboard/users");
    return { success: true };
  } catch (error: any) {
    console.error("[ADMIN_DELETE_USER_ERROR]", error);
    return { error: error.message || "Failed to delete user account." };
  }
}

export async function adminUpdateSettings(formData: FormData) {
  try {
    const session = await ensureAdmin();

    const name = formData.get("name") as string;
    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!name || name.trim().length < 2 || name.length > 50) {
      return { error: "Name must be between 2 and 50 characters." };
    }

    const updateData: any = { name };

    // Handle password update if password fields are provided
    if (oldPassword || newPassword || confirmPassword) {
      if (!oldPassword || !newPassword || !confirmPassword) {
        return { error: "All password fields are required to update credentials." };
      }

      if (newPassword !== confirmPassword) {
        return { error: "New passwords do not match." };
      }

      if (newPassword.length < 8) {
        return { error: "New password must be at least 8 characters long." };
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (!user || !user.passwordHash) {
        return { error: "Unable to verify current credentials." };
      }

      const isPasswordCorrect = await bcrypt.compare(oldPassword, user.passwordHash);
      if (!isPasswordCorrect) {
        return { error: "Incorrect current password." };
      }

      updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    revalidatePath("/admin-dashboard/settings");
    return { success: true };
  } catch (error: any) {
    console.error("[ADMIN_UPDATE_SETTINGS_ERROR]", error);
    return { error: error.message || "Failed to update settings." };
  }
}

export async function adminUpdateApplicationStatus(
  applicationId: string,
  status: "ACCEPTED" | "REJECTED"
) {
  try {
    await ensureAdmin();

    await prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });

    revalidatePath("/admin-dashboard/applications");
    return { success: true };
  } catch (error: any) {
    console.error("[ADMIN_UPDATE_APP_STATUS_ERROR]", error);
    return { error: "Failed to update application status." };
  }
}

export async function adminCreateJob(jobData: {
  title: string;
  location: string | null;
  locationType: "ONSITE" | "HYBRID" | "REMOTE";
  jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  salaryMin: number | null;
  salaryMax: number | null;
  about: string;
  term: string;
  recruiterId: string;
  categoryId: string;
  skills: string[];
  responsibilities: string[];
  requirements: string[];
}) {
  try {
    await ensureAdmin();

    if (!jobData.title || jobData.title.trim().length < 3) {
      return { error: "Job title must be at least 3 characters long." };
    }
    if (!jobData.about || jobData.about.trim().length < 10) {
      return { error: "Job description must be at least 10 characters long." };
    }
    if (!jobData.recruiterId) {
      return { error: "A valid recruiter assignment is required." };
    }
    if (!jobData.categoryId) {
      return { error: "A valid category selection is required." };
    }

    // Generate unique slug
    const cleanTitle = jobData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `${cleanTitle}-${randomSuffix}`;

    await prisma.job.create({
      data: {
        slug,
        title: jobData.title,
        location: jobData.location,
        locationType: jobData.locationType,
        jobType: jobData.jobType,
        salaryMin: jobData.salaryMin,
        salaryMax: jobData.salaryMax,
        about: jobData.about,
        term: jobData.term || "Permanent",
        skills: jobData.skills,
        responsibilities: jobData.responsibilities,
        requirements: jobData.requirements,
        recruiterId: jobData.recruiterId,
        categoryId: jobData.categoryId,
        status: "PUBLISHED",
      },
    });

    revalidatePath("/admin-dashboard/jobs");
    return { success: true };
  } catch (error: any) {
    console.error("[ADMIN_CREATE_JOB_ERROR]", error);
    return { error: error.message || "Failed to create job posting." };
  }
}

export async function adminUpdateJob(
  jobId: string,
  jobData: {
    title: string;
    location: string | null;
    locationType: "ONSITE" | "HYBRID" | "REMOTE";
    jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
    salaryMin: number | null;
    salaryMax: number | null;
    about: string;
    term: string;
    recruiterId: string;
    categoryId: string;
    skills: string[];
    responsibilities: string[];
    requirements: string[];
  }
) {
  try {
    await ensureAdmin();

    if (!jobData.title || jobData.title.trim().length < 3) {
      return { error: "Job title must be at least 3 characters long." };
    }
    if (!jobData.about || jobData.about.trim().length < 10) {
      return { error: "Job description must be at least 10 characters long." };
    }
    if (!jobData.recruiterId) {
      return { error: "A valid recruiter assignment is required." };
    }
    if (!jobData.categoryId) {
      return { error: "A valid category selection is required." };
    }

    await prisma.job.update({
      where: { id: jobId },
      data: {
        title: jobData.title,
        location: jobData.location,
        locationType: jobData.locationType,
        jobType: jobData.jobType,
        salaryMin: jobData.salaryMin,
        salaryMax: jobData.salaryMax,
        about: jobData.about,
        term: jobData.term,
        skills: jobData.skills,
        responsibilities: jobData.responsibilities,
        requirements: jobData.requirements,
        recruiterId: jobData.recruiterId,
        categoryId: jobData.categoryId,
      },
    });

    revalidatePath("/admin-dashboard/jobs");
    return { success: true };
  } catch (error: any) {
    console.error("[ADMIN_UPDATE_JOB_ERROR]", error);
    return { error: error.message || "Failed to update job posting." };
  }
}
