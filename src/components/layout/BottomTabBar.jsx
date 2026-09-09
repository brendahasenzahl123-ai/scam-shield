import React, { useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Users, BookOpen, Bell, User } from "lucide-react";

const TABS = [
  { label: "Scan", path: "/", icon: Search },
  { label: "Community", path: "/community", icon: Users },
  { label: "Learn", path: "/learn", icon: BookOpen },
  { label: "Alerts", path: "/alerts", icon: Bell },
  { label: "Profile", path: "/profile", icon: User },
];

// Preserve scroll position per tab root path
const scrollPositions = {};

export default function BottomTabBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const prevTabRef = useRef(null);

  const getActiveTab = () => TABS.find(t => t.path === "/" ? pathname === "/" : pathname.startsWith(t.path));
  const activeTab = getActiveTab();

  const handleTabPress = useCallback((tab) => {
    const isCurrentTab = activeTab?.path === tab.path;

    if (isCurrentTab) {
      // Re-selecting active tab: reset to root and scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (pathname !== tab.path) {
        navigate(tab.path, { replace: true });
      }
      return;
    }

    // Save scroll position of current tab before leaving
    if (activeTab) {
      scrollPositions[activeTab.path] = window.scrollY;
    }

    navigate(tab.path);

    // Restore scroll position of the destination tab after navigation
    const savedY = scrollPositions[tab.path] ?? 0;
    requestAnimationFrame(() => {
      window.scrollTo({ top: savedY, behavior: "instant" });
    });
  }, [activeTab, pathname, navigate]);

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border/60 flex items-stretch"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {TABS.map(({ label, path, icon: Icon }) => {
        const active = path === "/" ? pathname === "/" : pathname.startsWith(path);
        return (
          <button
            key={path}
            onClick={() => handleTabPress({ label, path, icon: Icon })}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors select-none ${
              active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-muted-foreground"}`} strokeWidth={active ? 2.5 : 2} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}