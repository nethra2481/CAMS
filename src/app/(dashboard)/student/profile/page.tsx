"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { getStudentStats } from "@/app/actions/statistics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Mail, Phone, Building, Briefcase, Award, Loader2 } from "lucide-react";

export default function StudentProfilePage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<{ total: number, byCategory: Record<string, number> } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      getStudentStats(session.user.id).then(res => {
        if (res.success && res.stats) {
          setStats(res.stats);
        }
        setLoading(false);
      });
    }
  }, [session]);

  if (!session?.user) {
    return null;
  }

  const { user } = session;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">My Profile</h1>
        <p className="text-slate-400 mt-2">View your personal details and achievement statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Personal Details Card */}
        <Card className="col-span-1 md:col-span-1 bg-slate-900/80 border-slate-800 backdrop-blur-xl h-fit">
          <CardHeader className="text-center pb-2">
            <div className="w-24 h-24 rounded-full bg-cyan-900/50 border-2 border-cyan-500 mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-bold text-cyan-400">{user.name?.[0]?.toUpperCase()}</span>
            </div>
            <CardTitle className="text-xl text-white">{user.name}</CardTitle>
            <CardDescription className="text-cyan-400 font-mono">
              {user.registerNumber || "No Register No."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center text-sm text-slate-300">
              <Mail className="w-4 h-4 mr-3 text-slate-500" />
              {user.email}
            </div>
            {user.mobile && (
              <div className="flex items-center text-sm text-slate-300">
                <Phone className="w-4 h-4 mr-3 text-slate-500" />
                {user.mobile}
              </div>
            )}
            <div className="flex items-center text-sm text-slate-300">
              <Building className="w-4 h-4 mr-3 text-slate-500" />
              {user.department || "Unknown Dept"}
            </div>
            <div className="flex items-center text-sm text-slate-300">
              <Briefcase className="w-4 h-4 mr-3 text-slate-500" />
              Batch {user.batch || "N/A"}
            </div>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card className="col-span-1 md:col-span-2 bg-slate-900/80 border-slate-800 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-purple-400" /> Achievement Statistics
            </CardTitle>
            <CardDescription className="text-slate-400">Your total approved achievements breakdown.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : !stats || stats.total === 0 ? (
              <div className="text-center py-12 bg-slate-950/50 rounded-xl border border-slate-800 border-dashed">
                <p className="text-slate-400">You haven't logged any approved achievements yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                    <h3 className="text-3xl font-bold text-white mb-1">{stats.total}</h3>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Total Approved</p>
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">By Category</h4>
                <div className="space-y-4">
                  {Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
                    const percentage = Math.round((count / stats.total) * 100);
                    return (
                      <div key={cat} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-slate-200 flex items-center">
                            <Award className="w-4 h-4 mr-2 text-purple-400" />
                            {cat}
                          </span>
                          <span className="text-slate-400 font-mono">{count} ({percentage}%)</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-500 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
