"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function publishFeedPost(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "FACULTY") {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const eventId = formData.get("eventId") as string;

  if (!title || !content || !eventId) {
    return { error: "Missing required fields" };
  }

  try {
    const post = await prisma.feedPost.create({
      data: {
        title,
        content,
        announcementId: eventId,
        postedById: session.user.id
      }
    });

    return { success: true, post };
  } catch (err) {
    console.error("Failed to publish feed post", err);
    return { error: "Internal server error" };
  }
}
