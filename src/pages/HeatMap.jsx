import React, { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, GraduationCap, X, ArrowUp, Users, Shield, Flame, BookOpen } from "lucide-react";
import USChoroplethMap from "@/components/map/USChoroplethMap";
import { Link } from "react-router-dom";

const STATE_DATA = {
  AL: { name: "Alabama", reports: 820, topScam: "IRS Impersonation", studentScam: "Fake Scholarship", trending: "USPS Delivery Scam", categories: ["Financial", "Government", "Delivery", "Employment", "Social Media"], fastestGrowing: "AI Voice Clone", recentReports: ["Resident received fake IRS arrest threat via robocall", "University student targeted by fake scholarship email"] },
  AK: { name: "Alaska", reports: 310, topScam: "Tech Support Scam", studentScam: "Fake Remote Job", trending: "Crypto Investment", categories: ["Tech Support", "Financial", "Employment", "Social Media", "Delivery"], fastestGrowing: "Crypto Investment", recentReports: ["Pop-up Microsoft security alert reported in Anchorage", "Fake remote job offer targeting UAA students"] },
  AZ: { name: "Arizona", reports: 1420, topScam: "Lottery / Prize Scam", studentScam: "Fake Scholarship", trending: "Fake FAFSA Email", categories: ["Financial", "Education", "Delivery", "Romance", "Social Media"], fastestGrowing: "Fake FAFSA Email", recentReports: ["Lottery scam text wave reported in Phoenix metro area", "ASU student received fake scholarship winner notification"] },
  AR: { name: "Arkansas", reports: 640, topScam: "Package Delivery Scam", studentScam: "Fake Job Offer", trending: "IRS Text Scam", categories: ["Delivery", "Employment", "Financial", "Social Media", "Tech Support"], fastestGrowing: "IRS Text Scam", recentReports: ["USPS phishing texts reported across multiple cities", "Fake work-from-home offer targeting UA students"] },
  CA: { name: "California", reports: 4820, topScam: "Crypto Investment Scam", studentScam: "Fake Internship", trending: "AI Deepfake Ad", categories: ["Financial", "Employment", "Social Media", "AI & Tech", "Delivery"], fastestGrowing: "AI Deepfake Ad", recentReports: ["TikTok crypto giveaway scam targeting LA-area college students", "Fake Google internship offer circulating on LinkedIn", "Instagram brand ambassador DM wave hitting Bay Area influencers"] },
  CO: { name: "Colorado", reports: 1290, topScam: "Crypto Investment", studentScam: "Fake Job", trending: "Discord Nitro Scam", categories: ["Financial", "Social Media", "Employment", "Gaming", "Education"], fastestGrowing: "AI Voice Clone", recentReports: ["Crypto pig-butchering scam reported by Denver residents", "CU Boulder students targeted by fake research assistant offers"] },
  CT: { name: "Connecticut", reports: 940, topScam: "Phishing Emails", studentScam: "Fake Financial Aid", trending: "PayPal Scam", categories: ["Phishing", "Financial", "Education", "Social Media", "Delivery"], fastestGrowing: "PayPal Phishing", recentReports: ["Yale and UConn students report fake financial aid emails", "PayPal account verification phishing wave across Fairfield County"] },
  DE: { name: "Delaware", reports: 380, topScam: "Social Security Scam", studentScam: "Fake Campus Job", trending: "Bank Smishing", categories: ["Government", "Financial", "Employment", "Delivery", "Tech Support"], fastestGrowing: "Bank Smishing", recentReports: ["Social Security suspension robocall reported statewide", "UD students targeted by fake on-campus job scam"] },
  DC: { name: "Washington D.C.", reports: 920, topScam: "Government Impersonation", studentScam: "Fake Federal Internship", trending: "LinkedIn Fake Job", categories: ["Government", "Employment", "Financial", "Social Media", "Phishing"], fastestGrowing: "LinkedIn Fake Federal Job", recentReports: ["Government agency impersonation scam targeting DC-area residents", "Georgetown and AU students targeted by fake congressional internship offers"] },
  FL: { name: "Florida", reports: 3610, topScam: "Medicare Fraud", studentScam: "FAFSA Scam", trending: "Grandparent Scam", categories: ["Healthcare", "Education", "Romance", "Financial", "Delivery"], fastestGrowing: "AI Voice Clone", recentReports: ["Medicare supplement scam calls flooding South Florida seniors", "UCF and FSU students report FAFSA phishing emails", "AI voice grandparent scam reported in Sarasota and Naples"] },
  GA: { name: "Georgia", reports: 1760, topScam: "Social Media Fraud", studentScam: "Fake Study Abroad", trending: "Instagram DM Scam", categories: ["Social Media", "Education", "Employment", "Financial", "Delivery"], fastestGrowing: "Instagram DM Scam", recentReports: ["Instagram brand ambassador scams targeting Georgia Tech students", "Fake study abroad scholarship targeting Spelman College applicants"] },
  HI: { name: "Hawaii", reports: 490, topScam: "Romance Scam", studentScam: "Fake Research Job", trending: "Vacation Rental Scam", categories: ["Romance", "Employment", "Financial", "Social Media", "Delivery"], fastestGrowing: "Vacation Rental Scam", recentReports: ["Military romance scam targeting UH Manoa students", "Fake vacation rental listings targeting tourists and students"] },
  ID: { name: "Idaho", reports: 520, topScam: "Tech Support", studentScam: "Fake Scholarship", trending: "IRS Threat Call", categories: ["Tech Support", "Education", "Financial", "Government", "Employment"], fastestGrowing: "Crypto Investment", recentReports: ["Microsoft pop-up scam reported in Boise area", "Boise State students receive fake National Merit scholarship notifications"] },
  IL: { name: "Illinois", reports: 2050, topScam: "Romance Scam", studentScam: "Fake Ambassador", trending: "Crypto Pump-Dump", categories: ["Romance", "Social Media", "Financial", "Employment", "Phishing"], fastestGrowing: "Crypto Pump-Dump Discord", recentReports: ["Pig-butchering romance scam reported by Chicago-area victims", "UIC and DePaul students targeted by fake brand ambassador offers"] },
  IN: { name: "Indiana", reports: 980, topScam: "Tech Support", studentScam: "Fake Tutoring Job", trending: "Gift Card Scam", categories: ["Tech Support", "Employment", "Financial", "Delivery", "Social Media"], fastestGrowing: "Utility Shutoff Scam", recentReports: ["Tech support pop-up scam hitting Indianapolis senior residents", "Purdue and IU students report fake tutoring job offers requiring upfront fees"] },
  IA: { name: "Iowa", reports: 710, topScam: "Package Delivery", studentScam: "Fake Research", trending: "USPS Smishing", categories: ["Delivery", "Employment", "Financial", "Government", "Social Media"], fastestGrowing: "USPS Smishing", recentReports: ["USPS fake delivery text reported across Des Moines metro", "UI students targeted by fake research assistant position offering high pay"] },
  KS: { name: "Kansas", reports: 630, topScam: "IRS Impersonation", studentScam: "Fake Scholarship", trending: "Bank Fraud Call", categories: ["Government", "Education", "Financial", "Tech Support", "Delivery"], fastestGrowing: "Bank Fraud Call Scam", recentReports: ["IRS arrest threat calls targeting Wichita residents", "KU students receive fake scholarship winner emails from unknown foundations"] },
  KY: { name: "Kentucky", reports: 750, topScam: "Romance Scam", studentScam: "Fake Job Offer", trending: "Grandparent Scam", categories: ["Romance", "Employment", "Financial", "Delivery", "Social Media"], fastestGrowing: "Grandparent AI Clone Scam", recentReports: ["Military catfish romance scam reported by Louisville residents", "UK students targeted by fake remote job offers requiring equipment purchase"] },
  LA: { name: "Louisiana", reports: 860, topScam: "Social Media Fraud", studentScam: "Fake FAFSA", trending: "Instagram Scam", categories: ["Social Media", "Education", "Financial", "Employment", "Delivery"], fastestGrowing: "Instagram DM Scam", recentReports: ["Instagram brand ambassador DM scam hitting LSU and Tulane students", "Fake FAFSA verification emails circulating among Louisiana college students"] },
  ME: { name: "Maine", reports: 410, topScam: "Package Delivery", studentScam: "Fake Campus Job", trending: "Amazon Scam", categories: ["Delivery", "Employment", "Financial", "Tech Support", "Social Media"], fastestGrowing: "Amazon Refund Scam", recentReports: ["Amazon refund overpayment scam targeting Portland area seniors", "UMaine students report fake on-campus job listings"] },
  MD: { name: "Maryland", reports: 1180, topScam: "Government Impersonation", studentScam: "Fake Internship", trending: "Social Security Scam", categories: ["Government", "Employment", "Financial", "Education", "Social Media"], fastestGrowing: "Social Security Scam", recentReports: ["Social Security suspension robocall wave in Baltimore/DC metro area", "UMD and UMBC students targeted by fake federal internship offers"] },
  MA: { name: "Massachusetts", reports: 1240, topScam: "Phishing Emails", studentScam: "FAFSA Scam", trending: "Fake College Acceptance", categories: ["Phishing", "Education", "Financial", "Social Media", "Employment"], fastestGrowing: "Fake College Acceptance Email", recentReports: ["Harvard, MIT, and BU students targeted by phishing impersonating financial aid offices", "Fake college acceptance emails tricking HS seniors into paying fake deposits"] },
  MI: { name: "Michigan", reports: 1620, topScam: "Gift Card Scam", studentScam: "Fake Competition", trending: "Tech Support Scam", categories: ["Financial", "Tech Support", "Social Media", "Delivery", "Employment"], fastestGrowing: "Zelle Reversal Scam", recentReports: ["Gift card draining scam reported across Metro Detroit retail stores", "UM and MSU students report fake research competition with entry fees"] },
  MN: { name: "Minnesota", reports: 1120, topScam: "Romance Scam", studentScam: "Fake Research", trending: "Crypto Investment", categories: ["Romance", "Financial", "Employment", "Social Media", "Education"], fastestGrowing: "Crypto Investment Pig Butchering", recentReports: ["Pig-butchering crypto romance scam reported in Minneapolis area", "UMN students targeted by fake paid research opportunities requiring SSN"] },
  MS: { name: "Mississippi", reports: 510, topScam: "IRS Impersonation", studentScam: "Fake Scholarship", trending: "Package Delivery Scam", categories: ["Government", "Education", "Delivery", "Financial", "Social Media"], fastestGrowing: "USPS Smishing", recentReports: ["IRS arrest threat calls targeting Jackson-area residents", "Ole Miss and JSU students report fake scholarship notifications requiring fees"] },
  MO: { name: "Missouri", reports: 950, topScam: "Package Delivery", studentScam: "Fake Ambassador", trending: "Facebook Marketplace Scam", categories: ["Delivery", "Social Media", "Financial", "Employment", "Tech Support"], fastestGrowing: "Facebook Marketplace Overpayment", recentReports: ["USPS smishing texts widespread in St. Louis and Kansas City", "Mizzou students targeted by fake brand ambassador programs"] },
  MT: { name: "Montana", reports: 320, topScam: "Tech Support", studentScam: "Fake Remote Job", trending: "IRS Call Scam", categories: ["Tech Support", "Employment", "Financial", "Government", "Delivery"], fastestGrowing: "Fake Remote Job", recentReports: ["Microsoft tech support pop-up scam reported in Billings", "UM students targeted by fake high-paying remote work offers"] },
  NE: { name: "Nebraska", reports: 580, topScam: "Package Delivery", studentScam: "Fake Scholarship", trending: "Amazon Scam", categories: ["Delivery", "Education", "Financial", "Social Media", "Employment"], fastestGrowing: "Student Loan Forgiveness Scam", recentReports: ["Amazon delivery notification phishing texts reported across Omaha", "UNL students targeted by student loan forgiveness scammers"] },
  NV: { name: "Nevada", reports: 1090, topScam: "Lottery / Prize Scam", studentScam: "Fake Job Offer", trending: "Crypto Investment", categories: ["Financial", "Employment", "Social Media", "Gambling", "Romance"], fastestGrowing: "Crypto Pump-Dump", recentReports: ["Lottery prize scams widespread in Las Vegas area", "UNLV students receiving fake high-paying remote job offers"] },
  NH: { name: "New Hampshire", reports: 440, topScam: "Phishing Emails", studentScam: "Fake Financial Aid", trending: "Bank Smishing", categories: ["Phishing", "Financial", "Education", "Delivery", "Social Media"], fastestGrowing: "Bank Smishing", recentReports: ["Bank account security text scam reported in Manchester", "UNH students targeted by fake financial aid verification emails"] },
  NJ: { name: "New Jersey", reports: 1080, topScam: "Phishing Emails", studentScam: "Fake Job Offer", trending: "EZPass Toll Scam", categories: ["Phishing", "Employment", "Financial", "Delivery", "Social Media"], fastestGrowing: "Fake Toll Road Text", recentReports: ["EZPass toll payment scam texts flooding NJ residents", "Rutgers and Montclair State students report fake internship offers"] },
  NM: { name: "New Mexico", reports: 560, topScam: "IRS Impersonation", studentScam: "Fake Research Job", trending: "Medicare Fraud", categories: ["Government", "Healthcare", "Financial", "Education", "Delivery"], fastestGrowing: "Medicare Supplement Scam", recentReports: ["IRS threat calls targeting Albuquerque and Santa Fe residents", "UNM students targeted by fake paid research positions"] },
  NY: { name: "New York", reports: 3280, topScam: "Phishing Emails", studentScam: "Fake Job Offer", trending: "Deepfake Investment Ad", categories: ["Phishing", "Employment", "Financial", "Social Media", "AI & Tech"], fastestGrowing: "AI Deepfake Investment Ad", recentReports: ["Deepfake celebrity investment ads targeting NYC social media users", "NYU and Columbia students report fake summer internship LinkedIn scams"] },
  NC: { name: "North Carolina", reports: 1540, topScam: "Grandparent Scam", studentScam: "Fake Admissions", trending: "AI Voice Clone", categories: ["Family", "Education", "AI & Tech", "Financial", "Social Media"], fastestGrowing: "AI Voice Grandparent Clone", recentReports: ["AI voice cloning grandparent scam reported in Raleigh-Durham area", "UNC and Duke students targeted by fake college admissions consultants"] },
  ND: { name: "North Dakota", reports: 290, topScam: "Package Delivery", studentScam: "Fake Remote Job", trending: "IRS Threat Call", categories: ["Delivery", "Employment", "Financial", "Government", "Tech Support"], fastestGrowing: "Fake Remote Job", recentReports: ["USPS delivery phishing texts reported in Fargo", "NDSU students targeted by fake work-from-home offers"] },
  OH: { name: "Ohio", reports: 1890, topScam: "Package Delivery", studentScam: "Fake Research Job", trending: "Zelle Scam", categories: ["Delivery", "Employment", "Financial", "Social Media", "Tech Support"], fastestGrowing: "Zelle Payment Reversal", recentReports: ["USPS package notification scam texts widespread across Ohio", "OSU students targeted by fake paid research opportunities"] },
  OK: { name: "Oklahoma", reports: 690, topScam: "IRS Impersonation", studentScam: "Fake Scholarship", trending: "Package Delivery Scam", categories: ["Government", "Education", "Delivery", "Financial", "Social Media"], fastestGrowing: "USPS Smishing", recentReports: ["IRS arrest threat calls targeting Oklahoma City residents", "OU and OSU students report fake scholarship awards requiring processing fees"] },
  OR: { name: "Oregon", reports: 1020, topScam: "Crypto Investment", studentScam: "Fake Internship", trending: "Discord Nitro Scam", categories: ["Financial", "Employment", "Social Media", "Gaming", "Tech Support"], fastestGrowing: "Crypto Investment Scam", recentReports: ["Pig-butchering crypto scam reported by Portland-area victims", "U of Oregon students targeted by fake tech company internship offers"] },
  PA: { name: "Pennsylvania", reports: 2190, topScam: "Tech Support", studentScam: "Fake Tutoring Job", trending: "Grandparent Scam", categories: ["Tech Support", "Employment", "Family", "Financial", "Phishing"], fastestGrowing: "Grandparent Emergency Scam", recentReports: ["Microsoft support pop-up scam targeting Philadelphia area seniors", "Penn State and Pitt students targeted by fake tutoring platform jobs"] },
  RI: { name: "Rhode Island", reports: 350, topScam: "Phishing Emails", studentScam: "Fake Financial Aid", trending: "Bank Smishing", categories: ["Phishing", "Financial", "Education", "Delivery", "Social Media"], fastestGrowing: "Bank Smishing", recentReports: ["Bank account phishing texts targeting Providence residents", "Brown and URI students report fake financial aid emails"] },
  SC: { name: "South Carolina", reports: 810, topScam: "Romance Scam", studentScam: "Fake Campus Job", trending: "Lottery Scam", categories: ["Romance", "Employment", "Financial", "Social Media", "Delivery"], fastestGrowing: "Prize Lottery Scam", recentReports: ["Military romance scam targeting USC and Clemson students", "Lottery prize mail scam targeting Greenville and Columbia area seniors"] },
  SD: { name: "South Dakota", reports: 280, topScam: "Package Delivery", studentScam: "Fake Scholarship", trending: "IRS Robocall", categories: ["Delivery", "Education", "Government", "Financial", "Tech Support"], fastestGrowing: "IRS Robocall", recentReports: ["USPS delivery scam texts reported across Sioux Falls", "SDSU students targeted by fake scholarship notification emails"] },
  TN: { name: "Tennessee", reports: 1190, topScam: "IRS Impersonation", studentScam: "Fake Scholarship", trending: "Grandparent Scam", categories: ["Government", "Education", "Family", "Financial", "Delivery"], fastestGrowing: "Grandparent AI Clone", recentReports: ["IRS impersonation calls targeting Nashville and Memphis residents", "Vanderbilt and UT students targeted by fake scholarship programs"] },
  TX: { name: "Texas", reports: 3940, topScam: "IRS Impersonation", studentScam: "Fake Scholarship", trending: "Fake Toll Road Text", categories: ["Government", "Education", "Delivery", "Financial", "Social Media"], fastestGrowing: "Fake Toll Road Text (TxTag)", recentReports: ["TxTag/TollTag fake text scam flooding Texas phone numbers", "UT Austin and A&M students targeted by fake scholarship winner notifications", "LinkedIn fake tech internship scam targeting DFW-area college students"] },
  UT: { name: "Utah", reports: 890, topScam: "Crypto Investment", studentScam: "Fake Remote Job", trending: "Romance Scam", categories: ["Financial", "Employment", "Romance", "Social Media", "Tech Support"], fastestGrowing: "Crypto Investment", recentReports: ["Crypto investment scam targeting Utah tech community members", "BYU and UofU students targeted by fake high-paying remote work offers"] },
  VT: { name: "Vermont", reports: 290, topScam: "Package Delivery", studentScam: "Fake Financial Aid", trending: "IRS Scam", categories: ["Delivery", "Education", "Financial", "Government", "Social Media"], fastestGrowing: "IRS Text Scam", recentReports: ["USPS delivery notification scam texts reported in Burlington", "UVM students targeted by fake financial aid review emails"] },
  VA: { name: "Virginia", reports: 1040, topScam: "Social Security Scam", studentScam: "Fake Admissions", trending: "LinkedIn Fake Job", categories: ["Government", "Employment", "Education", "Financial", "Social Media"], fastestGrowing: "LinkedIn Fake Job", recentReports: ["Social Security suspension robocall targeting Northern VA seniors", "UVA and George Mason students targeted by fake federal job offers"] },
  WA: { name: "Washington", reports: 1380, topScam: "AI Voice Clone", studentScam: "Fake Internship", trending: "Deepfake Investment Ad", categories: ["AI & Tech", "Employment", "Financial", "Social Media", "Phishing"], fastestGrowing: "AI Deepfake Ad", recentReports: ["AI voice cloning scam targeting King County residents", "UW and WSU students report fake Amazon and Microsoft internship phishing"] },
  WV: { name: "West Virginia", reports: 380, topScam: "IRS Impersonation", studentScam: "Fake Scholarship", trending: "Medicare Fraud", categories: ["Government", "Education", "Healthcare", "Financial", "Delivery"], fastestGrowing: "Medicare Supplement Scam", recentReports: ["IRS arrest threat calls targeting Charleston and Huntington residents", "WVU students receive fake scholarship award notifications requiring fees"] },
  WI: { name: "Wisconsin", reports: 1050, topScam: "Package Delivery", studentScam: "Fake Research", trending: "Grandparent Scam", categories: ["Delivery", "Employment", "Family", "Financial", "Social Media"], fastestGrowing: "Grandparent Emergency Scam", recentReports: ["USPS delivery scam texts widespread across Milwaukee and Madison", "UW-Madison students targeted by fake paid research studies requiring SSN"] },
  WY: { name: "Wyoming", reports: 210, topScam: "Tech Support", studentScam: "Fake Remote Job", trending: "IRS Robocall", categories: ["Tech Support", "Employment", "Financial", "Government", "Delivery"], fastestGrowing: "IRS Robocall", recentReports: ["Tech support pop-up scam reported in Cheyenne", "UW students targeted by fake remote job listings requiring equipment purchase"] },
};

