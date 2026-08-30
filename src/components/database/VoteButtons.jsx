import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { ThumbsUp, AlertTriangle, HelpCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const voteOptions = [
  { key: "votes_confirmed", label: "Confirmed Scam", icon: "🟢", field: "votes_confirmed" },
  { key: "votes_likely", label: "Likely Scam", icon: "🟡", field: "votes_likely" },
  { key: "votes_suspicious", label: "Suspicious", icon: "🟠", field: "votes_suspicious" },
  { key: "votes_needs_evidence", label: "Needs Evidence", icon: "🔵", field: "votes_needs_evidence" },
];

function getConfidenceScore(report) {
  const total = (report.votes_confirmed || 0) + (report.votes_likely || 0) + (report.votes_suspicious || 0) + (report.votes_needs_evidence || 0);
  if (total === 0) return null;
  const weighted = ((report.votes_confirmed || 0) * 1 + (report.votes_likely || 0) * 0.7 + (report.votes_suspicious || 0) * 0.4 + (report.votes_needs_evidence || 0) * 0.1) / total;
  return Math.round(weighted * 100);
}

function getVerificationLabel(report) {
  const score = getConfidenceScore(report);
  if (report.verification_status === "high_risk_active") return { label: "🔴 High-Risk Active Threat", color: "text-red-600 bg-red-50" };
  if (score === null || score === undefined) return null;
  if (score >= 80) return { label: "🟢 Verified Scam", color: "text-emerald-700 bg-emerald-50" };
  if (score >= 50) return { label: "🟡 Under Review", color: "text-amber-700 bg-amber-50" };
  return { label: "🔵 Needs More Evidence", color: "text-blue-700 bg-blue-50" };
}

export default function VoteButtons({ report, onVote }) {
  const [voted, setVoted] = useState(null);
  const [loading, setLoading] = useState(false);

  const total = (report.votes_confirmed || 0) + (report.votes_likely || 0) + (report.votes_suspicious || 0) + (report.votes_needs_evidence || 0);
  const confidence = getConfidenceScore(report);
  const verLabel = getVerificationLabel(report);

  const handleVote = async (field) => {
    if (voted || loading) return;
    setLoading(true);
    try {
      const update = { [field]: (report[field] || 0) + 1 };
      // Recalculate confidence score after vote
      const newReport = { ...report, ...update };
      const newScore = getConfidenceScore(newReport);
      update.confidence_score = newScore;
      await base44.entities.ScamReport.update(report.id, update);
      setVoted(field);
      onVote?.({ ...newReport });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-border/50">
      {verLabel && (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold mb-2 ${verLabel.color}`}>
          {verLabel.label}
          {confidence !== null && <span className="opacity-70">· {confidence}% confidence</span>}
        </div>
      )}
      <p className="text-[10px] text-muted-foreground mb-2">Community verification ({total} vote{total !== 1 ? "s" : ""}):</p>
      <div className="grid grid-cols-2 gap-1">
        {voteOptions.map(opt => (
          <button
            key={opt.key}
            disabled={!!voted || loading}
            onClick={() => handleVote(opt.field)}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-medium border transition-all ${
              voted === opt.field
                ? "bg-primary/10 border-primary text-primary"
                : voted
                ? "opacity-40 cursor-not-allowed bg-muted border-transparent"
                : "bg-muted/40 border-border hover:bg-muted hover:border-muted-foreground/30 cursor-pointer"
            }`}
          >
            <span>{opt.icon}</span>
            <span>{opt.label}</span>
            <span className="ml-auto text-muted-foreground">{report[opt.field] || 0}</span>
          </button>
        ))}
      </div>
      {voted && <p className="text-[10px] text-primary mt-1.5 font-medium">✓ Thanks for your vote!</p>}
    </div>
  );
}