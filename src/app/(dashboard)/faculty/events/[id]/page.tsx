import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, FileText, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import PublishWinnersModal from "./PublishWinnersModal";

export default async function ManageEventPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "FACULTY") {
    redirect("/login");
  }

  const event = await prisma.announcement.findUnique({
    where: { id: params.id },
    include: {
      achievements: {
        include: {
          student: true,
          teamMembers: true
        }
      },
      feedPosts: true
    }
  });

  if (!event) {
    return <div>Event not found</div>;
  }

  const totalParticipants = event.achievements.reduce((sum, ach) => sum + (ach.isTeam ? ach.teamMembers.length : 1), 0);
  const pendingCount = event.achievements.filter(a => a.status === "PENDING").length;
  const approvedCount = event.achievements.filter(a => a.status === "APPROVED").length;
  const isPublished = event.feedPosts.length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {event.type}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-800 text-slate-300 border border-slate-700">
              {event.visibilityLevel}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{event.title}</h1>
          <p className="text-slate-400 mt-2">Manage submissions, view stats, and publish results.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/faculty/events">
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              Back to Events
            </Button>
          </Link>
          <PublishWinnersModal eventId={event.id} eventTitle={event.title} isPublished={isPublished} />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80 border-slate-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Participants</p>
              <h3 className="text-3xl font-bold text-white mt-1">{totalParticipants}</h3>
            </div>
            <Users className="w-8 h-8 text-cyan-500 opacity-50" />
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/80 border-slate-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Submissions</p>
              <h3 className="text-3xl font-bold text-white mt-1">{event.achievements.length}</h3>
            </div>
            <FileText className="w-8 h-8 text-blue-500 opacity-50" />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Pending Review</p>
              <h3 className="text-3xl font-bold text-amber-400 mt-1">{pendingCount}</h3>
            </div>
            <Clock className="w-8 h-8 text-amber-500 opacity-50" />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Approved</p>
              <h3 className="text-3xl font-bold text-emerald-400 mt-1">{approvedCount}</h3>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-500 opacity-50" />
          </CardContent>
        </Card>
      </div>

      {/* Submissions Table */}
      <Card className="bg-slate-900/80 border-slate-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl text-slate-200">Submissions</CardTitle>
              <CardDescription className="text-slate-400">Review student entries for this event.</CardDescription>
            </div>
            <Link href={`/faculty/students?eventId=${event.id}`}>
              <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-white">
                Go to Bulk Approval
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {event.achievements.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No submissions yet.
            </div>
          ) : (
            <div className="space-y-4">
              {event.achievements.map(ach => (
                <div key={ach.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-950/50 border border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                      <span className="text-sm font-bold text-slate-300">{ach.student.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{ach.student.name} {ach.isTeam && <span className="text-xs text-cyan-400 ml-2">(Team: {ach.teamName})</span>}</p>
                      <p className="text-xs text-slate-400">Result: {ach.result}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase 
                      ${ach.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        ach.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'} border`}>
                      {ach.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
