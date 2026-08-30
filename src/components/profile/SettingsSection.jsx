import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText, Shield, BookOpen, Mail, Ban, ChevronRight, ExternalLink
} from "lucide-react";
import LegalModal from "@/components/legal/LegalModal";
import BlockedUsersList from "@/components/profile/BlockedUsersList";
import { SUPPORT_EMAIL } from "@/lib/legalContent";

export default function SettingsSection({ userId }) {
  const [openDoc, setOpenDoc] = useState(null);
  const [showBlocked, setShowBlocked] = useState(false);

  const settingsItems = [
    { icon: FileText, label: "Terms of Use", desc: "View the app's Terms of Use / EULA", action: () => setOpenDoc("terms") },
    { icon: Shield, label: "Privacy Policy", desc: "How we handle your data", action: () => setOpenDoc("privacy") },
    { icon: BookOpen, label: "Community Standards", desc: "Rules for community content", action: () => setOpenDoc("community") },
    { icon: Ban, label: "Blocked Users", desc: "Manage users you've blocked", action: () => setShowBlocked(true) },
  ];

  return (
    <>
      <Card className="border-0 shadow-md shadow-black/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-primary" /> Settings & Safety
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {settingsItems.map(item => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Safety & Support */}
      <Card className="border-0 shadow-md shadow-black/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-primary" /> Safety & Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Contact ScamShield regarding safety issues, abusive content, moderation decisions, or other concerns.
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="flex items-center gap-2 p-3 rounded-xl border border-border hover:bg-muted transition-colors"
          >
            <Mail className="w-4 h-4 text-primary shrink-0" />
            <span className="text-sm font-medium text-primary flex-1">{SUPPORT_EMAIL}</span>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
          </a>
          <p className="text-[10px] text-muted-foreground mt-2">
            We review all reports within 24 hours. For urgent safety concerns, contact us immediately.
          </p>
        </CardContent>
      </Card>

      {openDoc && <LegalModal initialDoc={openDoc} onClose={() => setOpenDoc(null)} />}

      {showBlocked && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Ban className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-sm">Blocked Users</h2>
              </div>
              <button onClick={() => setShowBlocked(false)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
            <div className="overflow-y-auto p-4">
              <BlockedUsersList userId={userId} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}