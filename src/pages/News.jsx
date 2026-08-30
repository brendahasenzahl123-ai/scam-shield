import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import usePullToRefresh from "@/hooks/usePullToRefresh";
import PullToRefreshIndicator from "@/components/ui/PullToRefreshIndicator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle, ShieldAlert, Eye, ChevronDown, ChevronUp,
  Target, Users, MapPin, Calendar, CheckCircle2
} from "lucide-react";

const SEVERITY_CONFIG = {
  info: { border: "border-l-blue-400", badgeCls: "bg-blue-100 text-blue-700", icon: Eye, label: "Advisory" },
  warning: { border: "border-l-amber-400", badgeCls: "bg-amber-100 text-amber-700", icon: AlertTriangle, label: "Warning" },
  critical: { border: "border-l-red-500", badgeCls: "bg-red-100 text-red-700", icon: ShieldAlert, label: "Active Threat" },
};

const FILTER_TABS = [
  "All", "Students", "Families", "Seniors", "Financial", "Jobs",
  "Scholarships", "AI", "Social Media", "Delivery", "Banking",
];

const ALERTS = [
  { title: "Fake FAFSA Verification Email Campaign", category: "Scholarships", audience: "Students", severity: "critical", date: "Jun 2025", geo: "Nationwide", status: "Active", desc: "Phishing emails impersonating the U.S. Department of Education ask students to 'verify' their FSA ID credentials on a fake site. Victims lose access to financial aid accounts.", target: "High school seniors and college students applying for federal aid", signs: ["Email not from .gov domain", "Urgent 'verify immediately or lose aid' language", "Link goes to fafsa-verify.net or similar fake domain"], safe: ["Only access FAFSA at studentaid.gov", "Never enter FSA ID on a linked page — type the URL directly", "Report suspicious emails to phishing@ed.gov"] },
  { title: "USPS Delivery Notification Text Scam", category: "Delivery", audience: "All", severity: "critical", date: "Jun 2025", geo: "Nationwide", status: "Active", desc: "Text messages claiming a package couldn't be delivered and asking recipients to click a link and pay a small redelivery fee. The link steals credit card info.", target: "Online shoppers and anyone expecting deliveries", signs: ["USPS texts never include payment links", "Unusual domain (usps-track.net, delivery-notice.com)", "Requests payment via link for 're-delivery fee'"], safe: ["Track packages only at usps.com", "Never pay fees via a text message link", "Report smishing to spam@uspis.gov"] },
  { title: "AI Voice Clone Family Emergency Scam", category: "AI", audience: "Seniors", severity: "critical", date: "Jun 2025", geo: "Nationwide", status: "Active", desc: "Scammers use AI to clone a family member's voice and call grandparents claiming to be in jail, a hospital, or an accident — demanding immediate wire transfers or gift cards.", target: "Adults 60+, grandparents", signs: ["Unusual urgency, 'don't tell mom/dad'", "Requests gift cards or wire transfer specifically", "Caller sounds like a family member but story doesn't add up"], safe: ["Hang up and call the family member directly on a known number", "Establish a family code word for emergencies", "Never send gift cards based on a phone call"] },
  { title: "Fake Summer Internship Recruitment", category: "Jobs", audience: "Students", severity: "critical", date: "May 2025", geo: "Nationwide", status: "Active", desc: "Fake Fortune 500 company recruiters contact students via LinkedIn and email with high-paying remote internship offers, ultimately collecting personal info or getting victims to cash fraudulent checks.", target: "College students and recent graduates", signs: ["Job pays unusually high for entry-level remote work", "No formal interview required", "Recruiter uses Gmail or Yahoo, not company domain"], safe: ["Verify the recruiter on the company's official website", "Never cash checks for a new employer before starting", "Look up the company on LinkedIn independently"] },
  { title: "TikTok Crypto Giveaway Scam", category: "Social Media", audience: "Students", severity: "critical", date: "May 2025", geo: "Nationwide", status: "Active", desc: "Deepfake videos of Elon Musk, MrBeast, and other influencers promoting fake crypto giveaways. Victims are asked to 'send crypto to receive double back.'", target: "TikTok users ages 16-30", signs: ["Giveaway requires sending cryptocurrency first", "Video looks slightly off or audio doesn't match lips", "No verifiable source for the giveaway"], safe: ["Real giveaways never ask you to send money first", "Check the account creation date — scam accounts are new", "Report deepfake ads to TikTok directly"] },
  { title: "Instagram Brand Ambassador DM Scam", category: "Social Media", audience: "Students", severity: "warning", date: "May 2025", geo: "Nationwide", status: "Active", desc: "Fake brand accounts DM users offering ambassador programs for free products. Victims are asked to pay upfront for 'shipping' or provide bank info for 'direct deposit commissions.'", target: "Instagram users ages 16-28 with smaller followings", signs: ["Account reached out without any prior interaction", "Brand account has few posts and followers", "Requests personal payment info before any product is received"], safe: ["Research the brand independently", "Never pay for an 'ambassador' role", "Legitimate brands never DM-only approach influencers"] },
  { title: "Discord Nitro Phishing Campaign", category: "Social Media", audience: "Students", severity: "critical", date: "Apr 2025", geo: "Nationwide", status: "Active", desc: "DMs sent from compromised Discord accounts offer free Nitro subscriptions via a link that redirects to a fake Discord login page to steal credentials.", target: "Discord users ages 13-25, gamers", signs: ["Link goes to discordapp.gift or similar — not discord.com", "Friend's account seems unlike their normal behavior", "Site asks for login to 'claim' a prize"], safe: ["Discord will never send Nitro via a DM link", "Enable 2FA on your Discord account now", "If a friend sends it, verify on a voice call before clicking"] },
  { title: "Fake Apple ID Security Alert", category: "Financial", audience: "All", severity: "warning", date: "Apr 2025", geo: "Nationwide", status: "Active", desc: "Emails and texts warning of suspicious Apple ID activity, redirecting victims to a fake Apple login page that captures credentials and two-factor codes in real time.", target: "iPhone and Mac users of all ages", signs: ["Email sender domain not @apple.com", "Extreme urgency: 'your account will be locked in 24 hours'", "Login page URL contains 'apple' but on a different domain"], safe: ["Go directly to appleid.apple.com — never follow email links", "Use Sign in with Apple where available", "Enable two-factor authentication"] },
  { title: "IRS Tax Refund Text Message Scam", category: "Banking", audience: "Families", severity: "warning", date: "Apr 2025", geo: "Nationwide", status: "Monitoring", desc: "Text messages claiming to be from the IRS notifying victims of an unclaimed tax refund. Link leads to a form asking for SSN, bank details, and driver's license.", target: "Taxpayers of all ages, especially during and after tax season", signs: ["IRS never contacts taxpayers via text or social media", "Link contains 'irs-refund' but not the official irs.gov domain", "Requests banking information to 'deposit' the refund"], safe: ["The IRS only contacts by mail first — always", "Report IRS scams to phishing@irs.gov", "Check your actual refund status only at irs.gov/refunds"] },
  { title: "Amazon Refund Overpayment Scam", category: "Financial", audience: "Seniors", severity: "warning", date: "Apr 2025", geo: "Nationwide", status: "Active", desc: "Callers pose as Amazon support agents claiming a refund was processed incorrectly and too much was deposited. They ask victims to send back the 'overpayment' via gift cards.", target: "Adults 50+, frequent Amazon shoppers", signs: ["Call came in unexpectedly — Amazon doesn't cold call", "They're asking you to buy gift cards to 'return' money", "Pressure to act quickly before the 'error' is flagged"], safe: ["Amazon will never ask for gift card payments via phone", "Hang up and go to amazon.com/contact to verify", "Report at amazon.com/reportascam"] },
  { title: "Netflix Billing Scam Email", category: "Banking", audience: "Families", severity: "warning", date: "Mar 2025", geo: "Nationwide", status: "Monitoring", desc: "Emails falsely warning that a Netflix payment failed and threatening account suspension. The link leads to a fake payment form that captures card details.", target: "Netflix subscribers of all ages", signs: ["Sender email is not @netflix.com", "Generic greeting: 'Dear Customer'", "Link URL contains 'netflix' but is a different domain"], safe: ["Log in to Netflix directly at netflix.com to check billing", "Never update payment info through an email link", "Use a virtual card number for streaming subscriptions"] },
  { title: "PayPal Account Verification Phishing", category: "Banking", audience: "All", severity: "warning", date: "Mar 2025", geo: "Nationwide", status: "Active", desc: "Emails posing as PayPal claim that account activity requires immediate identity verification. The fake page captures payment credentials and personal information.", target: "PayPal users of all ages", signs: ["Email not from @paypal.com", "Links go to paypal-verification.com or similar", "Urgent language about account limitations"], safe: ["Access PayPal only at paypal.com by typing it manually", "Enable Security Key or 2FA on your PayPal account", "Report phishing emails to spoof@paypal.com"] },
  { title: "Fake Student Ambassador Invitation", category: "Jobs", audience: "Students", severity: "info", date: "Mar 2025", geo: "Nationwide", status: "Active", desc: "Emails offering prestigious-sounding student ambassador roles for brands or organizations, asking students to pay for 'kits,' 'uniforms,' or 'training materials.'", target: "High school and college students active in clubs or social media", signs: ["Never heard of the company before receiving the email", "Payment required before starting the role", "Contact is via personal Gmail, not corporate email"], safe: ["Legitimate ambassador programs never charge participants", "Research the company independently before engaging", "Ask to speak with a current ambassador to verify"] },
  { title: "Fake College Acceptance Email", category: "Scholarships", audience: "Students", severity: "warning", date: "Mar 2025", geo: "Nationwide", status: "Active", desc: "Students receive fake acceptance emails from real universities. To 'confirm enrollment,' they're directed to a payment portal to pay a deposit to a fraudulent account.", target: "High school seniors and transfer students", signs: ["Email domain doesn't match the official university domain", "Request for wire transfer or payment app instead of official portal", "No mention in the university's actual applicant portal"], safe: ["Always verify acceptance through the official applicant portal", "Never wire money for an enrollment deposit — use official payment methods", "Call the admissions office directly using the number on the school's website"] },
  { title: "Facebook Marketplace Overpayment Scam", category: "Financial", audience: "All", severity: "warning", date: "Feb 2025", geo: "Nationwide", status: "Active", desc: "Buyer sends a check for more than the asking price and asks the seller to wire back the difference before the check clears. The check later bounces.", target: "Private sellers on Facebook Marketplace", signs: ["Buyer insists on paying by check and offers more than asking price", "Asks you to send the difference via Zelle or wire transfer", "Rushes the transaction without meeting in person"], safe: ["Only accept cash or verified payment for local sales", "Wait for checks to fully clear before releasing items", "Use Facebook Pay for in-app transactions when possible"] },
  { title: "Zelle Payment Reversal Scam", category: "Banking", audience: "All", severity: "critical", date: "Feb 2025", geo: "Nationwide", status: "Active", desc: "Scammers pose as bank fraud departments, tell victims their account is compromised, and instruct them to 'protect' their money by sending it via Zelle to themselves — which actually sends it to the scammer.", target: "Bank customers of all ages", signs: ["Bank supposedly called you — banks don't do this for Zelle issues", "Told to 'move' money to a safe account via Zelle", "Urgency: act now or lose your money"], safe: ["Hang up and call your bank's official number on the back of your card", "Zelle transfers cannot be reversed — treat them like cash", "Banks never ask you to move money to protect it"] },
  { title: "Fake Study Abroad Scholarship", category: "Scholarships", audience: "Students", severity: "warning", date: "Feb 2025", geo: "Nationwide", status: "Active", desc: "Students receive emails or social media messages claiming they've been selected for a fully-funded study abroad program. A processing fee is required to secure the 'spot.'", target: "College students interested in international programs", signs: ["Never applied for this scholarship", "Requires upfront fee to 'claim' the award", "Organization name is vague or hard to verify"], safe: ["Search the organization name + 'scam' before responding", "Legitimate scholarships never charge application or processing fees", "Contact your university's study abroad office to verify"] },
  { title: "Crypto Pump-and-Dump Discord Server", category: "AI", audience: "Students", severity: "warning", date: "Jan 2025", geo: "Nationwide", status: "Monitoring", desc: "Discord servers promote obscure cryptocurrencies as 'hidden gems,' orchestrating pump-and-dump schemes that leave ordinary investors with worthless tokens while organizers profit.", target: "Young adults interested in cryptocurrency, ages 16-30", signs: ["Server admin promises guaranteed returns", "Urgency to buy before the coin 'moons'", "Server recently created, members added rapidly"], safe: ["Research any coin on CoinGecko and check trading history", "Be skeptical of any investment tip from Discord or Telegram", "If you can't understand how money is made, you're likely the product"] },
  { title: "Deepfake Celebrity Investment Ad", category: "AI", audience: "All", severity: "critical", date: "Jan 2025", geo: "Nationwide", status: "Active", desc: "AI-generated video ads using deepfakes of Elon Musk, Warren Buffett, and other celebrities promoting fake investment platforms. The platforms accept deposits but never allow withdrawals.", target: "Social media users, cryptocurrency enthusiasts", signs: ["Celebrity movement or lip sync looks slightly unnatural", "Investment platform has no verifiable physical address", "Minimum investment required to 'unlock' returns"], safe: ["Real celebrities don't endorse investments via social media ads", "Verify any platform with FINRA's BrokerCheck", "Report deepfake ads to the platform and to the FTC"] },
  { title: "LinkedIn Fake Job Offer Scam", category: "Jobs", audience: "Students", severity: "warning", date: "Jan 2025", geo: "Nationwide", status: "Active", desc: "Fake recruiters with polished LinkedIn profiles reach out with high-paying, easy remote jobs that require upfront payment for 'training materials' or result in check-cashing schemes.", target: "College students and recent graduates job hunting", signs: ["Job offer comes before any application or interview", "Recruiter profile was created recently", "Asks you to buy supplies or cash a check upfront"], safe: ["Verify recruiter by searching their name + company on LinkedIn", "Use LinkedIn's 'Is this a legitimate job?' report tool", "Never pay to get a job — ever"] },
  { title: "Grandparent Emergency Scam (AI Enhanced)", category: "Seniors", audience: "Seniors", severity: "critical", date: "Dec 2024", geo: "Nationwide", status: "Active", desc: "Fraudsters call grandparents using AI-cloned voices of their grandchildren claiming to be in legal or medical emergencies and needing immediate money via gift cards or wire transfer.", target: "Adults 60-80 with grandchildren", signs: ["Call came in from an unfamiliar number", "Grandchild 'can't talk right now' but a lawyer or officer stays on the line", "Request is specifically for gift cards or wire transfer"], safe: ["Hang up immediately and call your grandchild directly", "Establish a secret family emergency code word", "Do not send money based on any phone call alone"] },
  { title: "Medicare Supplement Scam Calls", category: "Seniors", audience: "Seniors", severity: "warning", date: "Dec 2024", geo: "Nationwide", status: "Active", desc: "Callers claim to offer free Medicare benefits or supplemental coverage and ask for Medicare numbers to 'update records.' Information is used for medical identity theft.", target: "Medicare recipients 65+", signs: ["Caller says your Medicare card needs to be replaced", "Asks for your Medicare number over the phone", "Offers free gifts in exchange for your information"], safe: ["Medicare will never call asking for your number", "Guard your Medicare card like a credit card", "Report Medicare fraud at 1-800-MEDICARE"] },
  { title: "Tech Support Pop-Up Scam", category: "Seniors", audience: "Seniors", severity: "warning", date: "Dec 2024", geo: "Nationwide", status: "Active", desc: "Browser pop-ups display alarming Microsoft or Apple security warnings and a phone number to call. Victims are granted remote access, then charged hundreds of dollars for fake 'repairs.'", target: "Adults 50+, less tech-savvy users", signs: ["Pop-up has a phone number and won't close easily", "Warning says your computer has been 'hacked' or 'locked'", "Caller requests remote access software like AnyDesk"], safe: ["Force-close the browser (Alt+F4 on Windows) — don't call the number", "Real Microsoft and Apple alerts never include phone numbers", "Call a trusted local tech professional if concerned"] },
  { title: "Fake Charity Scam (Disaster Relief)", category: "Families", audience: "Families", severity: "warning", date: "Nov 2024", geo: "Nationwide", status: "Monitoring", desc: "Following major natural disasters or news events, fake charity websites and social media pages solicit donations that never reach victims.", target: "Compassionate donors of all ages", signs: ["Organization has no verifiable history on Charity Navigator", "Solicits donations via gift cards or wire transfer", "Website created within days of the disaster"], safe: ["Donate only through established charities verifiable on charitynavigator.org", "Search the charity name + 'scam' or 'review' before donating", "Use BBB's Wise Giving Alliance to verify organizations"] },
  { title: "Work-From-Home Reshipping Scheme", category: "Jobs", audience: "All", severity: "warning", date: "Nov 2024", geo: "Nationwide", status: "Active", desc: "Victims are hired as 'package inspectors' or 'shipping coordinators,' receiving and re-shipping packages that are actually purchased with stolen credit cards.", target: "Job seekers of all ages looking for remote work", signs: ["Job pays well for minimal effort — receiving and shipping boxes", "No formal interview, just an online form", "Employer sends 'supplies' you need to ship to a third address"], safe: ["Participating unknowingly still makes you liable — report it immediately", "Legitimate employers never pay you to ship packages from home", "Search the company name on the FTC's scam database"] },
  { title: "Venmo Romance Scam", category: "Financial", audience: "All", severity: "warning", date: "Nov 2024", geo: "Nationwide", status: "Active", desc: "Online romantic interests build trust over weeks or months, eventually requesting money via Venmo, Zelle, or CashApp for medical emergencies, travel costs, or business investments.", target: "Adults on dating apps and social media, all ages", signs: ["You've never met in person or on a live video call", "Relationship progresses unusually fast with constant flattery", "First financial request seems small and reasonable"], safe: ["Never send money to someone you haven't met in person", "Reverse image search their profile photos", "Talk to a trusted friend or family member before sending money"] },
  { title: "Fake IRS Agent Phone Call", category: "Financial", audience: "All", severity: "warning", date: "Oct 2024", geo: "Nationwide", status: "Monitoring", desc: "Callers posing as IRS agents threaten immediate arrest, license suspension, or deportation unless taxes are paid immediately via wire transfer or gift cards.", target: "Taxpayers, immigrants, and adults 30-65", signs: ["IRS never calls demanding immediate payment without mailing a bill first", "Caller refuses to give badge number or supervisor name", "Demands payment via gift cards, wire transfer, or crypto"], safe: ["Hang up immediately — the IRS calls after sending mail", "Report to the Treasury Inspector General at 1-800-366-4484", "If you owe taxes, go directly to IRS.gov to verify"] },
  { title: "Fake Parking Ticket QR Code Scam", category: "Financial", audience: "All", severity: "info", date: "Oct 2024", geo: "Urban Areas", status: "Active", desc: "Fake parking tickets placed on windshields contain QR codes that link to fake payment portals designed to steal credit card information.", target: "Car owners in urban areas", signs: ["Ticket looks slightly different from official city tickets", "QR code leads to a site that doesn't match the city's official domain", "Payment options include Venmo or CashApp"], safe: ["Look up your city's official parking violation site manually", "Search your license plate on the city's official portal", "If unsure, call the parking enforcement number listed on the city website"] },
  { title: "Student Loan Forgiveness Scam", category: "Scholarships", audience: "Students", severity: "warning", date: "Oct 2024", geo: "Nationwide", status: "Active", desc: "Scammers capitalize on student loan news by calling or emailing borrowers offering guaranteed forgiveness programs that require upfront fees or FSA ID access.", target: "Student loan borrowers ages 20-40", signs: ["Charges upfront fees for forgiveness applications", "Claims to have special access to forgiveness programs not available publicly", "Asks for your FSA ID username and password"], safe: ["Student loan help is always free at studentaid.gov", "Never give your FSA ID to anyone — it's like a password", "Report scams to the Consumer Financial Protection Bureau (CFPB)"] },
  { title: "Gift Card Draining Scam", category: "Financial", audience: "All", severity: "info", date: "Sep 2024", geo: "Retail Stores", status: "Monitoring", desc: "Scammers open gift cards in stores, photograph the numbers, repackage them, and drain the balance after purchase — leaving buyers with empty cards.", target: "Gift card purchasers at retail stores", signs: ["Packaging looks tampered with — bent, re-taped, or scratched", "PIN scratch-off appears used or covered with a sticker", "Balance is zero when checked right after purchase"], safe: ["Buy gift cards from behind the counter or from locked displays", "Check the balance immediately at the register before leaving", "Consider digital gift cards purchased directly from the brand's app"] },
  { title: "Fake Online Store / Dropshipping Scam", category: "Financial", audience: "Families", severity: "info", date: "Sep 2024", geo: "Nationwide", status: "Monitoring", desc: "Professionally designed online stores advertise trending products at steep discounts, collect payment, and either ship cheap knockoffs or nothing at all.", target: "Online shoppers looking for deals", signs: ["Prices are 60-80% below other retailers", "Only accepts credit card but no PayPal or trusted payment methods", "Website was registered within the last few months"], safe: ["Use Whois to check domain registration date before purchasing", "Buy from established retailers or Amazon third-party sellers with reviews", "Pay with credit card — it offers better fraud protection than debit"] },
  { title: "Scholarship Search Site Data Harvesting", category: "Scholarships", audience: "Students", severity: "info", date: "Aug 2024", geo: "Nationwide", status: "Monitoring", desc: "Fake scholarship matching websites collect detailed personal information during sign-up and sell it to lead generation companies, triggering spam calls and texts.", target: "High school and college students searching for financial aid", signs: ["Site asks for SSN, income, or bank info during 'registration'", "Scholarship list never appears — just a form asking for more info", "Immediately after signing up, spam calls begin"], safe: ["Use established resources: FastWeb, Scholarships.com, College Board", "Never provide SSN on a scholarship matching site", "Use a separate email address for scholarship searches"] },
  { title: "Fake Business Email Compromise (BEC)", category: "Jobs", audience: "All", severity: "critical", date: "Aug 2024", geo: "Nationwide", status: "Active", desc: "Emails impersonating executives or vendors direct employees to urgently wire funds or update payment information. Losses average $100,000+ per incident.", target: "Small business employees, accountants, HR departments", signs: ["Request for urgent wire transfer from a C-suite executive via email", "Slight variation in email domain (ceo@company-inc.com vs company.com)", "Request to keep the transaction confidential"], safe: ["Always verify wire transfer requests via phone using a known number", "Establish a two-person approval process for any wire transfer", "Report to the FBI's IC3 at ic3.gov immediately"] },
  { title: "Fake WhatsApp Account Verification", category: "Social Media", audience: "All", severity: "warning", date: "Jul 2024", geo: "Nationwide", status: "Active", desc: "Victims receive a WhatsApp message from a known contact whose account was hijacked, asking them to forward a 6-digit code 'accidentally' sent to their phone.", target: "WhatsApp users of all ages", signs: ["Contact seems to be asking for a code they claim was sent to you by mistake", "The request comes with unusual urgency", "After sharing, your own account immediately gets compromised"], safe: ["Never share your WhatsApp verification code with anyone", "Enable two-step verification in WhatsApp Settings", "If a contact's behavior seems off, call them to verify"] },
  { title: "Fake Research Opportunity Scam", category: "Jobs", audience: "Students", severity: "info", date: "Jul 2024", geo: "Nationwide", status: "Active", desc: "Students receive official-looking emails from professors or research institutions offering paid research assistant positions, ultimately requesting bank account information for direct deposit.", target: "Undergraduate and graduate students", signs: ["Offer comes from a professor you've never interacted with", "Application process is unusually quick with no interview", "Early request for bank account information for 'direct deposit setup'"], safe: ["Verify the professor exists on the university's official website", "Check with your department's administrative office", "Never provide banking info before starting a job and receiving an official offer"] },
  { title: "Fake Utility Shutoff Threat", category: "Families", audience: "Seniors", severity: "warning", date: "Jun 2024", geo: "Nationwide", status: "Active", desc: "Callers pose as utility company representatives threatening immediate power shutoff unless a payment is made within the hour via prepaid card or Zelle.", target: "Homeowners and seniors, especially in summer and winter months", signs: ["Utility company called you — they don't do this before disconnection", "Payment demanded within a very short window", "Requests prepaid debit card, gift card, or Zelle payment"], safe: ["Hang up and call your utility company using the number on your bill", "Real utilities mail notices and have payment plans", "Never pay a bill via gift card or payment app for a utility"] },
  { title: "Rental Listing Scam", category: "Financial", audience: "All", severity: "warning", date: "Jun 2024", geo: "Nationwide", status: "Active", desc: "Fraudulent apartment listings on Craigslist and Facebook Marketplace use stolen photos and ask for deposits before showing the property. After payment, the 'landlord' disappears.", target: "Young adults and students searching for housing", signs: ["Rent is significantly below market rate for the area", "Landlord can't meet in person due to being 'out of the country'", "Requests deposit via Venmo, Zelle, or wire before any showing"], safe: ["Never pay a deposit without seeing the property in person", "Verify the listing on Google Maps against Street View", "Use a licensed realtor or verified rental platform"] },
  { title: "Fake SNAP/EBT Benefit Phishing", category: "Families", audience: "Families", severity: "warning", date: "May 2024", geo: "Nationwide", status: "Monitoring", desc: "Texts and emails claim EBT benefits have been suspended or that a new card is required. Victims are directed to fake state agency sites where their card numbers are stolen.", target: "SNAP recipients and low-income families", signs: ["Text from unknown number claiming to be a state agency", "Link doesn't go to your state's official .gov domain", "Requests EBT card number and PIN online"], safe: ["Contact your state SNAP office using the number on your EBT card", "Never enter your EBT PIN on any website", "Report EBT theft to your state's SNAP fraud hotline"] },
  { title: "Fake Prize Winning Notification", category: "Financial", audience: "Seniors", severity: "info", date: "May 2024", geo: "Nationwide", status: "Monitoring", desc: "Victims are notified by mail, phone, or email that they've won a sweepstakes and must pay taxes or fees upfront to claim the prize.", target: "Adults 50+", signs: ["You don't remember entering the sweepstakes", "Must pay fees or taxes before receiving your 'prize'", "Asked to keep the winnings confidential"], safe: ["Legitimate sweepstakes never require upfront payment", "You cannot win a contest you didn't enter", "Report prize scams to the FTC at reportfraud.ftc.gov"] },
  { title: "Puppy/Pet Scam", category: "Financial", audience: "Families", severity: "info", date: "Apr 2024", geo: "Nationwide", status: "Monitoring", desc: "Fake breeders advertise desirable puppies at low prices online, collecting deposits and shipping fees before the pet ever arrives — because it never existed.", target: "Families looking for pets online", signs: ["Breeder only communicates online and won't video-call with the puppy", "Unusually low price for a purebred dog", "Requests wire transfer or Zelle for deposit and shipping"], safe: ["Always visit the breeder in person or request a live video call", "Search for the breeder's photos using Google reverse image search", "Buy from local shelters or verified breeders with physical addresses"] },
  { title: "Fake Investment Seminar / Webinar Scam", category: "Financial", audience: "All", severity: "info", date: "Apr 2024", geo: "Nationwide", status: "Monitoring", desc: "Free webinars promising to teach 'secret' investing strategies pressure attendees to purchase expensive coaching packages or invest in platforms the host profits from.", target: "Adults looking for passive income, ages 25-55", signs: ["Seminar is 'free' but pushes expensive upsells", "Promises specific high returns ('make $5,000/week')", "Limited time offer at the end to pressure immediate decisions"], safe: ["Research any investment educator's credentials on FINRA BrokerCheck", "Never make investment decisions under time pressure", "Consult a fee-only fiduciary financial advisor for legitimate guidance"] },
  { title: "Fake Debt Collector Threat", category: "Banking", audience: "All", severity: "warning", date: "Mar 2024", geo: "Nationwide", status: "Monitoring", desc: "Callers impersonating debt collectors or law enforcement threaten arrest or lawsuits over fake debts, pressuring immediate payment via wire or gift card.", target: "Adults with any history of credit or loans", signs: ["Refuses to provide written verification of the debt", "Threatens immediate arrest unless you pay now", "Requests payment via gift card, wire transfer, or cryptocurrency"], safe: ["Under the FDCPA, you have the right to demand written verification", "Real debt collectors cannot threaten arrest", "Report fake collectors to the CFPB and FTC"] },
  { title: "Lottery Scam Email", category: "Financial", audience: "Seniors", severity: "info", date: "Feb 2024", geo: "Nationwide", status: "Monitoring", desc: "Emails claim the recipient has won a foreign lottery or a large cash prize. To claim it, they must first pay taxes, legal fees, or processing charges.", target: "Adults 50+", signs: ["You didn't enter any lottery", "Prize requires prepayment of fees", "Email from a free service like Gmail or Yahoo claiming to be from a government agency"], safe: ["No legitimate lottery requires upfront payment to claim winnings", "Foreign lottery participation by U.S. residents is illegal anyway", "Delete and report to spam@uce.gov"] },
  { title: "Social Security Benefits Suspension Robocall", category: "Seniors", audience: "Seniors", severity: "warning", date: "Jan 2024", geo: "Nationwide", status: "Monitoring", desc: "Automated calls claim the victim's Social Security number has been linked to criminal activity and their benefits will be suspended unless they call back immediately.", target: "Adults 60+ on Social Security", signs: ["The SSA never suspends benefits via robocall", "Requires calling back an unfamiliar number", "Asks for your SSN, Medicare number, or bank info to 'verify'"], safe: ["Hang up — the SSA communicates by mail first", "Report to the SSA's Office of Inspector General: 1-800-269-0271", "You can also file a report online at oig.ssa.gov"] },
  { title: "Fake Bank Text Alert Smishing", category: "Banking", audience: "All", severity: "warning", date: "Jan 2024", geo: "Nationwide", status: "Active", desc: "Text messages appearing to come from major banks like Chase, Bank of America, or Wells Fargo alert victims to 'suspicious charges' and ask them to click a link to verify.", target: "Bank account holders of all ages", signs: ["Text contains a link — real bank alerts don't include login links", "Slight misspellings in the bank name or generic greeting", "Link goes to a lookalike domain (chase-alerts.com)"], safe: ["Never click a link in a banking text — log in directly through the app", "Call the number on the back of your debit card to verify", "Enable official alerts through your bank's mobile app"] },
  { title: "Fake Scholarship from Fake Foundation", category: "Scholarships", audience: "Students", severity: "warning", date: "Dec 2023", geo: "Nationwide", status: "Monitoring", desc: "Students receive official-looking scholarship award letters from foundations that don't exist. Accepting requires paying a small 'processing fee' to release the funds.", target: "High school and college students", signs: ["Foundation name doesn't appear in any verifiable nonprofit database (GuideStar)", "Award amount is unusually high for unknown organization", "Processing fee required to claim the scholarship"], safe: ["Verify any nonprofit on IRS's Tax Exempt Organization Search or GuideStar", "Never pay a fee to receive scholarship money", "Consult your school's financial aid office before responding"] },
  { title: "SIM Swap / Phone Number Takeover", category: "Banking", audience: "All", severity: "critical", date: "Nov 2023", geo: "Nationwide", status: "Active", desc: "Fraudsters convince your mobile carrier to transfer your phone number to their SIM card, letting them intercept 2FA codes and take over bank, email, and social media accounts.", target: "Anyone who uses SMS-based two-factor authentication", signs: ["Your phone suddenly shows 'No Service' or 'Emergency Calls Only'", "You receive unexpected texts about account changes", "You're suddenly locked out of accounts you didn't touch"], safe: ["Set a port-out PIN with your carrier", "Use an authenticator app (Google Authenticator, Authy) instead of SMS for 2FA", "Place a security freeze with all three credit bureaus"] },
  { title: "Vishing: Fake Bank Fraud Department Call", category: "Banking", audience: "All", severity: "critical", date: "Oct 2023", geo: "Nationwide", status: "Active", desc: "Callers spoof real bank phone numbers and pose as fraud departments, warning of suspicious activity and walking victims through steps that actually authorize fraudulent transfers.", target: "Bank customers of all ages", signs: ["Call appears to come from your bank's official number (spoofed)", "They know your name and partial account info — still can be a scam", "Asks you to confirm a 'test' transfer to verify your identity"], safe: ["Hang up and call the number on the back of your card", "Banks never ask you to make a transfer to verify your identity", "Report vishing to the FTC at reportfraud.ftc.gov"] },
  { title: "Fake Subscription Cancellation Scam", category: "Financial", audience: "All", severity: "info", date: "Sep 2023", geo: "Nationwide", status: "Monitoring", desc: "Emails or calls claim the victim has been enrolled in an expensive subscription that will renew shortly. Victims call back and are instructed to download remote access software to 'cancel.'", target: "Adults of all ages with online subscriptions", signs: ["Charge amount is unusually specific ($299.99) to seem credible", "Calls urgently ask you to install software to 'process the refund'", "Email comes from a Gmail address, not a company domain"], safe: ["Check your actual bank statement before acting on any such claim", "Never install software at the request of an unsolicited caller", "If concerned, cancel subscriptions directly through your account settings"] },
  { title: "Fake Online Tutoring Job Scam", category: "Jobs", audience: "Students", severity: "info", date: "Aug 2023", geo: "Nationwide", status: "Monitoring", desc: "Seemingly legitimate online tutoring jobs ask applicants to purchase their own materials or 'training software' as part of onboarding, then disappear after receiving payment.", target: "College students seeking flexible part-time work", signs: ["Requires purchase of specific software or materials before starting", "Company website has very little information or is recently created", "Pay is unusually high for tutoring with no experience required"], safe: ["Established tutoring platforms (Wyzant, Tutor.com) never charge tutors", "Research the company name on the BBB and Glassdoor", "Trust your instincts — if onboarding seems off, it probably is"] },
];

