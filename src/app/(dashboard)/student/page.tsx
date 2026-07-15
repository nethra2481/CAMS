"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { calculateReadinessScore, CategoryCounts } from "@/lib/readiness-score";
import { getStudentStats } from "@/app/actions/statistics";
import { useState, useEffect } from "react";
import { Target, Loader2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function StudentDashboard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<CategoryCounts>({
    projects: 0,
    hackathons: 0,
    internships: 0,
    certifications: 0,
    openSource: 0,
    ctfs: 0,
    research: 0
  });
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    if (session?.user?.id) {
      getStudentStats(session.user.id).then(res => {
        if (res.success && res.stats) {
          const fetched = res.stats.byCategory;
          // Map to standard schema for score calculation
          setCounts({
            projects: fetched["Project"] || 0,
            hackathons: fetched["Hackathon"] || 0,
            internships: fetched["Internship"] || 0,
            certifications: fetched["Certification"] || 0,
            openSource: fetched["Open Source"] || 0,
            ctfs: fetched["CTF"] || 0,
            research: fetched["Paper Presentation"] || fetched["Research"] || 0
          });
          if (res.achievements) {
            setAchievements(res.achievements);
          }
        }
        setLoading(false);
      });
    }
  }, [session]);

  const { score } = calculateReadinessScore(counts);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back, {session?.user?.name || 'Student'}</h1>
          <p className="text-slate-400 mt-2">Here is a summary of your cyber achievements and readiness.</p>
        </div>
        <Button className="bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)]">Add New Achievement</Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-slate-900/50 border-cyan-500/30 shadow-[0_0_30px_-10px_rgba(6,182,212,0.15)] backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-cyan-400 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Placement Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-white">{score}<span className="text-xl text-slate-500">/100</span></div>
            <p className="text-xs text-slate-400 mt-2">Based on your approved achievements</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-slate-900/50 border-slate-800 shadow-[0_0_30px_-10px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center text-slate-200">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              Your Achievements
            </CardTitle>
            <CardDescription className="text-slate-400">
              A list of all achievements you have entered.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {achievements.length > 0 ? (
              <div className="space-y-4">
                {achievements.map((ach) => (
                  <div key={ach.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-200">{ach.title}</h4>
                      <p className="text-sm text-slate-400 mt-1">{ach.organizer} • {new Date(ach.startDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                      <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-medium rounded-full border border-slate-700 shrink-0">
                        {ach.category}
                      </span>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border shrink-0 ${ach.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ach.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                        {ach.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-400 text-sm py-4">No achievements entered yet.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
