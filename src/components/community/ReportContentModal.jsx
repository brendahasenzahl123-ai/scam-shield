import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Flag, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { REPORT_REASONS } from "@/lib/legalContent";

/**
 * Report content modal — saves a ContentReport to the database.
 * Prevents duplicate reports from the same user on the same content.
 */
export default function ReportContentModal({ contentType, contentId, contentTitle, contentSnapshot, reportedUserId, reportedUserName, onClose }) {
  const [reason, setReason] = useState("");
  const [explanation, setExplanation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!reason) return;
    setSubmitting(true);
    setError("");
    try {
      const user = await base44.auth.me();

      const response = await base44.functions.invoke("submitContentReport", {
        contentType,
        contentId,
        contentTitle,
        contentSnapshot,
        reportedUserId,
        reportedUserName,
        reason,
        explanation: explanation.trim(),
      });
      const data = response.data || response;
      if (data?.error === "duplicate") {
        setError("You have already reported this content. Thank you for helping keep ScamShield safe.");
        return;
      }
      if (data?.error) {
        setError(data.error.includes("Authentication") ? "Please sign in to report content." : data.error);
        return;
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.message?.includes("Authentication") ? "Please sign in to report content." : (err.message || "Failed to submit report."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 pb-[calc(env(safe-area-inset-bottom)+4rem)] sm:pb-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-destructive" />
            <h2 className="font-semibold text-sm">Report Content</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-semibold text-base mb-2">Report Submitted</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Thank you for helping keep ScamShield safe. Our moderation team will review this report within 24 hours.
            </p>
            <Button onClick={onClose} className="w-full">Done</Button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Content being reported */}
            {contentTitle && (
              <div className="bg-muted/40 rounded-lg p-3 border-l-2 border-destructive/30">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Reporting</p>
                <p className="text-sm font-medium line-clamp-2">{contentTitle}</p>
                {reportedUserName && (
                  <p className="text-xs text-muted-foreground mt-1">by {reportedUserName}</p>
                )}
              </div>
            )}

            {/* Reason selection */}
            <div>
              <p className="text-xs font-semibold mb-2">Why are you reporting this?</p>
              <div className="space-y-2">
                {REPORT_REASONS.map(r => (
                  <button
                    key={r.value}
                    onClick={() => setReason(r.value)}
                    className={`w-full flex items-center gap-2.5 p-3 rounded-xl border text-left transition-colors ${
                      reason === r.value
                        ? "border-destructive bg-destructive/5"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                      reason === r.value ? "border-destructive" : "border-muted-foreground/30"
                    }`}>
                      {reason === r.value && <div className="w-2 h-2 rounded-full bg-destructive" />}
                    </div>
                    <span className="text-sm">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional explanation */}
            <div>
              <p className="text-xs font-semibold mb-1.5">Additional details <span className="text-muted-foreground font-normal">(optional)</span></p>
              <textarea
                value={explanation}
                onChange={e => setExplanation(e.target.value)}
                placeholder="Help us understand the issue..."
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none h-20"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!reason || submitting}
              className="w-full"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
              ) : (
                "Submit Report"
              )}
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}