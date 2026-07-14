"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function removeUser(userId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Prevent self-deletion
  if (session.user.id === userId) {
    throw new Error("Cannot remove yourself");
  }

  await prisma.user.delete({
    where: { id: userId }
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function addUser(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const password = formData.get("password") as string;

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      name,
      role,
      passwordHash
    }
  });

  revalidatePath("/admin/users");
  return { success: true };
}
