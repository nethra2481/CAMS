"use client";

import { useState } from "react";
import { updateAchievementStatus } from "@/app/actions/faculty";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, ExternalLink, Loader2, AlertCircle, DownloadCloud } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type ApprovalsListProps = {
  initialData: any[]; // Typing as any[] for simplicity in this generated code
};

export default function ApprovalsList({ initialData }: ApprovalsListProps) {
  const [achievements, setAchievements] = useState(initialData);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [remarks, setRemarks] = useState<Record<string, string>>({});

  const handleStatusChange = async (id: string, status: string) => {
    setLoadingId(id);
    try {
      const remark = remarks[id] || "";
      const res = await updateAchievementStatus(id, status, remark);
      if (res.success) {
        setAchievements((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  const handleRemarkChange = (id: string, value: string) => {
    setRemarks((prev) => ({ ...prev, [id]: value }));
  };

  if (achievements.length === 0) {
    return (
      <div className="max-w-xl mx-auto mt-12 animate-in fade-in zoom-in duration-500">
        <Card className="bg-slate-900/50 border-emerald-500/30 text-center py-16 shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)]">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-400" />
          </div>
          <CardTitle className="text-2xl text-white mb-2">All Caught Up!</CardTitle>
          <p className="text-slate-400">There are no pending approvals at this time.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {achievements.map((achievement) => (
        <Card key={achievement.id} className="bg-slate-900/80 border-slate-800 backdrop-blur-xl shadow-lg overflow-hidden group hover:border-slate-700 transition-colors">
          <div className={`h-1 w-full ${achievement.status === "HOLD" ? "bg-amber-500" : "bg-cyan-500"}`}></div>
          <CardHeader className="pb-3 border-b border-slate-800/50 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-xl text-slate-200">{achievement.title}</CardTitle>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-slate-950 border-slate-700 text-cyan-400 shadow-inner">
                  {achievement.category}
                </span>
                {achievement.status === "HOLD" && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium border border-amber-500/30 bg-amber-500/10 text-amber-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> HOLD (Updated)
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400 flex items-center gap-2">
                By <span className="font-semibold text-white">{achievement.student.name}</span> 
                ({achievement.student.registerNumber}) • {achievement.student.department}
              </p>
              <a 
                href={`/api/students/${achievement.studentId}/download-zip`} 
                className="mt-3 inline-flex items-center text-xs font-medium px-3 py-1.5 bg-slate-950/80 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 transition-colors shadow-sm"
              >
                <DownloadCloud className="w-3 h-3 mr-1.5 text-cyan-400" />
                Download All Student Docs (ZIP)
              </a>
            </div>
            <div className="text-sm text-slate-400 text-left md:text-right bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
              <div className="mb-1"><span className="font-medium text-slate-300">Result:</span> <span className="text-white">{achievement.result}</span></div>
              <div><span className="font-medium text-slate-300">Date:</span> {new Date(achievement.startDate).toLocaleDateString()}</div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mr-2"></div>
                Description & Tech Stack
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed bg-slate-950/30 p-4 rounded-xl border border-slate-800/30">{achievement.description}</p>
            </div>

            {achievement.proofFiles.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mr-2"></div>
                  Proof Documents
                </h4>
                <div className="flex flex-wrap gap-3">
                  {achievement.proofFiles.map((file: any) => (
                    <Dialog key={file.id}>
                      <DialogTrigger asChild>
                        <button className="flex items-center gap-2 text-sm px-4 py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-lg text-cyan-400 transition-all hover:shadow-[0_0_10px_-2px_rgba(6,182,212,0.3)] hover:-translate-y-0.5">
                          <ExternalLink className="w-4 h-4" />
                          {file.name}
                        </button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-950 border-slate-800 text-slate-200 max-w-5xl w-[95vw] h-[85vh] flex flex-col p-6 shadow-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex justify-between items-center text-xl text-white pr-8">
                            <span className="truncate max-w-[60%]">{file.name}</span>
                            <a href={file.url} download className="text-sm font-semibold flex items-center bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/40 px-3 py-1.5 rounded-md transition-colors border border-cyan-500/30">
                              <DownloadCloud className="w-4 h-4 mr-2" /> Download File
                            </a>
                          </DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 w-full bg-slate-900 rounded-lg overflow-hidden mt-4 border border-slate-800">
                          {file.type.startsWith('image/') ? (
                            <img src={file.url} alt={file.name} className="w-full h-full object-contain" />
                          ) : (
                            <iframe src={file.url} className="w-full h-full border-0" />
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-slate-950/30 border-t border-slate-800 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-1/2">
              <Input 
                placeholder="Leave a remark (required for Hold/Reject, optional for Approve)..." 
                className="bg-slate-950/80 border-slate-800 focus:border-cyan-500 text-slate-200"
                value={remarks[achievement.id] || ""}
                onChange={(e) => handleRemarkChange(achievement.id, e.target.value)}
              />
            </div>
            <div className="flex flex-wrap justify-end gap-3 w-full md:w-auto">
              <Button 
                variant="outline" 
                className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 bg-transparent transition-colors"
                onClick={() => handleStatusChange(achievement.id, "REJECTED")}
                disabled={loadingId === achievement.id}
              >
                {loadingId === achievement.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <X className="w-4 h-4 mr-2" />}
                Reject
              </Button>
              <Button 
                variant="outline" 
                className="border-amber-500/50 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 bg-transparent transition-colors"
                onClick={() => handleStatusChange(achievement.id, "HOLD")}
                disabled={loadingId === achievement.id}
              >
                {loadingId === achievement.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
                Hold for Updates
              </Button>
              <Button 
                className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)] transition-all"
                onClick={() => handleStatusChange(achievement.id, "APPROVED")}
                disabled={loadingId === achievement.id}
              >
                {loadingId === achievement.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                Approve Now
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
