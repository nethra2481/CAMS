"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createAnnouncement(data: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "FACULTY") {
    return { error: "Unauthorized" };
  }

  const title = data.get("title") as string;
  const type = data.get("type") as string;
  const description = data.get("description") as string;
  const link = data.get("link") as string;
  const targetDateStr = data.get("targetDate") as string;
  
  if (!title || !type || !description) {
    return { error: "Missing required fields" };
  }

  try {
    const targetDate = targetDateStr ? new Date(targetDateStr) : null;
    
    // Parse new controls
    const acceptSubmissions = data.get("acceptSubmissions") === "on";
    const allowTeamEntries = data.get("allowTeamEntries") === "on";
    const visibilityLevel = data.get("visibilityLevel") as string || "DEPARTMENT";
    const targetBatch = data.get("targetBatch") as string || null;
    const eventCategory = data.get("eventCategory") as string || null;
    const eventOrganizer = data.get("eventOrganizer") as string || null;
    
    const announcement = await prisma.announcement.create({
      data: {
        title,
        type,
        description,
        link: link || null,
        targetDate,
        postedById: session.user.id,
        acceptSubmissions,
        allowTeamEntries,
        visibilityLevel,
        targetBatch,
        eventCategory,
        eventOrganizer
      }
    });

    // Notify all students
    const students = await prisma.user.findMany({ where: { role: "STUDENT" } });
    
    if (students.length > 0) {
      const notifications = students.map(student => ({
        userId: student.id,
        title: `New ${type}: ${title}`,
        message: description.substring(0, 100) + (description.length > 100 ? "..." : ""),
        link: "/feed"
      }));
      
      await prisma.notification.createMany({
        data: notifications
      });
    }

    return { success: true, announcement };
  } catch (err) {
    console.error("Failed to create announcement", err);
    return { error: "Internal server error" };
  }
}

export async function toggleEventRegistration(announcementId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "STUDENT") {
    return { error: "Unauthorized" };
  }

  try {
    const existing = await prisma.eventRegistration.findUnique({
      where: {
        studentId_announcementId: {
          studentId: session.user.id,
          announcementId
        }
      }
    });

    if (existing) {
      await prisma.eventRegistration.delete({
        where: { id: existing.id }
      });
      return { success: true, status: "unregistered" };
    } else {
      await prisma.eventRegistration.create({
        data: {
          studentId: session.user.id,
          announcementId,
          status: "REGISTERED"
        }
      });
      return { success: true, status: "registered" };
    }
  } catch (err) {
    console.error("Failed to toggle registration", err);
    return { error: "Internal server error" };
  }
}
