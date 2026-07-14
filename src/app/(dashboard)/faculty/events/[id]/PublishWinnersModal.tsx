"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { publishFeedPost } from "@/app/actions/feed";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Megaphone, X } from "lucide-react";

export default function PublishWinnersModal({ eventId, eventTitle, isPublished }: { eventId: string, eventTitle: string, isPublished: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (isPublished) {
    return (
      <Button disabled variant="outline" className="border-emerald-900 text-emerald-500 bg-emerald-500/10">
        Results Published
      </Button>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("eventId", eventId);
    
    const res = await publishFeedPost(formData);
    
    setLoading(false);
    if (res.error) {
      alert(res.error);
    } else {
      setIsOpen(false);
      router.refresh();
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]"
      >
        <Megaphone className="w-4 h-4 mr-2" />
        Publish Winners
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-6 border-b border-slate-800">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Megaphone className="w-6 h-6 mr-3 text-emerald-400" />
                Publish Results to News Feed
              </h2>
              <p className="text-slate-400 mt-1 text-sm">Create a public post announcing the winners of {eventTitle}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-300">Post Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    required 
                    defaultValue={`🏆 ${eventTitle} Results`}
                    className="bg-slate-950 border-slate-800 text-slate-200 focus:border-emerald-500 text-lg font-semibold" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-slate-300">Announcement Content</Label>
                  <textarea 
                    id="content" 
                    name="content" 
                    required 
                    rows={8}
                    placeholder="🥇 First Place: Team Alpha\n🥈 Second Place: Team Beta\n\nCongratulations to everyone who participated!"
                    className="flex w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none font-mono" 
                  />
                  <p className="text-xs text-slate-500">Supports emojis and multiple lines. This will be publicly visible on the Feed.</p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Publish to Feed
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
