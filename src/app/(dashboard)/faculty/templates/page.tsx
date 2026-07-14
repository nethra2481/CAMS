"use client";

import { useEffect, useState } from "react";
import { getAllTemplates } from "@/app/actions/templates";
import { Builder, FormField } from "./Builder";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LayoutTemplate, Plus, Loader2 } from "lucide-react";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<{ category: string, schemaJson: string, readinessPoints: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [schemaFields, setSchemaFields] = useState<FormField[]>([]);
  const [initialPoints, setInitialPoints] = useState<number>(0);

  // We could fetch predefined categories from DB or hardcode standard ones
  const EVENT_CATEGORIES = [
    "Hackathon",
    "Capture The Flag (CTF)",
    "Paper Presentation",
    "Project Expo",
    "Certification",
    "Internship",
    "Workshop"
  ];

  const fetchTemplates = async () => {
    setLoading(true);
    const res = await getAllTemplates();
    if (res.success && res.templates) {
      setTemplates(res.templates);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSelectCategory = (category: string | null) => {
    if (!category) return;
    setSelectedCategory(category);
    const existing = templates.find(t => t.category === category);
    if (existing) {
      try {
        setSchemaFields(JSON.parse(existing.schemaJson));
        setInitialPoints(existing.readinessPoints);
      } catch (e) {
        setSchemaFields([]);
        setInitialPoints(0);
      }
    } else {
      setSchemaFields([]);
      setInitialPoints(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
          <LayoutTemplate className="w-8 h-8 mr-3 text-cyan-400" />
          Form Templates
        </h1>
        <p className="text-slate-400 mt-2">Manage the custom data fields required for different types of events.</p>
      </div>

      <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-xl text-white">Select Event Category</CardTitle>
          <CardDescription className="text-slate-400">Choose a category to edit its template or create a new one.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center text-slate-400"><Loader2 className="animate-spin w-4 h-4 mr-2" /> Loading...</div>
          ) : (
            <Select value={selectedCategory || ""} onValueChange={handleSelectCategory}>
              <SelectTrigger className="w-full bg-slate-950 border-slate-700 text-white h-12">
                <SelectValue placeholder="Select an event category..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-white">
                {EVENT_CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat} {templates.some(t => t.category === cat) ? "(Customized)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {selectedCategory && (
        <Builder 
          key={selectedCategory} // Force re-render on category change
          category={selectedCategory} 
          initialFields={schemaFields} 
          initialPoints={initialPoints}
          onSaved={fetchTemplates}
        />
      )}
    </div>
  );
}
