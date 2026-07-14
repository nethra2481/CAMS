import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || q.length < 2) {
    return NextResponse.json({ students: [], announcements: [] });
  }

  try {
    // Search Students by name or registerNumber
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        OR: [
          { name: { contains: q } },
          { registerNumber: { contains: q } }
        ]
      },
      select: {
        id: true,
        name: true,
        registerNumber: true,
        department: true,
        year: true,
        section: true
      },
      take: 5
    });

    // Search Announcements by title
    const announcements = await prisma.announcement.findMany({
      where: {
        title: { contains: q }
      },
      select: {
        id: true,
        title: true,
        type: true
      },
      take: 3
    });

    return NextResponse.json({ students, announcements });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