function AlertCard({ alert, index }) {
  const [expanded, setExpanded] = useState(false);
  const sev = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.info;
  const Icon = sev.icon;
  const statusColor = alert.status === "Active" ? "bg-red-50 text-red-600 border-red-100" : alert.status === "Monitoring" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-emerald-50 text-emerald-600 border-emerald-100";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Card className={`border-0 shadow-sm border-l-4 ${sev.border} hover:shadow-md transition-shadow`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${sev.badgeCls}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1.5 flex-wrap">
                <h3 className="font-semibold text-sm leading-snug flex-1">{alert.title}</h3>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColor}`}>{alert.status}</span>
                  <Badge className={`${sev.badgeCls} text-[10px] border-0`}>{sev.label}</Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="outline" className="text-[10px]">{alert.category}</Badge>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" />{alert.audience}</span>
                {alert.date && <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{alert.date}</span>}
                {alert.geo && <span className="text-[10px] text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{alert.geo}</span>}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{alert.desc}</p>

              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs text-primary font-medium mt-2 hover:underline"
              >
                {expanded ? <><ChevronUp className="w-3 h-3" /> Less</> : <><ChevronDown className="w-3 h-3" /> Full advisory</>}
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 space-y-3 pt-3 border-t border-border/50">
                      {alert.target && (
                        <div className="flex items-start gap-2">
                          <Target className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">Who is targeted</p>
                            <p className="text-xs">{alert.target}</p>
                          </div>
                        </div>
                      )}
                      {alert.signs?.length > 0 && (
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Warning signs</p>
                          <div className="space-y-1">
                            {alert.signs.map((sign, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs">
                                <span className="text-red-500 shrink-0">🚩</span><span>{sign}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {alert.safe?.length > 0 && (
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">How to stay safe</p>
                          <div className="space-y-1">
                            {alert.safe.map((tip, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs">
                                <span className="text-emerald-500 shrink-0">✓</span><span>{tip}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function News() {
  const [activeFilter, setActiveFilter] = useState("All");
  // News is static data — pull-to-refresh just gives tactile feedback
  const { pullY, refreshing } = usePullToRefresh(useCallback(() => new Promise(r => setTimeout(r, 600)), []));

  const filtered = activeFilter === "All"
    ? ALERTS
    : ALERTS.filter(a => a.audience === activeFilter || a.category === activeFilter);

  const criticalCount = ALERTS.filter(a => a.severity === "critical").length;
  const activeCount = ALERTS.filter(a => a.status === "Active").length;

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-12">
      <PullToRefreshIndicator pullY={pullY} refreshing={refreshing} />
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold mb-3 border border-red-100">
          <ShieldAlert className="w-3.5 h-3.5" />
          Threat Alerts
        </div>
        <h1 className="text-2xl font-heading font-bold">Active Threat Intelligence</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Current scam campaigns, consumer protection alerts, and emerging fraud patterns — updated continuously
        </p>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
          <p className="text-[11px] text-red-600 font-medium">Active Threats</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-amber-600">{activeCount}</p>
          <p className="text-[11px] text-amber-600 font-medium">Live Alerts</p>
        </div>
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-primary">{ALERTS.length}</p>
          <p className="text-[11px] text-primary font-medium">Total Advisories</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeFilter === tab ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((alert, i) => (
          <AlertCard key={alert.title} alert={alert} index={i} />
        ))}
      </div>
    </div>
  );
}