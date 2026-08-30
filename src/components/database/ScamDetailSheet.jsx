import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import RiskBadge from "@/components/scan/RiskBadge";
import { format } from "date-fns";
import { Calendar, Eye, AlertTriangle } from "lucide-react";

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

export default function ScamDetailSheet({ report, onClose }) {
  if (!report) return null;

  return (
    <Sheet open={!!report} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-left pr-6">{report.title}</SheetTitle>
        </SheetHeader>

        {report.screenshot_url && (
          <div className="rounded-xl overflow-hidden border mb-4">
            <img src={report.screenshot_url} alt="" className="w-full object-contain bg-muted" />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {report.risk_level && <RiskBadge level={report.risk_level} />}
          <Badge variant="secondary" className="text-xs">
            {categoryLabels[report.category] || report.category}
          </Badge>
          {report.is_trending && (
            <Badge className="bg-orange-100 text-orange-700 text-xs">Trending</Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          {report.date_encountered && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {format(new Date(report.date_encountered), "MMMM d, yyyy")}
            </span>
          )}
          {report.view_count > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {report.view_count} views
            </span>
          )}
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{report.description}</p>
          </div>

          {report.scam_tactics?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Scam Tactics Used
              </h3>
              <div className="space-y-1.5">
                {report.scam_tactics.map((tactic, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-100">
                    <span className="text-amber-600">⚠️</span>
                    <span className="text-sm text-amber-700">{tactic}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}