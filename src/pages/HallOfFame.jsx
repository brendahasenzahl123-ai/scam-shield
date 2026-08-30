import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database, TrendingUp, Eye, CheckCircle2, ShieldAlert, ArrowUp } from "lucide-react";

const scamData = [
  { rank: 1, title: "USPS Delivery Notification Scam", category: "Package Delivery", reports: 18420, views: 94300, verificationRate: 97, trend: "high_risk", trendUp: true, summary: "Fake USPS text messages claiming a package couldn't be delivered, directing victims to a phishing site that steals payment info and personal data.", topTargets: "All adults, online shoppers" },
  { rank: 2, title: "Discord Nitro Free Gift Phishing", category: "Social Media", reports: 14280, views: 78500, verificationRate: 99, trend: "high_risk", trendUp: true, summary: "Fake Discord Nitro links sent via DM that steal account credentials through a near-perfect replica of the Discord login page.", topTargets: "Gamers ages 13-25" },
  { rank: 3, title: "Fake Scholarship Winner Notification", category: "Education", reports: 11650, views: 62100, verificationRate: 96, trend: "high_risk", trendUp: true, summary: "Students receive calls, texts, or emails claiming they've won scholarships they never applied for, then are asked to pay processing fees.", topTargets: "High school and college students" },
  { rank: 4, title: "IRS Tax Debt Arrest Threat", category: "Financial", reports: 10900, views: 58200, verificationRate: 98, trend: "under_review", trendUp: false, summary: "Aggressive phone calls threatening immediate arrest for unpaid taxes, demanding payment via gift cards or wire transfer.", topTargets: "Adults 35-65" },
  { rank: 5, title: "Fake Remote Job / Work-From-Home Offer", category: "Employment", reports: 9870, views: 51400, verificationRate: 94, trend: "high_risk", trendUp: true, summary: "LinkedIn and Indeed job postings for high-paying remote work with no experience required, leading to check cashing or reshipping schemes.", topTargets: "College students, recent graduates" },
  { rank: 6, title: "Crypto Investment / Pig Butchering Scam", category: "Financial", reports: 8940, views: 47800, verificationRate: 95, trend: "high_risk", trendUp: true, summary: "Long-term romantic or friendship relationships cultivated online, ultimately leading victims to invest in fake cryptocurrency platforms.", topTargets: "Adults 25-55, cryptocurrency investors" },
  { rank: 7, title: "Microsoft / Windows Defender Pop-Up Alert", category: "Tech Support", reports: 7650, views: 43100, verificationRate: 97, trend: "verified", trendUp: false, summary: "Browser pop-ups displaying fake Windows security alerts with a phone number to call for 'Microsoft Support' — which connects to scammers.", topTargets: "Adults 50+" },
  { rank: 8, title: "Instagram Brand Ambassador DM Scam", category: "Social Media", reports: 7320, views: 39500, verificationRate: 93, trend: "under_review", trendUp: true, summary: "Fake brand accounts DM users offering ambassador deals for free products, ultimately asking for payment, personal info, or recruitment.", topTargets: "Instagram users ages 16-28" },
  { rank: 9, title: "Grandparent Emergency / AI Voice Clone", category: "AI & Emerging", reports: 6980, views: 37200, verificationRate: 91, trend: "high_risk", trendUp: true, summary: "Calls to grandparents claiming a grandchild is in legal or medical trouble and needs immediate financial help — increasingly using AI voice cloning.", topTargets: "Adults 60-80" },
  { rank: 10, title: "PayPal / Venmo Overpayment Scheme", category: "Financial", reports: 6410, views: 34100, verificationRate: 92, trend: "verified", trendUp: false, summary: "Seller receives overpayment and is asked to send back the difference. The original payment reverses and the seller is out both the money and the item.", topTargets: "Online sellers, marketplace users" },
  { rank: 11, title: "Fake FAFSA Verification Email", category: "Education", reports: 5890, views: 31200, verificationRate: 96, trend: "high_risk", trendUp: true, summary: "Phishing emails impersonating the Department of Education directing students to fake FAFSA sites to steal FSA IDs and personal information.", topTargets: "College students and parents" },
  { rank: 12, title: "Romance / Military Catfish Scam", category: "Relationship", reports: 5540, views: 28700, verificationRate: 89, trend: "under_review", trendUp: false, summary: "Fake military officers or overseas professionals build romantic relationships online for months before requesting money for an 'emergency.'", topTargets: "Adults 35-65, dating app users" },
  { rank: 13, title: "Social Security Number Suspended Robocall", category: "Government", reports: 5120, views: 27300, verificationRate: 98, trend: "verified", trendUp: false, summary: "Automated calls claiming the victim's Social Security number has been 'suspended' due to suspicious activity and legal action is imminent.", topTargets: "Adults 40+" },
  { rank: 14, title: "TikTok Crypto / Investment Promotion Scam", category: "Social Media", reports: 4890, views: 26100, verificationRate: 90, trend: "high_risk", trendUp: true, summary: "TikTok accounts with large followings promote fake cryptocurrency platforms or 'trading mentors' that steal invested funds.", topTargets: "TikTok users ages 16-30" },
  { rank: 15, title: "AI Deepfake Celebrity Investment Ad", category: "AI & Emerging", reports: 4230, views: 23800, verificationRate: 88, trend: "high_risk", trendUp: true, summary: "AI-generated video ads featuring deepfake versions of Elon Musk, MrBeast, and other celebrities promoting fake cryptocurrency investment platforms.", topTargets: "Social media users, crypto enthusiasts" },
];

