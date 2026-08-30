import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Home, FileText, Heart, Monitor, CreditCard, Users, Mic, HandHeart, TrendingUp,
  ChevronRight, ArrowLeft, AlertTriangle, CheckCircle2, XCircle
} from "lucide-react";

const categories = [
  {
    id: "irs_scams",
    icon: FileText,
    color: "bg-red-100 text-red-700",
    title: "IRS Scams",
    audience: "All Adults",
    preview: "Threatening calls claiming you owe back taxes — pay now or face arrest.",
    description: "IRS impersonation scams are among the most reported fraud in the US, using fear of legal consequences to force immediate payment.",
    redFlags: [
      "Call, text, or email demanding immediate payment",
      "Threatens arrest, deportation, or license revocation",
      "Demands payment via gift cards, wire transfer, or cryptocurrency",
      "Caller is aggressive, threatening, or rude",
      "Does not allow you to question or appeal the debt",
      "Asks for your Social Security number over the phone"
    ],
    examples: [
      { title: "The 'Arrest Warrant' Call", detail: "Caller claims to be an IRS agent and says you have an outstanding tax debt that resulted in an arrest warrant. You must pay immediately by iTunes gift cards to avoid arrest." },
      { title: "Fake Tax Refund Email", detail: "Email from 'IRS.gov-refund@gmail.com' says you're owed a $847 refund. Click the link to 'claim your refund' — which leads to a phishing site that steals your SSN and bank info." }
    ],
    tips: [
      "The IRS ONLY initiates contact via US Mail — never by phone, email, or text",
      "The IRS never demands immediate payment or threatens arrest",
      "The IRS never requires gift cards, wire transfers, or cryptocurrency",
      "If you think you owe taxes, call the IRS directly: 1-800-829-1040",
      "Report IRS scams to the Treasury Inspector General: 1-800-366-4484"
    ]
  },
  {
    id: "medicare_scams",
    icon: Heart,
    color: "bg-rose-100 text-rose-700",
    title: "Medicare Scams",
    audience: "Seniors 65+",
    preview: "Fake Medicare cards and free health screenings used to steal your benefits.",
    description: "Medicare scams target seniors by offering free services or equipment in exchange for their Medicare number — which scammers then bill for services never provided.",
    redFlags: [
      "Unsolicited calls about free medical equipment or tests",
      "Offer of free health screening in exchange for your Medicare number",
      "Claims your Medicare card is being 'updated' and needs verification",
      "Caller pressures you to act before your benefits expire",
      "Requests Medicare number, SSN, or bank information"
    ],
    examples: [
      { title: "Free Back Brace Scam", detail: "Caller offers a free back brace covered 100% by Medicare. They need your Medicare number to 'process the claim.' They submit thousands in fraudulent claims and send a cheap brace or nothing at all." },
      { title: "New Medicare Card Scam", detail: "Caller claims Medicare is issuing new cards and you must 'verify your account' with your current card number, SSN, and bank info to receive your new card." }
    ],
    tips: [
      "Medicare will never call you to offer free equipment",
      "Guard your Medicare card like a credit card — never share the number",
      "Medicare never needs to 'verify' your identity by phone",
      "Report Medicare fraud: 1-800-MEDICARE (1-800-633-4227)",
      "Review your Medicare statements for services you didn't receive"
    ]
  },
  {
    id: "social_security",
    icon: FileText,
    color: "bg-blue-100 text-blue-700",
    title: "Social Security Scams",
    audience: "All Adults",
    preview: "Your Social Security number has been 'suspended' — act now.",
    description: "Social Security impersonation scams threaten victims with benefit suspension or arrest to extract payments and personal information.",
    redFlags: [
      "Call claiming your SSN has been 'suspended' or 'compromised'",
      "Threatens legal action, arrest, or deportation",
      "Demands you 'secure' your money by transferring it to a safe account",
      "Asks you to confirm your SSN over the phone",
      "Uses robocall with an urgent, threatening message"
    ],
    examples: [
      { title: "Suspended SSN Robocall", detail: "Automated message: 'Your Social Security number has been suspended due to suspicious activity. Press 1 to speak with an officer immediately or a warrant will be issued for your arrest.'" }
    ],
    tips: [
      "The SSA never suspends SSNs — this doesn't happen",
      "Hang up immediately on any threatening call about your Social Security",
      "If concerned, call the SSA directly: 1-800-772-1213",
      "Report SSA scams: 1-800-269-0271 (SSA Inspector General hotline)"
    ]
  },
  {
    id: "tech_support",
    icon: Monitor,
    color: "bg-purple-100 text-purple-700",
    title: "Tech Support Scams",
    audience: "All Adults",
    preview: "Pop-up warning: 'Your computer is infected! Call Microsoft immediately!'",
    description: "Tech support scams use alarming pop-ups or cold calls claiming your computer has a virus, then charge for fake services or install real malware.",
    redFlags: [
      "Browser pop-up warning that your computer is infected",
      "Pop-up displays a phone number to call 'Microsoft' or 'Apple'",
      "Caller asks to remotely access your computer",
      "Offers to fix the problem for a fee (often $200-500)",
      "Pops up on a website that suddenly freezes your browser"
    ],
    examples: [
      { title: "Microsoft Pop-Up Scam", detail: "Browser displays a full-screen warning: 'CRITICAL ALERT: Your PC is infected with 5 viruses. Call Microsoft Support at 1-888-XXX-XXXX immediately.' Calling connects to a scammer who charges $299 to 'remove' viruses and installs actual malware." },
      { title: "Apple Security Alert", detail: "iPhone notification or website claims 'Your Apple account has been compromised.' Calling the provided number leads to a scammer requesting Apple Gift Cards as payment for 'account restoration.'" }
    ],
    tips: [
      "Microsoft and Apple will never pop up with a phone number to call",
      "Close the tab or restart your computer — you're not infected from a pop-up",
      "Never allow remote access to a stranger",
      "Real tech support doesn't ask for gift card payment",
      "If your browser is frozen by a pop-up, force-quit the browser"
    ]
  },
  {
    id: "gift_card",
    icon: CreditCard,
    color: "bg-amber-100 text-amber-700",
    title: "Gift Card Scams",
    audience: "All Adults",
    preview: "Government agencies, utilities, and courts never accept gift card payment.",
    description: "Gift card scams trick victims into buying gift cards as payment for fake debts, taxes, or emergencies — a method that's nearly impossible to reverse.",
    redFlags: [
      "Any official-sounding entity asks for payment in gift cards",
      "You're told to keep it secret until the payment is made",
      "You're asked to read the card numbers over the phone",
      "The request comes after a threatening or urgent call",
      "You're buying multiple high-value gift cards"
    ],
    examples: [
      { title: "Utility Shutoff Scam", detail: "Caller claims to be your electric company and threatens to shut off power in 30 minutes unless you pay an overdue bill immediately via iTunes or Google Play gift cards." },
      { title: "Bail Bond Gift Card Scam", detail: "Caller claiming to be a bail bondsman says your grandchild is in jail and needs $1,500 in Amazon gift cards for release. They demand you act immediately and tell no one." }
    ],
    tips: [
      "Gift cards are not a payment method for any legitimate business or government agency — ever",
      "If anyone asks for gift cards as payment, hang up — it is always a scam",
      "Report gift card scams to the FTC at reportfraud.ftc.gov",
      "If you've purchased gift cards, call the card company immediately to try to freeze them"
    ]
  },
  {
    id: "grandparent",
    icon: Users,
    color: "bg-orange-100 text-orange-700",
    title: "Grandparent Scams",
    audience: "Grandparents",
    preview: "A frantic call: 'Grandma, I'm in trouble — please don't tell Mom!'",
    description: "Grandparent scams prey on the love between grandparents and grandchildren, fabricating emergencies to extract money quickly.",
    redFlags: [
      "Unexpected call from 'grandchild' in distress",
      "Request for secrecy ('don't tell my parents')",
      "Asks for cash, wire transfer, or gift cards",
      "A 'lawyer' or 'police officer' gets on the line to add pressure",
      "Story involves arrest, accident, or being stranded abroad"
    ],
    examples: [
      { title: "Classic Grandparent Scam", detail: "Grandparent receives frantic call: 'Grandpa, it's me — I'm in so much trouble. I got in a car accident in Canada and I need $3,000 for bail. Please don't tell Dad.' A fake 'attorney' then verifies the story and explains how to wire money." },
      { title: "AI Voice Clone Version", detail: "Using AI trained on social media videos, scammers clone your grandchild's actual voice for a near-perfect impersonation, making the scam much harder to detect." }
    ],
    tips: [
      "Hang up and call your grandchild directly on their known phone number",
      "Establish a family code word for real emergencies",
      "Never send money based on an unexpected call without verification",
      "Tell seniors: 'We will never ask you to keep an emergency secret'"
    ]
  },
  {
    id: "ai_voice",
    icon: Mic,
    color: "bg-violet-100 text-violet-700",
    title: "AI Voice Impersonation",
    audience: "All Families",
    preview: "Scammers now clone family members' voices using AI in seconds.",
    description: "AI voice cloning technology can replicate anyone's voice from just a few seconds of audio, making phone scams dramatically more convincing.",
    redFlags: [
      "Unexpected call from a family member's number sounding slightly 'off'",
      "Caller is emotional or panicked, making it hard to think clearly",
      "Asks for immediate financial help with no time to think",
      "Audio quality is slightly unusual or glitchy",
      "Story doesn't quite add up on reflection"
    ],
    examples: [
      { title: "AI Voice Emergency Scam", detail: "A parent hears their child's voice crying and saying they've been kidnapped. A 'kidnapper' gets on the phone demanding $15,000 in wire transfers. The child was home the entire time — their voice was cloned from social media." }
    ],
    tips: [
      "Create a family safe word that any caller must provide to confirm identity",
      "Hang up and call the family member directly if anything seems wrong",
      "Social media videos are the primary source for voice training — adjust privacy settings",
      "In an emergency claim, don't panic — take 60 seconds to verify"
    ]
  },
  {
    id: "charity",
    icon: HandHeart,
    color: "bg-pink-100 text-pink-700",
    title: "Charity Scams",
    audience: "All Adults",
    preview: "Fake charities spike after disasters, exploiting generosity.",
    description: "Charity scammers create fake organizations that sound legitimate, especially after natural disasters, to collect donations they keep for themselves.",
    redFlags: [
      "Charity has a name very similar to a well-known organization",
      "Calls for immediate donation after a news event",
      "Cannot provide an EIN (tax ID) or FEIN number",
      "Asks for cash, wire transfer, or gift cards",
      "High-pressure tactics to donate immediately",
      "No physical address or verifiable contact information"
    ],
    examples: [
      { title: "Disaster Relief Fake Charity", detail: "After a hurricane, a caller solicits donations for 'American Disaster Relief Fund' — which sounds like 'American Red Cross.' Donations are pocketed and the 'organization' vanishes within weeks." }
    ],
    tips: [
      "Verify charities at Charity Navigator (charitynavigator.org) or GuideStar",
      "Donate directly to official organization websites — never through links in emails",
      "Ask for an EIN — legitimate charities provide this willingly",
      "The FTC's advice: never donate cash, gift cards, or wire transfers to charities"
    ]
  },
  {
    id: "investment",
    icon: TrendingUp,
    color: "bg-emerald-100 text-emerald-700",
    title: "Investment Scams",
    audience: "Pre-retirees / Retirees",
    preview: "Guaranteed 15% monthly returns — a promise no legitimate investment makes.",
    description: "Investment scams target people approaching retirement by promising unrealistic returns, often destroying life savings built over decades.",
    redFlags: [
      "Promises guaranteed returns or 'risk-free' investments",
      "Pressure to invest quickly before a deadline",
      "Returns are consistently high regardless of market conditions",
      "Difficulty withdrawing money from the account",
      "Investment advisor found on social media or through unsolicited contact",
      "Requests wire transfers or cryptocurrency deposits"
    ],
    examples: [
      { title: "Ponzi Scheme Investment Club", detail: "An 'investment club' promises 10-15% monthly returns through 'proprietary forex trading.' Early investors receive payments (funded by new investors). Eventually the scheme collapses and most investors lose everything." },
      { title: "Social Media Investment Mentor", detail: "Instagram account with luxury lifestyle photos offers a 'mentorship' program for $500 that teaches a 'guaranteed trading system.' The system doesn't work and the mentor becomes unresponsive." }
    ],
    tips: [
      "No investment can guarantee returns — guaranteed returns = guaranteed scam",
      "Verify any investment advisor at investor.gov/check-your-investment-professional",
      "Never invest based on social media recommendations or cold calls",
      "Consult an independent, fee-only financial advisor for a second opinion"
    ]
  }
];

