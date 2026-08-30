import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Ban, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export default function BlockedUsersList({ userId }) {
  const queryClient = useQueryClient();
  const [unblocking, setUnblocking] = useState(null);

  const { data: blocks = [], isLoading } = useQuery({
    queryKey: ["user-blocks", userId],
    queryFn: () => base44.entities.UserBlock.filter({ blocker_id: userId }, "-created_date", 100),
    enabled: !!userId,
  });

  const handleUnblock = async (block) => {
    setUnblocking(block.id);
    try {
      await base44.entities.UserBlock.delete(block.id);
      queryClient.invalidateQueries({ queryKey: ["user-blocks", userId] });
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      toast({ title: "User unblocked", description: `${block.blocked_name || "User"} can now appear in your feed again.` });
    } catch (err) {
      toast({ title: "Failed to unblock user", variant: "destructive" });
    } finally {
      setUnblocking(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (blocks.length === 0) {
    return (
      <div className="text-center py-6">
        <Ban className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">You haven't blocked anyone.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {blocks.map(block => (
        <div key={block.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
              <Ban className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{block.blocked_name || "Blocked user"}</p>
              <p className="text-xs text-muted-foreground">Blocked {block.created_date ? new Date(block.created_date).toLocaleDateString() : ""}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUnblock(block)}
            disabled={unblocking === block.id}
            className="gap-1.5 shrink-0"
          >
            {unblocking === block.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
            Unblock
          </Button>
        </div>
      ))}
    </div>
  );
}