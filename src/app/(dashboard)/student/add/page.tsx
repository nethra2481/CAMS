"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { submitAchievement } from "@/app/actions/achievements";
import { getEventForPrefill } from "@/app/actions/events";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, X, CheckCircle2, Loader2, FileText, Lock, LayoutTemplate } from "lucide-react";
import { TeammateSearch } from "@/components/TeammateSearch";
import { getFormTemplate } from "@/app/actions/templates";

function AddAchievementForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams?.get("eventId");

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [motivation, setMotivation] = useState<string | null>(null);
  
  // Pre-fill state
  const [isPrefilled, setIsPrefilled] = useState(false);
  const [allowTeams, setAllowTeams] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    organizer: "",
    category: "",
    level: "COLLEGE",
    mode: "OFFLINE",
    startDate: ""
  });
  
  const [categoryType, setCategoryType] = useState("");
  const [dynamicFields, setDynamicFields] = useState<any[]>([]);
  const [dynamicAnswers, setDynamicAnswers] = useState<Record<string, any>>({});
  const [dynamicFiles, setDynamicFiles] = useState<Record<string, File>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch form template when category changes
  useEffect(() => {
    if (categoryType && categoryType !== "Other") {
      getFormTemplate(categoryType).then(res => {
        if (res.success && res.template) {
          try {
            setDynamicFields(JSON.parse(res.template.schemaJson));
            setDynamicAnswers({}); // Reset answers
            setDynamicFiles({});
          } catch(e) {
            setDynamicFields([]);
          }
        } else {
          setDynamicFields([]);
        }
      });
    } else {
      setDynamicFields([]);
    }
  }, [categoryType]);

  useEffect(() => {
    if (eventId) {
      getEventForPrefill(eventId).then(res => {
        if (res.success && res.event) {
          setIsPrefilled(true);
          setAllowTeams(res.event.allowTeamEntries);
          setCategoryType(res.event.category);
          setFormData({
            title: res.event.title,
            organizer: res.event.organizer,
            category: res.event.category,
            level: res.event.level,
            mode: res.event.mode,
            startDate: res.event.targetDate ? new Date(res.event.targetDate).toISOString().split('T')[0] : ""
          });
        }
      });
    }
  }, [eventId]);

  const [isTeam, setIsTeam] = useState(false);
  const [teammates, setTeammates] = useState<Array<{ id?: string, name: string, dept?: string, internal: boolean }>>([]);

  const handleAddInternal = (student: any) => {
    if (teammates.find(t => t.id === student.id)) return;
    setTeammates([...teammates, { id: student.id, name: student.name, dept: student.department, internal: true }]);
  };

  const handleAddExternal = (name: string, dept: string) => {
    setTeammates([...teammates, { name, dept, internal: false }]);
  };

  const removeTeammate = (index: number) => {
    setTeammates(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMotivation(null);

    try {
      const formData = new FormData(e.currentTarget);
      // Append all files individually
      files.forEach(file => {
        formData.append("files", file);
      });
      
      if (isTeam && teammates.length > 0) {
        formData.append("teammates", JSON.stringify(teammates));
      }

      // Handle Dynamic Fields
      if (dynamicFields.length > 0) {
        const answersToSubmit: Record<string, any> = {};
        
        dynamicFields.forEach(field => {
          if (dynamicAnswers[field.id]) {
            answersToSubmit[field.label] = dynamicAnswers[field.id];
          }
        });

        // Append actual dynamic files and put placeholder in JSON
        Object.keys(dynamicFiles).forEach(fieldId => {
          const field = dynamicFields.find(f => f.id === fieldId);
          if (field) {
            formData.append(`dynamic_file_${field.label}`, dynamicFiles[fieldId]);
            answersToSubmit[field.label] = "__FILE_UPLOAD__";
          }
        });

        formData.append("dynamicData", JSON.stringify(answersToSubmit));
      }

      if (eventId) {
        formData.append("eventId", eventId);
      }

      const res = await submitAchievement(formData);
      
      if (res.success) {
        setMotivation(res.aiMotivation);
        setFiles([]);
        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error("Submission failed", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (motivation) {
    return (
      <div className="max-w-2xl mx-auto mt-12 animate-in fade-in zoom-in duration-500">
        <Card className="bg-slate-900/80 border-cyan-500/50 shadow-[0_0_50px_-12px_rgba(6,182,212,0.5)] backdrop-blur-xl text-center p-8">
          <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-cyan-400" />
          </div>
          <CardTitle className="text-3xl text-white mb-4 font-bold">Achievement Logged!</CardTitle>
          <CardDescription className="text-lg text-slate-300 mb-8 max-w-lg mx-auto italic">
            "{motivation}"
          </CardDescription>
          <Button 
            className="bg-cyan-600 hover:bg-cyan-500" 
            onClick={() => router.push("/student")}
          >
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Log New Achievement</h1>
        <p className="text-slate-400 mt-2">Submit your hackathons, CTFs, and certifications for faculty approval.</p>
      </div>

      <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl shadow-xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-xl text-slate-200">Achievement Details</CardTitle>
            <CardDescription className="text-slate-400">Fill in the event specifics carefully.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300 flex items-center">
                  Title of Event / Certification {isPrefilled && <Lock className="w-3 h-3 ml-2 text-cyan-500" />}
                </Label>
                <Input id="title" name="title" required placeholder="e.g. DEF CON Qualifiers" 
                  defaultValue={formData.title} 
                  readOnly={isPrefilled}
                  className={`bg-slate-950/50 border-slate-800 text-slate-200 focus:border-cyan-500 ${isPrefilled ? 'opacity-70 cursor-not-allowed' : ''}`} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizer" className="text-slate-300 flex items-center">
                  Organizer / Issuer {isPrefilled && <Lock className="w-3 h-3 ml-2 text-cyan-500" />}
                </Label>
                <Input id="organizer" name="organizer" required placeholder="e.g. Offensive Security" 
                  defaultValue={formData.organizer}
                  readOnly={isPrefilled}
                  className={`bg-slate-950/50 border-slate-800 text-slate-200 focus:border-cyan-500 ${isPrefilled ? 'opacity-70 cursor-not-allowed' : ''}`} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categorySelect" className="text-slate-300 flex items-center">
                  Category {isPrefilled && <Lock className="w-3 h-3 ml-2 text-cyan-500" />}
                </Label>
                {isPrefilled ? (
                  <Input name="category" value={categoryType} readOnly className="bg-slate-950/50 border-slate-800 text-slate-200 opacity-70 cursor-not-allowed" />
                ) : (
                  <select 
                    id="categorySelect" 
                    name={categoryType === "Other" ? undefined : "category"} 
                    required 
                    value={categoryType}
                    onChange={(e) => setCategoryType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="">Select Category...</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="CTF">CTF</option>
                    <option value="Other">Other</option>
                  </select>
                )}
                {categoryType === "Other" && (
                  <Input 
                    name="category" 
                    required 
                    placeholder="Please specify category..." 
                    className="mt-2 bg-slate-950/50 border-slate-800 text-slate-200 focus:border-cyan-500" 
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="level" className="text-slate-300">Level</Label>
                <select id="level" name="level" required className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                  <option value="COLLEGE">College Level</option>
                  <option value="INTER_COLLEGE">Inter-College</option>
                  <option value="STATE">State</option>
                  <option value="NATIONAL">National</option>
                  <option value="INTERNATIONAL">International</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mode" className="text-slate-300">Mode</Label>
                <select id="mode" name="mode" required className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                  <option value="ONLINE">Online</option>
                  <option value="OFFLINE">Offline</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="result" className="text-slate-300">Result / Rank</Label>
                <Input id="result" name="result" required placeholder="e.g. Winner, Top 10, Certified" className="bg-slate-950/50 border-slate-800 text-slate-200 focus:border-cyan-500" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-slate-300">Start Date</Label>
                <Input id="startDate" name="startDate" type="date" required className="bg-slate-950/50 border-slate-800 text-slate-200 focus:border-cyan-500 [color-scheme:dark]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-slate-300">End Date (Optional)</Label>
                <Input id="endDate" name="endDate" type="date" className="bg-slate-950/50 border-slate-800 text-slate-200 focus:border-cyan-500 [color-scheme:dark]" />
              </div>
            </div>

            {/* Dynamic Fields Section */}
            {dynamicFields.length > 0 && (
              <div className="space-y-6 pt-4 border-t border-slate-800">
                <div className="flex items-center text-cyan-400 mb-2">
                  <LayoutTemplate className="w-5 h-5 mr-2" />
                  <h3 className="text-lg font-medium text-slate-200">Additional Details for {categoryType}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dynamicFields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={`dyn_${field.id}`} className="text-slate-300">
                        {field.label} {field.required && <span className="text-red-400">*</span>}
                      </Label>
                      
                      {field.type === "text" && (
                        <Input 
                          id={`dyn_${field.id}`} 
                          required={field.required}
                          value={dynamicAnswers[field.id] || ""}
                          onChange={e => setDynamicAnswers({...dynamicAnswers, [field.id]: e.target.value})}
                          className="bg-slate-950/50 border-slate-800 text-slate-200 focus:border-cyan-500" 
                        />
                      )}

                      {field.type === "url" && (
                        <Input 
                          type="url"
                          id={`dyn_${field.id}`} 
                          required={field.required}
                          value={dynamicAnswers[field.id] || ""}
                          onChange={e => setDynamicAnswers({...dynamicAnswers, [field.id]: e.target.value})}
                          placeholder="https://..."
                          className="bg-slate-950/50 border-slate-800 text-slate-200 focus:border-cyan-500" 
                        />
                      )}

                      {field.type === "number" && (
                        <Input 
                          type="number"
                          id={`dyn_${field.id}`} 
                          required={field.required}
                          value={dynamicAnswers[field.id] || ""}
                          onChange={e => setDynamicAnswers({...dynamicAnswers, [field.id]: e.target.value})}
                          className="bg-slate-950/50 border-slate-800 text-slate-200 focus:border-cyan-500" 
                        />
                      )}

                      {field.type === "dropdown" && (
                        <select
                          id={`dyn_${field.id}`}
                          required={field.required}
                          value={dynamicAnswers[field.id] || ""}
                          onChange={e => setDynamicAnswers({...dynamicAnswers, [field.id]: e.target.value})}
                          className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                          <option value="">Select option...</option>
                          {field.options?.map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}

                      {field.type === "file" && (
                        <Input 
                          type="file"
                          id={`dyn_${field.id}`} 
                          required={field.required && !dynamicFiles[field.id]}
                          onChange={e => {
                            if (e.target.files?.[0]) {
                              setDynamicFiles({...dynamicFiles, [field.id]: e.target.files[0]});
                            }
                          }}
                          className="bg-slate-950/50 border-slate-800 text-slate-200 focus:border-cyan-500 file:text-cyan-400 file:bg-slate-900 file:border-0 file:mr-4 file:px-3 file:py-1 file:rounded" 
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-slate-200">Team Participation</h3>
                  <p className="text-sm text-slate-400">Did you participate as a team?</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">No</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isTeam}
                    onClick={() => setIsTeam(!isTeam)}
                    className={`${isTeam ? 'bg-cyan-500' : 'bg-slate-700'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                  >
                    <span className={`${isTeam ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                  </button>
                  <span className="text-sm text-slate-400">Yes</span>
                </div>
              </div>

              {isTeam && (
                <div className="space-y-4 bg-slate-950/30 p-4 rounded-xl border border-slate-800">
                  <div className="space-y-2">
                    <Label htmlFor="teamName" className="text-slate-300">Team Name (Optional)</Label>
                    <Input id="teamName" name="teamName" placeholder="e.g. CyberKnights" className="bg-slate-950/50 border-slate-800 text-slate-200 focus:border-cyan-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-slate-300">Add Teammates</Label>
                    <TeammateSearch onAddInternal={handleAddInternal} onAddExternal={handleAddExternal} />
                  </div>

                  {teammates.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <Label className="text-slate-400 text-xs uppercase tracking-wider">Team Roster</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {teammates.map((t, i) => (
                          <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                            <div>
                              <p className="text-sm font-medium text-white">{t.name}</p>
                              <p className="text-xs text-slate-500">{t.dept || 'Unknown Dept'} • {t.internal ? 'Internal' : 'External'}</p>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => removeTeammate(i)}
                              className="text-slate-500 hover:text-red-400 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800">
              <Label htmlFor="description" className="text-slate-300">Description & Tech Stack</Label>
              <textarea 
                id="description" 
                name="description" 
                required 
                rows={4}
                placeholder="Briefly describe what you built, learned, or achieved. Mention any specific tools used."
                className="flex w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none" 
              />
            </div>

            {/* File Upload UI */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div>
                <h3 className="text-lg font-medium text-slate-200">Proof Documents</h3>
                <p className="text-sm text-slate-400">Upload as many certificates or proof images as you want.</p>
              </div>
              
              <div 
                className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center bg-slate-950/30 hover:bg-slate-950/50 hover:border-cyan-500/50 transition-colors cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="w-10 h-10 text-slate-500 mx-auto mb-4 group-hover:text-cyan-400 transition-colors" />
                <p className="text-sm text-slate-300 font-medium">Click to upload files</p>
                <p className="text-xs text-slate-500 mt-1">Images, PDFs supported</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  multiple 
                  onChange={handleFileChange} 
                  accept="image/*,application/pdf"
                />
              </div>

              {files.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 group">
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <FileText className="w-5 h-5 text-cyan-500 shrink-0" />
                        <span className="text-sm text-slate-300 truncate">{f.name}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeFile(i)}
                        className="text-slate-500 hover:text-red-400 p-1 rounded-md hover:bg-slate-900 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </CardContent>
          <CardFooter className="bg-slate-900/50 rounded-b-xl border-t border-slate-800 p-6">
            <Button 
              type="submit" 
              className="w-full sm:w-auto ml-auto bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)]"
              disabled={loading || files.length === 0}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Submission & AI...
                </>
              ) : "Submit Achievement"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function AddAchievementPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading form...</div>}>
      <AddAchievementForm />
    </Suspense>
  );
}
