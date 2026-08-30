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
 * Three-dot menu for comments.
 * Own comment → Delete
 * Others' comment → Report Comment, Block User
 */
export default function CommentMenu({ comment, onDeleted }) {
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

  const isOwnComment = currentUserId && comment.created_by_id === currentUserId;

  const handleBlock = async () => {
    try {
      await base44.entities.UserBlock.create({
        blocker_id: currentUserId,
        blocked_id: comment.created_by_id,
        blocked_name: comment.author_name || "Community Member",
      });
      toast({ title: "User blocked", description: "This user's content will no longer appear in your feed." });
    } catch (err) {
      toast({ title: "Failed to block user", variant: "destructive" });
    }
    setShowBlock(false);
  };

  const handleDelete = async () => {
    try {
      await base44.entities.PostComment.delete(comment.id);
      toast({ title: "Comment deleted" });
      onDeleted?.();
    } catch (err) {
      toast({ title: "Failed to delete comment", variant: "destructive" });
    }
    setShowDelete(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground shrink-0"
        aria-label="Comment options"
      >
        <MoreVertical className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-border rounded-xl shadow-lg z-20 overflow-hidden">
          {isOwnComment ? (
            <button
              onClick={() => { setOpen(false); setShowDelete(true); }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-destructive hover:bg-destructive/5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          ) : (
            <>
              <button
                onClick={() => { setOpen(false); setShowReport(true); }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-muted transition-colors"
              >
                <Flag className="w-3.5 h-3.5 text-destructive" /> Report Comment
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

      <AlertDialog open={showBlock} onOpenChange={setShowBlock}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Block this user?</AlertDialogTitle>
            <AlertDialogDescription>
              {comment.author_name || "This user"}'s posts and comments will no longer appear in your feed. You can unblock them later from your Profile settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBlock}>Block</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this comment?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
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
          contentType="comment"
          contentId={comment.id}
          contentTitle={comment.content}
          contentSnapshot={comment.content}
          reportedUserId={comment.created_by_id || ""}
          reportedUserName={comment.author_name || ""}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}