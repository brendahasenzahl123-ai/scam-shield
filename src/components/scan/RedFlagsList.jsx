import React from "react";
import { motion } from "framer-motion";
import { Flag } from "lucide-react";

export default function RedFlagsList({ flags }) {
  if (!flags || flags.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Flag className="w-4 h-4 text-red-500" />
        Red Flags Detected
      </h3>
      <div className="space-y-1.5">
        {flags.map((flag, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-start gap-2.5 px-3 py-2 rounded-lg bg-red-50 border border-red-100"
          >
            <span className="text-red-500 mt-0.5 shrink-0">🚩</span>
            <span className="text-sm text-red-700">{flag}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}