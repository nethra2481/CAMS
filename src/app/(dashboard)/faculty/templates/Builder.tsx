"use client";

import { useState } from "react";
import { saveFormTemplate } from "@/app/actions/templates";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2, GripVertical, Save } from "lucide-react";

export type FieldType = "text" | "url" | "number" | "dropdown" | "file";

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[]; // For dropdowns
}

interface BuilderProps {
  category: string;
  initialFields: FormField[];
  initialPoints?: number;
  onSaved: () => void;
}

export function Builder({ category, initialFields, initialPoints = 0, onSaved }: BuilderProps) {
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [points, setPoints] = useState<number>(initialPoints);
  const [loading, setLoading] = useState(false);

  const addField = () => {
    setFields([
      ...fields,
      {
        id: `field_${Date.now()}`,
        label: "New Field",
        type: "text",
        required: false,
      }
    ]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleSave = async () => {
    setLoading(true);
    const schemaJson = JSON.stringify(fields);
    const res = await saveFormTemplate(category, schemaJson, points);
    setLoading(false);
    
    if (res.error) {
      alert(res.error);
    } else {
      onSaved();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Editing Template: {category}</h2>
          <p className="text-slate-400 text-sm">Define the custom fields students must fill out when submitting this event type.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-1.5">
            <Label htmlFor="points" className="text-slate-300 text-xs uppercase tracking-wider whitespace-nowrap">Readiness Points</Label>
            <Input 
              id="points"
              type="number" 
              value={points} 
              onChange={e => setPoints(parseInt(e.target.value) || 0)}
              className="w-20 bg-slate-950 border-slate-700 text-cyan-400 font-mono text-center h-8"
            />
          </div>
          <Button onClick={addField} variant="outline" className="border-cyan-500/50 text-cyan-400 bg-slate-950 hover:bg-cyan-500/10">
            <Plus className="w-4 h-4 mr-2" /> Add Field
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {fields.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/50 border border-slate-800 border-dashed rounded-xl text-slate-400">
            No custom fields defined. Click "Add Field" to start building.
          </div>
        ) : (
          fields.map((field, index) => (
            <Card key={field.id} className="bg-slate-900 border-slate-800">
              <CardContent className="p-4 flex gap-4 items-start">
                <div className="pt-2 cursor-grab text-slate-600 hover:text-slate-400">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4 space-y-2">
                    <Label className="text-slate-400 text-xs uppercase tracking-wider">Field Label</Label>
                    <Input 
                      value={field.label} 
                      onChange={e => updateField(field.id, { label: e.target.value })}
                      className="bg-slate-950 border-slate-700 text-white"
                    />
                  </div>
                  
                  <div className="md:col-span-3 space-y-2">
                    <Label className="text-slate-400 text-xs uppercase tracking-wider">Data Type</Label>
                    <Select value={field.type} onValueChange={(v: FieldType | null) => v && updateField(field.id, { type: v })}>
                      <SelectTrigger className="bg-slate-950 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800 text-white">
                        <SelectItem value="text">Short Text</SelectItem>
                        <SelectItem value="url">URL Link</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="dropdown">Dropdown</SelectItem>
                        <SelectItem value="file">File Upload</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-3 flex flex-col justify-center space-y-2 pt-6">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={field.required} 
                        onCheckedChange={c => updateField(field.id, { required: c })}
                      />
                      <Label className="text-slate-300">Required</Label>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex justify-end pt-6">
                    <Button variant="ghost" size="icon" onClick={() => removeField(field.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {field.type === "dropdown" && (
                    <div className="md:col-span-12 space-y-2 pt-2 border-t border-slate-800">
                      <Label className="text-slate-400 text-xs uppercase tracking-wider">Options (Comma separated)</Label>
                      <Input 
                        value={field.options?.join(", ") || ""} 
                        onChange={e => updateField(field.id, { options: e.target.value.split(",").map(s => s.trim()) })}
                        placeholder="e.g. 1st Place, 2nd Place, Runner up"
                        className="bg-slate-950 border-slate-700 text-white font-mono text-sm"
                      />
                    </div>
                  )}
                  
                  {field.type === "file" && (
                    <div className="md:col-span-12 pt-2">
                      <p className="text-xs text-amber-400/80">
                        * Note: A file upload button will be rendered for this field.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {loading ? "Saving..." : "Save Template"}
        </Button>
      </div>
    </div>
  );
}
