import React from "react";

export default function ScamShieldScoreRing({ score }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const color = score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#3b82f6";
  const label = score >= 70 ? "Expert" : score >= 40 ? "Aware" : "Learner";

  return (
    <div className="flex flex-col items-center shrink-0">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
          <circle
            cx="32" cy="32" r={r} fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - score / 100)}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-bold leading-none">{score}</span>
        </div>
      </div>
      <span className="text-[10px] font-semibold mt-1" style={{ color }}>{label}</span>
      <span className="text-[9px] text-muted-foreground">ScamShield Score</span>
    </div>
  );
}