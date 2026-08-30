import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen, Shield, Mail, Briefcase, Users, Heart, Bot, GraduationCap,
  ChevronRight, Clock, ArrowLeft, CreditCard, Video, Lock, Smartphone,
  TrendingUp, Key, Database, Zap, FileText, Search, DollarSign, Globe, AlertTriangle,
  QrCode, ShoppingBag, Landmark, Bug
} from "lucide-react";
import ReactMarkdown from "react-markdown";

const modules = [
  // BEGINNER
  {
    id: "tactics", title: "Common Scam Tactics", icon: Shield, color: "bg-primary/10 text-primary",
    difficulty: "beginner", minutes: 5,
    content: `## How Scammers Manipulate You\n\nScammers use psychological tricks to make you act before you think.\n\n### 🔴 Urgency\n"Act now or lose your chance!" — Creates fake deadlines to prevent careful thinking.\n\n**Example:** "Your scholarship expires in 24 hours unless you confirm now."\n\n### 🔴 Fear\n"Your account has been compromised!" — Panic stops rational thought.\n\n**Example:** "We detected unauthorized access to your bank account. Click here immediately."\n\n### 🔴 Authority Impersonation\nPretending to be the IRS, your bank, Microsoft, or your university to gain trust.\n\n### 🔴 Too Good to Be True\n"You've won $10,000 without entering!" — Unrealistic offers are always a red flag.\n\n### 🔴 Isolation\n"Don't tell your parents — this is confidential." — Prevents you from getting a second opinion.\n\n### 🔴 Reciprocity\nSending you something small (free gift, small payment) to make you feel obligated to send something back.\n\n### How to Break the Pattern\n1. **Slow down.** Any legitimate offer will still exist tomorrow.\n2. **Verify independently.** Never use contact info provided in the suspicious message.\n3. **Get a second opinion.** A trusted adult or friend sees through scams you can't.\n4. **Trust the feeling.** Discomfort and confusion are warning signs.`
  },
  {
    id: "phishing", title: "Phishing Basics", icon: Mail, color: "bg-red-100 text-red-600",
    difficulty: "beginner", minutes: 6,
    content: `## Understanding Phishing\n\nPhishing is sending fake messages pretending to be a legitimate company to steal your information.\n\n### How It Works\n1. You receive an email, text, or DM that looks official\n2. You're directed to click a link or provide information\n3. The link goes to a fake website that looks real\n4. Your credentials or payment info are stolen\n\n### Types\n- **Email phishing** — Fake emails from banks, schools, companies\n- **Smishing** — Phishing via SMS text messages\n- **Vishing** — Voice call scams\n- **Spear phishing** — Personalized attacks using your information\n\n### How to Spot Fake URLs\n- **Typosquatting:** faceb00k.com, paypa1.com\n- **Subdomain tricks:** discord.com.free-nitro.xyz (real domain: free-nitro.xyz)\n- **No HTTPS** on sensitive pages\n\n### Protection\n- **Hover before clicking** to see the real destination\n- **Never enter passwords** from links in emails — go directly to the site\n- **Enable two-factor authentication** on all accounts\n- **Check the sender email address**, not just the display name`
  },
  {
    id: "social_media", title: "Social Media Scams", icon: Users, color: "bg-pink-100 text-pink-600",
    difficulty: "beginner", minutes: 5,
    content: `## Scams on Social Media\n\nInstagram, TikTok, Snapchat, and Discord are prime hunting grounds for scammers targeting young people.\n\n### Instagram & TikTok\n- **Fake brand sponsorships** — "Pay shipping for free products." Real sponsorships pay YOU.\n- **Fake giveaways** — Collecting followers and emails; no prize exists\n- **Crypto/investment advice** — Lifestyle accounts promoting fake platforms\n\n### Discord\n- **Free Nitro links** — Steal your account credentials\n- **Crypto/NFT projects** — Fake investment opportunities in servers\n- **QR code scams** — Scanning gives scammers account access\n\n### Snapchat\n- **Sugar parent offers** — Promising money for nothing; eventually steals your payment info\n- **Account hacking pages** — "See who unfriended you" phishing links\n\n### How to Stay Safe\n- Never click links from strangers in DMs\n- Verify brand offers on the official company website\n- Real companies contact influencers from official business emails — not DMs\n- Enable two-factor authentication everywhere`
  },
  {
    id: "scholarships_basics", title: "Scholarship Scams", icon: GraduationCap, color: "bg-blue-100 text-blue-600",
    difficulty: "beginner", minutes: 5,
    content: `## Fake Scholarship Scams\n\n**The Golden Rule: Legitimate scholarships NEVER charge you to receive money.**\n\n### Warning Signs\n- You're told you "won" without applying\n- Requires a fee to claim the award\n- Asks for your bank account or SSN\n- No verifiable organization\n- High-pressure deadline\n\n### How They Work\n1. Notification of winning a scholarship\n2. Asked for "processing fee" of $25-$100\n3. Or: form collects your SSN and bank routing number\n4. Contact disappears after payment\n\n### Legitimate Sources\n- **FAFSA.gov** — Federal student aid\n- **Scholarships.com** — Free scholarship search\n- **Your school's financial aid office**\n- **Local community foundations**\n\nIf you're unsure, ask your school counselor — that's exactly what they're there for.`
  },
  {
    id: "delivery_scams", title: "Delivery & Package Scams", icon: Globe, color: "bg-orange-100 text-orange-600",
    difficulty: "beginner", minutes: 4,
    content: `## Package Delivery Scams\n\nThe most-reported scam in the US right now is a fake USPS, FedEx, or UPS text message.\n\n### How They Work\n- Text: "Your USPS package could not be delivered. Update your address: [link]"\n- Or: "A $1.99 rescheduling fee is required to reschedule your FedEx delivery"\n- The link leads to a payment page that steals your credit card details\n\n### Red Flags\n- You weren't expecting a package\n- The link doesn't go to USPS.com, FedEx.com, or UPS.com\n- Requests payment to release a package\n- Generic message with no specific package details\n\n### What To Do\n- **Never click the link in the text** — go directly to the carrier's official website\n- **Check your real tracking** by typing the tracking number at USPS.com, FedEx.com, or UPS.com\n- **Report to the carrier** — USPS: spam@uspis.gov, FedEx: abuse@fedex.com\n- **Block and delete** the message`
  },
  {
    id: "password_security", title: "Password Security", icon: Lock, color: "bg-slate-100 text-slate-700",
    difficulty: "beginner", minutes: 5,
    content: `## Password Security Fundamentals\n\nWeak passwords and password reuse are the #1 way people get hacked.\n\n### The Problem\n- The average person uses the same password across 5+ sites\n- When one site is breached, hackers try your password on every other site\n- Common passwords: "123456", "password", "qwerty", your name + year\n\n### What Makes a Strong Password\n- **Length over complexity** — "correct-horse-battery-staple" is stronger than "P@ssw0rd!"\n- **Unique per site** — Different password for every account\n- **Passphrase approach** — Three random words connected: BlueTornadoPasta\n\n### Password Managers\nYou only need to remember ONE strong master password. The manager handles the rest.\n- **Free options:** Bitwarden, KeePass\n- **Paid options:** 1Password, Dashlane\n\n### Two-Factor Authentication (2FA)\nEven if someone gets your password, 2FA stops them. Always enable it on:\n- Email accounts\n- Banking\n- Social media\n- Any account with personal or financial data\n\n### If You've Been Compromised\n1. Change the password immediately\n2. Change it on any other site where you used the same password\n3. Check haveibeenpwned.com to see if your email was in a breach`
  },
  {
    id: "qr_scams", title: "QR Code Scams", icon: QrCode, color: "bg-cyan-100 text-cyan-700",
    difficulty: "beginner", minutes: 5,
    content: `## QR Code Scams\n\nQR codes are everywhere — menus, parking meters, package labels, posters. Scammers love them because you can't read a QR code with your eyes, so you can't tell where it leads until you scan it.\n\n### How QR Code Scams Work\n- **Fake parking meters** — A sticker QR code placed over a real meter's code sends you to a payment page that steals your card details\n- **Malicious menus & posters** — Public QR codes replaced with links to phishing sites or malware downloads\n- **Package delivery QR codes** — A "reschedule" QR code on a fake delivery slip leads to a phishing page\n- **Crypto wallet swaps** — A QR code that, when scanned, routes crypto to the scammer's wallet instead of the intended recipient\n- **QR codes inside emails** — Companies block clickable links, so scammers put a QR code in an email image to bypass filters\n\n### Why They're Dangerous\n- You can't preview the destination before scanning\n- Your phone's camera may auto-open the link\n- QR codes can trigger app actions: open a payment app, join a Wi-Fi network, draft an email, or add a contact — not just open a webpage\n\n### How to Stay Safe\n1. **Use your phone's native camera** — it shows the URL before opening it; third-party scanner apps often auto-open links\n2. **Check for tampering** — Look for stickers placed over printed codes, misaligned labels, or codes that look newer than the surface around them\n3. **Don't scan codes from unsolicited sources** — emails, texts, or flyers you didn't expect\n4. **Never enter payment info** from a QR code without confirming the URL matches the official site\n5. **For parking, pay inside** when possible, or use the city's official app rather than a meter QR code\n\n### If You Scanned a Bad Code\n- Don't enter any information on the page that opens\n- Close the browser tab immediately\n- If you entered payment info, call your bank right away`
  },

  // INTERMEDIATE
  {
    id: "internships", title: "Job & Internship Scams", icon: Briefcase, color: "bg-purple-100 text-purple-600",
    difficulty: "intermediate", minutes: 6,
    content: `## Fake Job & Internship Scams\n\nFake job offers are surging on LinkedIn, Indeed, and Handshake — targeting students hungry for experience.\n\n### Warning Signs\n- No interview required\n- Pay is unrealistically high for entry-level work\n- Asked to pay for training, equipment, or a background check\n- Communication only via text, WhatsApp, or Telegram\n- Company cannot be verified online\n- Requests SSN or bank info before starting\n\n### Most Common Types\n**Fake Check Scam:** Receive a "company check" to buy supplies. Deposit it, send money back. The check bounces days later.\n\n**Reshipping Scam:** Receive packages at home and forward them. You're handling stolen goods.\n\n**Pyramid Scheme:** "Ambassador" or "marketing coordinator" role where pay depends on recruiting others.\n\n**Equipment Scam:** "Pay $200 for your work laptop before your first day." Never happens in real jobs.\n\n### Verification Checklist\n1. Search the company independently — not with info provided in the job posting\n2. Find the listing on the company's official website\n3. Look up the recruiter on LinkedIn and verify they list the company\n4. Call the company's main line to confirm the position exists\n5. Never pay any amount for any reason to start a job`
  },
  {
    id: "banking_scams", title: "Banking & Payment Scams", icon: CreditCard, color: "bg-emerald-100 text-emerald-600",
    difficulty: "intermediate", minutes: 5,
    content: `## Banking and Payment Platform Fraud\n\n### Venmo, Cash App & Zelle Scams\nThese platforms have NO fraud protection — once sent, money is almost never recovered.\n\n- **Overpayment scam:** Buyer sends too much, asks for change back. Their payment reverses.\n- **Fake payment screenshot:** Scammer sends a screenshot claiming to have paid. No actual payment made.\n- **"Send first to get more back":** Classic advance fee fraud. Always a scam.\n\n**Critical rule: Never send money to receive money.**\n\n### Fake Bank Alert Scams\n- Caller claims to be from your bank's fraud department\n- Asks you to move money to a "safe account" to protect from fraud\n- Requests your PIN, full password, or account number\n\n**What real banks do:** They will never ask for your PIN or full password. They will never ask you to move money to protect it.\n\n### Crypto Scam Patterns\n- "Double your Bitcoin" — money is sent to a wallet and never returned\n- Fake investment platforms showing inflated returns — withdrawals are blocked\n- Trading mentors with guaranteed systems\n\n### Protection Tips\n1. Set up account alerts on all financial accounts\n2. Never share your PIN or full password with anyone\n3. Call your bank directly using the number on your card if you get a suspicious alert`
  },
  {
    id: "crypto_scams", title: "Crypto & Investment Scams", icon: TrendingUp, color: "bg-yellow-100 text-yellow-700",
    difficulty: "intermediate", minutes: 6,
    content: `## Cryptocurrency and Investment Fraud\n\n### Pig Butchering\nThe most devastating crypto scam. A long-term relationship (romantic or friendship) is cultivated online over weeks or months. The scammer gradually introduces a "great investment opportunity." Victims invest increasingly large amounts before discovering the platform is fake.\n\nName comes from the practice of "fattening up" the victim before the slaughter.\n\n### Common Patterns\n- **"Double your crypto"** — Send crypto to an address, receive double back. You get nothing.\n- **Fake celebrity investment ads** — Deepfake videos of Elon Musk or MrBeast promoting platforms\n- **Fake broker platforms** — Show impressive returns; freeze your account when you try to withdraw\n- **WhatsApp investment groups** — Bots posing as successful investors share "tips"\n- **Pump and dump** — Fake hype around a coin; insiders sell, price crashes\n\n### Red Flags in Any Investment\n- Guaranteed returns (no real investment can promise this)\n- High pressure to invest quickly\n- Returns inconsistent with market conditions\n- Difficulty or impossibility of withdrawing funds\n- Found through social media or unsolicited contact\n\n### Before Investing in Anything\n- Verify the platform is registered at investor.gov\n- Search "[platform name] + scam"\n- Consult an independent, fee-only financial advisor`
  },
  {
    id: "romance", title: "Romance Scams", icon: Heart, color: "bg-rose-100 text-rose-600",
    difficulty: "intermediate", minutes: 5,
    content: `## Romance and Catfishing Scams\n\nRomance scams aren't just for older adults — young people are heavily targeted through dating apps, gaming platforms, and social media.\n\n### Warning Signs\n- Falls in love unusually fast (days to weeks)\n- Can never video call — always a technical problem\n- Photos are too perfect (reverse image search: images.google.com)\n- Stories are inconsistent or change\n- Eventually asks for money, gift cards, or crypto\n\n### The Scam Playbook\n1. **Setup** — Attractive fake profile with stolen photos\n2. **Grooming** — Weeks of affectionate conversation building trust\n3. **Isolation** — Becomes your primary emotional support\n4. **Crisis** — Medical emergency, legal trouble, stranded abroad\n5. **Ask** — Money, gift cards, or cryptocurrency "just this once"\n6. **Repeat** — New emergencies until you stop paying\n\n### Sextortion\nIf someone convinces you to share intimate photos and then threatens to send them to your contacts unless you pay:\n- Do NOT pay — it will escalate\n- Report to the FBI: ic3.gov\n- Call 1-800-CALL-FBI\n\n### How to Verify Online Relationships\n- Reverse image search their photos immediately\n- Request a video call — any refusal is a major red flag\n- Never send money to someone you haven't met in person`
  },
  {
    id: "identity_theft", title: "Identity Theft", icon: Key, color: "bg-amber-100 text-amber-700",
    difficulty: "intermediate", minutes: 6,
    content: `## Identity Theft — How It Happens & What to Do\n\n### How Scammers Get Your Information\n- **Data breaches** — Companies get hacked; your info sold on dark web\n- **Phishing** — You give it to them on a fake site\n- **Social engineering** — They call and trick you into providing it\n- **Physical theft** — Stolen mail, shoulder surfing, dumpster diving\n- **Social media oversharing** — Birthday, address, phone number visible to anyone\n\n### What They Do With Your Identity\n- Open new credit cards or loans in your name\n- File false tax returns to steal your refund\n- Access your bank accounts\n- Apply for government benefits\n- Create accounts to commit further fraud\n\n### Warning Signs\n- Unfamiliar accounts or charges on your credit report\n- Bills for services you didn't use\n- Rejected tax return because one was already filed\n- Calls from collectors about debts you don't recognize\n\n### What to Do If You're a Victim\n1. File a report at IdentityTheft.gov (FTC's official resource)\n2. Place a fraud alert or credit freeze at all three bureaus: Equifax, Experian, TransUnion\n3. Report to your bank and close compromised accounts\n4. File a police report\n5. Check your credit report at annualcreditreport.com\n\n### Prevention\n- Check your credit report quarterly\n- Use credit freezes proactively — they're free\n- Shred physical documents with personal information\n- Use strong, unique passwords with 2FA`
  },
  {
    id: "data_privacy", title: "Data Privacy Basics", icon: Database, color: "bg-indigo-100 text-indigo-700",
    difficulty: "intermediate", minutes: 5,
    content: `## Protecting Your Personal Data\n\n### What Data Are Companies Collecting?\n- Every website you visit\n- Your location (often down to street level)\n- Your purchase history\n- Who you communicate with and when\n- Your health and wellness data\n- Your political and religious interests\n\n### Why It Matters for Scam Prevention\nScammers buy data from data brokers to craft highly targeted, personalized attacks. The more they know about you, the more convincing their scam can be.\n\n### Privacy Audit — Do These Now\n1. **Google yourself** — See what's publicly visible\n2. **Review app permissions** — Camera, microphone, location, contacts\n3. **Check social media privacy settings** — Who can see your birthday, hometown, employer?\n4. **Opt out of data brokers** — Services like DeleteMe, Privacy Bee, or do it manually\n5. **Review connected apps** — Revoke access from apps you no longer use\n\n### Browser & Search Privacy\n- Use a privacy-respecting browser (Firefox, Brave)\n- Install uBlock Origin ad blocker\n- Use a VPN on public Wi-Fi\n- Search with DuckDuckGo instead of Google when concerned about tracking\n\n### The Minimal Sharing Principle\nEvery piece of personal information you share online can potentially be used against you. Share only what's necessary, only with parties you trust.`
  },
  {
    id: "mobile_security", title: "Mobile Device Security", icon: Smartphone, color: "bg-cyan-100 text-cyan-700",
    difficulty: "intermediate", minutes: 5,
    content: `## Protecting Your Phone\n\nYour phone contains more sensitive information than almost any other object you own — and it's a primary target for scammers.\n\n### Phone-Specific Threats\n- **SIM swapping** — Scammer convinces your carrier to transfer your number to their SIM, bypassing SMS 2FA\n- **Smishing** — Text-based phishing (now the most common initial contact method)\n- **Malicious apps** — Apps that appear legitimate but steal data\n- **Public Wi-Fi attacks** — Intercepting your traffic on unencrypted networks\n- **Stalkerware** — Apps installed physically that track your location and messages\n\n### Essential Phone Security Checklist\n1. Use a strong PIN (6+ digits) or biometric lock\n2. Enable full-device encryption (on by default on modern iOS/Android)\n3. Keep your OS and apps updated — patches fix security vulnerabilities\n4. Only download apps from the official App Store or Google Play\n5. Review app permissions and revoke anything unnecessary\n6. Use authenticator apps (Google Authenticator, Authy) instead of SMS for 2FA\n7. Set up a SIM PIN through your carrier settings to prevent SIM swapping\n8. Back up your data regularly\n\n### If Your Phone Is Lost or Stolen\n- **iPhone:** Use Find My at icloud.com\n- **Android:** Use Find My Device at android.com/find\n- Remote wipe immediately if you can't recover the device`
  },
  {
    id: "marketplace_scams", title: "Marketplace & Selling Scams", icon: ShoppingBag, color: "bg-orange-100 text-orange-600",
    difficulty: "intermediate", minutes: 6,
    content: `## Marketplace & Online Selling Scams\n\nFacebook Marketplace, Craigslist, OfferUp, and eBay are full of scammers targeting both buyers and sellers.\n\n### When You're the Buyer\n- **Too-good-to-be-true price** — A $1,200 iPhone listed for $300. The seller has a reason they can't meet in person.\n- **Advance payment to "hold" the item** — Once you Zelle/Venmo the deposit, the seller disappears. These apps have no buyer protection.\n- **Fake escrow services** — "Use this escrow company to hold the funds." The escrow site is fake and run by the scammer.\n- **Counterfeit goods** — Designer items, sneakers, and electronics that are convincing fakes.\n\n### When You're the Seller\n- **Overpayment scam** — Buyer "accidentally" sends too much (often a stolen check or fake payment screenshot) and asks you to refund the difference. The original payment later reverses, and you're out the refund plus the item.\n- **Fake payment confirmation** — A screenshot or email that looks like a Zelle/Venmo receipt — but no money ever arrived. Always verify in your own app, not via a screenshot.\n- **"Send me the code" scam** — Buyer asks you to send the 6-digit code Google Voice texts you "to verify you're real." They're setting up a Google Voice number in your name to run more scams.\n- **Shipping to a "mover"** — Buyer pays extra to ship to a third party. Often a cover for reshipping stolen goods.\n\n### Red Flags for Any Transaction\n- Refusal to meet in person for a local sale\n- Pressure to use Zelle, Venmo, CashApp, wire, or gift cards (no fraud protection)\n- A story about being deployed military, offshore, or out of the country\n- Generic messages sent to many sellers at once\n\n### Safe Selling & Buying Rules\n1. **Meet in person** at a safe exchange zone (many police stations offer one)\n2. **Use platforms with buyer/seller protection** — eBay, PayPal Goods & Services — never "friends and family"\n3. **Verify payments in your own app** before handing over the item\n4. **Never refund an overpayment** — it's always a scam\n5. **Never share verification codes** anyone texts you, for any reason`
  },
  {
    id: "student_loans", title: "Student Loan & Aid Scams", icon: Landmark, color: "bg-blue-100 text-blue-600",
    difficulty: "intermediate", minutes: 5,
    content: `## Student Loan & Financial Aid Scams\n\nScammers exploit the stress and confusion around student debt — especially around repayment restarts and "forgiveness" headlines.\n\n### Loan Forgiveness Scams\n- **"We can get your loans forgiven — for a fee."** Real forgiveness programs (PSLF, IDR forgiveness, Borrower Defense) are free and handled through StudentAid.gov. No company can speed them up for a fee.\n- **Fake "approval" notices** — You're told you qualify for forgiveness you never applied for, and asked to pay a processing fee or hand over your FSA ID.\n- **Imposter "loan servicers"** — Callers claiming to be your servicer ask you to "re-consolidate" or redirect payments to them.\n\n### The FSA ID Red Flag\nYour Federal Student Aid ID (StudentAid.gov login) is as sensitive as a bank password. **No legitimate company or servicer will ever ask for it.** Anyone who does is a scammer — with your FSA ID they can redirect your loans, change your contact info, and steal your aid.\n\n### Consolidation & "Relief" Company Scams\n- Companies charge $500–$1,500 upfront to "enroll" you in income-driven repayment — which you can do yourself, free, in 10 minutes at StudentAid.gov.\n- They pose as official government programs with names like "Student Relief Center" or "Federal Loan Relief."\n- They collect monthly "fees" that don't go toward your loan.\n\n### How to Handle Student Loans Safely\n1. **Go directly to StudentAid.gov** — the only official federal student aid site\n2. **Log in to your servicer's site directly** — never through a link in an email or text\n3. **Never share your FSA ID** with anyone, ever\n4. **Never pay upfront for loan help** — it's illegal for debt-relief companies to charge before settling debt\n5. **Report scams** to the FTC (reportfraud.ftc.gov) and your state attorney general\n\n### If You've Already Paid a Scammer\n- Contact your bank immediately to stop or reverse the payment\n- File an FTC report\n- Change your FSA ID password right away if you shared it`
  },

  // ADVANCED
  {
    id: "ai_scams", title: "AI-Powered Scams", icon: Bot, color: "bg-violet-100 text-violet-600",
    difficulty: "advanced", minutes: 7,
    content: `## How AI Is Transforming Scams\n\nArtificial intelligence has fundamentally changed the scam landscape — making attacks more scalable, personalized, and convincing than ever.\n\n### AI-Generated Phishing\n- AI writes perfect phishing emails with no grammar errors\n- Messages personalized using information scraped from your social media\n- AI chatbots can hold convincing real-time conversations\n\n**The old advice "look for bad grammar" no longer reliably works.**\n\n### Voice Cloning\nAI can clone anyone's voice from just 3-5 seconds of audio.\n- Grandparent scams now use the actual grandchild's voice\n- "Emergency calls" from family members you trust\n- CEO fraud using the actual executive's voice\n\n### Deepfakes\n- Real-time video deepfakes on video calls\n- Celebrity endorsement videos for fake investments\n- "Proof" videos that didn't actually happen\n\n### AI-Enhanced Social Engineering\n- Scammers use AI to analyze your social media for personalized attack vectors\n- Automated bots can simultaneously target millions of people\n- AI generates realistic fake profiles with consistent backstories\n\n### Defenses\n- **Establish family code words** for emergency calls\n- **Verify through a second channel** — hang up and call back\n- **Be skeptical of unexpected urgency** even from known voices\n- Look for deepfake tells: unnatural blinking, audio sync issues, lighting inconsistencies`
  },
  {
    id: "deepfakes", title: "Deepfakes & Impersonation", icon: Video, color: "bg-orange-100 text-orange-600",
    difficulty: "advanced", minutes: 6,
    content: `## Deepfakes: What They Are and How to Spot Them\n\n### What Are Deepfakes?\nAI-generated video and audio that replaces one person's appearance or voice with another's. What once required Hollywood studios now takes seconds on a smartphone.\n\n### How Deepfakes Are Used in Scams\n\n**Family Emergency Scams**\nClone a family member's voice from social media, then call relatives with a fabricated crisis requiring immediate payment.\n\n**Video Call Impersonation**\nReal-time deepfake video calls impersonating executives, government officials, or family members.\n\n**Celebrity Investment Ads**\nDeepfake videos of Elon Musk, MrBeast, and others promoting fake crypto platforms distributed across social media.\n\n**Sextortion via Deepfakes**\nCreating non-consensual intimate imagery from innocent photos, then threatening distribution.\n\n### How to Detect Deepfakes\n- **Eye blinking** — AI often gets this wrong (too frequent or not enough)\n- **Audio-video sync** — Mouth movement slightly mismatched with words\n- **Lighting inconsistencies** — Face lighting doesn't match the room\n- **Hairline and ear artifacts** — Look closely at edges\n- **Background distortions** — Objects near the face may appear warped\n- **Texture** — Skin may look unnaturally smooth\n\n### What to Do\n- Establish a family verification code word\n- Always verify through a second channel\n- Report to FBI: ic3.gov\n- Don't panic — that's what they're counting on`
  },
  {
    id: "voice_cloning", title: "Voice Cloning Scams", icon: Zap, color: "bg-rose-100 text-rose-700",
    difficulty: "advanced", minutes: 5,
    content: `## AI Voice Cloning: The New Frontier of Fraud\n\n### How It Works\nModern AI can clone anyone's voice from as little as 3 seconds of audio. Any video or audio you've posted online — TikToks, Instagram reels, YouTube videos, podcast appearances — is sufficient training material.\n\n### Who Is Being Targeted\n- **Grandparents** receiving calls from their "grandchild's voice" in an emergency\n- **Parents** getting calls from their child's cloned voice claiming to be kidnapped\n- **Employees** receiving voice messages from the "CEO" authorizing urgent wire transfers\n- **Anyone** whose family members have an active social media presence\n\n### Real Documented Cases\n- Family received a call from what sounded exactly like their daughter crying and saying she'd been kidnapped. She was home the entire time.\n- A company CFO was defrauded of $243,000 after receiving a voice call from what sounded like the company's CEO directing an urgent wire transfer.\n\n### Defense Strategies\n1. **Create a family code word** — A word or phrase that anyone can ask for in an emergency to confirm real identity. Make it memorable but not guessable.\n2. **Hang up and call back** — On a number you already know, not one provided during the call\n3. **Ask questions only the real person would know** — Not social media-visible information\n4. **Reduce your audio footprint** — Limit publicly available recordings of your voice when possible\n5. **Never make financial decisions** based on a single phone call, regardless of how convincing`
  },
  {
    id: "bec", title: "Business Email Compromise", icon: FileText, color: "bg-slate-100 text-slate-700",
    difficulty: "advanced", minutes: 6,
    content: `## Business Email Compromise (BEC)\n\nBEC is one of the most financially damaging forms of cybercrime, costing businesses billions annually. Understanding it protects both you and any organization you work for.\n\n### How BEC Works\n1. **Reconnaissance** — Attackers research the company, identify executives, employees, and vendors\n2. **Account compromise or spoofing** — Either hack a real email account or create a convincing fake\n3. **The request** — Impersonate an executive or vendor requesting an urgent wire transfer or gift card purchase\n4. **Urgency and secrecy** — "This is time-sensitive and confidential — don't discuss with anyone else"\n\n### Common BEC Scenarios\n- **CEO Fraud:** Email from "CEO" to CFO requesting urgent wire transfer\n- **Vendor Invoice Fraud:** Vendor's email is compromised; legitimate invoices redirected to fraudulent bank account\n- **Payroll Fraud:** HR email from "employee" requesting payroll be redirected to a new bank account\n- **Real Estate Wire Fraud:** Closing attorney's email compromised; buyer instructed to wire down payment to fraudulent account\n\n### Red Flags\n- Unusual urgency or pressure to act without verification\n- Requests to keep the communication confidential\n- Changes to established payment processes\n- Email domain that's slightly different from the real one\n\n### Prevention\n- **Always verify** financial requests via a separate communication channel\n- **Call back** using a number you already have on file — not one from the email\n- Implement multi-person authorization for any significant financial transaction\n- Train everyone with financial access on BEC patterns`
  },
  {
    id: "social_engineering", title: "Social Engineering", icon: Users, color: "bg-amber-100 text-amber-700",
    difficulty: "advanced", minutes: 6,
    content: `## The Psychology of Social Engineering\n\nSocial engineering is the art of manipulating people into giving up confidential information or taking actions that benefit the attacker. Technology is secondary — exploiting human psychology is the real weapon.\n\n### Core Psychological Principles Scammers Exploit\n\n**Authority** — We comply with those perceived as legitimate authorities (government, bank officials, tech support).\n\n**Urgency** — Manufactured deadlines bypass careful thinking. "Act now or lose access."\n\n**Social Proof** — "Everyone else is doing this." Fake testimonials, fake reviews, fake crowds.\n\n**Liking** — We trust people we like. Scammers build rapport before making requests.\n\n**Reciprocity** — If someone gives us something, we feel obligated to give back.\n\n**Scarcity** — "Only 3 spots left." Scarcity overrides rational evaluation.\n\n**Fear** — Fear of arrest, account suspension, or embarrassment clouds judgment.\n\n### Pretexting\nCreating a fabricated scenario to extract information:\n- "I'm from IT — I need your password to fix a system issue."\n- "This is your bank's fraud department — please verify your account number."\n- "I'm auditing your tax records — I need your SSN to verify your identity."\n\n### Building Immunity\n- **Slow down** whenever you feel rushed or pressured\n- **Verify through independent channels** before providing anything\n- **Know your organization's policies** — legitimate processes don't require secrecy\n- **It's okay to say no** and call back on a verified number`
  },
  {
    id: "financial_fraud", title: "Advanced Financial Fraud", icon: DollarSign, color: "bg-green-100 text-green-700",
    difficulty: "advanced", minutes: 7,
    content: `## Advanced Financial Fraud\n\n### Money Mule Schemes\nScammers recruit unwitting intermediaries to transfer money, providing plausible cover for fraud. If you receive and forward money at someone's request, you may be participating in money laundering — even if you didn't know the origin.\n\n**How people get recruited:**\n- Remote job offers involving "payment processing"\n- Romantic partners asking you to receive and forward transfers\n- Online job boards for "financial agents"\n\n### Check Fraud\nDespite seeming outdated, check fraud is resurging because banks must provisionally credit checks before they fully clear.\n\n- You can see the funds in your account before the check bounces (3-10 days later)\n- Banks hold you responsible for the full amount\n- Gift card, wire transfer, cryptocurrency payment requested in the window\n\n### Elder Financial Exploitation\n- Power of attorney abuse\n- Undue influence over financial decisions\n- Fake investment advisors targeting retirement savings\n\nIf you suspect a senior is being financially exploited, contact Adult Protective Services in your state.\n\n### Student-Specific Financial Fraud\n- **FAFSA fraud** — Someone uses your information to steal financial aid\n- **Fake scholarship fees** — Any fee to receive scholarship money\n- **Overpayment scam** applied to tutoring or selling items\n\n### Resources\n- FTC fraud reporting: reportfraud.ftc.gov\n- CFPB consumer complaints: consumerfinance.gov/complaint\n- IC3 (FBI internet crime): ic3.gov`
  },
  {
    id: "dark_web", title: "Dark Web & Data Breaches", icon: AlertTriangle, color: "bg-gray-100 text-gray-700",
    difficulty: "advanced", minutes: 6,
    content: `## Your Data on the Dark Web\n\n### What Is the Dark Web?\nA part of the internet not indexed by search engines, requiring special software (Tor) to access. Used for both legitimate privacy purposes and illegal marketplaces where stolen data is bought and sold.\n\n### What Data Is Sold There?\n- **Fullz** — Complete identity packages: name, SSN, DOB, address, bank info\n- **Login credentials** — Email/password combinations from breached sites\n- **Credit card data** — Often sold in batches of thousands\n- **Medical records** — Worth more than credit cards on dark web markets\n- **Account access** — Bank accounts, Netflix, streaming services, airline miles\n\n### Major Known Breaches Affecting Millions\n- Equifax (2017) — 147 million Americans\n- Yahoo (2016) — 3 billion accounts\n- Facebook (2021) — 533 million users\n- T-Mobile (2021) — 50 million customers\n- National Public Data (2024) — 2.9 billion records including SSNs\n\n### How to Check If You've Been Breached\n- **haveibeenpwned.com** — Check your email address against known breaches\n- **Google One / Apple's Password Monitor** — Alerts for compromised passwords\n\n### What to Do After a Breach\n1. Change the compromised password immediately\n2. Change it on any other site where you used it\n3. Enable 2FA on the affected account\n4. Place a credit freeze if personal/financial data was exposed\n5. Monitor your credit report for 12 months`
  },
  {
    id: "ransomware", title: "Ransomware & Malware", icon: Bug, color: "bg-red-100 text-red-600",
    difficulty: "advanced", minutes: 7,
    content: `## Ransomware & Malware\n\nMalware is any software designed to harm you — steal data, lock files, spy on you, or hijack your device. Ransomware is the most destructive type: it encrypts your files and demands payment to unlock them.\n\n### How You Get Infected\n- **Malicious email attachments** — A fake invoice, shipping label, or "resume" .docx/.zip/.exe\n- **Drive-by downloads** — Visiting a compromised or fake website silently installs malware\n- **Pirated software & "cracks"** — Free downloads of paid software are a top malware delivery method\n- **Fake updates** — "Your Flash player is out of date" pop-ups that install malware instead\n- **Malicious browser extensions** — Seemingly useful add-ons that harvest your data\n- **USB drops** — Scammers leave infected USB drives in public places\n\n### Types of Malware\n- **Ransomware** — Encrypts files; demands crypto payment. Even if you pay, recovery isn't guaranteed.\n- **Info-stealers** — Silently exfiltrate saved passwords, cookies, and crypto wallets, often sold in bulk on the dark web.\n- **Remote access trojans (RATs)** — Full control of your device, including camera and microphone.\n- **Banking trojans** — Modify banking pages to capture login details and redirect transfers.\n- **Stalkerware** — Installed by someone with physical access to spy on your location and messages.\n\n### Ransomware Reality\n- **Paying doesn't guarantee recovery** — Many victims pay and never get their files back, or get hit again.\n- **Healthcare, schools, and small businesses** are prime targets because they can't afford downtime.\n- **Double extortion** — Scammers threaten to publish stolen data if you don't pay the unlock fee.\n- **Backups are the only reliable defense** — if you have clean backups, you can wipe and restore without paying.\n\n### Prevention\n1. **Back up regularly** — Use the 3-2-1 rule: 3 copies, 2 different media, 1 offsite/cloud. Verify backups work.\n2. **Keep everything updated** — OS, browser, and all software. Updates patch the holes malware uses.\n3. **Use real antivirus** — Windows Defender (built in) or Malwarebytes; enable real-time protection.\n4. **Never open unexpected attachments** — even from people you know (their account may be compromised). Verify by another channel.\n5. **Don't pirate software** — the "free" version often costs you your identity.\n6. **Use an ad blocker** (uBlock Origin) to block malicious ads and fake update pop-ups.\n7. **Disable macros** in Office documents from outside your organization.\n\n### If You're Infected\n1. **Disconnect from the internet immediately** — unplug ethernet, turn off Wi-Fi. This stops data exfiltration and spread.\n2. **Don't pay the ransom** — report to IC3 (ic3.gov) and your IT department if at work.\n3. **Run a full scan** with reputable antivirus from a clean boot environment.\n4. **Restore from your most recent clean backup** if files are encrypted.\n5. **Change all passwords** from a different, known-clean device — info-stealers grab saved credentials.\n6. **Enable 2FA** on critical accounts, since stolen passwords may already be in attackers' hands.`
  },

  // EXPERT
  {
    id: "psychology", title: "Psychological Manipulation", icon: Search, color: "bg-purple-100 text-purple-700",
    difficulty: "expert", minutes: 8,
    content: `## The Deep Psychology of Fraud\n\n### Why Smart People Fall for Scams\nVictims of fraud are not stupid — research consistently shows that education and intelligence are not reliable protection. Scams exploit universal cognitive vulnerabilities:\n\n**Cognitive Load** — When overwhelmed or stressed, people rely on mental shortcuts (heuristics) rather than careful analysis. Scammers deliberately create high-stress, time-pressured situations.\n\n**Optimism Bias** — We believe bad things are more likely to happen to others than to ourselves. "I would never fall for that" is a dangerous belief.\n\n**Sunk Cost Fallacy** — In long-con scams, victims who have already invested time or money often keep going to "recover" their investment rather than cut losses.\n\n**Isolation Effect** — Once isolated from trusted friends and family, victims lose their most important protection: an outside perspective.\n\n**Trauma Bonding** — In romance scams, victims form genuine emotional attachments that persist even after learning they were deceived. Victims may continue sending money even after knowing it's a scam.\n\n### BITE Model (Used in Cults — and Scams)\n- **Behavior control** — Controlling what you do, who you see\n- **Information control** — Limiting outside information ("don't Google this, I'll explain everything")\n- **Thought control** — Discouraging critical thinking\n- **Emotional control** — Manipulating your emotional state\n\n### Building Genuine Scam Immunity\n- Recognize that you are vulnerable — everyone is\n- Build the habit of slow thinking before any financial or data-sharing decision\n- Maintain trusted relationships that provide outside perspectives\n- Practice saying "Let me think about it and get back to you" for any high-pressure request`
  },
  {
    id: "scam_economics", title: "Scam Economics", icon: TrendingUp, color: "bg-emerald-100 text-emerald-700",
    difficulty: "expert", minutes: 7,
    content: `## The Business of Fraud\n\n### The Global Fraud Economy\nFraud is not a collection of isolated criminals — it's a global, organized industry generating an estimated $1 trillion annually. Understanding the economics helps explain the scale and sophistication.\n\n### How Scam Operations Are Structured\n\n**Scam Centers (Southeast Asia)**\nOrganized operations, often trafficking victims as workers, that run industrialized fraud at scale. Workers are given scripts, monitored by managers, and required to meet daily quotas.\n\n**Fraud-as-a-Service**\nPhishing kits, malware, and fake websites sold as products on dark web markets. Anyone can purchase a pre-built phishing campaign targeting a specific bank.\n\n**Money Mule Networks**\nLayered networks of recruited intermediaries that launder fraud proceeds, making tracing nearly impossible.\n\n### Why Scams Are So Hard to Stop\n- Most operations are in jurisdictions with limited US/EU law enforcement reach\n- Losses under certain thresholds receive minimal investigation resources\n- Victims often feel shame and don't report\n- Crypto enables near-untraceable international transfers\n- Infrastructure is rebuilt rapidly after takedowns\n\n### What Actually Works\n- **International cooperation:** FBI, Interpol, Europol joint operations\n- **Bank-level friction:** Banks adding verification steps for high-risk transfers\n- **Education at scale** — The most cost-effective defense\n- **Reporting culture** — Every report to IC3 and the FTC contributes to pattern detection and prosecutions`
  },
  {
    id: "fraud_investigation", title: "Fraud Investigation Methods", icon: Search, color: "bg-blue-100 text-blue-700",
    difficulty: "expert", minutes: 7,
    content: `## How Fraud Is Investigated\n\n### OSINT (Open Source Intelligence)\nInvestigators use publicly available information to identify and trace scammers:\n\n- **Reverse image search** — Identify stolen profile photos\n- **Domain WHOIS records** — Find registration dates and (sometimes) registrant information\n- **Email header analysis** — Trace the originating server of phishing emails\n- **Phone number lookup** — Identify carrier and origination area\n- **Social media cross-referencing** — Find duplicate profiles and inconsistencies\n\n### Tools You Can Use\n- **images.google.com** — Reverse image search profile photos\n- **whois.domaintools.com** — Research suspicious website registrations\n- **haveibeenpwned.com** — Check email breach history\n- **virustotal.com** — Analyze suspicious links and files\n- **Google Cache / Wayback Machine** — See how a website looked in the past\n\n### How to Document a Scam\n1. Take timestamped screenshots of all communications\n2. Note dates, times, and what was said or requested\n3. Save email headers (not just the email body)\n4. Record all phone numbers, email addresses, and URLs involved\n5. Preserve evidence before blocking or deleting\n\n### Where to Report\n- **FTC:** reportfraud.ftc.gov — Most important for US enforcement\n- **FBI IC3:** ic3.gov — Internet and organized fraud\n- **USPS Inspection Service:** postalinspectors.uspis.gov\n- **Your state attorney general** — Many have consumer fraud divisions\n- **CFPB:** consumerfinance.gov — Financial fraud`
  },
  {
    id: "digital_forensics", title: "Digital Forensics Basics", icon: Database, color: "bg-indigo-100 text-indigo-700",
    difficulty: "expert", minutes: 6,
    content: `## Digital Forensics for Everyday Users\n\n### What Is Digital Forensics?\nThe process of collecting, preserving, and analyzing digital evidence. While forensics experts do complex work, basic techniques are useful for documenting fraud.\n\n### Preserving Evidence\n**Screenshots with metadata:** Use tools that capture timestamps. On Windows: Snipping Tool (includes time). On Mac: Shift+Cmd+4.\n\n**Email headers:** Contain routing information showing where an email actually originated.\n- In Gmail: Open email → Three dots → Show original\n- In Outlook: File → Properties → Internet headers\n\n**URL analysis before clicking:**\n- Hover to see the real destination\n- Use urlscan.io to safely analyze suspicious URLs\n- Use virustotal.com to check links and files\n\n### Metadata in Images\nPhotos contain EXIF data including:\n- Camera make and model\n- GPS coordinates where the photo was taken\n- Date and time of capture\n\nThis can help verify (or disprove) claims about where a photo was taken — useful in romance scam investigations. Tool: exifdata.com\n\n### Chain of Custody\nWhen preserving evidence for law enforcement:\n- Don't alter or edit files\n- Document where and when you found each piece of evidence\n- Store in a dedicated folder, backed up in multiple places\n- Provide copies to investigators — not originals\n\n### Limitations\nDigital forensics has limits — sophisticated scammers use VPNs, Tor, and cryptocurrency to obscure their identities. But even partial information contributes to law enforcement pattern analysis.`
  },
  {
    id: "future_scams", title: "Future Scam Trends", icon: Globe, color: "bg-teal-100 text-teal-700",
    difficulty: "expert", minutes: 6,
    content: `## The Future of Fraud\n\n### Emerging Technologies Scammers Will Exploit\n\n**Increasingly Convincing Deepfakes**\nAs AI video quality improves, real-time deepfake video calls will become indistinguishable from real people. "Seeing is believing" will no longer be a reliable safeguard.\n\n**Personalized AI Phishing at Scale**\nAI will enable mass-personalization of phishing attacks — every email will reference your actual name, employer, recent purchases, and connections. Currently only possible for high-value targets; soon available for everyone.\n\n**Quantum Computing Threats**\nLong-term: quantum computers may eventually break current encryption methods. Passwords and financial security as we know them may require fundamental overhaul.\n\n**Augmented Reality Scams**\nAs AR glasses become common, scammers will create overlaid fake information — fake QR codes, fake currency, fake verification displays in physical spaces.\n\n**IoT Device Exploitation**\nSmart home devices are largely unsecured. Scammers will increasingly use compromised smart devices to surveil victims, interrupt services, and demand payment.\n\n### Near-Term Trends (2025-2027)\n- AI voice and video calling scams reaching mainstream scale\n- Increasingly targeted attacks using aggregated data from multiple breaches\n- Scam centers shifting tactics after law enforcement focus on Southeast Asia\n- Crypto-native scams evolving faster than regulatory frameworks\n- Mental health platform and medical data targeting\n\n### How to Stay Ahead\n- Follow cybersecurity news: Krebs on Security, Bleeping Computer, FTC alerts\n- Update your mental model of what "proof" means — video and voice are no longer reliable verification\n- Advocate for better consumer protection legislation\n- Teach others — community education is the most scalable defense we have`
  },
];

