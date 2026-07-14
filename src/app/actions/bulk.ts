"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function bulkUpdateStatus(achievementIds: string[], status: "APPROVED" | "REJECTED" | "PENDING") {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "FACULTY") {
    return { error: "Unauthorized" };
  }

  try {
    const res = await prisma.achievement.updateMany({
      where: {
        id: { in: achievementIds }
      },
      data: {
        status
      }
    });

    return { success: true, count: res.count };
  } catch (err) {
    console.error("Bulk update failed", err);
    return { error: "Internal server error" };
  }
}

export async function updateSingleStatus(achievementId: string, status: "APPROVED" | "REJECTED" | "PENDING") {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "FACULTY") {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.achievement.update({
      where: { id: achievementId },
      data: { status }
    });
    return { success: true };
  } catch (err) {
    console.error("Update failed", err);
    return { error: "Internal server error" };
  }
}
