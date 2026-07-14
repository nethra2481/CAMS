"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { calculateReadinessScore, CategoryCounts } from "@/lib/readiness-score";
import { getStudentStats } from "@/app/actions/statistics";
import { useState, useEffect } from "react";
import { Target, Rocket, CheckCircle2, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
        }
        setLoading(false);
      });
    }
  }, [session]);

  const { score, improvements } = calculateReadinessScore(counts);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back, {session?.user?.name || 'Student'}</h1>
          <p className="text-slate-400 mt-2">Here is a summary of your cyber achievements and readiness.</p>
        </div>
        <Button className="bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)]">Add New Achievement</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-900/50 border-cyan-500/30 col-span-1 md:col-span-1 shadow-[0_0_30px_-10px_rgba(6,182,212,0.15)] backdrop-blur-xl">
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

        <Card className="bg-slate-900/50 border-slate-800 col-span-1 md:col-span-3 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg text-slate-200">Areas for Improvement</CardTitle>
            <CardDescription className="text-slate-400">Complete these to boost your placement readiness score.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {improvements.map((imp, idx) => (
              <div key={idx} className="flex items-center text-sm text-slate-300 bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                <Rocket className="w-4 h-4 text-purple-400 mr-3 shrink-0" />
                {imp}
              </div>
            ))}
            {improvements.length === 0 && (
              <div className="flex items-center text-sm text-emerald-400">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                You have achievements in all major categories. Great job!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Real-time Recommendations Engine */}
        <Card className="bg-slate-900/50 border-purple-500/30 shadow-[0_0_30px_-10px_rgba(168,85,247,0.15)] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center text-purple-400">
              <Search className="w-5 h-5 mr-2" />
              Live Recommendations (Powered by Gemini)
            </CardTitle>
            <CardDescription className="text-slate-400">
              Discover upcoming hackathons, CTFs, and certifications tailored to your skills and fetched dynamically.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-6">
              <Input placeholder="Enter your current interests (e.g., Web3, Reverse Engineering)..." className="bg-slate-950/50 border-slate-800 focus-visible:ring-purple-500 text-slate-200" />
              <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 bg-slate-950">Scan Web</Button>
            </div>
            <div className="space-y-4">
               {/* Mock data for now, would be fetched from Gemini in production */}
               <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 transition-colors cursor-pointer group flex justify-between items-center">
                 <div>
                   <h4 className="font-semibold text-slate-200 group-hover:text-purple-400 transition-colors">DEF CON CTF Qualifier 2026</h4>
                   <p className="text-sm text-slate-400 mt-1">Global online jeopardy-style CTF covering reverse engineering, binary exploitation, and crypto.</p>
                 </div>
                 <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-xs font-medium rounded-full border border-purple-500/20 shrink-0">CTF</span>
               </div>
               
               <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition-colors cursor-pointer group flex justify-between items-center">
                 <div>
                   <h4 className="font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">OSCP Certification Path</h4>
                   <p className="text-sm text-slate-400 mt-1">Offensive Security Certified Professional - highly recommended based on your recent Hack The Box achievements.</p>
                 </div>
                 <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-medium rounded-full border border-cyan-500/20 shrink-0">Certification</span>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
