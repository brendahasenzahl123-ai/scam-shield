import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flag, Ban, Trash2, XCircle, UserX, Clock, MessageSquare, Mail, MailWarning, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const REASON_LABELS = {
  harassment: "Harassment/Bullying",
  hate_speech: "Hate Speech",
  threats: "Threats",
  sexual: "Sexual Content",
  scam_fraud: "Scam/Fraud",
  spam: "Spam",
  misinformation: "Misinformation",
  other: "Other",
};

const CONTENT_TYPE_LABELS = {
  community_post: "Community Post",
  comment: "Comment",
  scam_report: "Scam Report",
};

export default function ContentReportCard({ report, onRemove, onDismiss, onSuspend, onBan }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge className="bg-red-100 text-red-700 text-[10px] border-0">{REASON_LABELS[report.reason] || report.reason}</Badge>
            <Badge variant="secondary" className="text-[10px]">{CONTENT_TYPE_LABELS[report.content_type] || report.content_type}</Badge>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="w-3 h-3" />
              {report.created_date ? `${formatDistanceToNow(new Date(report.created_date))} pending` : "Recently"}
            </span>
            {report.email_notification_status === "sent" && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-600" title="Moderation email sent">
                <Mail className="w-3 h-3" /> Email sent
              </span>
            )}
            {report.email_notification_status === "failed" && (
              <span className="flex items-center gap-1 text-[10px] text-amber-600" title={report.email_error || "Email failed to send"}>
                <MailWarning className="w-3 h-3" /> Email failed
              </span>
            )}
            {(!report.email_notification_status || report.email_notification_status === "pending") && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground" title="Email notification pending">
                <Loader2 className="w-3 h-3" /> Email pending
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        {report.content_title && (
          <div className="bg-muted/40 rounded-lg p-3 mb-3 border-l-2 border-destructive/30">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Reported Content</p>
            <p className="text-sm line-clamp-3">{report.content_title}</p>
          </div>
        )}

        {/* Details */}
        <div className="space-y-1 text-xs mb-3">
          <p><span className="text-muted-foreground">Reported user:</span> <span className="font-medium">{report.reported_user_name || "Unknown"}</span></p>
          <p><span className="text-muted-foreground">Reported by:</span> <span className="font-medium">{report.reporting_user_name || "Unknown"}</span></p>
          {report.explanation && (
            <p className="mt-1"><span className="text-muted-foreground">Explanation:</span> {report.explanation}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/50">
          <Button size="sm" variant="outline" className="gap-1 text-xs h-8 text-destructive border-destructive/30 hover:bg-destructive/5" onClick={() => onRemove(report)}>
            <Trash2 className="w-3 h-3" /> Remove Content
          </Button>
          <Button size="sm" variant="outline" className="gap-1 text-xs h-8" onClick={() => onDismiss(report)}>
            <XCircle className="w-3 h-3" /> Dismiss
          </Button>
          {report.reported_user_id && (
            <>
              <Button size="sm" variant="outline" className="gap-1 text-xs h-8 text-amber-600 border-amber-300 hover:bg-amber-50" onClick={() => onSuspend(report)}>
                <UserX className="w-3 h-3" /> Suspend User
              </Button>
              <Button size="sm" variant="outline" className="gap-1 text-xs h-8 text-destructive border-destructive/30 hover:bg-destructive/5" onClick={() => onBan(report)}>
                <Ban className="w-3 h-3" /> Ban User
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}