"use client";

import { useState } from "react";
import { bulkUpdateStatus, updateSingleStatus } from "@/app/actions/bulk";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, FileText, X, Star } from "lucide-react";

type Achievement = {
  id: string;
  title: string;
  category: string;
  status: string;
  scoreAwarded: number;
  dynamicData: string | null;
  student: { name: string; registerNumber: string | null };
  proofFiles: { url: string; name: string }[];
};

export default function BulkApprovalTable({ achievements, categoryPoints }: {
  achievements: Achievement[];
  categoryPoints?: Record<string, number>;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [previewAch, setPreviewAch] = useState<Achievement | null>(null);
  const [overridePoints, setOverridePoints] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleAll = () => {
    if (selectedIds.size === achievements.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(achievements.map(a => a.id)));
  };

  const handleBulkUpdate = async (status: "APPROVED" | "REJECTED" | "PENDING") => {
    if (selectedIds.size === 0) return;
    setLoading(true);
    const res = await bulkUpdateStatus(Array.from(selectedIds), status);
    setLoading(false);
    if (res.success) {
      setSelectedIds(new Set());
      router.refresh();
    } else {
      alert(res.error);
    }
  };

  const openPreview = (ach: Achievement) => {
    setPreviewAch(ach);
    // Pre-fill with existing score if already approved, otherwise use template default
    const defaultPts = categoryPoints?.[ach.category] ?? 0;
    setOverridePoints(String(ach.status === "APPROVED" ? ach.scoreAwarded : defaultPts));
  };

  const handleSingleUpdate = async (id: string, status: "APPROVED" | "REJECTED" | "PENDING") => {
    setLoading(true);
    const pts = status === "APPROVED" ? (parseInt(overridePoints) || 0) : undefined;
    const res = await updateSingleStatus(id, status, pts);
    setLoading(false);
    if (res.success) {
      setPreviewAch(null);
      router.refresh();
    } else {
      alert(res.error);
    }
  };

  const defaultPts = previewAch ? (categoryPoints?.[previewAch.category] ?? 0) : 0;

  return (
    <div className="space-y-6">
      {/* Bulk Action Bar */}
      <div className="flex items-center justify-between p-4 bg-slate-900/80 border border-slate-800 rounded-xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <label className="flex items-center space-x-2 text-sm text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={achievements.length > 0 && selectedIds.size === achievements.length}
              onChange={toggleAll}
              className="rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-cyan-500 w-5 h-5"
            />
            <span className="font-medium">Select All</span>
          </label>
          <span className="text-slate-500 text-sm">|</span>
          <span className="text-cyan-400 font-semibold text-sm">{selectedIds.size} Selected</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            disabled={selectedIds.size === 0 || loading}
            onClick={() => handleBulkUpdate("APPROVED")}
            className="bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
          </Button>
          <Button
            disabled={selectedIds.size === 0 || loading}
            onClick={() => handleBulkUpdate("REJECTED")}
            className="bg-red-600 hover:bg-red-500 text-white"
          >
            <XCircle className="w-4 h-4 mr-2" /> Reject
          </Button>
          <Button
            disabled={selectedIds.size === 0 || loading}
            onClick={() => handleBulkUpdate("PENDING")}
            variant="outline"
            className="border-amber-700 text-amber-500 hover:bg-amber-950/30 hover:text-amber-400"
          >
            <Clock className="w-4 h-4 mr-2" /> Hold
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4 w-16"></th>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Achievement</th>
              <th className="px-6 py-4">Points</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {achievements.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">No submissions found.</td>
              </tr>
            )}
            {achievements.map((ach) => (
              <tr key={ach.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(ach.id)}
                    onChange={() => toggleSelect(ach.id)}
                    className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500 w-5 h-5 cursor-pointer"
                  />
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-white">{ach.student.name}</p>
                  <p className="text-xs text-slate-500 font-mono">{ach.student.registerNumber}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-200">{ach.title}</p>
                  <p className="text-xs text-cyan-500/70">{ach.category}</p>
                </td>
                <td className="px-6 py-4">
                  {ach.status === "APPROVED" ? (
                    <span className="flex items-center gap-1 text-purple-400 font-semibold">
                      <Star className="w-3 h-3" />
                      {ach.scoreAwarded} pts
                    </span>
                  ) : (
                    <span className="text-slate-600 text-xs">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase border
                    ${ach.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      ach.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                    {ach.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" onClick={() => openPreview(ach)} className="text-cyan-400 hover:text-cyan-300">
                    Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Preview / Approval Modal */}
      {previewAch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setPreviewAch(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white mb-1">{previewAch.title}</h2>
              <p className="text-slate-400 text-sm">Submitted by {previewAch.student.name}</p>
            </div>
            <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">

              {/* Point Override Section */}
              <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">Placement Readiness Points</h3>
                  </div>
                  <span className="text-xs text-slate-500">Category default: {defaultPts} pts</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={overridePoints}
                    onChange={(e) => setOverridePoints(e.target.value)}
                    className="w-28 px-3 py-2 rounded-lg bg-slate-950 border border-purple-500/30 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors"
                    placeholder="Points"
                  />
                  <p className="text-xs text-slate-500 flex-1">
                    Override the default score before approving. Leave as-is to use the category default.
                  </p>
                </div>
                <div className="flex gap-2">
                  {[5, 10, 15, 20, 25].map(v => (
                    <button
                      key={v}
                      onClick={() => setOverridePoints(String(v))}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors
                        ${overridePoints === String(v)
                          ? "bg-purple-600 text-white"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                        }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Details */}
              {previewAch.dynamicData && (
                <div className="space-y-2 border-b border-slate-800 pb-4">
                  <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Additional Details</h3>
                  <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(() => {
                      try {
                        const parsed = JSON.parse(previewAch.dynamicData!);
                        return Object.entries(parsed).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-xs text-slate-500 uppercase">{key}</p>
                            {typeof value === 'string' && value.startsWith('http') ? (
                              <a href={value} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline break-all">
                                View Link
                              </a>
                            ) : (
                              <p className="text-sm text-slate-200">{String(value)}</p>
                            )}
                          </div>
                        ));
                      } catch (e) {
                        return <p className="text-xs text-red-400">Error parsing data.</p>;
                      }
                    })()}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Proof Documents</h3>
                {previewAch.proofFiles.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {previewAch.proofFiles.map((f, i) => (
                      <a key={i} href={f.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800 hover:border-cyan-500/50 transition-colors">
                        <FileText className="w-5 h-5 text-cyan-500" />
                        <span className="text-sm text-slate-200 truncate">{f.name}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No documents attached.</p>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
              <Button onClick={() => handleSingleUpdate(previewAch.id, "REJECTED")} variant="destructive" className="bg-red-600 hover:bg-red-500 text-white" disabled={loading}>
                Reject
              </Button>
              <Button onClick={() => handleSingleUpdate(previewAch.id, "PENDING")} variant="outline" className="border-amber-700 text-amber-500 hover:bg-amber-950/30" disabled={loading}>
                Hold
              </Button>
              <Button
                onClick={() => handleSingleUpdate(previewAch.id, "APPROVED")}
                className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]"
                disabled={loading}
              >
                <Star className="w-4 h-4 mr-2" />
                Approve · {overridePoints || defaultPts} pts
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
