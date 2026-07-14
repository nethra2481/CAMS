"use client";

import { useState } from "react";
import { toggleEventRegistration } from "@/app/actions/announcements";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarPlus, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function FeedInteractions({ 
  announcementId, 
  isInterestedInitial, 
  countInitial 
}: { 
  announcementId: string, 
  isInterestedInitial: boolean,
  countInitial: number
}) {
  const [loading, setLoading] = useState(false);
  const [isInterested, setIsInterested] = useState(isInterestedInitial);
  const [count, setCount] = useState(countInitial);
  const router = useRouter();

  const handleToggle = async () => {
    setLoading(true);
    const res = await toggleEventRegistration(announcementId);
    
    if (res.success) {
      if (res.status === "registered") {
        setIsInterested(true);
        setCount(c => c + 1);
      } else {
        setIsInterested(false);
        setCount(c => c - 1);
      }
      router.refresh();
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-800">
      <Button
        onClick={handleToggle}
        disabled={loading}
        variant="outline"
        className={`bg-transparent border ${isInterested ? 'border-cyan-500 text-cyan-400 hover:bg-cyan-500/10' : 'border-slate-700 text-slate-300 hover:bg-slate-800'}`}
      >
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 
         isInterested ? <CheckCircle2 className="w-4 h-4 mr-2" /> : 
         <CalendarPlus className="w-4 h-4 mr-2" />}
        {isInterested ? "Registered" : "I'm Interested"}
      </Button>
      <span className="text-sm text-slate-500 font-medium">{count} student{count !== 1 && 's'} interested</span>
    </div>
  );
}
