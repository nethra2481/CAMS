"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { calculateReadinessScore, CategoryCounts } from "@/lib/readiness-score";
import { getStudentStats } from "@/app/actions/statistics";
import { useState, useEffect } from "react";
import { Target, Loader2, Award, Zap, Trophy, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


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
    <div className="space-y-10 animate-fade-in pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{session?.user?.name || 'Student'}</span>
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Here is a summary of your cyber achievements and readiness.</p>
        </div>
        <Button className="bg-cyan-600 hover:bg-cyan-500 text-white border-0 shadow-[0_0_20px_-3px_rgba(6,182,212,0.5)] transition-all hover:scale-105 px-6 py-5 rounded-full font-semibold">
          <Zap className="w-4 h-4 mr-2" />
          Add New Achievement
        </Button>
      </div>

      {/* PLACEMENT READINESS HERO CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 border border-cyan-500/20 shadow-[0_0_40px_-15px_rgba(6,182,212,0.3)] backdrop-blur-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
            <Target className="w-4 h-4" />
            Placement Readiness
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            You are <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{score}%</span> Ready
          </h2>
          <p className="text-slate-400 text-lg max-w-xl">
            This score reflects your approved achievements, projects, and hackathons. Keep building and participating to maximize your potential.
          </p>
        </div>

        <div className="relative z-10 w-48 h-48 md:w-56 md:h-56 shrink-0 flex items-center justify-center rounded-full border-[8px] border-slate-800 bg-slate-950/50 shadow-inner">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-800" />
            <circle 
              cx="50" 
              cy="50" 
              r="46" 
              fill="transparent" 
              stroke="url(#score-gradient)" 
              strokeWidth="8" 
              strokeDasharray={`${(score / 100) * 289} 289`} 
              strokeLinecap="round"
              className="drop-shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">{score}</div>
            <div className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">Score</div>
          </div>
        </div>
      </div>

      {/* ACHIEVEMENTS SECTION */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
            <Award className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Your Achievements</h2>
            <p className="text-slate-400 text-sm mt-1">Track and manage your submitted operations.</p>
          </div>
        </div>

        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((ach) => (
              <div 
                key={ach.id} 
                className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 hover:border-cyan-500/50 p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_-15px_rgba(6,182,212,0.2)] overflow-hidden"
              >
                {/* Subtle gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-slate-950 text-slate-300 text-[10px] uppercase font-bold tracking-widest rounded-md border border-slate-800 shadow-sm">
                      {ach.category}
                    </span>
                    <span className={`flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-md border shadow-sm backdrop-blur-md ${
                      ach.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      ach.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {ach.status === 'APPROVED' && <CheckCircle className="w-3 h-3" />}
                      {ach.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                      {ach.status === 'PENDING' && <Clock className="w-3 h-3" />}
                      {ach.status}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-white text-xl leading-tight mb-3 group-hover:text-cyan-400 transition-colors">{ach.title}</h4>
                  <p className="text-sm text-slate-400 line-clamp-2">{ach.organizer}</p>
                </div>
                
                <div className="relative z-10 flex items-center justify-between mt-6 pt-4 border-t border-slate-800/50 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(ach.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                  
                  <Dialog>
                    <DialogTrigger 
                      render={
                        <button className="text-cyan-500 hover:text-cyan-400 font-semibold flex items-center gap-1 transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 cursor-pointer">
                          View Details
                        </button>
                      }
                    />
                    <DialogContent className="sm:max-w-[425px] bg-slate-950 border-slate-800 text-white">
                      <DialogHeader>
                        <DialogTitle>{ach.title}</DialogTitle>
                        <DialogDescription className="text-slate-400">
                          Submitted on {new Date(ach.startDate).toLocaleDateString()}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <span className="text-sm font-medium text-slate-500">Category</span>
                          <span className="text-sm text-slate-200">{ach.category}</span>
                        </div>
                        <div className="grid gap-2">
                          <span className="text-sm font-medium text-slate-500">Organizer</span>
                          <span className="text-sm text-slate-200">{ach.organizer}</span>
                        </div>
                        <div className="grid gap-2">
                          <span className="text-sm font-medium text-slate-500">Description</span>
                          <span className="text-sm text-slate-200">{ach.description || "No description provided."}</span>
                        </div>
                        {ach.evidenceUrl && (
                          <div className="grid gap-2">
                            <span className="text-sm font-medium text-slate-500">Evidence Link</span>
                            <a href={ach.evidenceUrl} target="_blank" rel="noreferrer" className="text-cyan-500 hover:underline text-sm truncate">
                              {ach.evidenceUrl}
                            </a>
                          </div>
                        )}
                        <div className="grid gap-2">
                          <span className="text-sm font-medium text-slate-500">Status</span>
                          <span className={`text-sm font-bold uppercase tracking-wider ${
                            ach.status === 'APPROVED' ? 'text-emerald-400' : 
                            ach.status === 'REJECTED' ? 'text-red-400' : 
                            'text-amber-400'
                          }`}>
                            {ach.status}
                          </span>
                        </div>
                        {ach.rejectionReason && (
                          <div className="grid gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                            <span className="text-sm font-medium text-red-400">Rejection Reason</span>
                            <span className="text-sm text-red-300">{ach.rejectionReason}</span>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-900/30 border border-slate-800/50 rounded-3xl border-dashed">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No achievements yet</h3>
            <p className="text-slate-400 text-center max-w-md mb-6">
              You haven't added any cyber achievements to your profile yet. Start logging your CTFs, hackathons, and certifications to boost your readiness score.
            </p>
            <Button className="bg-slate-800 hover:bg-slate-700 text-white">
              Add Your First Achievement
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
