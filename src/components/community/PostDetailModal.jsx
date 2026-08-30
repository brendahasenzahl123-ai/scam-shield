import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  X, Heart, ThumbsUp, MessageSquare, Flag, Send, Shield,
  AlertTriangle, CheckCircle2, UserX, Clock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import RiskBadge from "@/components/scan/RiskBadge";
import PostMenu from "@/components/community/PostMenu";
import CommentMenu from "@/components/community/CommentMenu";
import { moderateContent } from "@/lib/contentModeration";

const VERIFICATION_CONFIG = {
  verified_scam: { label: "Verified Scam", color: "bg-emerald-100 text-emerald-700", icon: "🟢" },
  under_review: { label: "Under Review", color: "bg-amber-100 text-amber-700", icon: "🟡" },
  emerging_threat: { label: "Emerging Threat", color: "bg-orange-100 text-orange-700", icon: "🟠" },
  high_risk_active: { label: "High-Risk Active", color: "bg-red-100 text-red-700", icon: "🔴" },
};

export default function PostDetailModal({ post, onClose }) {
  const [commentText, setCommentText] = useState("");
  const [isAnon, setIsAnon] = useState(false);
  const [posting, setPosting] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [localPost, setLocalPost] = useState(post);
  const [reacted, setReacted] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const queryClient = useQueryClient();

  const { data: comments = [], refetch } = useQuery({
    queryKey: ["post-comments", post.id],
    queryFn: () => base44.entities.PostComment.filter({ post_id: post.id }, "-created_date", 50),
  });

  const { data: blocks = [] } = useQuery({
    queryKey: ["user-blocks", currentUser?.id],
    queryFn: () => base44.entities.UserBlock.filter({ blocker_id: currentUser.id }, "-created_date", 100),
    enabled: !!currentUser,
  });

  useEffect(() => {
    base44.auth.me().then(setCurrentUser).catch(() => {});
  }, []);

  const blockedIds = new Set(blocks.map(b => b.blocked_id));
  const visibleComments = comments.filter(c => !c.created_by_id || !blockedIds.has(c.created_by_id));

  const handleReact = async (type, field) => {
    if (reacted[type]) return;
    setReacted(r => ({ ...r, [type]: true }));
    const updated = { [field]: (localPost[field] || 0) + 1 };
    setLocalPost(p => ({ ...p, ...updated }));
    if (!String(post.id).startsWith("seed-")) {
      await base44.entities.CommunityPost.update(post.id, updated);
    }
  };

  const submitComment = async () => {
    if (!commentText.trim()) return;
    const moderation = moderateContent(commentText);
    if (moderation.isViolating) {
      setCommentError(moderation.message);
      return;
    }
    setPosting(true);
    setCommentError("");
    try {
      const user = await base44.auth.me();
      if (user.suspended) {
        setCommentError("Your account has been suspended. You cannot post comments.");
        return;
      }
      await base44.entities.PostComment.create({
        post_id: post.id,
        content: commentText.trim(),
        is_anonymous: isAnon,
        author_name: isAnon ? "Anonymous" : (user.full_name || "Community Member"),
      });
      if (!String(post.id).startsWith("seed-")) {
        await base44.entities.CommunityPost.update(post.id, {
          comment_count: (localPost.comment_count || 0) + 1
        });
      }
      setCommentText("");
      refetch();
    } catch (err) {
      setCommentError("Please sign in to comment.");
    } finally {
      setPosting(false);
    }
  };

  const vc = VERIFICATION_CONFIG[localPost.verification_status] || VERIFICATION_CONFIG.under_review;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-4 pb-[calc(env(safe-area-inset-bottom)+4rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-sm">Community Report</h2>
          </div>
          <div className="flex items-center gap-1">
            <PostMenu post={localPost} onDeleted={onClose} />
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Status badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${vc.color}`}>
              {vc.icon} {vc.label}
            </span>
            {localPost.risk_level && <RiskBadge level={localPost.risk_level} />}
            {localPost.confidence_score != null && (
              <span className="text-xs text-muted-foreground">AI confidence: <strong>{localPost.confidence_score}%</strong></span>
            )}
          </div>

          <h3 className="text-lg font-bold">{localPost.title}</h3>

          {/* Author + date */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Reported by {localPost.is_anonymous ? "Anonymous" : (localPost.author_name || "Community Member")}</span>
            <span>·</span>
            <span>{localPost.created_date ? formatDistanceToNow(new Date(localPost.created_date), { addSuffix: true }) : "Recently"}</span>
          </div>

          {/* AI Summary */}
          {localPost.ai_summary && (
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
              <p className="text-xs font-semibold text-primary mb-1 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> AI Analysis Summary
              </p>
              <p className="text-sm leading-relaxed">{localPost.ai_summary}</p>
            </div>
          )}

          {/* Red Flags */}
          {localPost.red_flags?.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> Red Flags Detected
              </p>
              <div className="space-y-1.5">
                {localPost.red_flags.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs bg-red-50 text-red-700 rounded-lg px-3 py-2">
                    <span className="shrink-0">🚩</span> {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personal story */}
          {localPost.personal_story && (
            <div className="bg-muted/40 rounded-xl p-4 border-l-2 border-primary/40">
              <p className="text-xs font-semibold mb-1">Personal Experience</p>
              <p className="text-sm leading-relaxed italic">"{localPost.personal_story}"</p>
            </div>
          )}

          {/* Advice */}
          {localPost.advice && (
            <div className="bg-emerald-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-emerald-700 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Community Advice
              </p>
              <p className="text-sm leading-relaxed text-emerald-900">{localPost.advice}</p>
            </div>
          )}

          {/* Screenshot */}
          {localPost.screenshot_url && (
            <div className="rounded-xl overflow-hidden border border-border">
              <img src={localPost.screenshot_url} alt="Scam screenshot" className="w-full" />
            </div>
          )}

          {/* Reaction bar */}
          <div className="flex items-center gap-2 py-3 border-y border-border/50">
            <button
              onClick={() => handleReact("helpful", "helpful_votes")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${reacted.helpful ? "bg-rose-100 text-rose-700" : "bg-muted hover:bg-rose-50 hover:text-rose-600"}`}
            >
              <Heart className="w-4 h-4" /> {localPost.helpful_votes || 0} Helpful
            </button>
            <button
              onClick={() => handleReact("received", "received_too_count")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${reacted.received ? "bg-blue-100 text-blue-700" : "bg-muted hover:bg-blue-50 hover:text-blue-600"}`}
            >
              <ThumbsUp className="w-4 h-4" /> {localPost.received_too_count || 0} Got This Too
            </button>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground ml-auto">
              <MessageSquare className="w-4 h-4" /> {visibleComments.length} comments
            </span>
          </div>

          {/* Comments */}
          <div>
            <p className="text-sm font-semibold mb-3">Discussion</p>
            {visibleComments.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No comments yet. Be the first to respond.</p>
            ) : (
              <div className="space-y-3 mb-4">
                {visibleComments.map(c => (
                  <div key={c.id} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {c.is_anonymous ? "?" : (c.author_name?.charAt(0) || "U")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold">{c.is_anonymous ? "Anonymous" : (c.author_name || "Member")}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {c.created_date ? formatDistanceToNow(new Date(c.created_date), { addSuffix: true }) : "Recently"}
                        </span>
                        <div className="ml-auto">
                          <CommentMenu comment={c} onDeleted={refetch} />
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add comment */}
            <div className="flex gap-2 mt-3">
              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 rounded-xl border border-input bg-background text-sm"
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && submitComment()}
              />
              <button
                onClick={() => setIsAnon(!isAnon)}
                className={`p-2 rounded-xl border transition-colors ${isAnon ? "bg-primary/10 text-primary border-primary/20" : "border-input hover:bg-muted text-muted-foreground"}`}
                title="Post anonymously"
              >
                <UserX className="w-4 h-4" />
              </button>
              <Button size="sm" onClick={submitComment} disabled={!commentText.trim() || posting} className="px-3">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {isAnon && <p className="text-[10px] text-muted-foreground mt-1">Posting anonymously</p>}
            {commentError && <p className="text-[10px] text-destructive mt-1">{commentError}</p>}
          </div>
        </div>
      </motion.div>
    </div>
  );
}