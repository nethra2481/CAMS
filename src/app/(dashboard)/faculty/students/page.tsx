import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadCloud, GraduationCap, Mail, User as UserIcon } from "lucide-react";
import { isAlumnus } from "@/lib/alumni";

export default async function FacultyStudentsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "FACULTY") {
    redirect("/login");
  }

  // Fetch all students and include their achievements
  const allStudents = await prisma.user.findMany({
    where: {
      role: "STUDENT"
    },
    include: {
      achievements: {
        include: {
          proofFiles: true
        }
      }
    },
    orderBy: {
      name: "asc"
    }
  });

  // Filter out alumni
  const students = allStudents.filter(s => !isAlumnus(s.registerNumber));

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Student Directory</h1>
        <p className="text-slate-400 mt-2">View student profiles, achievements, and download all their submitted documents as a ZIP archive.</p>
      </div>

      {students.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-800 text-center py-12">
          <UserIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <CardTitle className="text-xl text-white">No Students Found</CardTitle>
          <p className="text-slate-400 mt-2">Students must register to appear in this directory.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map(student => {
            const totalAchievements = student.achievements.length;
            const totalFiles = student.achievements.reduce((acc, ach) => acc + ach.proofFiles.length, 0);

            return (
              <Card key={student.id} className="bg-slate-900/80 border-slate-800 backdrop-blur-xl hover:border-cyan-500/50 transition-colors flex flex-col group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-bl-full -z-10 group-hover:bg-cyan-500/20 transition-colors"></div>
                <CardHeader className="pb-4 border-b border-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                      <span className="text-lg font-bold text-cyan-400">{student.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white font-semibold">{student.name}</CardTitle>
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">{student.registerNumber || "No Roll No"}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 flex-1 flex flex-col space-y-4">
                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="truncate">{student.department} • {student.year || 'Unknown'} {student.section && `• Sec ${student.section}`}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="truncate">{student.email}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-slate-950 rounded-lg p-3 text-center border border-slate-800/50">
                      <p className="text-2xl font-bold text-white">{totalAchievements}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Submissions</p>
                    </div>
                    <div className="bg-slate-950 rounded-lg p-3 text-center border border-slate-800/50">
                      <p className="text-2xl font-bold text-cyan-400">{totalFiles}</p>
                      <p className="text-[10px] text-cyan-400/70 uppercase tracking-wider font-semibold">Docs Uploaded</p>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4">
                    {totalFiles > 0 ? (
                      <a 
                        href={`/api/students/${student.id}/download-zip`}
                        className="w-full flex items-center justify-center text-sm font-semibold px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-all shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)] hover:-translate-y-0.5"
                      >
                        <DownloadCloud className="w-4 h-4 mr-2" />
                        Download All Documents
                      </a>
                    ) : (
                      <div className="w-full flex items-center justify-center text-sm font-medium px-4 py-2.5 bg-slate-800 text-slate-500 rounded-lg border border-slate-700 cursor-not-allowed">
                        <DownloadCloud className="w-4 h-4 mr-2" />
                        No Documents Yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
