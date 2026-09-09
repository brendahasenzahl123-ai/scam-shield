import React, { useState, useEffect } from "react";
import { Search, BookOpen } from "lucide-react";
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
          <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
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

  return (
    <div className="max-w-2xl mx-auto px-4 pb-12">
      {/* Hero */}
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-4 leading-tight">
          Spot Scams.<br />Protect Each Other.
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
          Check suspicious messages, learn common warning signs, and share scam reports with others.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" className="gap-2 w-full sm:w-auto" onClick={() => setShowScanner(true)}>
            <Search className="w-4 h-4" /> Scan a Message
          </Button>
          <Link to="/learn" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="gap-2 w-full">
              <BookOpen className="w-4 h-4" /> Learn the Warning Signs
            </Button>
          </Link>
        </div>
      </div>

      {/* What you can do */}
      <div className="mb-8">
        <h2 className="text-base font-semibold mb-3">What you can do</h2>
        <ul className="border rounded-md divide-y">
          <li className="flex items-center gap-3 p-3 text-sm">Scan suspicious content</li>
          <li className="flex items-center gap-3 p-3 text-sm">Review warning signs</li>
          <li className="flex items-center gap-3 p-3 text-sm">Share reports</li>
        </ul>
      </div>

      {/* How it works */}
      <div className="border rounded-md p-5">
        <h2 className="text-base font-semibold mb-2">How ScamShield Works</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Submit a message, link, or screenshot and ScamShield checks it for common scam warning signs, then explains what it finds in plain language.
        </p>
        <ol className="space-y-2 text-sm">
          <li className="flex gap-2"><span className="font-semibold shrink-0">1.</span> Submit a message, link, or screenshot.</li>
          <li className="flex gap-2"><span className="font-semibold shrink-0">2.</span> Review possible warning signs.</li>
          <li className="flex gap-2"><span className="font-semibold shrink-0">3.</span> Save the result or warn the community.</li>
        </ol>
      </div>
    </div>
  );
}