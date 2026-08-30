import React from "react";
import { motion } from "framer-motion";

function getColor(score) {
  if (score <= 25) return { stroke: "#10b981", bg: "rgba(16,185,129,0.1)" };
  if (score <= 50) return { stroke: "#f59e0b", bg: "rgba(245,158,11,0.1)" };
  if (score <= 75) return { stroke: "#f97316", bg: "rgba(249,115,22,0.1)" };
  return { stroke: "#ef4444", bg: "rgba(239,68,68,0.1)" };
}

export default function ScamScoreRing({ score }) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const colors = getColor(score);

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="8"
        />
        <motion.circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-bold font-heading"
          style={{ color: colors.stroke }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}%
        </motion.span>
        <span className="text-xs text-muted-foreground font-medium mt-0.5">Scam Likelihood</span>
      </div>
    </div>
  );
}