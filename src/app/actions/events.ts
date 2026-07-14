"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getEventForPrefill(eventId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "STUDENT") {
    return { error: "Unauthorized" };
  }

  try {
    const event = await prisma.announcement.findUnique({
      where: { id: eventId }
    });

    if (!event) return { error: "Event not found" };
    if (!event.acceptSubmissions) return { error: "Submissions closed for this event" };

    return { 
      success: true, 
      event: {
        id: event.id,
        title: event.title,
        category: event.eventCategory || "Other",
        organizer: event.eventOrganizer || "Department",
        level: event.eventLevel || "COLLEGE",
        mode: event.eventMode || "OFFLINE",
        targetDate: event.targetDate,
        allowTeamEntries: event.allowTeamEntries
      }
    };
  } catch (err) {
    console.error("Failed to fetch event for pre-fill", err);
    return { error: "Internal server error" };
  }
}
