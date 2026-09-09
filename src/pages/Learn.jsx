import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen, Mail, Briefcase, Users, GraduationCap,
  ChevronRight, Clock, ArrowLeft, ShoppingBag, UserCog
} from "lucide-react";
import ReactMarkdown from "react-markdown";

const modules = [
  {
    id: "scholarships", title: "Scholarship Scams", icon: GraduationCap,
    minutes: 5,
    content: `## Fake Scholarship Scams\n\n**The Golden Rule: Legitimate scholarships NEVER charge you to receive money.**\n\n### Warning Signs\n- You're told you "won" without applying\n- Requires a fee to claim the award\n- Asks for your bank account or SSN\n- No verifiable organization\n- High-pressure deadline\n\n### How They Work\n1. Notification of winning a scholarship\n2. Asked for a "processing fee" of $25-$100\n3. Or: a form collects your SSN and bank routing number\n4. Contact disappears after payment\n\n### Legitimate Sources\n- **FAFSA.gov** — Federal student aid\n- **Scholarships.com** — Free scholarship search\n- **Your school's financial aid office**\n- **Local community foundations**\n\nIf you're unsure, ask your school counselor — that's exactly what they're there for.`
  },
  {
    id: "jobs", title: "Job & Internship Scams", icon: Briefcase,
    minutes: 6,
    content: `## Fake Job & Internship Scams\n\nFake job offers target students hungry for experience on LinkedIn, Indeed, and Handshake.\n\n### Warning Signs\n- No interview required\n- Pay is unrealistically high for entry-level work\n- Asked to pay for training, equipment, or a background check\n- Communication only via text, WhatsApp, or Telegram\n- Company cannot be verified online\n- Requests SSN or bank info before starting\n\n### Most Common Types\n**Fake Check Scam:** Receive a "company check" to buy supplies. Deposit it, send money back. The check bounces days later.\n\n**Reshipping Scam:** Receive packages at home and forward them. You're handling stolen goods.\n\n**Pyramid Scheme:** "Ambassador" or "marketing coordinator" role where pay depends on recruiting others.\n\n### Verification Checklist\n1. Search the company independently — not with info from the job posting\n2. Find the listing on the company's official website\n3. Look up the recruiter on LinkedIn and verify they list the company\n4. Never pay any amount for any reason to start a job`
  },
  {
    id: "impersonation", title: "Impersonation Scams", icon: UserCog,
    minutes: 6,
    content: `## Impersonation Scams\n\nScammers pretend to be someone you trust — a government agency, your bank, tech support, or even a family member — to pressure you into acting fast.\n\n### Common Impersonation Targets\n- **IRS / government** — "You owe taxes, pay now or be arrested"\n- **Bank fraud department** — "Your account is compromised, move your money"\n- **Tech support (Microsoft/Apple)** — "Your computer is infected, call this number"\n- **Family member in trouble** — increasingly using AI-cloned voices\n\n### Warning Signs\n- Urgency: you must act immediately\n- Threats of arrest, account closure, or deportation\n- Requests for gift cards, wire transfer, or crypto\n- "Keep this confidential — don't tell anyone"\n- Caller refuses to let you verify through another channel\n\n### How to Stay Safe\n- **Slow down.** Real institutions don't demand instant action.\n- **Hang up and call back** using a number you already have (on your card, on the official website).\n- **Government agencies contact by mail first**, not by phone or email.\n- **Establish a family code word** for real emergencies.\n- Never give remote access to your computer to an unsolicited caller.`
  },
  {
    id: "marketplace", title: "Marketplace Scams", icon: ShoppingBag,
    minutes: 6,
    content: `## Marketplace & Online Selling Scams\n\nFacebook Marketplace, Craigslist, OfferUp, and eBay are full of scammers targeting both buyers and sellers.\n\n### When You're the Buyer\n- **Too-good-to-be-true price** — and the seller has a reason they can't meet in person.\n- **Advance payment to "hold" the item** — once you Zelle/Venmo the deposit, the seller disappears.\n- **Fake escrow services** run by the scammer.\n- **Counterfeit goods** — convincing fakes of designer items.\n\n### When You're the Seller\n- **Overpayment scam** — Buyer "accidentally" sends too much and asks you to refund the difference. The original payment later reverses.\n- **Fake payment confirmation** — A screenshot that looks like a Zelle/Venmo receipt, but no money arrived. Verify in your own app.\n- **"Send me the code" scam** — Buyer asks you to send a 6-digit code "to verify you're real." They're setting up a Google Voice number in your name.\n\n### Safe Rules\n1. **Meet in person** at a safe exchange zone (many police stations offer one)\n2. **Use platforms with buyer/seller protection** — never "friends and family" payments\n3. **Verify payments in your own app** before handing over the item\n4. **Never refund an overpayment** — it's always a scam\n5. **Never share verification codes** anyone texts you, for any reason`
  },
  {
    id: "phishing", title: "Phishing", icon: Mail,
    minutes: 6,
    content: `## Understanding Phishing\n\nPhishing is sending fake messages pretending to be a legitimate company to steal your information.\n\n### How It Works\n1. You receive an email, text, or DM that looks official\n2. You're directed to click a link or provide information\n3. The link goes to a fake website that looks real\n4. Your credentials or payment info are stolen\n\n### Types\n- **Email phishing** — Fake emails from banks, schools, companies\n- **Smishing** — Phishing via SMS text messages\n- **Vishing** — Voice call scams\n\n### How to Spot Fake URLs\n- **Typosquatting:** faceb00k.com, paypa1.com\n- **Subdomain tricks:** discord.com.free-nitro.xyz (real domain: free-nitro.xyz)\n- **No HTTPS** on sensitive pages\n\n### Protection\n- **Hover before clicking** to see the real destination\n- **Never enter passwords** from links in emails — go directly to the site\n- **Enable two-factor authentication** on all accounts\n- **Check the sender email address**, not just the display name\n\n**Note:** AI now writes phishing emails with perfect grammar, so "look for bad grammar" no longer reliably works.`
  },
  {
    id: "social_media", title: "Social Media Scams", icon: Users,
    minutes: 5,
    content: `## Scams on Social Media\n\nInstagram, TikTok, Snapchat, and Discord are prime hunting grounds for scammers targeting young people.\n\n### Instagram & TikTok\n- **Fake brand sponsorships** — "Pay shipping for free products." Real sponsorships pay YOU.\n- **Fake giveaways** — Collecting followers and emails; no prize exists\n- **Crypto/investment advice** — Lifestyle accounts promoting fake platforms\n\n### Discord\n- **Free Nitro links** — Steal your account credentials\n- **Crypto/NFT projects** — Fake investment opportunities in servers\n- **QR code scams** — Scanning gives scammers account access\n\n### Snapchat\n- **Sugar parent offers** — Promising money for nothing; eventually steals your payment info\n- **Account hacking pages** — "See who unfriended you" phishing links\n\n### How to Stay Safe\n- Never click links from strangers in DMs\n- Verify brand offers on the official company website\n- Real companies contact influencers from official business emails — not DMs\n- Enable two-factor authentication everywhere`
  },
];