export default function FamilyCenter() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const cat = categories.find(c => c.id === selected);
    const Icon = cat.icon;
    return (
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-12">
        <Button variant="ghost" size="sm" className="gap-1.5 mb-4 text-muted-foreground" onClick={() => setSelected(null)}>
          <ArrowLeft className="w-4 h-4" /> Back to Family Center
        </Button>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${cat.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold">{cat.title}</h1>
              <Badge variant="secondary" className="text-[10px] mt-0.5">Targets: {cat.audience}</Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{cat.description}</p>

          <Card className="border-0 shadow-md">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-3 text-red-600">
                <XCircle className="w-4 h-4" /> Red Flags to Watch For
              </h3>
              <div className="space-y-2">
                {cat.redFlags.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-red-500 shrink-0 mt-0.5">🚩</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Real Examples
              </h3>
              <div className="space-y-4">
                {cat.examples.map((ex, i) => (
                  <div key={i} className="border-l-2 border-amber-300 pl-3">
                    <p className="text-sm font-semibold">{ex.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{ex.detail}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-primary/5">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-3 text-primary">
                <CheckCircle2 className="w-4 h-4" /> How to Stay Safe
              </h3>
              <div className="space-y-2">
                {cat.tips.map((t, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold mb-3 border border-rose-100">
          <Home className="w-3.5 h-3.5" />
          Parent & Family Protection Center
        </div>
        <h1 className="text-2xl font-heading font-bold">Scams Targeting Parents & Seniors</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Guides for {categories.length} scam types most commonly targeting parents, grandparents, and older adults
        </p>
      </div>

      <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 mb-6 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          <strong>Share this with family.</strong> Seniors lose an estimated $3.4 billion to fraud annually. The most effective protection is awareness and an open family conversation about these tactics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card
                className="border-0 shadow-md hover:shadow-lg cursor-pointer group transition-all"
                onClick={() => setSelected(cat.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{cat.title}</h3>
                        <Badge variant="outline" className="text-[10px] shrink-0">{cat.audience}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-snug">{cat.preview}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors mt-1 shrink-0" />
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