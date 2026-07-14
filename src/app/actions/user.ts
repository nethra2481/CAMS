"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function changePassword(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    return { error: "Unauthorized" };
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return { error: "Invalid input. New password must be at least 6 characters." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return { error: "User not found" };
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    
    if (!isValid) {
      return { error: "Incorrect current password." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedPassword }
    });

    return { success: true };
  } catch (err) {
    console.error("Password change failed", err);
    return { error: "Internal server error" };
  }
}

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const mobile = formData.get("mobile") as string;
  const batch = formData.get("batch") as string;
  const linkedin = formData.get("linkedin") as string;
  const github = formData.get("github") as string;
  const skills = formData.get("skills") as string;
  const aboutMe = formData.get("aboutMe") as string;

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...(name && { name }),
        mobile: mobile || null,
        batch: batch || null,
        linkedin: linkedin || null,
        github: github || null,
        skills: skills || null,
        aboutMe: aboutMe || null,
      }
    });

    return { success: true };
  } catch (err) {
    console.error("Profile update failed", err);
    return { error: "Internal server error" };
  }
}

export async function getProfile() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return null;
  
  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    return user;
  } catch (e) {
    return null;
  }
}