export default function Learn() {
  const [selectedModule, setSelectedModule] = useState(null);
  const [completedModules, setCompletedModules] = useState(() => {
    try { return JSON.parse(localStorage.getItem("completedModules") || "[]"); } catch { return []; }
  });

  const markComplete = (id) => {
    const updated = completedModules.includes(id) ? completedModules : [...completedModules, id];
    setCompletedModules(updated);
    localStorage.setItem("completedModules", JSON.stringify(updated));
  };

  if (selectedModule) {
    const mod = modules.find(m => m.id === selectedModule);
    const Icon = mod.icon;
    const isComplete = completedModules.includes(mod.id);
    return (
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-12">
        <Button variant="ghost" size="sm" className="gap-1.5 mb-4 text-muted-foreground" onClick={() => setSelectedModule(null)}>
          <ArrowLeft className="w-4 h-4" /> Back to topics
        </Button>
        <div className="flex items-center gap-3 mb-6">
          <Icon className="w-5 h-5 text-primary shrink-0" />
          <div>
            <h1 className="text-xl font-bold">{mod.title}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {mod.minutes} min read
              </span>
              {isComplete && <span className="text-xs text-primary font-semibold">✓ Completed</span>}
            </div>
          </div>
        </div>
        <Card className="border shadow-sm">
          <CardContent className="p-5">
            <ReactMarkdown className="prose prose-sm prose-slate max-w-none [&>h2]:text-lg [&>h2]:font-bold [&>h2]:mt-0 [&>h3]:text-base [&>h3]:font-semibold [&>h3]:mt-5 [&>ul]:mt-2 [&>ol]:mt-2 [&>p]:leading-relaxed [&>p]:text-slate-600">
              {mod.content}
            </ReactMarkdown>
          </CardContent>
        </Card>
        {!isComplete && (
          <Button className="w-full mt-4" onClick={() => markComplete(mod.id)}>
            ✓ Mark as Complete
          </Button>
        )}
        {isComplete && (
          <div className="mt-4 flex items-center justify-center gap-2 text-primary text-sm font-semibold">
            <span>🏅</span> Topic completed! Keep going.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Learn to Spot Scams</h1>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-sm text-muted-foreground">{modules.length} topics</p>
          <div className="flex items-center gap-1.5">
            <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${(completedModules.length / modules.length) * 100}%` }} />
            </div>
            <span className="text-xs text-muted-foreground">{completedModules.length}/{modules.length} done</span>
          </div>
        </div>
      </div>

      <div className="border rounded-md divide-y">
        {modules.map((mod) => {
          const Icon = mod.icon;
          const isComplete = completedModules.includes(mod.id);
          return (
            <button
              key={mod.id}
              onClick={() => setSelectedModule(mod.id)}
              className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left"
            >
              <Icon className="w-5 h-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm leading-snug">{mod.title}</h3>
                <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" /> {mod.minutes} min
                </span>
              </div>
              {isComplete && <span className="text-primary text-xs shrink-0">✓</span>}
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}