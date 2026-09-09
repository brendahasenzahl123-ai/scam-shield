import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import usePullToRefresh from "@/hooks/usePullToRefresh";
import PullToRefreshIndicator from "@/components/ui/PullToRefreshIndicator";
import MobileSelect from "@/components/ui/MobileSelect";
import { Heart, ThumbsUp, MessageSquare, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import PostDetailModal from "@/components/community/PostDetailModal";
import PostMenu from "@/components/community/PostMenu";
import ShareScamModal from "@/components/community/ShareScamModal";

const CATEGORY_LABELS = {
  education: "Education", employment: "Employment", social_media: "Social Media",
  marketplace: "Marketplace", financial: "Financial", phishing: "Phishing",
  relationship: "Relationship", package_delivery: "Package & Delivery", other: "Other",
};

const RISK_LABELS = { low: "Low risk", moderate: "Moderate risk", high: "High risk", extreme: "Extreme risk" };

function PostCard({ post, onSelect, onReaction, onDeleted }) {
  const [reacted, setReacted] = useState({});

  const handleReact = async (type, field) => {
    if (reacted[type]) return;
    setReacted(r => ({ ...r, [type]: true }));
    await base44.entities.CommunityPost.update(post.id, { [field]: (post[field] || 0) + 1 });
    onReaction?.(post.id, field);
  };

  return (
    <div className="border rounded-md p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-1 text-xs text-muted-foreground">
            <span>{CATEGORY_LABELS[post.category] || post.category}</span>
            {post.risk_level && (
              <>
                <span>·</span>
                <span>{RISK_LABELS[post.risk_level] || post.risk_level}</span>
              </>
            )}
          </div>
          <h3
            className="font-semibold text-sm leading-snug cursor-pointer hover:text-primary transition-colors"
            onClick={() => onSelect(post)}
          >
            {post.title}
          </h3>
        </div>
        <PostMenu post={post} onDeleted={onDeleted} />
      </div>

      {post.ai_summary && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">{post.ai_summary}</p>
      )}

      {post.personal_story && (
        <p className="text-sm text-foreground leading-relaxed mb-3 line-clamp-2 italic border-l-2 border-border pl-3">"{post.personal_story}"</p>
      )}

      {post.screenshot_url && (
        <div className="rounded-md overflow-hidden mb-3 bg-muted max-h-40">
          <img src={post.screenshot_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {post.red_flags?.length > 0 && (
        <ul className="space-y-1 mb-3">
          {post.red_flags.slice(0, 3).map((f, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <span className="shrink-0">•</span><span>{f}</span>
            </li>
          ))}
          {post.red_flags.length > 3 && (
            <li className="text-xs text-muted-foreground">+{post.red_flags.length - 3} more</li>
          )}
        </ul>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleReact("helpful", "helpful_votes")}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors ${reacted.helpful ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"}`}
          >
            <Heart className="w-3.5 h-3.5" /> {post.helpful_votes || 0}
          </button>
          <button
            onClick={() => handleReact("received", "received_too_count")}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors ${reacted.received ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"}`}
          >
            <ThumbsUp className="w-3.5 h-3.5" /> {post.received_too_count || 0}
          </button>
          <button
            onClick={() => onSelect(post)}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-muted-foreground hover:bg-muted transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" /> {post.comment_count || 0}
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{post.is_anonymous ? "Anonymous" : (post.author_name || "Community Member")}</span>
          <span>·</span>
          <span>{post.created_date ? formatDistanceToNow(new Date(post.created_date), { addSuffix: true }) : "Recently"}</span>
        </div>
      </div>
    </div>
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

  const blockedIds = new Set(blocks.map(b => b.blocked_id));
  const posts = dbPosts.filter(p => !p.created_by_id || !blockedIds.has(p.created_by_id));

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
      <div className="mb-5">
        <h1 className="text-2xl font-bold mb-1">Community Reports</h1>
        <p className="text-sm text-muted-foreground mb-3">Scam reports shared by the community to help others stay safe</p>
        <Button size="sm" className="gap-1.5" onClick={() => setShowShare(true)}>
          <Plus className="w-4 h-4" /> Share a Scam
        </Button>
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
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-40 bg-muted/40 rounded-md animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-semibold mb-1">No reports yet</p>
          <p className="text-sm text-muted-foreground mb-4">Be the first to share a scam with the community</p>
          <Button size="sm" onClick={() => setShowShare(true)} className="gap-1.5">
            <Plus className="w-4 h-4" /> Share a Scam Report
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
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