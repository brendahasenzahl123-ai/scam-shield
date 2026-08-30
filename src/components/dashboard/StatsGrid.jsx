import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ShieldAlert, Bookmark, Activity } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { key: "totalScans", label: "Total Scans", icon: Search, color: "text-primary bg-primary/10" },
  { key: "highRisk", label: "High Risk Found", icon: ShieldAlert, color: "text-red-500 bg-red-50" },
  { key: "bookmarked", label: "Bookmarked", icon: Bookmark, color: "text-amber-500 bg-amber-50" },
  { key: "reports", label: "Reports Made", icon: Activity, color: "text-blue-500 bg-blue-50" },
];

export default function StatsGrid({ data }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.key}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <Card className="border-0 shadow-md shadow-black/5">
            <CardContent className="p-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <p className="text-2xl font-heading font-bold">{data[stat.key] || 0}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}