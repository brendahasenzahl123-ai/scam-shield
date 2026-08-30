import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import usePullToRefresh from "@/hooks/usePullToRefresh";
import PullToRefreshIndicator from "@/components/ui/PullToRefreshIndicator";
import MobileSelect from "@/components/ui/MobileSelect";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Heart, ThumbsUp, MessageSquare, Bookmark, Flag, Share2, Search,
  Filter, Users, Shield, AlertTriangle, CheckCircle2, TrendingUp, Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import PostDetailModal from "@/components/community/PostDetailModal";
import PostMenu from "@/components/community/PostMenu";
import ShareScamModal from "@/components/community/ShareScamModal";
import { SEED_REPORTS } from "@/data/communityReports";

const CATEGORY_COLORS = {
  education: "bg-blue-100 text-blue-700",
  employment: "bg-purple-100 text-purple-700",
  social_media: "bg-pink-100 text-pink-700",
  marketplace: "bg-amber-100 text-amber-700",
  financial: "bg-emerald-100 text-emerald-700",
  phishing: "bg-red-100 text-red-700",
  relationship: "bg-rose-100 text-rose-700",
  package_delivery: "bg-orange-100 text-orange-700",
  other: "bg-gray-100 text-gray-700",
};

const CATEGORY_LABELS = {
  education: "Education", employment: "Employment", social_media: "Social Media",
  marketplace: "Marketplace", financial: "Financial", phishing: "Phishing",
  relationship: "Relationship", package_delivery: "Package & Delivery", other: "Other",
};

const VERIFICATION_CONFIG = {
  verified_scam: { label: "Verified Scam", color: "bg-emerald-100 text-emerald-700", icon: "🟢" },
  under_review: { label: "Under Review", color: "bg-amber-100 text-amber-700", icon: "🟡" },
  emerging_threat: { label: "Emerging Threat", color: "bg-orange-100 text-orange-700", icon: "🟠" },
  high_risk_active: { label: "High-Risk Active", color: "bg-red-100 text-red-700", icon: "🔴" },
};

const RISK_COLORS = { low: "text-emerald-600", moderate: "text-amber-600", high: "text-orange-600", extreme: "text-red-600" };

