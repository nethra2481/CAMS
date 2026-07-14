"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAnnouncement } from "@/app/actions/announcements";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from "lucide-react";

export default function PostAnnouncementForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await createAnnouncement(formData);
    
    setLoading(false);
    
    if (res.error) {
      alert(res.error);
    } else {
      (e.target as HTMLFormElement).reset();
      router.refresh();
    }
  };

  return (
    <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl shadow-xl sticky top-8">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-xl text-slate-200">New Post</CardTitle>
          <CardDescription className="text-slate-400">Broadcast to all students.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-300">Title</Label>
            <Input id="title" name="title" required placeholder="e.g. DEF CON Qualifiers" className="bg-slate-950/50 border-slate-800 text-slate-200 focus:border-cyan-500" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type" className="text-slate-300">Type</Label>
            <select id="type" name="type" required className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
              <option value="EVENT">Event / Hackathon</option>
              <option value="DEADLINE">Important Deadline</option>
              <option value="OPPORTUNITY">Internship / Opportunity</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate" className="text-slate-300">Date (Optional)</Label>
            <Input id="targetDate" name="targetDate" type="date" className="bg-slate-950/50 border-slate-800 text-slate-200 focus:border-cyan-500 [color-scheme:dark]" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link" className="text-slate-300">Link (Optional)</Label>
            <Input id="link" name="link" type="url" placeholder="https://..." className="bg-slate-950/50 border-slate-800 text-slate-200 focus:border-cyan-500" />
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Event Settings & Pre-fill</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="visibilityLevel" className="text-slate-300">Visibility</Label>
                <select id="visibilityLevel" name="visibilityLevel" className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-200">
                  <option value="DEPARTMENT">Entire Department</option>
                  <option value="BATCH">Specific Batch</option>
                  <option value="PRIVATE">Private / Invite Only</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetBatch" className="text-slate-300">Target Batch (if Batch vis)</Label>
                <Input id="targetBatch" name="targetBatch" placeholder="e.g. 2024" className="bg-slate-950/50 border-slate-800 text-slate-200 focus:border-cyan-500" />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 text-sm text-slate-300 cursor-pointer">
                <input type="checkbox" name="acceptSubmissions" defaultChecked className="rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-cyan-500" />
                <span>Accept Submissions</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-slate-300 cursor-pointer">
                <input type="checkbox" name="allowTeamEntries" defaultChecked className="rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-cyan-500" />
                <span>Allow Team Entries</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventCategory" className="text-slate-300">Pre-fill Category</Label>
                <Input id="eventCategory" name="eventCategory" placeholder="e.g. Hackathon" className="bg-slate-950/50 border-slate-800 text-slate-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventOrganizer" className="text-slate-300">Pre-fill Organizer</Label>
                <Input id="eventOrganizer" name="eventOrganizer" placeholder="e.g. CYS Dept" className="bg-slate-950/50 border-slate-800 text-slate-200" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300">Description</Label>
            <textarea 
              id="description" 
              name="description" 
              required 
              rows={4}
              placeholder="Provide details..."
              className="flex w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none" 
            />
          </div>
        </CardContent>
        <CardFooter className="bg-slate-900/50 rounded-b-xl border-t border-slate-800 p-4">
          <Button 
            type="submit" 
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)]"
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            {loading ? "Posting..." : "Post Announcement"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
