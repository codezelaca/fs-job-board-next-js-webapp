"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function signupUser(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string; // "RECRUITER" or "JOB_SEEKER"

    if (!name || !email || !password || !role) {
      return { error: "All fields are required." };
    }

    if (password.length < 8) {
      return { error: "Password must be at least 8 characters long." };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "An account with this email already exists." };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role === "RECRUITER" ? "RECRUITER" : "JOB_SEEKER",
        onboardingCompleted: false,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("[SIGNUP_ERROR]", error);
    return { error: "An error occurred during signup." };
  }
}

export async function forgotPassword(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    if (!email) return { error: "Email is required." };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return success anyway to prevent email enumeration attacks
      return { success: true };
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    // Send email
    const emailResult = await sendPasswordResetEmail(email, token);
    if (emailResult.error) {
      return { error: emailResult.error };
    }

    return { success: true };
  } catch (error) {
    console.error("[FORGOT_PASSWORD_ERROR]", error);
    return { error: "An error occurred." };
  }
}

export async function resetPassword(formData: FormData) {
  try {
    const token = formData.get("token") as string;
    const password = formData.get("password") as string;

    if (!token || !password) {
      return { error: "Missing required fields." };
    }

    if (password.length < 8) {
      return { error: "Password must be at least 8 characters long." };
    }

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetRecord) {
      return { error: "Invalid or expired token." };
    }

    if (new Date() > resetRecord.expiresAt) {
      // Cleanup expired token
      await prisma.passwordResetToken.delete({ where: { token } });
      return { error: "Token has expired." };
    }

    // Update password
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email: resetRecord.email },
      data: { passwordHash },
    });

    // Delete token
    await prisma.passwordResetToken.delete({ where: { token } });

    return { success: true };
  } catch (error) {
    console.error("[RESET_PASSWORD_ERROR]", error);
    return { error: "An error occurred." };
  }
}
