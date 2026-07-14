"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitSuccessStory } from "@/app/actions/achievements";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Lightbulb, Trophy, AlertTriangle, Send } from "lucide-react";
import Link from "next/link";

export default function WriteSuccessStoryPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("achievementId", params.id);
    
    const res = await submitSuccessStory(formData);
    
    if (res.error) {
      alert(res.error);
      setLoading(false);
    } else {
      router.push(`/student/achievements`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
          <Trophy className="w-8 h-8 mr-3 text-emerald-400" />
          How We Won
        </h1>
        <p className="text-slate-400 mt-2">Share your experience, lessons learned, and tips for future students.</p>
      </div>

      <Card className="bg-slate-900/80 border-emerald-900/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-8 space-y-8">
            <div className="space-y-3">
              <Label htmlFor="whatWeBuilt" className="text-slate-200 text-base flex items-center font-semibold">
                1. What did you build / achieve?
              </Label>
              <textarea 
                id="whatWeBuilt" 
                name="whatWeBuilt" 
                required 
                rows={4}
                placeholder="We built a distributed malware analysis pipeline..."
                className="flex w-full rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono resize-none" 
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="challengesFaced" className="text-slate-200 text-base flex items-center font-semibold">
                <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
                2. What were the biggest challenges?
              </Label>
              <textarea 
                id="challengesFaced" 
                name="challengesFaced" 
                required 
                rows={4}
                placeholder="Integrating the backend with the AI model was difficult because..."
                className="flex w-full rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono resize-none" 
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="lessonsLearned" className="text-slate-200 text-base flex items-center font-semibold">
                3. What did you learn?
              </Label>
              <textarea 
                id="lessonsLearned" 
                name="lessonsLearned" 
                required 
                rows={4}
                placeholder="We learned how to properly manage state in React and..."
                className="flex w-full rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono resize-none" 
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="tipsForJuniors" className="text-slate-200 text-base flex items-center font-semibold">
                <Lightbulb className="w-4 h-4 mr-2 text-yellow-400" />
                4. Any tips for juniors?
              </Label>
              <textarea 
                id="tipsForJuniors" 
                name="tipsForJuniors" 
                required 
                rows={3}
                placeholder="Don't spend too much time on design early on. Focus on..."
                className="flex w-full rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono resize-none" 
              />
            </div>
          </CardContent>

          <CardFooter className="bg-slate-900/50 rounded-b-xl border-t border-slate-800 p-6 flex justify-between items-center">
            <Link href="/student/achievements">
              <Button type="button" variant="ghost" className="text-slate-400 hover:text-white">
                Cancel
              </Button>
            </Link>
            <Button 
              type="submit" 
              className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)] px-8"
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {loading ? "Publishing..." : "Publish Story"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
