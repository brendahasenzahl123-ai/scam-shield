import React, { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import usePullToRefresh from "@/hooks/usePullToRefresh";
import PullToRefreshIndicator from "@/components/ui/PullToRefreshIndicator";
import { ChevronDown, ChevronUp } from "lucide-react";

const RISK_LABELS = {
  warning: "Warning",
  critical: "High Risk",
  info: "Advisory",
};

const FILTER_TABS = [
  "All", "Scholarships", "Jobs", "Social Media", "Financial", "Delivery", "Phishing", "Seniors",
];

const ALERTS = [
  { title: "Fake FAFSA Verification Email", category: "Scholarships", audience: "Students", severity: "critical", desc: "Phishing emails impersonating the U.S. Department of Education ask students to 'verify' their FSA ID credentials on a fake site. Victims lose access to financial aid accounts.", target: "High school seniors and college students applying for federal aid", signs: ["Email not from a .gov domain", "Urgent 'verify immediately or lose aid' language", "Link goes to a fake domain instead of studentaid.gov"], safe: ["Only access FAFSA at studentaid.gov", "Never enter your FSA ID on a linked page — type the URL directly", "Report suspicious emails to phishing@ed.gov"] },
  { title: "USPS Delivery Notification Text Scam", category: "Delivery", audience: "All", severity: "critical", desc: "Text messages claiming a package couldn't be delivered and asking recipients to click a link and pay a small redelivery fee. The link steals credit card info.", target: "Online shoppers and anyone expecting deliveries", signs: ["USPS texts never include payment links", "Unusual domain instead of usps.com", "Requests payment via link for a 're-delivery fee'"], safe: ["Track packages only at usps.com", "Never pay fees via a text message link", "Report smishing to spam@uspis.gov"] },
  { title: "AI Voice Clone Family Emergency Scam", category: "Financial", audience: "Seniors", severity: "critical", desc: "Scammers use AI to clone a family member's voice and call grandparents claiming to be in jail, a hospital, or an accident — demanding immediate wire transfers or gift cards.", target: "Adults 60+, grandparents", signs: ["Unusual urgency, 'don't tell mom/dad'", "Requests gift cards or wire transfer specifically", "Caller sounds like a family member but the story doesn't add up"], safe: ["Hang up and call the family member directly on a known number", "Establish a family code word for emergencies", "Never send gift cards based on a phone call"] },
  { title: "Fake Summer Internship Recruitment", category: "Jobs", audience: "Students", severity: "critical", desc: "Fake Fortune 500 company recruiters contact students via LinkedIn and email with high-paying remote internship offers, ultimately collecting personal info or getting victims to cash fraudulent checks.", target: "College students and recent graduates", signs: ["Job pays unusually high for entry-level remote work", "No formal interview required", "Recruiter uses Gmail or Yahoo, not a company domain"], safe: ["Verify the recruiter on the company's official website", "Never cash checks for a new employer before starting", "Look up the company on LinkedIn independently"] },
  { title: "TikTok Crypto Giveaway Scam", category: "Social Media", audience: "Students", severity: "critical", desc: "Deepfake videos of celebrities and influencers promoting fake crypto giveaways. Victims are asked to 'send crypto to receive double back.'", target: "TikTok users ages 16-30", signs: ["Giveaway requires sending cryptocurrency first", "Video looks slightly off or audio doesn't match lips", "No verifiable source for the giveaway"], safe: ["Real giveaways never ask you to send money first", "Check the account creation date — scam accounts are new", "Report deepfake ads to TikTok directly"] },
  { title: "Instagram Brand Ambassador DM Scam", category: "Social Media", audience: "Students", severity: "warning", desc: "Fake brand accounts DM users offering ambassador programs for free products. Victims are asked to pay upfront for 'shipping' or provide bank info for 'direct deposit commissions.'", target: "Instagram users ages 16-28 with smaller followings", signs: ["Account reached out without any prior interaction", "Brand account has few posts and followers", "Requests personal payment info before any product is received"], safe: ["Research the brand independently", "Never pay for an 'ambassador' role", "Legitimate brands don't recruit influencers via DM only"] },
  { title: "Discord Nitro Phishing Campaign", category: "Social Media", audience: "Students", severity: "critical", desc: "DMs sent from compromised Discord accounts offer free Nitro subscriptions via a link that redirects to a fake Discord login page to steal credentials.", target: "Discord users ages 13-25, gamers", signs: ["Link goes to a fake domain instead of discord.com", "Friend's account seems unlike their normal behavior", "Site asks for login to 'claim' a prize"], safe: ["Discord will never send Nitro via a DM link", "Enable 2FA on your Discord account", "If a friend sends it, verify on a voice call before clicking"] },
  { title: "Fake Apple ID Security Alert", category: "Phishing", audience: "All", severity: "warning", desc: "Emails and texts warning of suspicious Apple ID activity, redirecting victims to a fake Apple login page that captures credentials and two-factor codes in real time.", target: "iPhone and Mac users of all ages", signs: ["Email sender domain not @apple.com", "Extreme urgency: 'your account will be locked in 24 hours'", "Login page URL contains 'apple' but on a different domain"], safe: ["Go directly to appleid.apple.com — never follow email links", "Enable two-factor authentication", "Real Apple emails only come from @apple.com"] },
  { title: "Amazon Refund Overpayment Scam", category: "Financial", audience: "Seniors", severity: "warning", desc: "Callers pose as Amazon support agents claiming a refund was processed incorrectly and too much was deposited. They ask victims to send back the 'overpayment' via gift cards.", target: "Adults 50+, frequent Amazon shoppers", signs: ["Call came in unexpectedly — Amazon doesn't cold call", "They're asking you to buy gift cards to 'return' money", "Pressure to act quickly before the 'error' is flagged"], safe: ["Amazon will never ask for gift card payments via phone", "Hang up and go to amazon.com/contact to verify", "Report at amazon.com/reportascam"] },
  { title: "Facebook Marketplace Overpayment Scam", category: "Financial", audience: "All", severity: "warning", desc: "Buyer sends a check for more than the asking price and asks the seller to wire back the difference before the check clears. The check later bounces.", target: "Private sellers on Facebook Marketplace", signs: ["Buyer insists on paying by check and offers more than asking price", "Asks you to send the difference via Zelle or wire transfer", "Rushes the transaction without meeting in person"], safe: ["Only accept cash or verified payment for local sales", "Wait for checks to fully clear before releasing items", "Use Facebook Pay for in-app transactions when possible"] },
  { title: "Zelle Payment Reversal Scam", category: "Financial", audience: "All", severity: "critical", desc: "Scammers pose as bank fraud departments, tell victims their account is compromised, and instruct them to 'protect' their money by sending it via Zelle to themselves — which actually sends it to the scammer.", target: "Bank customers of all ages", signs: ["Bank supposedly called you — banks don't do this for Zelle issues", "Told to 'move' money to a safe account via Zelle", "Urgency: act now or lose your money"], safe: ["Hang up and call your bank's official number on the back of your card", "Zelle transfers cannot be reversed — treat them like cash", "Banks never ask you to move money to protect it"] },
  { title: "Student Loan Forgiveness Scam", category: "Scholarships", audience: "Students", severity: "warning", desc: "Scammers capitalize on student loan news by calling or emailing borrowers offering guaranteed forgiveness programs that require upfront fees or FSA ID access.", target: "Student loan borrowers ages 20-40", signs: ["Charges upfront fees for forgiveness applications", "Claims special access to forgiveness programs not available publicly", "Asks for your FSA ID username and password"], safe: ["Student loan help is always free at studentaid.gov", "Never give your FSA ID to anyone — it's like a password", "Report scams to the Consumer Financial Protection Bureau (CFPB)"] },
  { title: "Grandparent Emergency Scam", category: "Financial", audience: "Seniors", severity: "critical", desc: "Fraudsters call grandparents claiming a grandchild is in legal or medical trouble and needs immediate money via gift cards or wire transfer — increasingly using AI-cloned voices.", target: "Adults 60-80 with grandchildren", signs: ["Call came in from an unfamiliar number", "Grandchild 'can't talk right now' but a lawyer or officer stays on the line", "Request is specifically for gift cards or wire transfer"], safe: ["Hang up immediately and call your grandchild directly", "Establish a secret family emergency code word", "Do not send money based on any phone call alone"] },
  { title: "Tech Support Pop-Up Scam", category: "Phishing", audience: "Seniors", severity: "warning", desc: "Browser pop-ups display alarming Microsoft or Apple security warnings and a phone number to call. Victims are granted remote access, then charged hundreds of dollars for fake 'repairs.'", target: "Adults 50+, less tech-savvy users", signs: ["Pop-up has a phone number and won't close easily", "Warning says your computer has been 'hacked' or 'locked'", "Caller requests remote access software like AnyDesk"], safe: ["Force-close the browser — don't call the number", "Real Microsoft and Apple alerts never include phone numbers", "Call a trusted local tech professional if concerned"] },
  { title: "Fake Charity Scam (Disaster Relief)", category: "Financial", audience: "All", severity: "warning", desc: "Following major natural disasters or news events, fake charity websites and social media pages solicit donations that never reach victims.", target: "Compassionate donors of all ages", signs: ["Organization has no verifiable history on Charity Navigator", "Solicits donations via gift cards or wire transfer", "Website created within days of the disaster"], safe: ["Donate only through established charities verifiable on charitynavigator.org", "Search the charity name + 'scam' before donating", "Use BBB's Wise Giving Alliance to verify organizations"] },
];

function AlertCard({ alert }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-md p-4">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-semibold text-sm leading-snug flex-1">{alert.title}</h3>
        <span className="text-xs text-muted-foreground shrink-0">{RISK_LABELS[alert.severity] || alert.severity}</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-2 text-xs text-muted-foreground">
        <span>{alert.category}</span>
        <span>·</span>
        <span>{alert.audience}</span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{alert.desc}</p>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-primary font-medium mt-2 hover:underline"
      >
        {expanded ? <><ChevronUp className="w-3 h-3" /> Less</> : <><ChevronDown className="w-3 h-3" /> Warning signs & safety tips</>}
      </button>

      <AnimatePresence>
        {expanded && (
          <div className="mt-3 space-y-3 pt-3 border-t border-border">
            {alert.target && (
              <div>
                <p className="text-xs font-semibold mb-1">Who is targeted</p>
                <p className="text-sm text-muted-foreground">{alert.target}</p>
              </div>
            )}
            {alert.signs?.length > 0 && (
              <div>
                <p className="text-xs font-semibold mb-1">Warning signs</p>
                <ul className="space-y-1">
                  {alert.signs.map((sign, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-muted-foreground shrink-0">•</span><span>{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {alert.safe?.length > 0 && (
              <div>
                <p className="text-xs font-semibold mb-1">How to stay safe</p>
                <ul className="space-y-1">
                  {alert.safe.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-primary shrink-0">✓</span><span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function News() {
  const [activeFilter, setActiveFilter] = useState("All");
  const { pullY, refreshing } = usePullToRefresh(useCallback(() => new Promise(r => setTimeout(r, 600)), []));

  const filtered = activeFilter === "All"
    ? ALERTS
    : ALERTS.filter(a => a.audience === activeFilter || a.category === activeFilter);

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-12">
      <PullToRefreshIndicator pullY={pullY} refreshing={refreshing} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Scam Examples</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Examples of common scams and the signs to watch for.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto md:flex-wrap md:overflow-visible pb-1 -mx-4 px-4 md:mx-0 md:px-0">
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors shrink-0 whitespace-nowrap ${activeFilter === tab ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((alert) => (
          <AlertCard key={alert.title} alert={alert} />
        ))}
      </div>
    </div>
  );
}