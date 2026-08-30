import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import RiskBadge from "@/components/scan/RiskBadge";
import { format } from "date-fns";
import { Type, ImageIcon, Link2 } from "lucide-react";

const typeIcons = {
  text: Type,
  image: ImageIcon,
  link: Link2,
};

export default function RecentScans({ scans = [] }) {
  if (scans.length === 0) {
    return (
      <div>
        <h3 className="text-sm font-semibold mb-3">Recent Scans</h3>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <p className="text-xs text-muted-foreground">No scans yet. Try analyzing a suspicious message!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Recent Scans</h3>
      <div className="space-y-2">
        {scans.slice(0, 5).map((scan) => {
          const Icon = typeIcons[scan.input_type] || Type;

          return (
            <Card key={scan.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">
                    {scan.input_content?.slice(0, 60) || `${scan.input_type} scan`}
                    {scan.input_content?.length > 60 && "..."}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {scan.created_date ? format(new Date(scan.created_date), "MMM d, h:mm a") : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-bold" style={{
                    color: scan.scam_likelihood > 75 ? "#ef4444" :
                      scan.scam_likelihood > 50 ? "#f97316" :
                      scan.scam_likelihood > 25 ? "#f59e0b" : "#10b981"
                  }}>
                    {scan.scam_likelihood}%
                  </span>
                  <RiskBadge level={scan.risk_level} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}