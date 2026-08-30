import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff, Shield, AlertTriangle, CheckCircle2, Settings, X, ChevronRight, BookOpen, MapPin, GraduationCap, Users, CreditCard, Truck, Cpu, Heart, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const TOPICS = [
  { id: "scholarship", label: "Scholarship Scams", icon: GraduationCap, color: "bg-blue-100 text-blue-700" },
  { id: "jobs", label: "Job & Internship Scams", icon: Briefcase, color: "bg-purple-100 text-purple-700" },
  { id: "social_media", label: "Social Media Fraud", icon: Users, color: "bg-pink-100 text-pink-700" },
  { id: "banking", label: "Banking & Financial Scams", icon: CreditCard, color: "bg-emerald-100 text-emerald-700" },
  { id: "delivery", label: "Package Delivery Scams", icon: Truck, color: "bg-orange-100 text-orange-700" },
  { id: "ai_scams", label: "AI Impersonation Scams", icon: Cpu, color: "bg-violet-100 text-violet-700" },
  { id: "romance", label: "Romance & Relationship Scams", icon: Heart, color: "bg-rose-100 text-rose-700" },
  { id: "student", label: "Student-Targeted Scams", icon: GraduationCap, color: "bg-indigo-100 text-indigo-700" },
  { id: "senior", label: "Senior-Targeted Scams", icon: Shield, color: "bg-teal-100 text-teal-700" },
];

const STATES_SHORT = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

const PREF_OPTIONS = [
  { id: "all", label: "All Alerts" },
  { id: "high_risk", label: "High-Risk Only" },
  { id: "verified", label: "Verified Scams Only" },
  { id: "digest", label: "Weekly Digest" },
  { id: "off", label: "Turn Off" },
];

const SAMPLE_NOTIFICATIONS = [
  { id: 1, title: "Fake FAFSA Verification Email — Active Campaign", risk_level: "extreme", category: "Scholarship", state: "TX", summary: "A phishing campaign impersonating the U.S. Dept. of Education is targeting college students in Texas and surrounding states.", action: "Verify your FAFSA only at studentaid.gov", time: "2 hours ago", read: false, link: "/news" },
  { id: 2, title: "AI Voice Clone Grandparent Scam — Rising Fast", risk_level: "extreme", category: "AI Scams", state: "FL", summary: "AI-powered voice cloning scam targeting seniors in Florida and the Southeast has increased 34% this week.", action: "Set a family emergency code word today", time: "5 hours ago", read: false, link: "/news" },
  { id: 3, title: "Discord Nitro Phishing — New Domain Detected", risk_level: "high", category: "Social Media", state: "Nationwide", summary: "Scammers switched to a new phishing domain: discordapp.io — same attack, new URL. Gamers ages 13-25 are primary targets.", action: "Enable 2FA on your Discord account", time: "1 day ago", read: false, link: "/community" },
  { id: 4, title: "Fake Summer Internship Offers — LinkedIn Wave", risk_level: "high", category: "Jobs", state: "CA, NY, TX", summary: "Fake tech company recruiters are mass-messaging college students on LinkedIn with fake internship offers requiring equipment purchases.", action: "Verify all recruiters via the company's official HR page", time: "2 days ago", read: true, link: "/community" },
  { id: 5, title: "USPS Package Notification Smishing — Nationwide", risk_level: "extreme", category: "Delivery", state: "Nationwide", summary: "A new wave of fake USPS text messages using the domain 'usps-packagetrack.net' is circulating. Over 50,000 texts reportedly sent this week.", action: "Track packages only at usps.com — never follow links", time: "3 days ago", read: true, link: "/news" },
  { id: 6, title: "Student Loan Forgiveness Scam — Spring Wave", risk_level: "high", category: "Scholarship", state: "Nationwide", summary: "Scammers are capitalizing on loan forgiveness news. Callers charge upfront fees to 'file applications' for programs that are free through studentaid.gov.", action: "Student loan help is always free at studentaid.gov", time: "4 days ago", read: true, link: "/students" },
  { id: 7, title: "Fake Microsoft Tech Support Pop-Up — Senior Alert", risk_level: "high", category: "Senior-Targeted", state: "PA, OH, FL", summary: "A new pop-up campaign locking browsers and displaying fake Microsoft alerts is targeting adults 60+ in multiple states.", action: "Force-close any browser showing a number to call", time: "5 days ago", read: true, link: "/news" },
  { id: 8, title: "TikTok Crypto Deepfake Ads — New Celebrities Used", risk_level: "high", category: "AI Scams", state: "Nationwide", summary: "Deepfake videos now using Warren Buffett, Bill Gates, and MrBeast have been detected promoting fake crypto investment platforms.", action: "Real celebrities never advertise investments via social media ads", time: "6 days ago", read: true, link: "/community" },
];

