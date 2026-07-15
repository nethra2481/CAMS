"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getDepartmentStats() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "FACULTY") {
    return { error: "Unauthorized" };
  }

  try {
    // Only count approved achievements
    const approvedAchievements = await prisma.achievement.findMany({
      where: { status: "APPROVED" },
      include: {
        student: { select: { batch: true } }
      }
    });

    const totalAchievements = approvedAchievements.length;
    
    // Group by Batch
    const batchStats: Record<string, number> = {};
    // Group by Domain/Category
    const categoryStats: Record<string, number> = {};

    for (const ach of approvedAchievements) {
      // Batch grouping
      const batch = ach.student.batch || "Unknown Batch";
      batchStats[batch] = (batchStats[batch] || 0) + 1;

      // Category grouping
      const cat = ach.category || "Uncategorized";
      categoryStats[cat] = (categoryStats[cat] || 0) + 1;
    }

    return {
      success: true,
      stats: {
        total: totalAchievements,
        byBatch: batchStats,
        byCategory: categoryStats
      }
    };
  } catch (err) {
    console.error("Failed to fetch department stats", err);
    return { error: "Failed to fetch stats" };
  }
}

  export async function getStudentStats(studentId: string) {
    try {
      const allAchievements = await prisma.achievement.findMany({
        where: { 
          studentId: studentId 
        },
        orderBy: {
          createdAt: "desc"
        }
      });
  
      const approvedAchievements = allAchievements.filter(a => a.status === "APPROVED");
      const total = approvedAchievements.length;
      const categoryStats: Record<string, number> = {};
  
      for (const ach of approvedAchievements) {
        const cat = ach.category || "Uncategorized";
        categoryStats[cat] = (categoryStats[cat] || 0) + 1;
      }
  
      return {
        success: true,
        stats: {
          total,
          byCategory: categoryStats
        },
        achievements: allAchievements
      };
  } catch (err) {
    console.error("Failed to fetch student stats", err);
    return { error: "Failed to fetch stats" };
  }
}
