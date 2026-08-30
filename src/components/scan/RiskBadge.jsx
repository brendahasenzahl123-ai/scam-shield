import React from "react";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ShieldCheck, AlertTriangle, ShieldX } from "lucide-react";

const riskConfig = {
  low: {
    label: "Low Risk",
    icon: ShieldCheck,
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  moderate: {
    label: "Moderate Risk",
    icon: AlertTriangle,
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  high: {
    label: "High Risk",
    icon: ShieldAlert,
    className: "bg-orange-100 text-orange-700 border-orange-200",
  },
  extreme: {
    label: "Extremely High Risk",
    icon: ShieldX,
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

export default function RiskBadge({ level, size = "default" }) {
  const config = riskConfig[level] || riskConfig.low;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.className} border gap-1.5 font-semibold ${size === "lg" ? "text-sm px-3 py-1.5" : "text-xs px-2 py-1"}`}>
      <Icon className={size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5"} />
      {config.label}
    </Badge>
  );
}