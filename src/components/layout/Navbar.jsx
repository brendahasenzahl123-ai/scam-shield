import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X, Search, BookOpen, MessageCircle, BarChart3, Newspaper, User, BookMarked, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const primaryNav = [
  { to: "/", label: "Scan", icon: Search },
  { to: "/community", label: "Community", icon: MessageCircle },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/news", label: "Alerts", icon: Newspaper },
];

const moreNav = [
  { to: "/dashboard", label: "My Activity", icon: BarChart3 },
  { to: "/profile", label: "My Profile", icon: User },
  { to: "/journal", label: "My Scam Journal", icon: BookMarked },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();

  const isMoreActive = moreNav.some(l => l.to === location.pathname);

  return (
    <>
      <nav className="hidden md:block sticky top-0 z-50 glass border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-lg tracking-tight">
                Scam<span className="text-primary">Shield</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-0.5">
              {primaryNav.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link key={link.to} to={link.to}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`gap-1.5 font-medium text-xs px-3 ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      <link.icon className="w-3.5 h-3.5" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}

              {/* More dropdown */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-1.5 font-medium text-xs px-3 ${isMoreActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setMoreOpen(!moreOpen)}
                >
                  More <ChevronDown className="w-3 h-3" />
                </Button>
                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute right-0 top-full mt-1 w-52 bg-card border border-border rounded-xl shadow-xl py-1 z-50"
                    >
                      {moreNav.map(link => {
                        const isActive = location.pathname === link.to;
                        return (
                          <Link key={link.to} to={link.to} onClick={() => setMoreOpen(false)}>
                            <div className={`flex items-center gap-2.5 px-4 py-2.5 hover:bg-muted transition-colors ${isActive ? "text-primary bg-primary/5" : "text-foreground"}`}>
                              <link.icon className="w-4 h-4 shrink-0" />
                              <span className="text-sm font-medium">{link.label}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile menu backdrop */}
      {moreOpen && <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-16 z-40 glass border-b border-border/50 md:hidden max-h-[80vh] overflow-y-auto"
          >
            <div className="p-3 space-y-0.5">
              {[...primaryNav, ...moreNav].map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}>
                      <link.icon className="w-4 h-4" />
                      <span className="font-medium text-sm">{link.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}