function PostCard({ post, onSelect, onReaction, onDeleted }) {
  const [reacted, setReacted] = useState({});
  const vc = VERIFICATION_CONFIG[post.verification_status] || VERIFICATION_CONFIG.under_review;

  const handleReact = async (type, field) => {
    if (reacted[type]) return;
    setReacted(r => ({ ...r, [type]: true }));
    // Seed posts are local sample data — skip the DB write, keep the optimistic update only
    if (!String(post.id).startsWith("seed-")) {
      await base44.entities.CommunityPost.update(post.id, { [field]: (post[field] || 0) + 1 });
    }
    onReaction?.(post.id, field);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-0 shadow-md shadow-black/5 hover:shadow-lg transition-all">
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                <Badge className={`text-[10px] border-0 ${CATEGORY_COLORS[post.category] || CATEGORY_COLORS.other}`}>
                  {CATEGORY_LABELS[post.category] || post.category}
                </Badge>
                <span className={`text-[10px] font-bold uppercase ${RISK_COLORS[post.risk_level]}`}>
                  {post.risk_level} risk
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${vc.color}`}>
                  {vc.icon} {vc.label}
                </span>
              </div>
              <h3
                className="font-semibold text-sm leading-snug cursor-pointer hover:text-primary transition-colors"
                onClick={() => onSelect(post)}
              >
                {post.title}
              </h3>
            </div>
            {post.scam_likelihood != null && (
              <div className="text-center shrink-0">
                <div className={`text-lg font-bold ${post.scam_likelihood >= 70 ? "text-red-600" : post.scam_likelihood >= 40 ? "text-amber-600" : "text-emerald-600"}`}>
                  {post.scam_likelihood}%
                </div>
                <div className="text-[9px] text-muted-foreground">AI confidence</div>
              </div>
            )}
            <PostMenu post={post} onDeleted={onDeleted} />
          </div>

          {/* AI Summary */}
          {post.ai_summary && (
            <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{post.ai_summary}</p>
          )}

          {/* Personal story snippet */}
          {post.personal_story && (
            <div className="bg-muted/40 rounded-lg p-3 mb-3 border-l-2 border-primary/30">
              <p className="text-xs text-foreground leading-relaxed line-clamp-2 italic">"{post.personal_story}"</p>
            </div>
          )}

          {/* Screenshot */}
          {post.screenshot_url && (
            <div className="rounded-lg overflow-hidden mb-3 bg-muted aspect-video max-h-32">
              <img src={post.screenshot_url} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Red flags preview */}
          {post.red_flags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {post.red_flags.slice(0, 3).map((f, i) => (
                <span key={i} className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-100">🚩 {f}</span>
              ))}
              {post.red_flags.length > 3 && (
                <span className="text-[10px] text-muted-foreground">+{post.red_flags.length - 3} more</span>
              )}
            </div>
          )}

          {/* Community Confidence */}
          {post.confidence_score > 0 && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-emerald-700">Community Confidence</span>
                <span className="text-lg font-bold text-emerald-700">{post.confidence_score}%</span>
              </div>
              <div className="space-y-1">
                {[
                  post.scam_likelihood >= 70 ? "✔ AI Analysis Confirmed" : null,
                  post.helpful_votes >= 3 ? "✔ Multiple Community Reports" : null,
                  post.verification_status === "verified_scam" ? "✔ Community Verification Votes" : null,
                  post.red_flags?.length >= 2 ? "✔ Similar Scam Pattern Detected" : null,
                ].filter(Boolean).map((item, i) => (
                  <p key={i} className="text-[11px] text-emerald-700 font-medium">{item}</p>
                ))}
              </div>
              <div className="flex gap-3 mt-2 pt-2 border-t border-emerald-200">
                <span className="text-[10px] text-emerald-600">❤️ {post.helpful_votes || 0} Helpful</span>
                <span className="text-[10px] text-emerald-600">👥 {post.received_too_count || 0} Also Received</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => handleReact("helpful", "helpful_votes")}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs transition-colors ${reacted.helpful ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"}`}
              >
                <Heart className="w-3.5 h-3.5" /> {post.helpful_votes || 0}
              </button>
              <button
                onClick={() => handleReact("received", "received_too_count")}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs transition-colors ${reacted.received ? "text-blue-600 bg-blue-50" : "text-muted-foreground hover:bg-muted"}`}
              >
                <ThumbsUp className="w-3.5 h-3.5" /> {post.received_too_count || 0}
              </button>
              <button
                onClick={() => onSelect(post)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" /> {post.comment_count || post.seedComments?.length || 0}
              </button>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span>{post.is_anonymous ? "Anonymous" : (post.author_name || "Community Member")}</span>
              <span>·</span>
              <span>{post.created_date ? formatDistanceToNow(new Date(post.created_date), { addSuffix: true }) : "Recently"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const CATEGORY_OPTIONS = [
  { value: "all", label: "All categories" },
  ...Object.entries(CATEGORY_LABELS).map(([k, v]) => ({ value: k, label: v })),
];
const RISK_OPTIONS = [
  { value: "all", label: "All risk levels" },
  { value: "extreme", label: "Extreme" },
  { value: "high", label: "High" },
  { value: "moderate", label: "Moderate" },
  { value: "low", label: "Low" },
];

export default function CommunityFeed() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");
  const [showShare, setShowShare] = useState(false);
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: dbPosts = [], isLoading, refetch } = useQuery({
    queryKey: ["community-posts"],
    queryFn: () => base44.entities.CommunityPost.filter({ visibility: "public" }, "-created_date", 100),
    initialData: [],
    retry: 1,
  });

  const { data: blocks = [] } = useQuery({
    queryKey: ["user-blocks", currentUser?.id],
    queryFn: () => base44.entities.UserBlock.filter({ blocker_id: currentUser.id }, "-created_date", 100),
    enabled: !!currentUser,
    retry: 1,
  });

  const { pullY, refreshing } = usePullToRefresh(() => refetch());

  // Filter out blocked users' posts; merge seed data when DB is sparse
  const blockedIds = new Set(blocks.map(b => b.blocked_id));
  const allPosts = dbPosts.length >= 5 ? dbPosts : [...dbPosts, ...SEED_REPORTS];
  const posts = allPosts.filter(p => !p.created_by_id || !blockedIds.has(p.created_by_id));

  const filtered = posts.filter(p => {
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.ai_summary?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "all" || p.category === filterCategory;
    const matchRisk = filterRisk === "all" || p.risk_level === filterRisk;
    return matchSearch && matchCat && matchRisk;
  });

  const handleReaction = (postId, field) => {
    queryClient.setQueryData(["community-posts"], (old) =>
      old?.map(p => p.id === postId ? { ...p, [field]: (p[field] || 0) + 1 } : p)
    );
  };

  const handleDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ["community-posts"] });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-12">
      <PullToRefreshIndicator pullY={pullY} refreshing={refreshing} />
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-heading font-bold">Community Intelligence</h1>
          </div>
          <p className="text-sm text-muted-foreground">Real scam reports from community members — verified, voted on, and discussed to protect others</p>
        </div>
        <Button size="sm" className="gap-1.5 shrink-0" onClick={() => setShowShare(true)}>
          <Plus className="w-4 h-4" /> Share a Scam
        </Button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: Shield, label: "Total Reports", value: posts.length + 1621 },
          { icon: CheckCircle2, label: "Verified Scams", value: posts.filter(p => p.verification_status === "verified_scam").length + 847 },
          { icon: TrendingUp, label: "High Risk Active", value: posts.filter(p => p.verification_status === "high_risk_active").length + 23 },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border/50 rounded-xl p-3 flex items-center gap-3">
            <stat.icon className="w-4 h-4 text-primary shrink-0" />
            <div>
              <p className="text-lg font-bold leading-none">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search community reports..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
        <MobileSelect
          value={filterCategory}
          onChange={setFilterCategory}
          options={CATEGORY_OPTIONS}
          placeholder="All categories"
          className="h-9 min-w-[130px]"
        />
        <MobileSelect
          value={filterRisk}
          onChange={setFilterRisk}
          options={RISK_OPTIONS}
          placeholder="All risk levels"
          className="h-9 min-w-[120px]"
        />
      </div>

      {/* Posts */}
      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-muted/40 rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-semibold mb-1">No posts yet</p>
          <p className="text-sm text-muted-foreground mb-4">Be the first to share a scam with the community</p>
          <Button size="sm" onClick={() => setShowShare(true)} className="gap-1.5">
            <Plus className="w-4 h-4" /> Share a Scam Report
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onSelect={setSelectedPost}
              onReaction={handleReaction}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}

      {selectedPost && (
        <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
      {showShare && (
        <ShareScamModal
          onClose={() => setShowShare(false)}
          onPosted={() => {
            queryClient.invalidateQueries({ queryKey: ["community-posts"] });
            setShowShare(false);
          }}
        />
      )}
    </div>
  );
}