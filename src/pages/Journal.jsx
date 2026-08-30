import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen, FolderOpen, Trash2, Plus, Shield, AlertTriangle,
  CheckCircle2, Flag, Ban, Bookmark, Clock, Lock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import RiskBadge from "@/components/scan/RiskBadge";

const FOLDERS = [
  { id: "all", label: "All Entries", icon: BookOpen, color: "text-primary" },
  { id: "confirmed_scams", label: "Confirmed Scams", icon: AlertTriangle, color: "text-red-600" },
  { id: "suspicious", label: "Suspicious Messages", icon: Shield, color: "text-amber-600" },
  { id: "safe", label: "Safe Messages", icon: CheckCircle2, color: "text-emerald-600" },
  { id: "reported_to_authorities", label: "Reported to Authorities", icon: Flag, color: "text-blue-600" },
  { id: "blocked_senders", label: "Blocked Senders", icon: Ban, color: "text-rose-600" },
  { id: "saved_for_later", label: "Saved for Later", icon: Bookmark, color: "text-purple-600" },
];

export default function Journal() {
  const [activeFolder, setActiveFolder] = useState("all");
  const [addingNote, setAddingNote] = useState(null);
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["journal-entries"],
    queryFn: () => base44.entities.JournalEntry.list("-created_date", 200),
  });

  const { data: scans = [] } = useQuery({
    queryKey: ["user-scans"],
    queryFn: () => base44.entities.ScanResult.list("-created_date", 200),
  });

  const bookmarkedScans = scans.filter(s => s.is_bookmarked && !entries.some(e => e.scan_result_id === s.id));

  const filtered = activeFolder === "all"
    ? entries
    : entries.filter(e => e.folder === activeFolder);

  const deleteEntry = async (id) => {
    await base44.entities.JournalEntry.delete(id);
    queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
  };

  const addFromScan = async (scan) => {
    const folder = scan.risk_level === "extreme" || scan.risk_level === "high"
      ? "confirmed_scams"
      : scan.risk_level === "moderate" ? "suspicious" : "safe";

    await base44.entities.JournalEntry.create({
      scan_result_id: scan.id,
      title: scan.input_content?.slice(0, 80) || "Scanned message",
      folder,
      risk_level: scan.risk_level,
      category: scan.categories?.[0] || "other",
      summary: scan.explanation || "",
    });
    queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
  };

  const folderCounts = {};
  entries.forEach(e => {
    folderCounts[e.folder] = (folderCounts[e.folder] || 0) + 1;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-12">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-heading font-bold">My Scam Journal</h1>
        </div>
        <p className="text-sm text-muted-foreground">Private — only you can see this. Organize your scam analyses into folders.</p>
      </div>

      <div className="flex gap-5 flex-col sm:flex-row">
        {/* Sidebar */}
        <div className="sm:w-48 shrink-0">
          <div className="space-y-0.5">
            {FOLDERS.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFolder(f.id)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors text-left ${activeFolder === f.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`}
              >
                <span className="flex items-center gap-2">
                  <f.icon className={`w-4 h-4 shrink-0 ${activeFolder === f.id ? "text-primary" : f.color}`} />
                  <span className="text-xs">{f.label}</span>
                </span>
                {f.id !== "all" && folderCounts[f.id] ? (
                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">{folderCounts[f.id]}</span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Add from bookmarked scans */}
          {bookmarkedScans.length > 0 && (
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-4">
              <p className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-primary" /> {bookmarkedScans.length} saved scan{bookmarkedScans.length > 1 ? "s" : ""} not yet in journal
              </p>
              <div className="space-y-2">
                {bookmarkedScans.slice(0, 3).map(scan => (
                  <div key={scan.id} className="flex items-center justify-between gap-2 bg-white rounded-lg px-3 py-2 border border-border/50">
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{scan.input_content?.slice(0, 60) || "Scanned content"}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">{scan.risk_level} risk</p>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 text-xs shrink-0" onClick={() => addFromScan(scan)}>
                      Add to Journal
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-20 bg-muted/40 rounded-xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <FolderOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-semibold text-sm mb-1">This folder is empty</p>
              <p className="text-xs text-muted-foreground">Bookmark scans from your analysis results to add them here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(entry => {
                const folder = FOLDERS.find(f => f.id === entry.folder);
                return (
                  <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Card className="border-0 shadow-sm hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              {folder && (
                                <span className={`text-[10px] font-medium flex items-center gap-1 ${folder.color}`}>
                                  <folder.icon className="w-3 h-3" /> {folder.label}
                                </span>
                              )}
                              {entry.risk_level && <RiskBadge level={entry.risk_level} />}
                            </div>
                            <p className="text-sm font-medium leading-snug">{entry.title}</p>
                            {entry.summary && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{entry.summary}</p>}
                            {entry.notes && (
                              <div className="mt-2 bg-muted/40 rounded-lg px-3 py-2">
                                <p className="text-xs italic text-muted-foreground">{entry.notes}</p>
                              </div>
                            )}
                            <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {entry.created_date ? formatDistanceToNow(new Date(entry.created_date), { addSuffix: true }) : "Recently"}
                            </p>
                          </div>
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}