const trendConfig = {
  high_risk: { label: "High-Risk Active", cls: "bg-red-100 text-red-700 border-red-200" },
  under_review: { label: "Under Review", cls: "bg-amber-100 text-amber-700 border-amber-200" },
  verified: { label: "Verified — Documented", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
};

const rankColors = ["text-yellow-500", "text-slate-400", "text-amber-600"];

export default function HallOfFame() {
  const [filter, setFilter] = useState("all");
  const categories = ["all", ...new Set(scamData.map(d => d.category))];
  const filtered = filter === "all" ? scamData : scamData.filter(d => d.category === filter);

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-12">
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3 border border-slate-200">
          <Database className="w-3.5 h-3.5" />
          Scam Intelligence Archive
        </div>
        <h1 className="text-2xl font-heading font-bold">Most Reported Scams</h1>
        <p className="text-sm text-muted-foreground mt-1">
          The most documented, verified, and dangerous scams in our community intelligence database
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-card border border-border/50 rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold">{scamData.reduce((a, b) => a + b.reports, 0).toLocaleString()}</p>
          <p className="text-[11px] text-muted-foreground">Total Reports</p>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold">{Math.round(scamData.reduce((a, b) => a + b.verificationRate, 0) / scamData.length)}%</p>
          <p className="text-[11px] text-muted-foreground">Avg Verification Rate</p>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold">{scamData.filter(d => d.trendUp).length}</p>
          <p className="text-[11px] text-muted-foreground">Currently Rising</p>
        </div>
      </div>

      {/* Top 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {scamData.slice(0, 3).map((scam, i) => (
          <motion.div key={scam.rank} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className={`border-0 shadow-lg ${i === 0 ? "ring-2 ring-yellow-400/40" : ""}`}>
              <CardContent className="p-4 text-center">
                <div className={`text-3xl font-black mb-1 ${rankColors[i]}`}>#{scam.rank}</div>
                <p className="text-[10px] font-semibold text-muted-foreground mb-1">Most Reported</p>
                <h3 className="font-semibold text-sm leading-snug mb-2">{scam.title}</h3>
                <Badge variant="outline" className="text-[10px] mb-3">{scam.category}</Badge>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted/40 rounded-lg p-2">
                    <p className="text-sm font-bold">{(scam.reports / 1000).toFixed(1)}k</p>
                    <p className="text-[10px] text-muted-foreground">Reports</p>
                  </div>
                  <div className="bg-muted/40 rounded-lg p-2">
                    <p className="text-sm font-bold">{scam.verificationRate}%</p>
                    <p className="text-[10px] text-muted-foreground">Verified</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {categories.map(cat => (
          <Button key={cat} variant={filter === cat ? "default" : "outline"} size="sm" className="text-xs h-8 capitalize" onClick={() => setFilter(cat)}>
            {cat}
          </Button>
        ))}
      </div>

      {/* Full list */}
      <div className="space-y-3">
        {filtered.map((scam, i) => {
          const trend = trendConfig[scam.trend] || trendConfig.verified;
          return (
            <motion.div key={scam.rank} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 text-sm font-bold text-muted-foreground">
                      {scam.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-sm leading-snug">{scam.title}</h3>
                        <Badge className={`text-[10px] border shrink-0 ${trend.cls}`}>{trend.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{scam.summary}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <Badge variant="outline" className="text-[10px]">{scam.category}</Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1"><ShieldAlert className="w-3 h-3" />{scam.reports.toLocaleString()} reports</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Eye className="w-3 h-3" />{scam.views.toLocaleString()} views</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" />{scam.verificationRate}% verified</span>
                        {scam.trendUp && <span className="text-[10px] text-red-500 flex items-center gap-0.5"><ArrowUp className="w-3 h-3" />Rising</span>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}