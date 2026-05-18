"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { ApplicationStatus } from "@prisma/client";
import { sendShortlistEmail, sendRejectionEmail } from "@/lib/email";

export async function updateApplicationStatus(
  applicationId: string,
  status: "ACCEPTED" | "REJECTED",
  details?: {
    rejectionReason?: string;
    interviewDate?: string;
    meetLink?: string;
  }
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

    // 2. Fetch the Application, verify ownership, and load applicant & job info
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          include: {
            recruiter: true,
          },
        },
        applicant: true,
      },
    });

    if (!application) {
      return { error: "Application not found." };
    }

    if (application.job.recruiterId !== recruiter.id) {
      return { error: "Forbidden. You do not own the job listing for this application." };
    }

    // 3. Validate response parameters based on status
    const updateData: any = { status: status as ApplicationStatus };

    if (status === "ACCEPTED") {
      if (!details?.interviewDate) {
        return { error: "Interview date and time are required for shortlisting." };
      }
      if (!details?.meetLink || !details.meetLink.trim()) {
        return { error: "A video interview meeting link is required." };
      }

      // Validate interview date is in the future
      const parsedDate = new Date(details.interviewDate);
      if (isNaN(parsedDate.getTime()) || parsedDate <= new Date()) {
        return { error: "Interview date must be scheduled in the future." };
      }

      // Validate URL format roughly
      if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(details.meetLink.trim())) {
        return { error: "Please enter a valid meeting URL (starting with http:// or https://)." };
      }

      updateData.interviewDate = parsedDate;
      updateData.meetLink = details.meetLink.trim();
      updateData.rejectionReason = null;
    } else {
      updateData.rejectionReason = details?.rejectionReason?.trim() || null;
      updateData.interviewDate = null;
      updateData.meetLink = null;
    }

    // 4. Update the Application in DB
    const updatedApp = await prisma.application.update({
      where: { id: applicationId },
      data: updateData,
    });

    // 5. Send notification email to the candidate
    const candidateName = application.applicant.name || "Candidate";
    const candidateEmail = application.applicant.email;
    const jobTitle = application.job.title;
    const companyName = application.job.recruiter.companyName;

    if (status === "ACCEPTED") {
      await sendShortlistEmail({
        candidateEmail,
        candidateName,
        jobTitle,
        companyName,
        interviewDate: details!.interviewDate!,
        meetLink: details!.meetLink!.trim(),
      });
    } else {
      await sendRejectionEmail({
        candidateEmail,
        candidateName,
        jobTitle,
        companyName,
        rejectionReason: details?.rejectionReason?.trim() || undefined,
      });
    }

    revalidatePath("/recruiter-dashboard/applications");
    revalidatePath("/recruiter-dashboard");

    return { success: true, application: updatedApp };
  } catch (error: any) {
    console.error("[UPDATE_APPLICATION_STATUS_ERROR]", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
