import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Megaphone, Calendar as CalendarIcon, Users } from "lucide-react";
import PostAnnouncementForm from "./PostAnnouncementForm";

export default async function FacultyEventsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "FACULTY") {
    redirect("/login");
  }

  const announcements = await prisma.announcement.findMany({
    where: { postedById: session.user.id },
    include: {
      registrations: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Manage Events & Announcements</h1>
        <p className="text-slate-400 mt-2">Post upcoming hackathons, deadlines, and opportunities. Students will be notified instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Post Form */}
        <div className="lg:col-span-1">
          <PostAnnouncementForm />
        </div>

        {/* Right Column: Existing Announcements */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Megaphone className="w-5 h-5 mr-2 text-cyan-400" />
            Your Announcements
          </h2>
          
          {announcements.length === 0 ? (
            <Card className="bg-slate-900/50 border-slate-800 text-center py-12">
              <CalendarIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <CardTitle className="text-xl text-white">No Announcements Yet</CardTitle>
              <p className="text-slate-400 mt-2">Use the form to post your first event or deadline.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {announcements.map(ann => (
                <Card key={ann.id} className="bg-slate-900/80 border-slate-800 backdrop-blur-xl hover:border-slate-700 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase 
                            ${ann.type === 'EVENT' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 
                              ann.type === 'DEADLINE' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                              'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                            {ann.type}
                          </span>
                          {ann.targetDate && (
                            <span className="text-xs text-slate-400 flex items-center">
                              <CalendarIcon className="w-3 h-3 mr-1" />
                              {new Date(ann.targetDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{ann.title}</h3>
                        <p className="text-sm text-slate-300 line-clamp-2">{ann.description}</p>
                      </div>
                      
                      <div className="bg-slate-950 px-4 py-3 rounded-lg border border-slate-800 text-center min-w-[100px]">
                        <div className="flex justify-center items-center text-cyan-400 mb-1">
                          <Users className="w-5 h-5 mr-1" />
                          <span className="text-2xl font-bold">{ann.registrations.length}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Interested</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
