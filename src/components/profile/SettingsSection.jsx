import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Shield, BookOpen, Ban, ChevronRight } from "lucide-react";
import LegalModal from "@/components/legal/LegalModal";
import BlockedUsersList from "@/components/profile/BlockedUsersList";

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
      <Card className="border shadow-sm">
        <CardContent className="p-4">
          <h2 className="text-sm font-semibold mb-2 px-1">Settings</h2>
          <div className="divide-y">
            {settingsItems.map(item => (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full flex items-center gap-3 py-3 hover:bg-muted/50 -mx-1 px-1 rounded-md transition-colors text-left"
              >
                <item.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {openDoc && <LegalModal initialDoc={openDoc} onClose={() => setOpenDoc(null)} />}

      {showBlocked && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-card rounded-t-md sm:rounded-md shadow-lg w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-center justify-between">
              <h2 className="font-semibold text-sm">Blocked Users</h2>
              <button onClick={() => setShowBlocked(false)} className="p-2 rounded-md hover:bg-muted transition-colors">
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