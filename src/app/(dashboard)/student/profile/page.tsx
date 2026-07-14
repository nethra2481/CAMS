"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { getStudentStats } from "@/app/actions/statistics";
import { getProfile, updateProfile } from "@/app/actions/user";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Mail, Phone, Building, Briefcase, Award, Loader2, Globe, Code, Terminal, Edit3, X, Save } from "lucide-react";

export default function StudentProfilePage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<{ total: number, byCategory: Record<string, number> } | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user?.id) {
      Promise.all([
        getStudentStats(session.user.id),
        getProfile()
      ]).then(([statsRes, profileRes]) => {
        if (statsRes.success && statsRes.stats) {
          setStats(statsRes.stats);
        }
        if (profileRes) {
          setUserProfile(profileRes);
        }
        setLoading(false);
      });
    }
  }, [session]);

  if (!session?.user || !userProfile) {
    return loading ? (
      <div className="flex items-center justify-center min-h-[50vh] text-[#c0392b]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    ) : null;
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const res = await updateProfile(formData);
    
    if (res.error) {
      setError(res.error);
      setSaving(false);
    } else {
      // Reload profile
      const updated = await getProfile();
      setUserProfile(updated);
      setIsEditing(false);
      setSaving(false);
    }
  };

  const primaryColor = "#c0392b";

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12 font-share-tech">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap');
        .font-rajdhani { font-family: 'Rajdhani', sans-serif; }
        .font-share-tech { font-family: 'Share Tech Mono', monospace; }
        .cyber-card {
          background-color: rgba(20, 20, 20, 0.9);
          border: 1px solid rgba(192, 57, 43, 0.4);
          box-shadow: 0 0 20px -5px rgba(192, 57, 43, 0.3);
          position: relative;
        }
        .cyber-card::before {
          content: "";
          position: absolute; top: 0; left: 0; w: 10px; h: 10px;
          border-top: 2px solid ${primaryColor}; border-left: 2px solid ${primaryColor};
        }
        .cyber-input {
          background-color: #0d0d0d !important;
          border-color: #333 !important;
          color: white !important;
          font-family: 'Share Tech Mono', monospace !important;
        }
        .cyber-input:focus {
          border-color: ${primaryColor} !important;
        }
      `}</style>

      <div className="flex justify-between items-end border-b border-[#c0392b]/30 pb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-widest text-[#f0f0f0] uppercase flex items-center gap-3">
            <Terminal className="w-8 h-8 text-[#c0392b]" /> Operative Profile
          </h1>
          <p className="text-[#a85050] mt-2 tracking-widest text-sm uppercase">Classified Identity Data & Service Records</p>
        </div>
        {!isEditing && (
          <Button 
            onClick={() => setIsEditing(true)}
            className="bg-[#c0392b]/10 text-[#c0392b] border border-[#c0392b]/50 hover:bg-[#c0392b] hover:text-white uppercase tracking-widest font-share-tech transition-colors"
          >
            <Edit3 className="w-4 h-4 mr-2" /> Override Identity
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card className="cyber-card backdrop-blur-xl">
          <form onSubmit={handleSave}>
            <CardHeader className="border-b border-[#c0392b]/20 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-[#f0f0f0] uppercase tracking-widest flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-[#c0392b]" /> Edit Profile Data
                </CardTitle>
                <Button variant="ghost" type="button" onClick={() => setIsEditing(false)} className="text-[#8a8a8a] hover:text-white">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {error && <div className="p-3 bg-[#c0392b]/20 border border-[#c0392b] text-[#c0392b] text-sm">{error}</div>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#8a8a8a] uppercase tracking-widest text-xs">Operative Name</Label>
                  <Input id="name" name="name" defaultValue={userProfile.name} className="cyber-input" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#8a8a8a] uppercase tracking-widest text-xs">Email (Immutable)</Label>
                  <Input defaultValue={userProfile.email} className="cyber-input opacity-50 cursor-not-allowed" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-[#8a8a8a] uppercase tracking-widest text-xs">Comms Link (Mobile)</Label>
                  <Input id="mobile" name="mobile" defaultValue={userProfile.mobile || ""} className="cyber-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batch" className="text-[#8a8a8a] uppercase tracking-widest text-xs">Deployment Batch</Label>
                  <Input id="batch" name="batch" defaultValue={userProfile.batch || ""} placeholder="e.g. 2026" className="cyber-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github" className="text-[#8a8a8a] uppercase tracking-widest text-xs">GitHub Node</Label>
                  <Input id="github" name="github" defaultValue={userProfile.github || ""} placeholder="github.com/username" className="cyber-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-[#8a8a8a] uppercase tracking-widest text-xs">LinkedIn Node</Label>
                  <Input id="linkedin" name="linkedin" defaultValue={userProfile.linkedin || ""} placeholder="linkedin.com/in/username" className="cyber-input" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="skills" className="text-[#8a8a8a] uppercase tracking-widest text-xs">Known Vectors (Skills)</Label>
                  <Input id="skills" name="skills" defaultValue={userProfile.skills || ""} placeholder="e.g. Reversing, Web Exploitation, Crypto" className="cyber-input" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="aboutMe" className="text-[#8a8a8a] uppercase tracking-widest text-xs">Operative Bio</Label>
                  <textarea 
                    id="aboutMe" 
                    name="aboutMe" 
                    defaultValue={userProfile.aboutMe || ""} 
                    rows={4}
                    placeholder="Brief description..."
                    className="w-full p-3 cyber-input outline-none rounded-md" 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-[#c0392b]/20">
                <Button type="button" onClick={() => setIsEditing(false)} className="bg-transparent text-[#8a8a8a] hover:text-white uppercase tracking-widest border border-[#333]">
                  Abort
                </Button>
                <Button type="submit" disabled={saving} className="bg-[#c0392b] hover:bg-[#9b2020] text-white uppercase tracking-widest">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Transmit Data
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Personal Details Card */}
          <Card className="col-span-1 cyber-card backdrop-blur-xl h-fit">
            <CardHeader className="text-center pb-4 border-b border-[#c0392b]/20">
              <div className="w-24 h-24 rounded-none bg-[#c0392b]/10 border border-[#c0392b] mx-auto mb-4 flex items-center justify-center relative shadow-[0_0_15px_rgba(192,57,43,0.4)]">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#f0f0f0]"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#f0f0f0]"></div>
                <span className="text-4xl font-press-start text-[#c0392b]">{userProfile.name?.[0]?.toUpperCase()}</span>
              </div>
              <CardTitle className="text-2xl text-[#f0f0f0] uppercase tracking-wider">{userProfile.name}</CardTitle>
              <CardDescription className="text-[#c0392b] font-share-tech tracking-widest mt-1 uppercase">
                {userProfile.registerNumber || "UNREGISTERED"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center text-sm text-[#d0d0d0]">
                <Mail className="w-4 h-4 mr-4 text-[#c0392b]" />
                {userProfile.email}
              </div>
              <div className="flex items-center text-sm text-[#d0d0d0]">
                <Phone className="w-4 h-4 mr-4 text-[#c0392b]" />
                {userProfile.mobile || "N/A"}
              </div>
              <div className="flex items-center text-sm text-[#d0d0d0]">
                <Building className="w-4 h-4 mr-4 text-[#c0392b]" />
                {userProfile.department || "Unknown Dept"}
              </div>
              <div className="flex items-center text-sm text-[#d0d0d0]">
                <Briefcase className="w-4 h-4 mr-4 text-[#c0392b]" />
                Batch {userProfile.batch || "N/A"}
              </div>
              {userProfile.github && (
                <div className="flex items-center text-sm text-[#d0d0d0]">
                  <Code className="w-4 h-4 mr-4 text-[#c0392b]" />
                  {userProfile.github}
                </div>
              )}
              {userProfile.linkedin && (
                <div className="flex items-center text-sm text-[#d0d0d0]">
                  <Globe className="w-4 h-4 mr-4 text-[#c0392b]" />
                  {userProfile.linkedin}
                </div>
              )}
              
              {(userProfile.skills || userProfile.aboutMe) && (
                <div className="pt-4 mt-4 border-t border-[#c0392b]/20 space-y-4">
                  {userProfile.skills && (
                    <div>
                      <p className="text-xs text-[#8a8a8a] uppercase tracking-widest mb-1">Vectors</p>
                      <p className="text-sm text-[#d0d0d0]">{userProfile.skills}</p>
                    </div>
                  )}
                  {userProfile.aboutMe && (
                    <div>
                      <p className="text-xs text-[#8a8a8a] uppercase tracking-widest mb-1">Bio</p>
                      <p className="text-sm text-[#d0d0d0] leading-relaxed">{userProfile.aboutMe}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card className="col-span-1 md:col-span-2 cyber-card backdrop-blur-xl">
            <CardHeader className="border-b border-[#c0392b]/20">
              <CardTitle className="text-xl text-[#f0f0f0] uppercase tracking-widest flex items-center">
                <Trophy className="w-5 h-5 mr-3 text-[#c0392b]" /> Service Record
              </CardTitle>
              <CardDescription className="text-[#8a8a8a] uppercase tracking-widest text-xs mt-1">Confirmed Achievements & Bounties</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-[#c0392b]">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : !stats || stats.total === 0 ? (
                <div className="text-center py-12 bg-[#0d0d0d] rounded-sm border border-[#333] border-dashed">
                  <p className="text-[#8a8a8a] uppercase tracking-widest text-sm">No confirmed service records found.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#0d0d0d] p-6 rounded-sm border border-[#c0392b]/30 text-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-[#c0392b]/5 group-hover:bg-[#c0392b]/10 transition-colors"></div>
                      <h3 className="text-4xl font-press-start text-[#f0f0f0] mb-2">{stats.total}</h3>
                      <p className="text-[10px] text-[#c0392b] uppercase tracking-[0.2em]">Total Cleared</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-[#8a8a8a] uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Terminal className="w-3 h-3 text-[#c0392b]" /> Category Breakdown
                    </h4>
                    <div className="space-y-5">
                      {Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
                        const percentage = Math.round((count / stats.total) * 100);
                        return (
                          <div key={cat} className="space-y-2">
                            <div className="flex justify-between items-center text-sm uppercase tracking-widest">
                              <span className="font-medium text-[#d0d0d0] flex items-center">
                                <Award className="w-4 h-4 mr-3 text-[#c0392b]" />
                                {cat}
                              </span>
                              <span className="text-[#c0392b] font-mono">{count} [{percentage}%]</span>
                            </div>
                            <div className="h-1.5 w-full bg-[#333] rounded-none overflow-hidden">
                              <div 
                                className="h-full bg-[#c0392b] transition-all duration-1000 ease-out shadow-[0_0_10px_#c0392b]" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
