"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateAchievementStatus(achievementId: string, status: string, remark?: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "FACULTY") {
    throw new Error("Unauthorized");
  }

  const validStatuses = ["APPROVED", "REJECTED", "HOLD"];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status");
  }

  await prisma.achievement.update({
    where: { id: achievementId },
    data: {
      status,
      facultyRemark: remark || null,
    }
  });

  revalidatePath("/faculty/approvals");
  return { success: true };
}
