import React from "react";
import { RefreshCw } from "lucide-react";

export default function PullToRefreshIndicator({ pullY, refreshing, threshold = 70 }) {
  const progress = Math.min(pullY / threshold, 1);
  const ready = pullY >= threshold;

  if (pullY < 4 && !refreshing) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 flex items-center justify-center z-40 pointer-events-none"
      style={{ height: `${Math.max(pullY, refreshing ? 52 : 0)}px`, transition: refreshing ? "height 0.2s" : "none" }}
    >
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md text-xs font-semibold transition-all ${ready || refreshing ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}>
        <RefreshCw
          className="w-4 h-4"
          style={{
            transform: `rotate(${refreshing ? 0 : progress * 360}deg)`,
            animation: refreshing ? "spin 0.7s linear infinite" : "none",
          }}
        />
        {refreshing ? "Refreshing..." : ready ? "Release to refresh" : "Pull to refresh"}
      </div>
    </div>
  );
}