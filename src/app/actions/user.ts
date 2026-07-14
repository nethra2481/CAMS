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
