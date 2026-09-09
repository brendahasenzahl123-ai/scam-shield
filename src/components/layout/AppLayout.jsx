import React from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import BottomTabBar from "./BottomTabBar";
import OfflineBanner from "@/components/OfflineBanner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Shield, ChevronLeft } from "lucide-react";

// Tab root paths — show brand logo header
const ROOT_PATHS = ["/", "/community", "/learn", "/alerts", "/profile"];

// Map sub-pages to a readable title and their parent tab
const SUB_PAGE_TITLES = {
  "/dashboard": "My Activity",
  "/journal": "Scam Journal",
  "/admin": "Admin",
};

// Which tab to go back to for each sub-page
const BACK_TARGETS = {
  "/dashboard": "/profile",
  "/journal": "/profile",
  "/admin": "/",
};

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isRoot = ROOT_PATHS.includes(location.pathname);
  const subTitle = SUB_PAGE_TITLES[location.pathname];
  const backTarget = BACK_TARGETS[location.pathname] ?? -1;

  return (
    <div
      className="min-h-screen bg-background"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      {/* Desktop navbar */}
      <Navbar />

      {/* Mobile brand header — root tab screens */}
      {isRoot && (
        <div className="md:hidden sticky top-0 z-40 bg-card border-b border-border flex items-center px-4 h-14">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-base tracking-tight">
              Scam<span className="text-primary">Shield</span>
            </span>
          </Link>
        </div>
      )}

      {/* Mobile back header — sub-pages */}
      {!isRoot && subTitle && (
        <div className="md:hidden sticky top-0 z-40 bg-card border-b border-border flex items-center gap-2 px-2 h-14">
          <button
            onClick={() => typeof backTarget === "string" ? navigate(backTarget) : navigate(-1)}
            className="flex items-center gap-0.5 px-2 py-2 text-primary font-semibold text-sm"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <span className="text-sm font-semibold truncate">{subTitle}</span>
        </div>
      )}
      <main className="pb-24 md:pb-24" style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}>
        <ErrorBoundary key={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
      <OfflineBanner />
      <BottomTabBar />
    </div>
  );
}