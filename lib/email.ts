import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy-key");

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;

  // Fallback for development if RESEND_API_KEY is missing
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "dummy-key") {
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
      from: "CCA Job Board <noreply@codezela.com>", // Update this when domain is verified
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