const LEVEL_ORDER = ["beginner", "intermediate", "advanced", "expert"];
const LEVEL_COLORS = {
  beginner: "text-emerald-600",
  intermediate: "text-amber-600",
  advanced: "text-red-600",
  expert: "text-purple-700",
};
const LEVEL_BG = {
  beginner: "bg-emerald-50 text-emerald-700 border-emerald-100",
  intermediate: "bg-amber-50 text-amber-700 border-amber-100",
  advanced: "bg-red-50 text-red-700 border-red-100",
  expert: "bg-purple-50 text-purple-700 border-purple-100",
};

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
          <ArrowLeft className="w-4 h-4" /> Back to modules
        </Button>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${mod.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold">{mod.title}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge className={`text-[10px] border capitalize ${LEVEL_BG[mod.difficulty]}`}>{mod.difficulty}</Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {mod.minutes} min read
                </span>
                {isComplete && <span className="text-[10px] text-emerald-600 font-semibold">✓ Completed</span>}
              </div>
            </div>
          </div>
          <Card className="border-0 shadow-lg shadow-black/5">
            <CardContent className="p-6">
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
            <div className="mt-4 flex items-center justify-center gap-2 text-emerald-600 text-sm font-semibold">
              <span>🏅</span> Module completed! Keep going.
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3 border border-primary/20">
          <BookOpen className="w-3.5 h-3.5" />
          Education Center
        </div>
        <h1 className="text-2xl font-heading font-bold">Learn to Spot Scams</h1>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-sm text-muted-foreground">{modules.length} modules</p>
          <div className="flex items-center gap-1.5">
            <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${(completedModules.length / modules.length) * 100}%` }} />
            </div>
            <span className="text-xs text-muted-foreground">{completedModules.length}/{modules.length} done</span>
          </div>
        </div>
      </div>

      {LEVEL_ORDER.map((level) => {
        const levelModules = modules.filter(m => m.difficulty === level);
        return (
          <div key={level} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <h2 className={`text-xs font-bold uppercase tracking-wider capitalize ${LEVEL_COLORS[level]}`}>{level}</h2>
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">{levelModules.filter(m => completedModules.includes(m.id)).length}/{levelModules.length} completed</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {levelModules.map((mod, i) => {
                const Icon = mod.icon;
                const isComplete = completedModules.includes(mod.id);
                return (
                  <motion.div key={mod.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <Card
                      className={`border-0 shadow-md hover:shadow-lg cursor-pointer group transition-all ${isComplete ? "opacity-75" : ""}`}
                      onClick={() => setSelectedModule(mod.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${mod.color} ${isComplete ? "opacity-60" : ""}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors leading-snug flex-1">
                                {mod.title}
                              </h3>
                              {isComplete && <span className="text-emerald-500 text-xs shrink-0">✓</span>}
                            </div>
                            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1.5">
                              <Clock className="w-3 h-3" /> {mod.minutes} min
                            </span>
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
      })}
    </div>
  );
}