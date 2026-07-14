import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, CheckCircle2, XCircle, PenSquare } from "lucide-react";
import Link from "next/link";

export default async function StudentAchievementsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>Unauthorized</div>;
  }

  const achievements = await prisma.achievement.findMany({
    where: { studentId: session.user.id },
    include: {
      successStory: true
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
            <Trophy className="w-8 h-8 mr-3 text-cyan-400" />
            My Achievements
          </h1>
          <p className="text-slate-400 mt-2">Track the status of your submissions and share success stories.</p>
        </div>
        <Link href="/student/add">
          <Button className="bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)]">
            Add New Record
          </Button>
        </Link>
      </div>

      {achievements.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-800 text-center py-12">
          <CardContent>
            <Trophy className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-300">No achievements yet</h3>
            <p className="text-slate-500 mt-1 mb-4">Start by adding your first participation or win.</p>
            <Link href="/student/add">
              <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 bg-slate-950">
                Add Achievement
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((ach) => (
            <Card key={ach.id} className="bg-slate-900/80 border-slate-800 backdrop-blur-xl relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${
                ach.status === "APPROVED" ? "bg-emerald-500" :
                ach.status === "REJECTED" ? "bg-red-500" :
                ach.status === "HOLD" ? "bg-amber-500" : "bg-blue-500"
              }`}></div>
              
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-white">{ach.title}</CardTitle>
                    <CardDescription className="text-slate-400 mt-1">{ach.organizer}</CardDescription>
                  </div>
                  <Badge className={`${
                    ach.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    ach.status === "REJECTED" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                    ach.status === "HOLD" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
                    "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  }`}>
                    {ach.status === "APPROVED" && <CheckCircle2 className="w-3 h-3 mr-1 inline" />}
                    {ach.status === "REJECTED" && <XCircle className="w-3 h-3 mr-1 inline" />}
                    {ach.status === "HOLD" && <Clock className="w-3 h-3 mr-1 inline" />}
                    {ach.status === "PENDING" && <Clock className="w-3 h-3 mr-1 inline" />}
                    {ach.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">{ach.category}</span>
                  <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">{ach.result}</span>
                  <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">{new Date(ach.startDate).toLocaleDateString()}</span>
                </div>

                {ach.facultyRemark && (
                  <div className="p-3 rounded-md bg-slate-950/50 border border-slate-800 text-sm">
                    <span className="text-slate-500 font-medium block mb-1">Faculty Remark:</span>
                    <span className="text-slate-300">{ach.facultyRemark}</span>
                  </div>
                )}

                {ach.status === "APPROVED" && ach.result !== "Participation" && (
                  <div className="pt-4 border-t border-slate-800/50">
                    {ach.successStory ? (
                      <div className="flex items-center text-emerald-400 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Success Story Published
                      </div>
                    ) : (
                      <Link href={`/student/achievements/${ach.id}/story`}>
                        <Button className="w-full bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 transition-colors">
                          <PenSquare className="w-4 h-4 mr-2" />
                          Share Success Story
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
