import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, ArrowLeft, Target, AlertTriangle, BookOpen, Lightbulb } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function StoryPage({ params }: { params: { id: string } }) {
  const achievement = await prisma.achievement.findUnique({
    where: { id: params.id },
    include: {
      student: true,
      successStory: true,
      teamMembers: true
    }
  });

  if (!achievement || !achievement.successStory || achievement.status !== "APPROVED") {
    return notFound();
  }

  const story = achievement.successStory;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
      <Link href="/feed">
        <Button variant="ghost" className="text-slate-400 hover:text-white -ml-4 mb-2">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Feed
        </Button>
      </Link>

      <div>
        <h1 className="text-4xl font-bold tracking-tight text-white flex items-center">
          <Trophy className="w-10 h-10 mr-4 text-emerald-400" />
          {achievement.title}
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Success Story by {achievement.student.name} • {achievement.organizer}</p>
      </div>

      <div className="flex gap-2">
        <span className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
          {achievement.result}
        </span>
        <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
          {achievement.category}
        </span>
      </div>

      <div className="space-y-6">
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
          <CardHeader className="pb-3 border-b border-slate-800/50">
            <CardTitle className="text-xl flex items-center text-cyan-400">
              <Target className="w-5 h-5 mr-3" /> What We Built
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{story.whatWeBuilt}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
          <CardHeader className="pb-3 border-b border-slate-800/50">
            <CardTitle className="text-xl flex items-center text-amber-500">
              <AlertTriangle className="w-5 h-5 mr-3" /> Challenges Faced
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{story.challengesFaced}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
          <CardHeader className="pb-3 border-b border-slate-800/50">
            <CardTitle className="text-xl flex items-center text-blue-400">
              <BookOpen className="w-5 h-5 mr-3" /> Lessons Learned
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{story.lessonsLearned}</p>
          </CardContent>
        </Card>

        <Card className="bg-emerald-900/20 border-emerald-900/50 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <CardHeader className="pb-3 border-b border-emerald-900/30">
            <CardTitle className="text-xl flex items-center text-emerald-400">
              <Lightbulb className="w-5 h-5 mr-3" /> Tips for Juniors
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-slate-200 leading-relaxed whitespace-pre-wrap font-medium">{story.tipsForJuniors}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
