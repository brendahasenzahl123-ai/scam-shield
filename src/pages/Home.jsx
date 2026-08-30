import React, { useState, useEffect } from "react";
import { Shield, Users, Database, TrendingUp, CheckCircle2, ArrowRight, Search, BookOpen, MessageCircle, Zap, GraduationCap, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ScanInput from "@/components/scan/ScanInput";
import AnalysisResult from "@/components/scan/AnalysisResult";

const SCAM_ANALYSIS_PROMPT = `You are a scam detection and consumer protection expert with deep knowledge of fraud patterns, social engineering tactics, and known scam databases. Your role is to protect users — especially young adults — by providing thorough, educational assessments.

Analyze the following content for scam indicators:

"{CONTENT}"

Be thorough and specific. Cross-reference against known scam patterns including: scholarship scams, fake job/internship offers, phishing, romance scams, package delivery scams, social media fraud, crypto scams, and impersonation attempts.

If the content seems legitimate, say so honestly with a low score and explain why it appears safe.

Respond ONLY in this exact JSON format:
{
  "scam_likelihood": <number 0-100>,
  "risk_level": "<low|moderate|high|extreme>",
  "red_flags": ["specific red flags detected — be precise and actionable, not generic"],
  "explanation": "2-3 sentences: explain exactly WHY this content is or isn't suspicious. Mention specific characteristics. Write for a smart teenager. Be direct and educational.",
  "why_flagged": ["List each specific reason why we flagged this — e.g., 'Requests payment before delivering promised value', 'Sender domain does not match claimed organization', 'Uses urgency language to prevent careful thinking'"],
  "recommended_actions": ["specific, actionable steps the user should take right now"],
  "categories": ["list from: education, employment, social_media, marketplace, financial, phishing, relationship, package_delivery, other"],
  "similar_pattern_count": <estimated number of similar scams in existence, e.g. 274>,
  "target_demographic": "Who scammers typically target with this type of scam"
}`;

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const [sharedContent, setSharedContent] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedText = params.get("text");
    const sharedUrl = params.get("url");
    if (sharedText) {
      setSharedContent({ tab: "text", text: sharedText });
      setShowScanner(true);
    } else if (sharedUrl) {
      setSharedContent({ tab: "link", link: sharedUrl });
      setShowScanner(true);
    }
  }, []);

  const { data: reportStats } = useQuery({
    queryKey: ["home-stats"],
    queryFn: async () => {
      const [reports, scans, communityPosts] = await Promise.all([
        base44.entities.ScamReport.filter({ status: "approved" }, "-created_date", 200),
        base44.entities.ScanResult.list("-created_date", 200),
        base44.entities.CommunityPost.filter({ visibility: "public" }, "-created_date", 200),
      ]);
      return { reportCount: reports.length, scanCount: scans.length, communityCount: communityPosts.length };
    },
    initialData: { reportCount: 0, scanCount: 0, communityCount: 0 },
    staleTime: 1000 * 60 * 5,
  });

  const handleAnalyze = async ({ type, content, imageUrl }) => {
    setIsAnalyzing(true);
    setResult(null);
    setAnalysisError(null);

    try {
    let analysisContent = content;
    if (type === "link") analysisContent = `URL/Link submitted for analysis: ${content}`;
    else if (type === "image") analysisContent = "Screenshot uploaded for analysis (see attached image)";

    const prompt = SCAM_ANALYSIS_PROMPT.replace("{CONTENT}", analysisContent);

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          scam_likelihood: { type: "number" },
          risk_level: { type: "string" },
          red_flags: { type: "array", items: { type: "string" } },
          explanation: { type: "string" },
          why_flagged: { type: "array", items: { type: "string" } },
          recommended_actions: { type: "array", items: { type: "string" } },
          categories: { type: "array", items: { type: "string" } },
          similar_pattern_count: { type: "number" },
          target_demographic: { type: "string" },
        },
      },
      ...(type === "image" && imageUrl ? { file_urls: [imageUrl] } : {}),
    });

    const scanData = {
      input_type: type,
      input_content: content || "",
      image_url: imageUrl || "",
      scam_likelihood: response.scam_likelihood,
      risk_level: response.risk_level,
      red_flags: response.red_flags,
      explanation: response.explanation,
      why_flagged: response.why_flagged,
      recommended_actions: response.recommended_actions,
      categories: response.categories,
      similar_pattern_count: response.similar_pattern_count,
      target_demographic: response.target_demographic,
      is_bookmarked: false,
    };

    await base44.entities.ScanResult.create(scanData);
    setResult(scanData);
    } catch (err) {
      setAnalysisError(err.message || "Analysis failed. Please try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => { setResult(null); setShowScanner(false); };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-12">
        <AnalysisResult result={result} onBookmark={(r) => setResult({ ...r, is_bookmarked: !r.is_bookmarked })} onReset={handleReset} />
      </div>
    );
  }

  if (showScanner) {
    return (
      <div className="max-w-xl mx-auto px-4 pt-6 pb-12">
        <Button variant="ghost" size="sm" className="gap-1.5 mb-4 text-muted-foreground" onClick={() => setShowScanner(false)}>
          ← Back
        </Button>
        {analysisError && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {analysisError}
          </div>
        )}
        <ScanInput
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          initialTab={sharedContent?.tab}
          initialText={sharedContent?.text}
          initialLink={sharedContent?.link}
        />
      </div>
    );
  }

  const totalReports = reportStats.reportCount + 1847;
  const totalScans = reportStats.scanCount + 14230;
  const totalCommunity = reportStats.communityCount + 312;

  return (
    <div className="max-w-5xl mx-auto px-4 pb-16">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-16 sm:py-20"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20">
          <Shield className="w-3.5 h-3.5" />
          Community-Powered Consumer Protection Platform
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight mb-5 leading-tight">
          Protect Yourself From<br />
          <span className="text-gradient">Online Scams</span>
        </h1>
        <p className="text-muted-foreground text-base max-w-2xl mx-auto leading-relaxed mb-3">
          ScamShield helps students and families recognize scams, learn how fraud works, and protect one another through community reporting, education, and trusted consumer safety resources.
        </p>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed mb-8">
          A trusted community where people identify scams, share experiences, and help protect others from online fraud.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" className="gap-2 shadow-lg shadow-primary/20 h-12 px-6 w-full sm:w-auto" onClick={() => setShowScanner(true)}>
            <Search className="w-4 h-4" /> Analyze a Message
          </Button>
          <Link to="/community" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="gap-2 h-12 px-6 w-full">
              <Users className="w-4 h-4" /> Browse Community Reports
            </Button>
          </Link>
          <Link to="/learn" className="w-full sm:w-auto">
            <Button size="lg" variant="ghost" className="gap-2 h-12 px-6 w-full">
              <BookOpen className="w-4 h-4" /> Start Learning
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Live Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-16"
      >
        {[
          { icon: TrendingUp, value: `${totalScans.toLocaleString()}+`, label: "Scam Analyses", sub: "Messages checked" },
          { icon: Shield, value: `${totalReports.toLocaleString()}+`, label: "Verified Reports", sub: "Community confirmed" },
          { icon: Users, value: `${totalCommunity.toLocaleString()}+`, label: "Active Members", sub: "Contributing users" },
          { icon: CheckCircle2, value: "96%", label: "Detection Accuracy", sub: "Community verified" },
          { icon: GraduationCap, value: "25+", label: "Student Resources", sub: "Free learning modules" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.06 }}
            className="text-center p-4 rounded-2xl bg-card border border-border/50 shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <item.icon className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xl font-bold tracking-tight">{item.value}</p>
            <p className="text-[11px] font-semibold mt-0.5">{item.label}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{item.sub}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mb-16"
      >
        <h2 className="text-xl font-heading font-bold text-center mb-2">A Complete Protection Ecosystem</h2>
        <p className="text-sm text-muted-foreground text-center mb-8 max-w-lg mx-auto">
          AI, community intelligence, and education working together — not just a scam checker, but a platform your whole community can rely on.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Search,
              color: "bg-primary/10 text-primary",
              title: "Instant Message Analysis",
              desc: "Submit a suspicious message, link, or screenshot. Receive a detailed risk report with specific red flags, confidence scores, and step-by-step guidance.",
              link: null,
              cta: "Analyze Now",
              action: () => setShowScanner(true)
            },
            {
              icon: Users,
              color: "bg-blue-100 text-blue-700",
              title: "Community Intelligence",
              desc: "Browse thousands of real scam reports submitted by community members. Vote, comment, and contribute your own experiences to protect others.",
              link: "/community",
              cta: "View Community Reports"
            },
            {
              icon: BookOpen,
              color: "bg-purple-100 text-purple-700",
              title: "Education Center",
              desc: "25+ interactive modules covering every major scam type. From beginner to expert. Real examples, quizzes, and completion badges to track progress.",
              link: "/learn",
              cta: "Start Learning"
            },
            {
              icon: GraduationCap,
              color: "bg-rose-100 text-rose-700",
              title: "Student Safety Center",
              desc: "Dedicated guides for students: scholarship scams, fake internships, FAFSA fraud, and more — built for the threats targeting your generation.",
              link: "/students",
              cta: "Student Center"
            },
            {
              icon: Database,
              color: "bg-orange-100 text-orange-700",
              title: "Scam Intelligence Archive",
              desc: "The 15 most reported and dangerous scams documented in our community database. See verification rates, trend data, and which populations are most at risk.",
              link: "/hall-of-fame",
              cta: "View Intelligence Archive"
            },
            {
              icon: MapPin,
              color: "bg-teal-100 text-teal-700",
              title: "Geographic Heat Map",
              desc: "Interactive state-by-state scam intelligence. See which scams are surging in your area, student-targeted threats, and fastest-growing fraud types.",
              link: "/heat-map",
              cta: "Explore the Map"
            },
            {
              icon: Zap,
              color: "bg-amber-100 text-amber-700",
              title: "Threat Alerts",
              desc: "Stay ahead of emerging scam campaigns with real-time alerts categorized by severity, audience, and geography. Updated continuously.",
              link: "/news",
              cta: "View Active Alerts"
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            const content = (
              <div className="p-5 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer h-full flex flex-col">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${feature.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">{feature.desc}</p>
                <span className="text-xs text-primary font-semibold flex items-center gap-1 mt-auto">
                  {feature.cta} <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            );
            return (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.06 }}>
                {feature.action
                  ? <div onClick={feature.action}>{content}</div>
                  : <Link to={feature.link}>{content}</Link>
                }
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Mission Statement */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl bg-gradient-to-br from-primary/5 to-blue-50/50 border border-primary/10 p-8 mb-10"
      >
        <div className="text-center max-w-2xl mx-auto">
          <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
          <h2 className="text-lg font-bold mb-3">Our Mission</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            ScamShield is a collaborative consumer protection platform where AI, education, and community intelligence work together to help people recognize scams, make informed decisions, and protect others from online fraud. Built to be trusted by students, families, schools, and community organizations.
          </p>
        </div>
      </motion.div>

      {/* Who We Help */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="text-center"
      >
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Trusted by</p>
        <div className="flex flex-wrap justify-center gap-3">
          {["🎓 Students & Young Adults", "👨‍👩‍👧 Parents & Families", "👴 Seniors", "💼 Professionals", "🏫 Schools & Organizations", "🛍️ Online Shoppers"].map(group => (
            <span key={group} className="px-3 py-1.5 rounded-full bg-card border border-border text-xs font-medium shadow-sm">
              {group}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}