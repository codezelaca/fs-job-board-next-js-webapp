"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { ApplicationStatus } from "@prisma/client";

export async function updateApplicationStatus(
  applicationId: string,
  status: "ACCEPTED" | "REJECTED"
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "RECRUITER") {
      return { error: "Unauthorized." };
    }

    // 1. Fetch Recruiter profile
    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: session.user.id },
    });

    if (!recruiter) {
      return { error: "Recruiter profile not found." };
    }

    // 2. Fetch the Application and verify ownership through Job
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: true,
      },
    });

    if (!application) {
      return { error: "Application not found." };
    }

    if (application.job.recruiterId !== recruiter.id) {
      return { error: "Forbidden. You do not own the job listing for this application." };
    }

    // 3. Update the status
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: status as ApplicationStatus },
    });

    revalidatePath("/recruiter-dashboard/applications");
    revalidatePath("/recruiter-dashboard");

    return { success: true };
  } catch (error: any) {
    console.error("[UPDATE_APPLICATION_STATUS_ERROR]", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