const RISK_COLORS = { extreme: "bg-red-100 text-red-700 border-red-200", high: "bg-orange-100 text-orange-700 border-orange-200", moderate: "bg-amber-100 text-amber-700 border-amber-200", low: "bg-emerald-100 text-emerald-700 border-emerald-200" };

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("notifications");
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const [followedTopics, setFollowedTopics] = useState(() => {
    try { return JSON.parse(localStorage.getItem("followedTopics") || "[]"); } catch { return []; }
  });
  const [followedStates, setFollowedStates] = useState(() => {
    try { return JSON.parse(localStorage.getItem("followedStates") || "[]"); } catch { return []; }
  });
  const [alertPref, setAlertPref] = useState(() => localStorage.getItem("alertPref") || "all");
  const [notifPermission, setNotifPermission] = useState(() => {
    if (typeof Notification === "undefined") return "unsupported";
    return Notification.permission;
  });

  const requestNotifPermission = async () => {
    if (typeof Notification === "undefined") return;
    const permission = await Notification.requestPermission();
    setNotifPermission(permission);
  };

  const toggleTopic = (id) => {
    const next = followedTopics.includes(id) ? followedTopics.filter(t => t !== id) : [...followedTopics, id];
    setFollowedTopics(next);
    localStorage.setItem("followedTopics", JSON.stringify(next));
  };

  const toggleState = (abbr) => {
    const next = followedStates.includes(abbr) ? followedStates.filter(s => s !== abbr) : [...followedStates, abbr];
    setFollowedStates(next);
    localStorage.setItem("followedStates", JSON.stringify(next));
  };

  const markRead = (id) => setNotifications(n => n.map(notif => notif.id === id ? { ...notif, read: true } : notif));
  const markAllRead = () => setNotifications(n => n.map(notif => ({ ...notif, read: true })));

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-12">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3 border border-primary/20">
            <Bell className="w-3.5 h-3.5" />
            Notification Center
          </div>
          <h1 className="text-2xl font-heading font-bold">Alerts & Subscriptions</h1>
          <p className="text-sm text-muted-foreground mt-1">Follow scam topics and states to receive relevant threat alerts</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1.5 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" /> Mark all read
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl mb-6 w-fit">
        {[
          { id: "notifications", label: `Notifications${unreadCount > 0 ? ` (${unreadCount})` : ""}` },
          { id: "topics", label: "Follow Topics" },
          { id: "states", label: "Follow States" },
          { id: "settings", label: "Preferences" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === tab.id ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <BellOff className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-semibold">No notifications yet</p>
              <p className="text-sm text-muted-foreground mt-1">Follow topics and states to receive scam alerts</p>
            </div>
          ) : (
            notifications.map((notif, i) => (
              <motion.div key={notif.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className={`border-0 shadow-sm transition-all ${!notif.read ? "ring-1 ring-primary/20 bg-primary/2" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${notif.risk_level === "extreme" ? "bg-red-100" : "bg-orange-100"}`}>
                        <AlertTriangle className={`w-4 h-4 ${notif.risk_level === "extreme" ? "text-red-600" : "text-orange-600"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className={`text-sm font-semibold leading-snug ${!notif.read ? "text-foreground" : "text-foreground/80"}`}>{notif.title}</h3>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {!notif.read && <div className="w-2 h-2 rounded-full bg-primary" />}
                            <button onClick={() => markRead(notif.id)} className="p-0.5 hover:text-muted-foreground transition-colors">
                              <X className="w-3.5 h-3.5 text-muted-foreground/50" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-1.5">
                          <Badge variant="outline" className={`text-[10px] ${RISK_COLORS[notif.risk_level]}`}>{notif.risk_level} risk</Badge>
                          <Badge variant="outline" className="text-[10px]">{notif.category}</Badge>
                          {notif.state && <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><MapPin className="w-3 h-3" />{notif.state}</span>}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-2">{notif.summary}</p>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11px] text-primary font-medium flex items-center gap-1">
                            <Shield className="w-3 h-3" /> {notif.action}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground">{notif.time}</span>
                            <Link to={notif.link}>
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] gap-1">
                                View <ChevronRight className="w-3 h-3" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Follow Topics Tab */}
      {activeTab === "topics" && (
        <div>
          <p className="text-sm text-muted-foreground mb-4">Select scam topics to receive alerts when new verified reports are posted.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TOPICS.map(topic => {
              const followed = followedTopics.includes(topic.id);
              return (
                <button key={topic.id} onClick={() => toggleTopic(topic.id)} className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${followed ? "bg-primary/5 border-primary/30 ring-1 ring-primary/20" : "bg-card border-border/50 hover:shadow-sm"}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${topic.color}`}>
                    <topic.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{topic.label}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${followed ? "bg-primary border-primary" : "border-muted-foreground/30"}`}>
                    {followed && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
          {followedTopics.length > 0 && (
            <p className="text-xs text-primary font-medium mt-4">✓ Following {followedTopics.length} topic{followedTopics.length > 1 ? "s" : ""}</p>
          )}
        </div>
      )}

      {/* Follow States Tab */}
      {activeTab === "states" && (
        <div>
          <p className="text-sm text-muted-foreground mb-4">Follow specific states to receive alerts for scams reported in your area.</p>
          <div className="flex flex-wrap gap-2">
            {STATES_SHORT.map(abbr => {
              const followed = followedStates.includes(abbr);
              return (
                <button key={abbr} onClick={() => toggleState(abbr)} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${followed ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                  {abbr}
                </button>
              );
            })}
          </div>
          {followedStates.length > 0 && (
            <p className="text-xs text-primary font-medium mt-4">✓ Following {followedStates.length} state{followedStates.length > 1 ? "s" : ""}: {followedStates.join(", ")}</p>
          )}
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === "settings" && (
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1.5"><Bell className="w-4 h-4 text-primary" /> Push Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              {notifPermission === "unsupported" ? (
                <p className="text-sm text-muted-foreground">Push notifications will be available in a future app update. Your alert preferences are saved and will apply once notifications are enabled.</p>
              ) : notifPermission === "granted" ? (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Notifications enabled. You'll receive alerts for followed topics and threat warnings.</span>
                </div>
              ) : notifPermission === "denied" ? (
                <p className="text-sm text-muted-foreground">Notifications are blocked. Enable them in your device Settings to receive scam alerts.</p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-3">Enable push notifications for scam alerts, threat warnings, and report updates on followed topics.</p>
                  <Button size="sm" onClick={requestNotifPermission} className="gap-1.5">
                    <Bell className="w-3.5 h-3.5" /> Enable Notifications
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1.5"><Settings className="w-4 h-4 text-primary" /> Alert Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {PREF_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => { setAlertPref(opt.id); localStorage.setItem("alertPref", opt.id); }} className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${alertPref === opt.id ? "bg-primary/5 border-primary/30 text-primary font-semibold" : "bg-card border-border/50 text-foreground hover:bg-muted/30"}`}>
                    <span>{opt.label}</span>
                    {alertPref === opt.id && <CheckCircle2 className="w-4 h-4 text-primary" />}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm font-semibold mb-1">Your Subscriptions</p>
              <p className="text-xs text-muted-foreground mb-3">A summary of what you're following</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Followed topics</span>
                  <span className="font-semibold">{followedTopics.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Followed states</span>
                  <span className="font-semibold">{followedStates.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Alert preference</span>
                  <span className="font-semibold capitalize">{PREF_OPTIONS.find(p => p.id === alertPref)?.label}</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border/50 flex gap-2">
                <Button variant="outline" size="sm" className="text-xs" onClick={() => setActiveTab("topics")}>Manage Topics</Button>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => setActiveTab("states")}>Manage States</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}