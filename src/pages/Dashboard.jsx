import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { BarChart3, Shield, TrendingUp, BookOpen, Flag, Bookmark, Target, Users, User, Lock, ArrowRight, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import BadgeDisplay from "@/components/dashboard/BadgeDisplay";
import RecentScans from "@/components/dashboard/RecentScans";

const CATEGORY_COLORS = {
  education: "#3b82f6",
  employment: "#8b5cf6",
  social_media: "#ec4899",
  marketplace: "#f59e0b",
  financial: "#10b981",
  phishing: "#ef4444",
  relationship: "#f43f5e",
  package_delivery: "#f97316",
  other: "#6b7280",
};

function StatCard({ icon: Icon, value, label, sub, color }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs font-medium mt-0.5">{label}</p>
        {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: scans = [] } = useQuery({
    queryKey: ["user-scans"],
    queryFn: () => base44.entities.ScanResult.list("-created_date", 100),
    initialData: [],
  });

  const { data: badges = [] } = useQuery({
    queryKey: ["user-badges"],
    queryFn: () => base44.entities.Badge.list(),
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
  const avgScore = scans.length > 0
    ? Math.round(scans.reduce((acc, s) => acc + (s.scam_likelihood || 0), 0) / scans.length)
    : 0;

  // Safety score: inverse of average scam likelihood detected, +10 per report submitted
  const safetyScore = Math.min(100, Math.max(0, 100 - avgScore + reports.length * 5));

  // Category distribution
  const categoryCounts = {};
  scans.forEach((scan) => {
    (scan.categories || []).forEach((cat) => {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
  });
  const chartData = Object.entries(categoryCounts).map(([name, value]) => ({
    name: name.replace(/_/g, " "),
    value,
    color: CATEGORY_COLORS[name] || "#6b7280",
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            My Impact Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your contributions to ScamShield's community protection network
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard icon={Users} value={scans.length} label="People Potentially Helped" sub="Through your analyses" color="bg-primary/10 text-primary" />
          <StatCard icon={Flag} value={communityPosts.length + reports.length} label="Threats Reported" sub="Shared with community" color="bg-red-100 text-red-600" />
          <StatCard icon={BookOpen} value={completedModules.length} label="Lessons Completed" sub="Learning progress" color="bg-amber-100 text-amber-600" />
          <StatCard icon={Shield} value={badges.length} label="Badges Earned" sub="Community reputation" color="bg-purple-100 text-purple-600" />
        </div>

        {/* Secondary stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard icon={Target} value={highRiskCount} label="Scams Detected" sub="High-risk catches" color="bg-orange-100 text-orange-600" />
          <StatCard icon={Bookmark} value={bookmarkedCount} label="Reports Saved" sub="Bookmarked for reference" color="bg-blue-100 text-blue-600" />
          <StatCard icon={Lock} value={journalEntries.length} label="Journal Entries" sub="Private scam records" color="bg-emerald-100 text-emerald-600" />
          <StatCard icon={TrendingUp} value={scans.length > 0 ? `${safetyScore}` : "—"} label="Safety Score" sub="Your awareness rating" color="bg-teal-100 text-teal-600" />
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            { to: "/profile", icon: User, color: "bg-primary/10 text-primary", label: "My Profile & Badges", desc: "ScamShield score and reputation" },
            { to: "/journal", icon: Lock, color: "bg-emerald-100 text-emerald-600", label: "My Scam Journal", desc: `${journalEntries.length} private entries` },
            { to: "/community", icon: Users, color: "bg-blue-100 text-blue-600", label: "Community Intelligence", desc: "See what others are reporting" },
          ].map(item => (
            <Link key={item.to} to={item.to}>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold group-hover:text-primary transition-colors">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        {/* Safety Score + Chart */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Safety Score */}
          <Card className="border-0 shadow-md shadow-black/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-primary" />
                Safety Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="32" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <circle
                      cx="40" cy="40" r="32" fill="none"
                      stroke={safetyScore >= 70 ? "#10b981" : safetyScore >= 40 ? "#f59e0b" : "#ef4444"}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 32}`}
                      strokeDashoffset={`${2 * Math.PI * 32 * (1 - safetyScore / 100)}`}
                      style={{ transition: "stroke-dashoffset 1s ease" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{safetyScore}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {safetyScore >= 70 ? "Great Awareness" : safetyScore >= 40 ? "Stay Alert" : "Build Your Skills"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Based on your analysis history and community contributions
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {badges.slice(0, 2).map((b, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px]">{b.badge_type?.replace(/_/g, " ")}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Chart */}
          {chartData.length > 0 ? (
            <Card className="border-0 shadow-md shadow-black/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Categories Encountered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value}`, name]}
                      contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: "11px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {chartData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-1 text-[10px]">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="capitalize text-muted-foreground">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-md shadow-black/5">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <BookOpen className="w-8 h-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">Run your first analysis to see category insights</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Badges */}
        <div className="mb-6">
          <BadgeDisplay badges={badges} />
        </div>

        {/* Recent Scans */}
        <RecentScans scans={scans} />
      </motion.div>
    </div>
  );
}