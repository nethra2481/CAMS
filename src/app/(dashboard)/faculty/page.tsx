import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDepartmentStats } from "@/app/actions/statistics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Users, BarChart3, PieChart, Activity, Award } from "lucide-react";

export default async function FacultyOverview() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "FACULTY") {
    redirect("/login");
  }

  const res = await getDepartmentStats();
  
  if (!res.success || !res.stats) {
    return <div className="text-red-400 p-8">Failed to load statistics.</div>;
  }

  const { total, byBatch, byCategory } = res.stats;

  // Sorting batches descending for display
  const sortedBatches = Object.entries(byBatch).sort((a, b) => b[0].localeCompare(a[0]));
  // Sorting categories by count descending
  const sortedCategories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
          <Activity className="w-8 h-8 mr-3 text-cyan-400" />
          Department Analytics
        </h1>
        <p className="text-slate-400 mt-2">Overview of student achievements for NBA / NAAC accreditation reporting.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-cyan-900/40 to-slate-900/80 border-cyan-800/50 backdrop-blur-xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-400 uppercase tracking-wider">Total Approved</p>
              <h2 className="text-4xl font-bold text-white mt-2">{total}</h2>
              <p className="text-xs text-slate-400 mt-1">Across all batches & domains</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-cyan-950/50 flex items-center justify-center border border-cyan-800/50">
              <Trophy className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/40 to-slate-900/80 border-purple-800/50 backdrop-blur-xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-400 uppercase tracking-wider">Active Domains</p>
              <h2 className="text-4xl font-bold text-white mt-2">{Object.keys(byCategory).length}</h2>
              <p className="text-xs text-slate-400 mt-1">Unique event categories</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-purple-950/50 flex items-center justify-center border border-purple-800/50">
              <PieChart className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-900/40 to-slate-900/80 border-emerald-800/50 backdrop-blur-xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-400 uppercase tracking-wider">Active Batches</p>
              <h2 className="text-4xl font-bold text-white mt-2">{Object.keys(byBatch).length}</h2>
              <p className="text-xs text-slate-400 mt-1">Batches with logged data</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-emerald-950/50 flex items-center justify-center border border-emerald-800/50">
              <Users className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Batch-wise Breakdown */}
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-cyan-400" /> Batch-wise Participation
            </CardTitle>
            <CardDescription className="text-slate-400">Total approved achievements grouped by student batch.</CardDescription>
          </CardHeader>
          <CardContent>
            {sortedBatches.length === 0 ? (
              <p className="text-slate-500 py-4">No data available.</p>
            ) : (
              <div className="space-y-6">
                {sortedBatches.map(([batch, count]) => {
                  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={batch} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-slate-200">{batch}</span>
                        <span className="text-slate-400 font-mono">{count} ({percentage}%)</span>
                      </div>
                      <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyan-500 rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Domain-wise Breakdown */}
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <Award className="w-5 h-5 mr-2 text-purple-400" /> Domain-wise Distribution
            </CardTitle>
            <CardDescription className="text-slate-400">Total approved achievements grouped by category.</CardDescription>
          </CardHeader>
          <CardContent>
            {sortedCategories.length === 0 ? (
              <p className="text-slate-500 py-4">No data available.</p>
            ) : (
              <div className="space-y-6">
                {sortedCategories.map(([cat, count]) => {
                  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-slate-200">{cat}</span>
                        <span className="text-slate-400 font-mono">{count} ({percentage}%)</span>
                      </div>
                      <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
