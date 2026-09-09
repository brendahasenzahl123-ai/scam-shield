import React, { useState } from "react";
import { motion } from "framer-motion";
import SharePrompt from "@/components/scan/SharePrompt";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bookmark, BookmarkCheck, ShieldCheck, AlertTriangle, Share2,
  ChevronRight, ArrowLeft, Users, Flag, Info, CheckCircle2,
  Search, Target
} from "lucide-react";
import ScamScoreRing from "./ScamScoreRing";
import { useNativeShare } from "@/hooks/useNativeShare";
import RiskBadge from "./RiskBadge";

const categoryLabels = {
  education: "Education Scam",
  employment: "Employment Scam",
  social_media: "Social Media Scam",
  marketplace: "Marketplace Scam",
  financial: "Financial Scam",
  phishing: "Phishing",
  relationship: "Relationship Scam",
  package_delivery: "Package & Delivery Scam",
  other: "Other",
};

const riskBorderColor = {
  low: "border-l-emerald-400",
  moderate: "border-l-amber-400",
  high: "border-l-orange-500",
  extreme: "border-l-red-500",
};

export default function AnalysisResult({ result, onBookmark, onReset }) {
  const [promptDismissed, setPromptDismissed] = useState(false);
  const { share, sharing } = useNativeShare();
  const borderColor = riskBorderColor[result.risk_level] || "border-l-primary";

  const handleShare = async () => {
    const shareText = `ScamShield Analysis: ${result.risk_level.toUpperCase()} risk (${result.scam_likelihood}% likely). ${result.explanation || ""}`;
    await share({ title: "ScamShield Analysis", text: shareText, url: window.location.href });
  };
  const isHighRisk = result.risk_level === "high" || result.risk_level === "extreme";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Back + Bookmark header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground -ml-2" onClick={onReset}>
          <ArrowLeft className="w-4 h-4" />
          New Analysis
        </Button>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            disabled={sharing}
            className="gap-1.5 text-muted-foreground"
          >
            <Share2 className="w-4 h-4" /> Share
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBookmark?.(result)}
            className="gap-1.5 text-muted-foreground"
          >
            {result.is_bookmarked ? (
              <><BookmarkCheck className="w-4 h-4 text-primary" /> Saved</>
            ) : (
              <><Bookmark className="w-4 h-4" /> Save</>
            )}
          </Button>
        </div>
      </div>

      {/* Score + Risk Card */}
      <Card className={`border shadow-sm border-l-4 ${borderColor}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold font-heading">Analysis Result</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Scam probability assessment
              </p>
            </div>
            <RiskBadge level={result.risk_level} size="lg" />
          </div>

          <ScamScoreRing score={result.scam_likelihood} />

          {/* Categories */}
          {result.categories?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
              {result.categories.map((cat) => (
                <Badge key={cat} variant="secondary" className="text-xs font-medium">
                  {categoryLabels[cat] || cat}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Why We Flagged This — KEY SECTION */}
      {result.explanation && (
        <Card className="border shadow-sm">
          <CardHeader className="pb-3 pt-5 px-5">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Search className="w-4 h-4 text-primary" />
              </div>
              Why We Reached This Conclusion
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <p className="text-sm text-foreground leading-relaxed font-medium">
              {result.explanation}
            </p>

            {result.why_flagged?.length > 0 && (
              <div className="mt-4 space-y-2">
                {result.why_flagged.map((reason, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm bg-muted/40 rounded-lg px-3 py-2">
                    <Info className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground text-xs leading-relaxed">{reason}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Red Flags */}
      {result.red_flags?.length > 0 && (
        <Card className="border shadow-sm">
          <CardHeader className="pb-3 pt-5 px-5">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                <Flag className="w-4 h-4 text-red-500" />
              </div>
              Red Flags Detected
              <Badge className="bg-red-100 text-red-700 border-0 text-[10px] ml-auto">
                {result.red_flags.length} found
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <div className="space-y-2">
              {result.red_flags.map((flag, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2.5"
                >
                  <span className="text-red-500 text-sm mt-0.5 shrink-0">🚩</span>
                  <span className="text-sm text-foreground leading-snug">{flag}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Similar Reports / Pattern Matching */}
      {result.similar_pattern_count > 0 && (
        <Card className="border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <Users className="w-4.5 h-4.5 text-amber-700 w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Pattern Match</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  This content shares characteristics with an estimated{" "}
                  <span className="font-bold text-amber-700">
                    {result.similar_pattern_count.toLocaleString()} previously reported scams
                  </span>{" "}
                  in our database and known fraud registries.
                </p>
                {result.target_demographic && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <Target className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Typically targets: <span className="font-medium text-foreground">{result.target_demographic}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Actions */}
      {result.recommended_actions?.length > 0 && (
        <Card className={`border shadow-sm ${isHighRisk ? "border-l-4 border-l-red-500" : "border-l-4 border-l-primary"}`}>
          <CardHeader className="pb-3 pt-5 px-5">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isHighRisk ? "bg-red-100" : "bg-primary/10"}`}>
                <CheckCircle2 className={`w-4 h-4 ${isHighRisk ? "text-red-500" : "text-primary"}`} />
              </div>
              Recommended Actions
              {isHighRisk && (
                <Badge className="bg-red-100 text-red-700 border-0 text-[10px] ml-auto">
                  Act Now
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <div className="space-y-2">
              {result.recommended_actions.map((action, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <ChevronRight className={`w-4 h-4 mt-0.5 shrink-0 ${isHighRisk ? "text-red-500" : "text-primary"}`} />
                  <span className="text-sm text-foreground leading-snug">{action}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Low risk reassurance */}
      {(result.risk_level === "low") && (
        <Card className="border shadow-sm">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-700">Appears Legitimate</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                We did not detect significant scam indicators. Always stay cautious with unexpected requests.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Share with community prompt */}
      {!promptDismissed && <SharePrompt result={result} onDismiss={() => setPromptDismissed(true)} />}

      <Button
        variant="outline"
        className="w-full"
        onClick={onReset}
      >
        Analyze Another Message
      </Button>
    </motion.div>
  );
}