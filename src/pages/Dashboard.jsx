import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { User, Lock, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { data: scans = [] } = useQuery({
    queryKey: ["user-scans"],
    queryFn: () => base44.entities.ScanResult.list("-created_date", 100),
    initialData: [],
  });

  const { data: reports = [] } = useQuery({
    queryKey: ["user-reports"],
    queryFn: () => base44.entities.ScamReport.list("-created_date", 50),
    initialData: [],
  });

  const { data: communityPosts = [] } = useQuery({
    queryKey: ["user-community-posts"],
    queryFn: () => base44.entities.CommunityPost.list("-created_date", 50),
    initialData: [],
  });

  const { data: journalEntries = [] } = useQuery({
    queryKey: ["journal-entries"],
    queryFn: () => base44.entities.JournalEntry.list("-created_date", 100),
    initialData: [],
  });

  const completedModules = (() => {
    try { return JSON.parse(localStorage.getItem("completedModules") || "[]"); } catch { return []; }
  })();

  const highRiskCount = scans.filter((s) => s.risk_level === "high" || s.risk_level === "extreme").length;
  const bookmarkedCount = scans.filter((s) => s.is_bookmarked).length;

  const stats = [
    { label: "Analyses", value: scans.length },
    { label: "Reports", value: communityPosts.length + reports.length },
    { label: "Lessons", value: completedModules.length },
    { label: "High-Risk Results", value: highRiskCount },
    { label: "Saved Results", value: bookmarkedCount },
    { label: "Journal Entries", value: journalEntries.length },
  ];

  const links = [
    { to: "/profile", icon: User, label: "Profile" },
    { to: "/journal", icon: Lock, label: "Scam Journal" },
    { to: "/community", icon: Users, label: "Community Reports" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-12">
      <h1 className="text-2xl font-bold mb-5">My Activity</h1>

      {/* Summary panel */}
      <div className="border rounded-md divide-y mb-6">
        {stats.map(stat => (
          <div key={stat.label} className="flex items-center justify-between p-3">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <span className="text-sm font-semibold">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Navigation links */}
      <div className="border rounded-md divide-y">
        {links.map(item => (
          <Link key={item.to} to={item.to}>
            <div className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors group">
              <item.icon className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-medium flex-1">{item.label}</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}