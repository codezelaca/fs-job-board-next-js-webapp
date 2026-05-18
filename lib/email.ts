import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy-key");

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;

  // Fallback for development if RESEND_API_KEY is missing
  if (
    !process.env.RESEND_API_KEY ||
    process.env.RESEND_API_KEY === "dummy-key"
  ) {
    console.log("==========================================");
    console.log("📨 MOCK EMAIL SENDER (Missing RESEND_API_KEY)");
    console.log(`To: ${email}`);
    console.log(`Subject: Reset your password`);
    console.log(`Link: ${resetLink}`);
    console.log("==========================================");
    return { success: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "CCA Job Board <onboarding@resend.dev>", // Update this when domain is verified
      to: [email],
      subject: "Reset your password",
      html: `
        <div>
          <h1>Reset your password</h1>
          <p>You have requested to reset your password. Click the link below to set a new password:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("[EMAIL_ERROR]", error);
      return { error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("[EMAIL_EXCEPTION]", err);
    return { error: "Failed to send email." };
  }
}

export async function sendShortlistEmail(params: {
  candidateEmail: string;
  candidateName: string;
  jobTitle: string;
  companyName: string;
  interviewDate: string;
  meetLink: string;
}) {
  const { candidateEmail, candidateName, jobTitle, companyName, interviewDate, meetLink } = params;

  if (
    !process.env.RESEND_API_KEY ||
    process.env.RESEND_API_KEY === "dummy-key"
  ) {
    console.log("==========================================");
    console.log("📨 MOCK EMAIL SENDER - SHORTLISTED INVITATION");
    console.log(`To: ${candidateEmail} (${candidateName})`);
    console.log(`Job: ${jobTitle} at ${companyName}`);
    console.log(`Interview Date/Time: ${interviewDate}`);
    console.log(`Meeting Link: ${meetLink}`);
    console.log("==========================================");
    return { success: true };
  }

  try {
    const formattedDate = new Date(interviewDate).toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    });

    const { data, error } = await resend.emails.send({
      from: "CCA Job Board <onboarding@resend.dev>",
      to: [candidateEmail],
      subject: `Good news! You have been shortlisted for ${jobTitle} at ${companyName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; rounded-xl: 12px; background-color: #ffffff;">
          <h2 style="color: #4f46e5; margin-bottom: 6px;">Congratulations, ${candidateName}!</h2>
          <p style="font-size: 15px; color: #3f3f46; line-height: 1.5;">
            We are excited to let you know that you have been shortlisted for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>. 
            The recruitment team has scheduled an interview invitation with you.
          </p>
          
          <div style="background-color: #f4f4f5; padding: 16px; border-radius: 12px; margin: 20px 0; border: 1px solid #e4e4e7;">
            <h4 style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a;">Interview Details</h4>
            <p style="margin: 4px 0; font-size: 14px; color: #18181b;"><strong>Date & Time:</strong> ${formattedDate}</p>
            <p style="margin: 4px 0; font-size: 14px; color: #18181b;"><strong>Interview Platform:</strong> Google Meet / Video Link</p>
            <p style="margin: 12px 0 4px 0; font-size: 14px;">
              <a href="${meetLink}" target="_blank" style="background-color: #4f46e5; color: #ffffff; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                Join Video Interview
              </a>
            </p>
          </div>
          
          <p style="font-size: 14px; color: #71717a; line-height: 1.5; margin-top: 24px;">
            Please ensure you join the link on time. If you have any conflicts, feel free to reach out to the employer.
          </p>
          <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 24px 0;" />
          <p style="font-size: 12px; color: #a1a1aa; text-align: center;">Sent by CCA Job Board Onboarding System</p>
        </div>
      `,
    });

    if (error) {
      console.error("[EMAIL_SHORTLIST_ERROR]", error);
      return { error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("[EMAIL_SHORTLIST_EXCEPTION]", err);
    return { error: err.message || "Failed to send shortlist email." };
  }
}

export async function sendRejectionEmail(params: {
  candidateEmail: string;
  candidateName: string;
  jobTitle: string;
  companyName: string;
  rejectionReason?: string;
}) {
  const { candidateEmail, candidateName, jobTitle, companyName, rejectionReason } = params;

  if (
    !process.env.RESEND_API_KEY ||
    process.env.RESEND_API_KEY === "dummy-key"
  ) {
    console.log("==========================================");
    console.log("📨 MOCK EMAIL SENDER - REJECTION FEEDBACK");
    console.log(`To: ${candidateEmail} (${candidateName})`);
    console.log(`Job: ${jobTitle} at ${companyName}`);
    console.log(`Reason: ${rejectionReason || "No feedback reason provided."}`);
    console.log("==========================================");
    return { success: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "CCA Job Board <onboarding@resend.dev>",
      to: [candidateEmail],
      subject: `Update regarding your application for ${jobTitle} at ${companyName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #e11d48; margin-bottom: 6px;">Dear ${candidateName},</h2>
          <p style="font-size: 15px; color: #3f3f46; line-height: 1.5;">
            Thank you very much for taking the time to apply for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong> and for your interest in our company.
          </p>
          <p style="font-size: 15px; color: #3f3f46; line-height: 1.5;">
            After careful review of your application, we regret to inform you that we will not be moving forward with your candidacy at this time. 
            We received many highly qualified applications, making this decision extremely difficult.
          </p>
          
          ${
            rejectionReason
              ? `
            <div style="background-color: #fff1f2; padding: 16px; border-radius: 12px; margin: 20px 0; border: 1px solid #ffe4e6;">
              <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #b91c1c;">Employer Feedback</h4>
              <p style="margin: 0; font-size: 14px; color: #9f1239; line-height: 1.5; font-style: italic;">
                "${rejectionReason}"
              </p>
            </div>
            `
              : ""
          }
          
          <p style="font-size: 15px; color: #3f3f46; line-height: 1.5;">
            We appreciate the effort you put into your application and wish you the best of luck in your job search and future career endeavors.
          </p>
          
          <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 24px 0;" />
          <p style="font-size: 12px; color: #a1a1aa; text-align: center;">Sent by CCA Job Board Onboarding System</p>
        </div>
      `,
    });

    if (error) {
      console.error("[EMAIL_REJECTION_ERROR]", error);
      return { error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("[EMAIL_REJECTION_EXCEPTION]", err);
    return { error: err.message || "Failed to send rejection email." };
  }
}
