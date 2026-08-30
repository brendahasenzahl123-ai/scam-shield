import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Users, ChevronRight, X, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShareScamModal from "@/components/community/ShareScamModal";
import { useNativeShare } from "@/hooks/useNativeShare";

export default function SharePrompt({ result, onDismiss }) {
  const [showModal, setShowModal] = useState(false);
  const [shared, setShared] = useState(false);
  const { share, sharing } = useNativeShare();

  const handleNativeShare = async () => {
    const shareText = `ScamShield Alert: ${result.risk_level.toUpperCase()} risk scam detected (${result.scam_likelihood}% likelihood). ${result.explanation || ""}`;
    await share({ title: "ScamShield Analysis", text: shareText, url: window.location.href });
  };

  if (!result) return null;
  const shouldShow = result.risk_level === "high" || result.risk_level === "extreme" || result.scam_likelihood >= 60;
  if (!shouldShow || shared) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-primary/10 to-blue-50 border border-primary/20 p-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">Help protect others</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                This looks like a real scam. Share it with the ScamShield community so others can recognize and avoid it.
              </p>
            </div>
          </div>
          <button onClick={onDismiss} className="p-1 rounded-lg hover:bg-black/5 transition-colors shrink-0">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <Button
          size="sm"
          className="mt-3 w-full gap-1.5"
          onClick={() => setShowModal(true)}
        >
          <Shield className="w-3.5 h-3.5" /> Share with Community <ChevronRight className="w-3.5 h-3.5 ml-auto" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="mt-2 w-full gap-1.5"
          onClick={handleNativeShare}
          disabled={sharing}
        >
          <Share2 className="w-3.5 h-3.5" /> Share via...
        </Button>
      </motion.div>

      {showModal && (
        <ShareScamModal
          prefillData={{
            title: result.categories?.[0] ? `${result.categories[0].replace(/_/g, " ")} scam detected` : "Scam detected",
            category: result.categories?.[0] || "other",
            risk_level: result.risk_level,
            ai_summary: result.explanation || "",
            red_flags: result.red_flags || [],
            scam_likelihood: result.scam_likelihood,
          }}
          onClose={() => setShowModal(false)}
          onPosted={() => {
            setShowModal(false);
            setShared(true);
          }}
        />
      )}
    </>
  );
}