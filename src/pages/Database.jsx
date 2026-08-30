import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import usePullToRefresh from "@/hooks/usePullToRefresh";
import PullToRefreshIndicator from "@/components/ui/PullToRefreshIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, TrendingUp, Clock, Flame, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ScamCard from "@/components/database/ScamCard";
import ReportForm from "@/components/database/ReportForm";
import ScamDetailSheet from "@/components/database/ScamDetailSheet";

const categoryFilters = [
  { value: "all", label: "All" },
  { value: "education", label: "Scholarships" },
  { value: "employment", label: "Jobs" },
  { value: "social_media", label: "Social Media" },
  { value: "financial", label: "Financial" },
  { value: "phishing", label: "Phishing" },
  { value: "relationship", label: "Romance" },
  { value: "package_delivery", label: "Delivery" },
];

const categoryLabels = {
  education: "Scholarship",
  employment: "Job / Internship",
  social_media: "Social Media",
  marketplace: "Marketplace",
  financial: "Financial",
  phishing: "Phishing",
  relationship: "Romance",
  package_delivery: "Delivery",
  other: "Other",
};

const CATEGORY_COLORS = {
  education: "bg-blue-100 text-blue-700",
  employment: "bg-purple-100 text-purple-700",
  social_media: "bg-pink-100 text-pink-700",
  marketplace: "bg-orange-100 text-orange-700",
  financial: "bg-emerald-100 text-emerald-700",
  phishing: "bg-red-100 text-red-700",
  relationship: "bg-rose-100 text-rose-700",
  package_delivery: "bg-amber-100 text-amber-700",
  other: "bg-gray-100 text-gray-700",
};

export default function Database() {
  const [showReport, setShowReport] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const { data: reports = [], isLoading, refetch } = useQuery({
    queryKey: ["scam-reports"],
    queryFn: () => base44.entities.ScamReport.filter({ status: "approved" }, "-created_date", 100),
    initialData: [],
  });

  const { pullY, refreshing } = usePullToRefresh(() => refetch());

  const trending = [...reports].filter(r => r.is_trending || (r.view_count || 0) > 200).slice(0, 3);

  // Category breakdown
  const categoryCounts = {};
  reports.forEach(r => {
    const cat = r.category || "other";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const filtered = reports.filter((r) => {
    const matchesSearch = !searchQuery ||
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || r.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "trending") return (b.view_count || 0) - (a.view_count || 0);
    return new Date(b.created_date) - new Date(a.created_date);
  });

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-12">
      <PullToRefreshIndicator pullY={pullY} refreshing={refreshing} />
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3 border border-primary/20">
            <BarChart3 className="w-3.5 h-3.5" />
            Community Intelligence Hub
          </div>
          <h1 className="text-2xl font-heading font-bold">Scam Database</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {reports.length} verified community reports
          </p>
        </div>
        <Button onClick={() => setShowReport(!showReport)} size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Submit Report</span>
        </Button>
      </div>

      {/* Trending Now */}
      {trending.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4 text-orange-500" />
            <h2 className="text-sm font-semibold">Trending Now</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {trending.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className="text-left p-3 rounded-xl bg-orange-50 border border-orange-100 hover:bg-orange-100/60 transition-colors"
              >
                <Badge className={`text-[10px] border-0 mb-2 ${CATEGORY_COLORS[report.category] || "bg-gray-100 text-gray-700"}`}>
                  {categoryLabels[report.category] || "Other"}
                </Badge>
                <p className="text-xs font-semibold leading-snug line-clamp-2">{report.title}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <TrendingUp className="w-3 h-3 text-orange-500" />
                  <span className="text-[10px] text-orange-600">{report.view_count || 0} views</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Distribution */}
      {topCategories.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold">Most Reported This Week</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {topCategories.map(([cat, count], i) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${activeCategory === cat ? "ring-2 ring-primary ring-offset-1" : "hover:opacity-80"} ${CATEGORY_COLORS[cat] || "bg-gray-100 text-gray-700"}`}
              >
                <span className="font-bold">#{i + 1}</span>
                {categoryLabels[cat] || cat} scams
                <span className="opacity-60">({count})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Report Form */}
      <AnimatePresence>
        {showReport && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <ReportForm
              onSuccess={() => { setShowReport(false); refetch(); }}
              onCancel={() => setShowReport(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search + Filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categoryFilters.map((cat) => (
            <Button
              key={cat.value}
              variant={activeCategory === cat.value ? "default" : "outline"}
              size="sm"
              className="shrink-0 text-xs h-8"
              onClick={() => setActiveCategory(cat.value)}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={sortBy === "recent" ? "secondary" : "ghost"}
            size="sm"
            className="gap-1 text-xs h-7"
            onClick={() => setSortBy("recent")}
          >
            <Clock className="w-3 h-3" /> Recent
          </Button>
          <Button
            variant={sortBy === "trending" ? "secondary" : "ghost"}
            size="sm"
            className="gap-1 text-xs h-7"
            onClick={() => setSortBy("trending")}
          >
            <TrendingUp className="w-3 h-3" /> Most Viewed
          </Button>
          <span className="text-xs text-muted-foreground ml-auto">
            {sorted.length} report{sorted.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-sm">No reports found</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sorted.map((report) => (
            <ScamCard key={report.id} report={report} onClick={setSelectedReport} />
          ))}
        </div>
      )}

      <ScamDetailSheet
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  );
}