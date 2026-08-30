import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Flag, Ban, Trash2 } from "lucide-react";
import ReportContentModal from "./ReportContentModal";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { base44 } from "@/api/base44Client";
import { toast } from "@/components/ui/use-toast";

/**
 * Three-dot menu for community posts.
 * Own post → Delete
 * Others' post → Report Post, Block User
 */
export default function PostMenu({ post, onDeleted }) {
  const [open, setOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    base44.auth.me().then(u => setCurrentUserId(u.id)).catch(() => {});
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const isOwnPost = currentUserId && post.created_by_id === currentUserId;

  const handleBlock = async () => {
    try {
      await base44.entities.UserBlock.create({
        blocker_id: currentUserId,
        blocked_id: post.created_by_id,
        blocked_name: post.author_name || "Community Member",
      });
      toast({ title: "User blocked", description: "This user's content will no longer appear in your feed." });
    } catch (err) {
      toast({ title: "Failed to block user", variant: "destructive" });
    }
    setShowBlock(false);
  };

  const handleDelete = async () => {
    try {
      await base44.entities.CommunityPost.delete(post.id);
      toast({ title: "Post deleted" });
      onDeleted?.();
    } catch (err) {
      toast({ title: "Failed to delete post", variant: "destructive" });
    }
    setShowDelete(false);
  };

  // Don't show menu for seed posts (no created_by_id) unless it's a real user's
  if (!post.created_by_id && !isOwnPost) {
    // Seed posts: only show report (no block since no real user)
    return (
      <>
        <button
          onClick={() => setShowReport(true)}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          aria-label="More options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
        {showReport && (
          <ReportContentModal
            contentType="community_post"
            contentId={post.id}
            contentTitle={post.title}
            contentSnapshot={post.ai_summary || post.personal_story || ""}
            reportedUserId={post.created_by_id || ""}
            reportedUserName={post.author_name || ""}
            onClose={() => setShowReport(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
        aria-label="More options"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-border rounded-xl shadow-lg z-20 overflow-hidden">
          {isOwnPost ? (
            <button
              onClick={() => { setOpen(false); setShowDelete(true); }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-destructive hover:bg-destructive/5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Post
            </button>
          ) : (
            <>
              <button
                onClick={() => { setOpen(false); setShowReport(true); }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-muted transition-colors"
              >
                <Flag className="w-3.5 h-3.5 text-destructive" /> Report Post
              </button>
              <button
                onClick={() => { setOpen(false); setShowBlock(true); }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-muted transition-colors border-t border-border/50"
              >
                <Ban className="w-3.5 h-3.5" /> Block User
              </button>
            </>
          )}
        </div>
      )}

      {/* Block confirmation */}
      <AlertDialog open={showBlock} onOpenChange={setShowBlock}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Block this user?</AlertDialogTitle>
            <AlertDialogDescription>
              {post.author_name || "This user"}'s posts and comments will no longer appear in your feed. They will not be notified. You can unblock them later from your Profile settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBlock}>Block</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete confirmation */}
      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove your post from the community. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showReport && (
        <ReportContentModal
          contentType="community_post"
          contentId={post.id}
          contentTitle={post.title}
          contentSnapshot={post.ai_summary || post.personal_story || ""}
          reportedUserId={post.created_by_id || ""}
          reportedUserName={post.author_name || ""}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}