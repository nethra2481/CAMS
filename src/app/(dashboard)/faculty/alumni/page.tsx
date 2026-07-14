import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Mail, User as UserIcon, Award, MapPin } from "lucide-react";
import { isAlumnus, getPassoutYear } from "@/lib/alumni";

export default async function FacultyAlumniPage({
  searchParams
}: {
  searchParams: { year?: string }
}) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "FACULTY") {
    redirect("/login");
  }

  // Fetch all students (alumni are still technically STUDENT role in db)
  const allUsers = await prisma.user.findMany({
    where: {
      role: "STUDENT"
    },
    include: {
      achievements: {
        where: { status: "APPROVED" }
      }
    },
    orderBy: {
      name: "asc"
    }
  });

  // Filter ONLY alumni
  let alumni = allUsers.filter(u => isAlumnus(u.registerNumber));

  // Filter by requested year if any
  if (searchParams.year) {
    const filterYear = parseInt(searchParams.year, 10);
    alumni = alumni.filter(a => getPassoutYear(a.registerNumber) === filterYear);
  }

  // Gather unique passout years for the filter dropdown (using native HTML select for simplicity or links)
  const allPassoutYears = Array.from(new Set(
    allUsers.filter(u => isAlumnus(u.registerNumber)).map(a => getPassoutYear(a.registerNumber)).filter(Boolean)
  )).sort((a, b) => (b as number) - (a as number));

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
            <GraduationCap className="w-8 h-8 mr-3 text-cyan-400" />
            Alumni Directory
          </h1>
          <p className="text-slate-400 mt-2">View records and achievements of graduated students.</p>
        </div>
        
        {/* Simple Year Filter */}
        {allPassoutYears.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Passout Year:</span>
            <div className="flex gap-2 flex-wrap">
              <a 
                href="/faculty/alumni" 
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors border ${!searchParams.year ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'}`}
              >
                All
              </a>
              {allPassoutYears.map(year => (
                <a 
                  key={year}
                  href={`/faculty/alumni?year=${year}`} 
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors border ${searchParams.year === String(year) ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'}`}
                >
                  {year}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {alumni.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-800 text-center py-12">
          <GraduationCap className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <CardTitle className="text-xl text-white">No Alumni Found</CardTitle>
          <p className="text-slate-400 mt-2">Graduated students will automatically appear here.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alumni.map(alum => {
            const totalAchievements = alum.achievements.length;
            const passoutYear = getPassoutYear(alum.registerNumber);

            return (
              <Card key={alum.id} className="bg-slate-900/80 border-slate-800 backdrop-blur-xl hover:border-cyan-500/50 transition-colors flex flex-col group relative overflow-hidden opacity-90">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full -z-10 group-hover:bg-purple-500/20 transition-colors"></div>
                <CardHeader className="pb-4 border-b border-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                      <span className="text-lg font-bold text-slate-300">{alum.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white font-semibold flex items-center gap-2">
                        {alum.name}
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 uppercase tracking-wider">Alumni</span>
                      </CardTitle>
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">{alum.registerNumber || "No Roll No"} • Class of {passoutYear || 'Unknown'}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 flex-1 flex flex-col space-y-4">
                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="truncate">{alum.email}</span>
                    </div>
                    {alum.skills && (
                      <div className="flex items-start gap-2 mt-2">
                        <Award className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-400 line-clamp-2">{alum.skills}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-800">
                     <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                       <span className="text-cyan-400 font-bold">{totalAchievements}</span> Approved Achievements
                     </div>
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
