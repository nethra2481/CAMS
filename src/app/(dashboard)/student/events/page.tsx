import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, UploadCloud, Users, Lock, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function AvailableEventsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "STUDENT") {
    return <div>Unauthorized</div>;
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  
  // Fetch events where visibility matches the student's constraints
  const events = await prisma.announcement.findMany({
    where: {
      type: "EVENT",
      isLocked: false,
      OR: [
        { visibilityLevel: "DEPARTMENT" },
        { 
          visibilityLevel: "BATCH",
          targetBatch: user?.batch || user?.year
        }
      ]
    },
    include: {
      achievements: {
        where: { studentId: user?.id }, // Only fetch THIS student's submission
        select: { id: true, status: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Available Events</h1>
        <p className="text-slate-400 mt-2">Official department events and competitions. Click an event to log your submission.</p>
      </div>

      <div className="grid gap-6">
        {events.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-xl border border-slate-800">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-300">No events currently available</h3>
          </div>
        ) : (
          events.map(event => {
            const hasSubmitted = event.achievements.length > 0;
            const submission = hasSubmitted ? event.achievements[0] : null;

            return (
              <Card key={event.id} className="bg-slate-900/80 border-slate-800 backdrop-blur-xl hover:border-cyan-900/50 transition-colors overflow-hidden relative group">
                <div className={`absolute top-0 left-0 w-1 h-full ${hasSubmitted ? 'bg-emerald-500' : 'bg-cyan-500'}`}></div>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300 font-medium">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {event.targetDate ? new Date(event.targetDate).toLocaleDateString() : "TBA"}
                        </span>
                        {event.allowTeamEntries ? (
                          <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-cyan-400 font-medium flex items-center">
                            <Users className="w-3 h-3 mr-1" /> Teams Allowed
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-slate-400 font-medium flex items-center">
                            <Lock className="w-3 h-3 mr-1" /> Individual Only
                          </span>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{event.title}</h3>
                        <p className="text-sm text-slate-400 max-w-xl">{event.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end min-w-[200px] border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-3">Submission Status</p>
                      
                      {hasSubmitted ? (
                        <div className="text-center w-full">
                          <div className={`px-4 py-2 rounded-lg font-bold text-sm mb-2 border
                            ${submission.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                              submission.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                              'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                            {submission.status === 'PENDING' ? 'Waiting for Review' : submission.status}
                          </div>
                          <Link href={`/student/achievements/${submission.id}`}>
                            <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 w-full text-xs">
                              View Submission <ChevronRight className="w-3 h-3 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        event.acceptSubmissions ? (
                          <Link href={`/student/add?eventId=${event.id}`} className="w-full">
                            <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)]">
                              <UploadCloud className="w-4 h-4 mr-2" />
                              Open Submission
                            </Button>
                          </Link>
                        ) : (
                          <Button disabled variant="outline" className="w-full bg-slate-900 border-slate-700 text-slate-500">
                            Submissions Closed
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
