"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v2 as cloudinary } from "cloudinary";

// Ensure Cloudinary is configured
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_URL?.split("://")[1]?.split(":")[0],
  api_secret: process.env.CLOUDINARY_URL?.split(":")[2]?.split("@")[0],
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function submitAchievement(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  
  if (!user) {
    throw new Error("User not found");
  }

  const title = formData.get("title") as string;
  const organizer = formData.get("organizer") as string;
  const category = formData.get("category") as string;
  const level = formData.get("level") as string;
  const mode = formData.get("mode") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const result = formData.get("result") as string;
  const description = formData.get("description") as string;
  const eventId = formData.get("eventId") as string | null;

  // Process files
  const uploadedFiles: { url: string; name: string; type: string }[] = [];
  
  const files = formData.getAll("files") as File[];
  
  for (const file of files) {
    if (file.size === 0) continue;
    
    // Convert File to base64 buffer for Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mime = file.type;
    const encoding = "base64";
    const base64Data = buffer.toString("base64");
    const fileUri = `data:${mime};${encoding},${base64Data}`;

    try {
      const res = await cloudinary.uploader.upload(fileUri, {
        folder: "cap_achievements",
        resource_type: "auto"
      });
      
      uploadedFiles.push({
        url: res.secure_url,
        name: file.name,
        type: file.type
      });
    } catch (error) {
      console.error("Cloudinary upload error", error);
      throw new Error("Failed to upload files");
    }
  }

  // Generate AI Motivational Message based on the achievement
  let aiMotivation = "Great job on your latest achievement! Keep pushing boundaries.";
  if (process.env.GEMINI_API_KEY) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Write a short, professional, and highly encouraging 2-sentence motivational message for a college student who just submitted this cyber security achievement: 
      Title: ${title}
      Category: ${category}
      Result/Rank: ${result}
      Do not use quotes around the message.`;
      
      const res = await model.generateContent(prompt);
      aiMotivation = res.response.text().trim();
    } catch (e) {
      console.error("Gemini AI failed to generate message", e);
    }
  }

  const teammatesRaw = formData.get("teammates") as string;
  let teamMembers = [];
  let isTeam = false;
  
  if (teammatesRaw) {
    try {
      const parsed = JSON.parse(teammatesRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        isTeam = true;
        teamMembers = parsed.map(t => {
          if (t.internal) {
            return { userId: t.id, hasAccepted: false };
          } else {
            return { externalName: t.name, externalDept: t.dept, hasAccepted: true };
          }
        });
      }
    } catch (e) {
      console.error("Failed to parse teammates", e);
    }
  }

  // Handle dynamicData and dynamic files
  const dynamicDataRaw = formData.get("dynamicData") as string;
  let dynamicDataObj: Record<string, any> = {};
  
  if (dynamicDataRaw) {
    try {
      dynamicDataObj = JSON.parse(dynamicDataRaw);
      
      // Look for dynamic files and upload them
      for (const [key, value] of Object.entries(dynamicDataObj)) {
        if (value === "__FILE_UPLOAD__") {
          const dynamicFile = formData.get(`dynamic_file_${key}`) as File;
          if (dynamicFile && dynamicFile.size > 0) {
            const arrayBuffer = await dynamicFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const mime = dynamicFile.type;
            const fileUri = `data:${mime};base64,${buffer.toString("base64")}`;
            try {
              const res = await cloudinary.uploader.upload(fileUri, { folder: "cap_achievements", resource_type: "auto" });
              dynamicDataObj[key] = res.secure_url; // Replace the marker with the actual URL
            } catch (err) {
              console.error(`Failed to upload dynamic file ${key}`, err);
              dynamicDataObj[key] = "Upload failed";
            }
          }
        }
      }
    } catch (e) {
      console.error("Failed to parse dynamicData", e);
    }
  }

  // Create achievement in DB
  const achievement = await prisma.achievement.create({
    data: {
      title,
      organizer,
      category,
      level,
      mode,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      result,
      description,
      isTeam,
      status: "PENDING",
      aiMotivation,
      dynamicData: Object.keys(dynamicDataObj).length > 0 ? JSON.stringify(dynamicDataObj) : null,
      studentId: user.id,
      announcementId: eventId || null,
      proofFiles: {
        create: uploadedFiles
      },
      teamMembers: {
        create: teamMembers
      }
    }
  });

  return { success: true, aiMotivation, achievementId: achievement.id };
}

export async function submitSuccessStory(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return { error: "Unauthorized" };
  }

  const achievementId = formData.get("achievementId") as string;
  const whatWeBuilt = formData.get("whatWeBuilt") as string;
  const challengesFaced = formData.get("challengesFaced") as string;
  const lessonsLearned = formData.get("lessonsLearned") as string;
  const tipsForJuniors = formData.get("tipsForJuniors") as string;

  if (!achievementId || !whatWeBuilt || !challengesFaced || !lessonsLearned || !tipsForJuniors) {
    return { error: "All fields are required" };
  }

  try {
    // Verify ownership
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId }
    });

    if (!achievement || achievement.studentId !== session.user.id) {
      return { error: "Unauthorized or achievement not found" };
    }

    const story = await prisma.successStory.create({
      data: {
        achievementId,
        whatWeBuilt,
        challengesFaced,
        lessonsLearned,
        tipsForJuniors
      }
    });

    return { success: true, story };
  } catch (err) {
    console.error("Failed to submit success story", err);
    return { error: "Internal server error" };
  }
}
