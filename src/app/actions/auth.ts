"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerStudent(formData: FormData) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const department = formData.get("department") as string;
  const year = formData.get("year") as string;
  const section = formData.get("section") as string;

  if (!email || !name || !password || !department) {
    return { error: "All required fields must be filled out." };
  }

  // Validate Email Domain
  // regex to match anything@cb.students.amrita.edu
  const emailRegex = /^[a-zA-Z0-9._-]+@cb\.students\.amrita\.edu$/;
  if (!emailRegex.test(email)) {
    return { error: "Invalid email domain. Must be @cb.students.amrita.edu" };
  }

  // Extract Register Number from the email prefix (e.g. cb.en.u4cys22001 -> CB.EN.U4CYS22001)
  const prefix = email.split('@')[0];
  const registerNumber = prefix.toUpperCase();

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: "STUDENT",
        department,
        year: year || null,
        section: section || null,
        registerNumber
      }
    });

    return { success: true };
  } catch (err) {
    console.error("Registration error:", err);
    return { error: "Internal server error during registration." };
  }
}

import { v4 as uuidv4 } from "uuid";

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string;
  
  if (!email) {
    return { error: "Email is required" };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    return { success: true }; // Prevent email enumeration
  }

  const token = uuidv4();
  const expires = new Date(Date.now() + 3600000); // 1 hour

  await prisma.passwordResetToken.create({
    data: { email, token, expires }
  });

  // MOCK EMAIL SENDING
  console.log("======================================");
  console.log(`PASSWORD RESET EMAIL TO: ${email}`);
  console.log(`LINK: http://localhost:3000/reset-password?token=${token}`);
  console.log("======================================");

  return { success: true };
}

export async function resetPasswordWithToken(formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  
  if (!token || !password || password.length < 6) {
    return { error: "Invalid input. Password must be at least 6 characters." };
  }

  const resetRecord = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!resetRecord) return { error: "Invalid or expired token" };

  if (resetRecord.expires < new Date()) {
    await prisma.passwordResetToken.delete({ where: { token } });
    return { error: "Token has expired" };
  }

  const user = await prisma.user.findUnique({ where: { email: resetRecord.email } });
  if (!user) return { error: "User no longer exists" };

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: hashedPassword }
  });

  await prisma.passwordResetToken.deleteMany({ where: { email: user.email } });

  return { success: true };
}
