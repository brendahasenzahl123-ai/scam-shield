import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Shield, Upload, Globe, Lock, UserX } from "lucide-react";
import { motion } from "framer-motion";
import MobileSelect from "@/components/ui/MobileSelect";
import { moderateContentArray } from "@/lib/contentModeration";

const CATEGORIES = [
  { value: "education", label: "Education / Scholarships" },
  { value: "employment", label: "Jobs / Internships" },
  { value: "social_media", label: "Social Media" },
  { value: "financial", label: "Financial / Crypto" },
  { value: "phishing", label: "Phishing / Email" },
  { value: "relationship", label: "Romance / Relationship" },
  { value: "package_delivery", label: "Package / Delivery" },
  { value: "marketplace", label: "Marketplace / Selling" },
  { value: "other", label: "Other" },
];

const RISKS = [
  { value: "extreme", label: "Extreme" },
  { value: "high", label: "High" },
  { value: "moderate", label: "Moderate" },
  { value: "low", label: "Low" },
];

// Redact sensitive information from text
function redactSensitiveInfo(text) {
  if (!text) return text;
  return text
    .replace(/\b\d{3}-?\d{2}-?\d{4}\b/g, "[SSN REDACTED]")
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[EMAIL REDACTED]")
    .replace(/\b\d{10}\b|\(\d{3}\)\s*\d{3}-?\d{4}|\d{3}-\d{3}-\d{4}\b/g, "[PHONE REDACTED]")
    .replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, "[CARD REDACTED]")
    .replace(/\b\d{9}\b/g, "[ACCOUNT REDACTED]");
}

export default function ShareScamModal({ onClose, onPosted, prefillData }) {
  const [form, setForm] = useState({
    title: prefillData?.title || "",
    category: prefillData?.category || "other",
    risk_level: prefillData?.risk_level || "high",
    ai_summary: prefillData?.ai_summary || "",
    red_flags: prefillData?.red_flags || [],
    personal_story: "",
    advice: "",
    screenshot_url: prefillData?.screenshot_url || "",
    is_anonymous: false,
    author_name: "",
    visibility: "public",
    scam_likelihood: prefillData?.scam_likelihood || null,
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    set("screenshot_url", file_url);
    setUploading(false);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.category) return;
    const moderation = moderateContentArray([form.title, form.ai_summary, form.personal_story, form.advice, form.author_name]);
    if (moderation.isViolating) {
      setSubmitError(moderation.message);
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const user = await base44.auth.me();
      if (user.suspended) {
        setSubmitError("Your account has been suspended. You cannot post content. Contact support if you believe this is an error.");
        return;
      }
      const data = {
        ...form,
        personal_story: redactSensitiveInfo(form.personal_story),
        advice: redactSensitiveInfo(form.advice),
        author_name: form.is_anonymous ? "Anonymous" : (form.author_name || user.full_name || "Community Member"),
        verification_status: "under_review",
        confidence_score: form.scam_likelihood || 50,
        helpful_votes: 0,
        received_too_count: 0,
        save_count: 0,
        comment_count: 0,
        is_flagged: false,
      };
      await base44.entities.CommunityPost.create(data);
      onPosted?.();
    } catch (err) {
      setSubmitError(err.message?.includes("Authentication") ? "Please sign in to submit a report." : (err.message || "Failed to submit report."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-4 pb-[calc(env(safe-area-inset-bottom)+4rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-sm">Share a Scam Report</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-muted-foreground bg-primary/5 rounded-lg p-3 border border-primary/10">
            Help protect others by sharing your experience. Personal data is automatically redacted before posting.
          </p>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block">Scam Title *</label>
            <Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Fake scholarship email asking for fees" className="h-9" />
          </div>

          {/* Category + Risk */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold mb-1.5 block">Category *</label>
              <MobileSelect
                value={form.category}
                onChange={val => set("category", val)}
                options={CATEGORIES}
                placeholder="Category"
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block">Risk Level *</label>
              <MobileSelect
                value={form.risk_level}
                onChange={val => set("risk_level", val)}
                options={RISKS}
                placeholder="Risk Level"
              />
            </div>
          </div>

          {/* AI Summary (pre-filled or manual) */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block">Analysis Summary</label>
            <textarea
              value={form.ai_summary}
              onChange={e => set("ai_summary", e.target.value)}
              placeholder="What made this suspicious? What were the main red flags?"
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none h-20"
            />
          </div>

          {/* Personal Story */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block">Your Experience <span className="text-muted-foreground font-normal">(optional)</span></label>
            <textarea
              value={form.personal_story}
              onChange={e => set("personal_story", e.target.value)}
              placeholder="Share what happened to you or someone you know. Personal details will be automatically removed."
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none h-20"
            />
          </div>

          {/* Advice */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block">Advice for Others <span className="text-muted-foreground font-normal">(optional)</span></label>
            <textarea
              value={form.advice}
              onChange={e => set("advice", e.target.value)}
              placeholder="What would you tell someone who receives this scam?"
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none h-16"
            />
          </div>

          {/* Screenshot */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block">Screenshot <span className="text-muted-foreground font-normal">(optional — blur or crop personal info before uploading)</span></label>
            <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
              <Upload className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{uploading ? "Uploading..." : form.screenshot_url ? "Image uploaded ✓" : "Upload screenshot"}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {/* Author */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block">Your Name</label>
            <div className="flex gap-2">
              <Input
                value={form.author_name}
                onChange={e => set("author_name", e.target.value)}
                placeholder="Display name"
                disabled={form.is_anonymous}
                className="h-9 flex-1"
              />
              <button
                onClick={() => set("is_anonymous", !form.is_anonymous)}
                className={`flex items-center gap-1.5 px-3 h-9 rounded-lg border text-xs font-medium transition-colors ${form.is_anonymous ? "bg-primary/10 text-primary border-primary/20" : "border-input text-muted-foreground hover:bg-muted"}`}
              >
                <UserX className="w-3.5 h-3.5" /> Anonymous
              </button>
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="text-xs font-semibold mb-2 block">Visibility</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "public", label: "Share Publicly", icon: Globe, desc: "Help the community" },
                { value: "private", label: "Save Privately", icon: Lock, desc: "Only visible to you" },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => set("visibility", opt.value)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-colors ${form.visibility === opt.value ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}
                >
                  <opt.icon className={`w-4 h-4 shrink-0 ${form.visibility === opt.value ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <p className="text-xs font-semibold">{opt.label}</p>
                    <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {submitError && (
            <div className="mb-3 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {submitError}
            </div>
          )}
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!form.title || submitting}
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}