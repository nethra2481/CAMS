"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2, UserPlus, X, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

interface StudentSearchResult {
  id: string;
  name: string;
  registerNumber: string | null;
  department: string | null;
  year: string | null;
}

export function TeammateSearch({ onAddInternal, onAddExternal }: { 
  onAddInternal: (student: StudentSearchResult) => void,
  onAddExternal: (name: string, dept: string) => void 
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StudentSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // External fallback state
  const [showExternalForm, setShowExternalForm] = useState(false);
  const [extName, setExtName] = useState("");
  const [extDept, setExtDept] = useState("Computer Science");

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.students || []);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300); // debounce

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectInternal = (student: StudentSearchResult) => {
    // SECURITY/FALLBACK CHECK: User specified logic for non-Cyber Security students
    if (student.department && student.department.toLowerCase() !== "cyber security" && student.department.toLowerCase() !== "cys") {
      setShowExternalForm(true);
      setExtName(student.name);
      setExtDept(student.department);
      setShowDropdown(false);
      setQuery("");
      return;
    }

    onAddInternal(student);
    setQuery("");
    setShowDropdown(false);
  };

  const submitExternal = () => {
    if (extName && extDept) {
      onAddExternal(extName, extDept);
      setShowExternalForm(false);
      setExtName("");
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
        <Input 
          placeholder="Search teammates by Name or Roll Number (e.g. Balan... or CB.SC...)" 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowExternalForm(false); // Reset external form if typing again
          }}
          className="pl-10 bg-slate-950/50 border-slate-800 text-slate-200 focus:border-cyan-500"
        />
        {loading && <Loader2 className="absolute right-3 top-3 h-4 w-4 text-cyan-500 animate-spin" />}
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
          {results.map(student => (
            <div 
              key={student.id}
              onClick={() => handleSelectInternal(student)}
              className="p-3 border-b border-slate-800 hover:bg-slate-800 cursor-pointer flex justify-between items-center transition-colors"
            >
              <div>
                <p className="text-sm font-bold text-white">{student.name}</p>
                <p className="text-xs text-slate-400">
                  {student.year || 'Unknown'} Year • {student.department || 'Unknown Dept'}
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">
                {student.registerNumber}
              </span>
            </div>
          ))}
        </div>
      )}

      {showDropdown && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute z-10 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-4 text-center">
          <p className="text-sm text-slate-400 mb-2">No Cyber Security students found.</p>
          <Button 
            type="button"
            variant="outline" 
            size="sm" 
            onClick={() => {
              setShowDropdown(false);
              setShowExternalForm(true);
            }}
            className="text-cyan-400 border-cyan-900 hover:bg-cyan-900/30"
          >
            Add as External Teammate
          </Button>
        </div>
      )}

      {showExternalForm && (
        <div className="mt-4 p-4 bg-red-950/20 border border-red-900/50 rounded-lg animate-fade-in relative">
          <button 
            type="button" 
            onClick={() => setShowExternalForm(false)}
            className="absolute top-2 right-2 text-slate-500 hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2 text-red-400 mb-3 font-medium text-sm">
            <AlertTriangle className="w-4 h-4" />
            This student does not belong to the Cyber Security department.
          </div>
          <p className="text-xs text-slate-400 mb-4">Would you like to add them as an External Team Member instead?</p>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Name</label>
              <Input 
                value={extName} 
                onChange={(e) => setExtName(e.target.value)}
                className="bg-slate-950 border-slate-800 text-sm h-8"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Department / College</label>
              <Input 
                value={extDept} 
                onChange={(e) => setExtDept(e.target.value)}
                className="bg-slate-950 border-slate-800 text-sm h-8"
              />
            </div>
          </div>
          <Button 
            type="button" 
            onClick={submitExternal}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white h-8 text-sm"
          >
            <UserPlus className="w-3 h-3 mr-2" /> Add External Teammate
          </Button>
        </div>
      )}
    </div>
  );
}
