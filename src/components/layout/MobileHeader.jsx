import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function MobileHeader({ title }) {
  const navigate = useNavigate();

  return (
    <div
      className="md:hidden flex items-center gap-2 px-4 py-3 bg-card border-b border-border/50 sticky top-0 z-30"
      style={{ paddingTop: "calc(0.75rem + env(safe-area-inset-top))" }}
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-primary text-sm font-medium select-none -webkit-touch-callout-none"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>
      {title && <h1 className="text-sm font-semibold ml-2 truncate">{title}</h1>}
    </div>
  );
}