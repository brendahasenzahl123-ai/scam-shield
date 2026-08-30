import React, { useState, useEffect } from "react";
import { Shield, Users, Search, BookOpen, ArrowRight, Camera, MessageCircle, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
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

  const features = [
    {
      icon: Search,
      color: "bg-primary/10 text-primary",
      title: "Scan a Message",
      desc: "Paste a suspicious text, link, or screenshot. ScamShield analyzes it for red flags and explains what it finds.",
      cta: "Analyze a Message",
      action: () => setShowScanner(true),
    },
    {
      icon: MessageCircle,
      color: "bg-blue-100 text-blue-700",
      title: "Community Reports",
      desc: "Browse scam reports shared by other users, or share a scam you've seen to warn others. Reports are moderated for safety.",
      link: "/community",
      cta: "Browse Reports",
    },
    {
      icon: BookOpen,
      color: "bg-purple-100 text-purple-700",
      title: "Learn the Warning Signs",
      desc: "Short, clear guides on the most common scams — scholarships, jobs, impersonation, marketplace, phishing, and social media.",
      link: "/learn",
      cta: "Start Learning",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 pb-16">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-14 sm:py-20"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20">
          <Shield className="w-3.5 h-3.5" />
          Scam Awareness & Reporting
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight mb-5 leading-tight">
          Spot Scams.<br />
          <span className="text-gradient">Protect Each Other.</span>
        </h1>
        <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed mb-8">
          ScamShield is a student-built tool that helps you check whether a message is a scam,
          learn how common scams work, and share what you see so others stay safe.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" className="gap-2 shadow-lg shadow-primary/20 h-12 px-6 w-full sm:w-auto" onClick={() => setShowScanner(true)}>
            <Search className="w-4 h-4" /> Scan a Message
          </Button>
          <Link to="/learn" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="gap-2 h-12 px-6 w-full">
              <BookOpen className="w-4 h-4" /> Learn the Warning Signs
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* What you can do */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-14"
      >
        <h2 className="text-xl font-heading font-bold text-center mb-2">What you can do</h2>
        <p className="text-sm text-muted-foreground text-center mb-8 max-w-lg mx-auto">
          Three simple ways ScamShield helps you recognize and avoid online scams.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((feature, i) => {
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
              <motion.div key={feature.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06 }}>
                {feature.action
                  ? <div onClick={feature.action}>{content}</div>
                  : <Link to={feature.link}>{content}</Link>
                }
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl bg-gradient-to-br from-primary/5 to-blue-50/50 border border-primary/10 p-8"
      >
        <div className="text-center max-w-xl mx-auto">
          <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
          <h2 className="text-lg font-bold mb-3">How ScamShield Works</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            When you submit a message, link, or screenshot, ScamShield uses AI to look for common scam
            warning signs — like urgent requests, payment demands, or mismatched sender details — and
            explains what it finds in plain language. You can save the result, learn more about that
            type of scam, or share it with the community to warn others.
          </p>
          <div className="grid grid-cols-3 gap-3 text-left">
            <div className="flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                <Camera className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs font-semibold">1. Scan</p>
              <p className="text-[11px] text-muted-foreground">Paste or upload</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                <Search className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs font-semibold">2. Review</p>
              <p className="text-[11px] text-muted-foreground">See the red flags</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                <GraduationCap className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs font-semibold">3. Learn</p>
              <p className="text-[11px] text-muted-foreground">Stay protected</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}