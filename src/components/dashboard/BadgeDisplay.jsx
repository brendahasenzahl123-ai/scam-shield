import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Search, Award, Users, Zap, BookOpen, Star } from "lucide-react";

const badgeConfig = {
  first_scan: {
    label: "First Scan",
    desc: "Completed your first scam analysis",
    icon: Zap,
    color: "bg-emerald-100 text-emerald-600",
  },
  scam_spotter: {
    label: "Scam Spotter",
    desc: "Identified 5 high-risk scams",
    icon: Search,
    color: "bg-blue-100 text-blue-600",
  },
  scam_detective: {
    label: "Scam Detective",
    desc: "Completed 25 scam analyses",
    icon: Shield,
    color: "bg-purple-100 text-purple-600",
  },
  cyber_safety: {
    label: "Cyber Safety Pro",
    desc: "Read all education modules",
    icon: BookOpen,
    color: "bg-amber-100 text-amber-600",
  },
  community_contributor: {
    label: "Community Contributor",
    desc: "Submitted 3 scam reports",
    icon: Users,
    color: "bg-pink-100 text-pink-600",
  },
  ten_scans: {
    label: "Power Scanner",
    desc: "Completed 10 scam analyses",
    icon: Star,
    color: "bg-teal-100 text-teal-600",
  },
  educator: {
    label: "Educator",
    desc: "Shared scam knowledge",
    icon: Award,
    color: "bg-orange-100 text-orange-600",
  },
};

export default function BadgeDisplay({ badges = [] }) {
  const allBadgeTypes = Object.keys(badgeConfig);
  const earnedTypes = new Set(badges.map((b) => b.badge_type));

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Your Badges</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {allBadgeTypes.map((type) => {
          const config = badgeConfig[type];
          const earned = earnedTypes.has(type);

          return (
            <Card
              key={type}
              className={`border-0 shadow-sm transition-all ${earned ? "shadow-md" : "opacity-40"}`}
            >
              <CardContent className="p-3 text-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-1.5 ${config.color}`}>
                  <config.icon className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold">{config.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{config.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}