const LEARNING_MODULES = {
  "Scholarship": { label: "Scholarship Scam Guide", link: "/learn" },
  "Employment": { label: "Fake Job Offer Guide", link: "/learn" },
  "Financial": { label: "Financial Fraud Protection", link: "/learn" },
  "Phishing": { label: "Phishing Detection 101", link: "/learn" },
  "Social Media": { label: "Social Media Safety", link: "/learn" },
  "AI & Tech": { label: "AI Scam Awareness", link: "/learn" },
  "Romance": { label: "Romance Scam Warning Signs", link: "/learn" },
  "Delivery": { label: "Package Scam Awareness", link: "/learn" },
  "Government": { label: "Government Impersonation Guide", link: "/learn" },
  "Family": { label: "Grandparent Scam Alert", link: "/learn" },
  "Healthcare": { label: "Medicare Fraud Prevention", link: "/learn" },
};

export default function HeatMap() {
  const [selectedState, setSelectedState] = useState(null);

  const handleStateClick = (abbr) => {
    setSelectedState(prev => prev === abbr ? null : abbr);
  };

  const data = selectedState ? STATE_DATA[selectedState] : null;

  // Pick up to 3 relevant learning modules for selected state
  const modules = data
    ? data.categories.slice(0, 3).map(c => LEARNING_MODULES[c]).filter(Boolean)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 pt-6 pb-12">
      <div className="mb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold mb-3 border border-orange-100">
          <MapPin className="w-3.5 h-3.5" />
          Geographic Threat Intelligence
        </div>
        <h1 className="text-2xl font-heading font-bold">Scam Heat Map</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Hover over any state to preview threat data. Click to open the full intelligence panel.
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-5">
        {/* Map */}
        <div className="flex-1 min-w-0">
          <USChoroplethMap
            stateData={STATE_DATA}
            onStateClick={handleStateClick}
            selectedState={selectedState}
          />
        </div>

        {/* Side Panel */}
        <div className="w-full xl:w-80 space-y-4 shrink-0">
          {data ? (
            <motion.div key={selectedState} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-bold text-lg">{data.name}</h2>
                  <p className="text-xs text-muted-foreground">{data.reports.toLocaleString()} community reports</p>
                </div>
                <button onClick={() => setSelectedState(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-red-600 mb-0.5">Most Reported Scam</p>
                  <p className="text-sm font-bold text-red-700">{data.topScam}</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600 mb-0.5 flex items-center gap-1"><GraduationCap className="w-3 h-3" /> Student-Targeted</p>
                  <p className="text-sm font-bold text-blue-700">{data.studentScam}</p>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 mb-0.5 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Trending This Month</p>
                  <p className="text-sm font-bold text-amber-700">{data.trending}</p>
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-orange-600 mb-0.5 flex items-center gap-1"><Flame className="w-3 h-3" /> Fastest Growing</p>
                  <p className="text-sm font-bold text-orange-700">{data.fastestGrowing}</p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Top Categories</p>
                  <div className="flex flex-wrap gap-1">
                    {data.categories.map((cat, i) => (
                      <Badge key={i} variant="outline" className="text-[10px]">{cat}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 flex items-center gap-1"><Users className="w-3 h-3" /> Recent Community Reports</p>
                  <div className="space-y-1.5">
                    {data.recentReports.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px]">
                        <Shield className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {modules.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 flex items-center gap-1"><BookOpen className="w-3 h-3" /> Recommended Learning</p>
                    <div className="space-y-1.5">
                      {modules.map((m, i) => (
                        <Link key={i} to={m.link} className="flex items-center gap-2 text-[11px] text-primary font-medium hover:underline">
                          <BookOpen className="w-3 h-3 shrink-0" /> {m.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm text-center">
              <MapPin className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-semibold mb-1">Select a State</p>
              <p className="text-xs text-muted-foreground">Click any state on the map to view detailed scam intelligence.</p>
            </div>
          )}

          {/* Fastest growing nationally */}
          <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-semibold mb-3 flex items-center gap-1.5"><ArrowUp className="w-3.5 h-3.5 text-red-500" /> Fastest Growing Nationally</p>
            <div className="space-y-2">
              {[
                { name: "AI Voice Clone Scam", pct: "+34%" },
                { name: "Fake FAFSA Verification", pct: "+28%" },
                { name: "Fake Toll Road Texts", pct: "+22%" },
                { name: "Discord Nitro Phishing", pct: "+19%" },
                { name: "Deepfake Investment Ads", pct: "+17%" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-muted-foreground truncate">{item.name}</span>
                  <span className="text-[11px] font-bold text-red-500 shrink-0">{item.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}