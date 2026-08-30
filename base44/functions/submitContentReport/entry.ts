import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { waitUntil } from 'base44:runtime';

const SUPPORT_EMAIL = "scamshieldsafety@gmail.com";

const REASON_LABELS = {
  harassment: "Harassment or bullying",
  hate_speech: "Hate speech",
  threats: "Threatening or dangerous content",
  sexual: "Sexual or inappropriate content",
  scam_fraud: "Scam or fraud",
  spam: "Spam",
  misinformation: "False or misleading information",
  other: "Other",
};

const CONTENT_TYPE_LABELS = {
  community_post: "Community Post",
  comment: "Comment",
  scam_report: "Scam Report",
};

function buildEmailBody(report, user) {
  const submittedAt = new Date(report.created_date || Date.now()).toLocaleString("en-US", {
    timeZone: "UTC", dateStyle: "full", timeStyle: "long",
  });
  const reasonLabel = REASON_LABELS[report.reason] || report.reason;
  const contentTypeLabel = CONTENT_TYPE_LABELS[report.content_type] || report.content_type;
  const lines = [
    "A new content report has been submitted on ScamShield and requires moderation review.",
    "",
    "========================================",
    "REPORT DETAILS",
    "========================================",
    `Date/Time Submitted: ${submittedAt} (UTC)`,
    `Report Reason: ${reasonLabel}`,
    `Content Type: ${contentTypeLabel}`,
    `Report ID: ${report.id}`,
    `Content ID: ${report.content_id}`,
    "",
    "----------------------------------------",
    "REPORTING USER (submitter)",
    "----------------------------------------",
    `Name: ${report.reporting_user_name || "Unknown"}`,
    `User ID: ${report.reporting_user_id || user.id || "Unknown"}`,
    "",
    "----------------------------------------",
    "REPORTED USER (content author)",
    "----------------------------------------",
    `Name: ${report.reported_user_name || "Unknown"}`,
    `User ID: ${report.reported_user_id || "Unknown"}`,
    "",
    "----------------------------------------",
    "REPORTER'S EXPLANATION",
    "----------------------------------------",
    report.explanation ? report.explanation : "(No additional explanation provided)",
    "",
    "----------------------------------------",
    "REPORTED CONTENT SNAPSHOT",
    "----------------------------------------",
    report.content_snapshot || report.content_title || "(No content snapshot available)",
    "",
    "========================================",
    "ACTION REQUIRED",
    "========================================",
    "This report should be reviewed promptly, ideally within 24 hours.",
    "Review it in the ScamShield Admin dashboard under Reports.",
    "",
    `Reply to this email or contact ${SUPPORT_EMAIL} for questions about this report.`,
    "",
    "— ScamShield Moderation System",
  ];
  return lines.join("\n");
}

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      contentType, contentId, contentTitle, contentSnapshot,
      reportedUserId, reportedUserName, reason, explanation,
    } = body || {};

    if (!contentType || !contentId || !reason) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Duplicate check — same user reporting the same content
    const existing = await base44.entities.ContentReport.filter({
      content_id: contentId,
      reporting_user_id: user.id,
    });
    if (existing.length > 0) {
      return Response.json({ error: 'duplicate', message: "You have already reported this content." }, { status: 409 });
    }

    // 1. Create the report FIRST — this MUST succeed regardless of email outcome.
    const report = await base44.entities.ContentReport.create({
      content_type: contentType,
      content_id: contentId,
      content_title: contentTitle || "",
      content_snapshot: contentSnapshot || "",
      reported_user_id: reportedUserId || "",
      reported_user_name: reportedUserName || "",
      reporting_user_id: user.id,
      reporting_user_name: user.full_name || user.email || "",
      reason,
      explanation: (explanation || "").trim(),
      status: "pending",
      email_notification_status: "pending",
      email_error: "",
    });

    // 2. Send the notification email in the background. The report is already saved,
    //    so a failure here never loses the report. Status is logged on the record.
    waitUntil((async () => {
      try {
        const subject = `ScamShield Safety Report — ${REASON_LABELS[reason] || reason}`;
        const emailBody = buildEmailBody(report, user);
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: SUPPORT_EMAIL,
          subject,
          body: emailBody,
          from_name: "ScamShield Moderation",
        });
        await base44.asServiceRole.entities.ContentReport.update(report.id, {
          email_notification_status: "sent",
          email_error: "",
        });
      } catch (err) {
        // Log the failure on the record for administrators; report stays saved & pending.
        const msg = (err && err.message) ? err.message : String(err);
        try {
          await base44.asServiceRole.entities.ContentReport.update(report.id, {
            email_notification_status: "failed",
            email_error: msg,
          });
        } catch (_) { /* best-effort log */ }
      }
    })());

    return Response.json({ success: true, report });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}