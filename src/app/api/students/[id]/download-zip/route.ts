import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import JSZip from "jszip";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "FACULTY") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const studentId = params.id;

  const student = await prisma.user.findUnique({
    where: { id: studentId },
    include: {
      achievements: {
        include: {
          proofFiles: true
        }
      }
    }
  });

  if (!student) {
    return new NextResponse("Student not found", { status: 404 });
  }

  const allFiles = student.achievements.flatMap(a => a.proofFiles);
  if (allFiles.length === 0) {
    return new NextResponse("No files found", { status: 404 });
  }

  try {
    const zip = new JSZip();
    const folderName = `${student.name.replace(/\s+/g, '_')}_${student.registerNumber || 'Docs'}`;
    const studentFolder = zip.folder(folderName);

    // Fetch all files from their URLs and add to zip
    const fetchPromises = allFiles.map(async (file, index) => {
      try {
        const response = await fetch(file.url);
        if (!response.ok) throw new Error(`Failed to fetch ${file.url}`);
        const arrayBuffer = await response.arrayBuffer();
        
        // Ensure unique names if there are duplicates
        const extension = file.name.split('.').pop() || 'file';
        const baseName = file.name.replace(`.${extension}`, '');
        const filename = `${baseName}_${index}.${extension}`;
        
        studentFolder?.file(filename, arrayBuffer);
      } catch (err) {
        console.error("Error fetching file for zip", err);
      }
    });

    await Promise.all(fetchPromises);

    const zipBuffer = await zip.generateAsync({ type: "uint8array" });

    return new NextResponse(zipBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${folderName}.zip"`
      }
    });
  } catch (err) {
    console.error("Zip generation error:", err);
    return new NextResponse("Failed to generate zip", { status: 500 });
  }
}
