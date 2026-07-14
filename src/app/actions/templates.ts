"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function saveFormTemplate(category: string, schemaJson: string, readinessPoints: number = 0) {
  const session = await getServerSession(authOptions);
  
  // Basic faculty check (assuming FACULTY or ADMIN role exists, or just verify session)
  // In this app, everyone with a session who is not a STUDENT is FACULTY.
  if (!session || session.user?.role === "STUDENT") {
    return { error: "Unauthorized. Only faculty can modify templates." };
  }

  try {
    const template = await prisma.formTemplate.upsert({
      where: { category },
      update: { schemaJson, readinessPoints },
      create: { category, schemaJson, readinessPoints }
    });
    
    return { success: true, template };
  } catch (err) {
    console.error("Failed to save template:", err);
    return { error: "Failed to save template" };
  }
}

export async function deleteFormTemplate(category: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role === "STUDENT") {
    return { error: "Unauthorized." };
  }

  try {
    await prisma.formTemplate.delete({
      where: { category }
    });
    return { success: true };
  } catch (err) {
    console.error("Failed to delete template:", err);
    return { error: "Failed to delete template" };
  }
}

export async function getFormTemplate(category: string) {
  try {
    const template = await prisma.formTemplate.findUnique({
      where: { category }
    });
    
    return { success: true, template };
  } catch (err) {
    console.error("Failed to fetch template:", err);
    return { error: "Failed to fetch template" };
  }
}

export async function getAllTemplates() {
  try {
    const templates = await prisma.formTemplate.findMany({
      orderBy: { category: 'asc' }
    });
    return { success: true, templates };
  } catch (err) {
    console.error("Failed to fetch templates:", err);
    return { error: "Failed to fetch templates" };
  }
}
