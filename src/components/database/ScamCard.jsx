import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar } from "lucide-react";
import RiskBadge from "@/components/scan/RiskBadge";
import VoteButtons from "@/components/database/VoteButtons";
import { format } from "date-fns";

const categoryLabels = {
  education: "Education",
  employment: "Employment",
  social_media: "Social Media",
  marketplace: "Marketplace",
  financial: "Financial",
  phishing: "Phishing",
  relationship: "Relationship",
  package_delivery: "Package & Delivery",
  other: "Other",
};

const categoryColors = {
  education: "bg-blue-100 text-blue-700",
  employment: "bg-purple-100 text-purple-700",
  social_media: "bg-pink-100 text-pink-700",
  marketplace: "bg-amber-100 text-amber-700",
  financial: "bg-emerald-100 text-emerald-700",
  phishing: "bg-red-100 text-red-700",
  relationship: "bg-rose-100 text-rose-700",
  package_delivery: "bg-orange-100 text-orange-700",
  other: "bg-gray-100 text-gray-700",
};

export default function ScamCard({ report, onClick }) {
  const [localReport, setLocalReport] = useState(report);
  return (
    <Card
      className="border-0 shadow-md shadow-black/5 hover:shadow-lg transition-all group"
    >
      <CardContent className="p-4">
        <div className="cursor-pointer" onClick={() => onClick?.(localReport)}>
        {localReport.screenshot_url && (
          <div className="rounded-lg overflow-hidden mb-3 bg-muted aspect-video">
            <img
              src={report.screenshot_url}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {localReport.title}
          </h3>
          {localReport.is_trending && (
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-[10px] shrink-0">
              Trending
            </Badge>
          )}
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {localReport.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`${categoryColors[localReport.category] || categoryColors.other} text-[10px] border-0`}>
              {categoryLabels[localReport.category] || localReport.category}
            </Badge>
            {localReport.risk_level && <RiskBadge level={localReport.risk_level} />}
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            {localReport.view_count > 0 && (
              <span className="flex items-center gap-1 text-[10px]">
                <Eye className="w-3 h-3" /> {localReport.view_count}
              </span>
            )}
            {localReport.date_encountered && (
              <span className="flex items-center gap-1 text-[10px]">
                <Calendar className="w-3 h-3" />
                {format(new Date(localReport.date_encountered), "MMM d")}
              </span>
            )}
          </div>
        </div>
        </div>
        <VoteButtons report={localReport} onVote={setLocalReport} />
      </CardContent>
    </Card>
  );
}