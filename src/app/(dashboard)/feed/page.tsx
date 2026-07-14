import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FeedInteractions } from "./FeedInteractions";
import { Trophy, Calendar as CalendarIcon, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function NewsFeedPage() {
  const session = await getServerSession(authOptions);

  // Fetch Announcements
  const announcements = await prisma.announcement.findMany({
    include: {
      postedBy: true,
      registrations: true
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  // Fetch FeedPosts (Faculty published results)
  const posts = await prisma.feedPost.findMany({
    include: {
      announcement: true
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  // Fetch Success Stories (Student published)
  const stories = await prisma.successStory.findMany({
    include: {
      achievement: {
        include: { student: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  // Combine and sort by createdAt
  type FeedItem = 
    | { type: 'ANNOUNCEMENT', data: typeof announcements[0], date: Date }
    | { type: 'POST', data: typeof posts[0], date: Date }
    | { type: 'STORY', data: typeof stories[0], date: Date };

  const feed: FeedItem[] = [
    ...announcements.map(a => ({ type: 'ANNOUNCEMENT' as const, data: a, date: a.createdAt })),
    ...posts.map(p => ({ type: 'POST' as const, data: p, date: p.createdAt })),
    ...stories.map(s => ({ type: 'STORY' as const, data: s, date: s.createdAt }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Department Feed</h1>
        <p className="text-slate-400 mt-2">Stay updated with upcoming events and celebrate department successes.</p>
      </div>

      <div className="space-y-6">
        {feed.map((item, idx) => {
          if (item.type === 'ANNOUNCEMENT') {
            const ann = item.data;
            const isInterested = session ? ann.registrations.some(r => r.studentId === session.user?.id) : false;
            
            return (
              <Card key={`ann-${ann.id}`} className="bg-slate-900/80 border-cyan-900/50 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                        <span className="text-sm font-bold text-cyan-400">{ann.postedBy.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{ann.postedBy.name} <span className="text-slate-500 font-normal">posted an announcement</span></p>
                        <p className="text-xs text-slate-500">{new Date(ann.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase bg-slate-800 text-slate-300">
                      {ann.type}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-bold text-white mb-2">{ann.title}</h3>
                  <p className="text-slate-300 text-sm mb-4 whitespace-pre-wrap">{ann.description}</p>
                  
                  {ann.targetDate && (
                    <div className="flex items-center text-sm text-cyan-400 font-medium mb-4">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Scheduled for {new Date(ann.targetDate).toLocaleDateString()}
                    </div>
                  )}

                  {ann.link && (
                    <a href={ann.link} target="_blank" rel="noreferrer" className="flex items-center text-sm text-blue-400 hover:underline mb-4">
                      <ExternalLink className="w-4 h-4 mr-1" /> View External Link
                    </a>
                  )}

                  {session?.user?.role === "STUDENT" && (
                    <FeedInteractions 
                      announcementId={ann.id} 
                      isInterestedInitial={isInterested} 
                      countInitial={ann.registrations.length} 
                    />
                  )}
                </CardContent>
              </Card>
            );
          } else if (item.type === 'POST') {
            const post = item.data;
            return (
              <Card key={`post-${post.id}`} className="bg-slate-900/80 border-emerald-900/50 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                        <span className="text-sm font-bold text-emerald-400">FA</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Faculty <span className="text-slate-500 font-normal">published event results</span></p>
                        <p className="text-xs text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Results
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4 text-emerald-400">
                    <Trophy className="w-6 h-6" />
                    <h3 className="text-2xl font-bold text-white">{post.title}</h3>
                  </div>
                  
                  <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 font-mono text-sm text-slate-300 whitespace-pre-wrap">
                    {post.content}
                  </div>
                  
                  {post.announcement && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                      <ExternalLink className="w-3 h-3" />
                      Related Event: {post.announcement.title}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          } else {
            const story = item.data;
            const ach = story.achievement;
            return (
              <Card key={`story-${story.id}`} className="bg-slate-900/80 border-purple-900/50 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                      <span className="text-sm font-bold text-purple-400">{ach.student.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{ach.student.name} <span className="text-slate-500 font-normal">shared a success story!</span></p>
                      <p className="text-xs text-slate-500">{new Date(story.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2 text-purple-400">
                    <Trophy className="w-5 h-5" />
                    <h3 className="text-lg font-bold text-white">{ach.title}</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300">
                      {ach.category}
                    </span>
                    <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-purple-400 font-medium">
                      {ach.result}
                    </span>
                  </div>
                  
                  <div className="mt-4 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <h4 className="text-sm font-bold text-purple-400 mb-1">How We Won 🏆</h4>
                    <p className="text-xs text-slate-300 line-clamp-2 italic">"{story.whatWeBuilt}"</p>
                    <Link href={`/feed/story/${ach.id}`} className="text-xs text-purple-400 hover:underline mt-2 inline-block font-medium">
                      Read full story →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          }
        })}
        
        {feed.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">The feed is currently empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}
