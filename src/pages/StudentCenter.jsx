import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Briefcase, BookOpen, DollarSign, CreditCard, Users, Globe, Star, FlaskConical, Trophy, ChevronRight, ArrowLeft, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  {
    id: "fake_scholarships",
    icon: Star,
    color: "bg-blue-100 text-blue-700",
    title: "Fake Scholarships",
    count: "Most Common",
    preview: "You 'won' a scholarship you never applied for — a classic red flag.",
    description: "Fake scholarship scams target students desperate for financial aid by offering money that doesn't exist.",
    redFlags: [
      "You're told you 'won' without applying",
      "Requires a fee to claim the award",
      "Asks for your bank account or SSN",
      "No official website or verifiable organization",
      "High-pressure deadline ('expires today!')",
      "Contact comes via text or personal email"
    ],
    examples: [
      { title: "National Education Fund Scholarship", detail: "Email claims you've been selected for a $5,000 award. To 'process your scholarship,' you must pay a $75 registration fee. After payment, the contact disappears." },
      { title: "FastTrack Scholarship Program", detail: "Social media ad: 'Students with a 2.5+ GPA qualify for $2,000 instantly.' The 'application' collects your SSN and bank routing number." },
      { title: "Academic Excellence Award", detail: "Text message: 'Congratulations! Your academic record qualifies you for the $3,500 Academic Excellence Award. Reply YES to claim.' Leads to a data-harvesting form." }
    ],
    tips: [
      "Legitimate scholarships never charge application or processing fees",
      "Verify every scholarship on the official organization's .edu or .org website",
      "Search '[scholarship name] + scam' before providing any information",
      "Use only verified resources: Scholarships.com, FAFSA.gov, Fastweb.com, your school's aid office"
    ]
  },
  {
    id: "fake_internships",
    icon: Briefcase,
    color: "bg-purple-100 text-purple-700",
    title: "Fake Internships",
    count: "High Risk",
    preview: "Dream internship with no interview — if only that were real.",
    description: "Fake internship postings flood LinkedIn, Handshake, and Indeed, targeting students hungry for experience.",
    redFlags: [
      "No interview required — immediate offer",
      "Salary is unrealistically high for entry-level work",
      "Asks for payment for 'training materials' or equipment",
      "Communication only via text, Telegram, or WhatsApp",
      "Company cannot be verified online",
      "Requests SSN, bank info, or ID scan before starting"
    ],
    examples: [
      { title: "Fake Google Remote Internship", detail: "A 'Google recruiter' on LinkedIn offers a $45/hr remote data internship with no experience required. They ask you to purchase a $300 'equipment kit' before your start date." },
      { title: "Fake Marketing Internship", detail: "Attractive job posting for 'Digital Marketing Intern' at a vague company. After accepting, you're sent a check for $2,000 and told to buy gift cards for 'software licenses' and send them back." },
      { title: "Campus Ambassador Scam", detail: "You're hired as a 'Brand Ambassador' and given a code to share. But you're actually promoting a pyramid scheme and paid only if you recruit others." }
    ],
    tips: [
      "Verify the company independently — look for it on LinkedIn, Glassdoor, and Google Maps",
      "Legitimate employers never ask you to pay before starting",
      "Apply only through official company career pages when possible",
      "If it's on Handshake, check the employer's verification badge"
    ]
  },
  {
    id: "fake_tutoring",
    icon: BookOpen,
    color: "bg-green-100 text-green-700",
    title: "Fake Tutoring Jobs",
    count: "Growing Trend",
    preview: "Easy tutoring gig that turns into a check-cashing scheme.",
    description: "Tutoring job scams target students looking for flexible part-time work by posing as families or schools.",
    redFlags: [
      "Immediate hire with no interview or background check",
      "Offered pay far above market rate ($80-100/hr for basic tutoring)",
      "Client 'accidentally' overpays and asks you to refund the difference",
      "Contact found through Craigslist or suspicious job boards",
      "Never meets in person or video calls"
    ],
    examples: [
      { title: "Overpayment Tutoring Scam", detail: "'Parent' hires you as a tutor and sends a check for $1,200 — more than agreed. They ask you to cash it and send back $800 via Zelle. The original check bounces and you're out $800." },
      { title: "Fake School District Tutor", detail: "Email claims to be from a local school district hiring tutors at $75/hr. They ask for your bank account to 'set up direct deposit' before you meet any students." }
    ],
    tips: [
      "Use established platforms: Wyzant, Tutor.com, or your school's tutoring board",
      "Never accept overpayment checks from clients",
      "Meet clients in person at libraries or public places before exchanging payment info",
      "Real employers never pay you before you start working"
    ]
  },
  {
    id: "fafsa_scams",
    icon: DollarSign,
    color: "bg-amber-100 text-amber-700",
    title: "FAFSA Scams",
    count: "Peak Season",
    preview: "Fake FAFSA 'verification' emails designed to steal your federal aid.",
    description: "FAFSA scams spike every year during financial aid season, tricking students and parents into handing over sensitive information.",
    redFlags: [
      "Email not from a .gov or .edu domain",
      "Asks you to 'verify' your FSA ID via a link",
      "Requests payment to 'process' or 'expedite' your FAFSA",
      "Promises to help increase your aid amount for a fee",
      "Creates urgency: 'Your FAFSA application will be cancelled'"
    ],
    examples: [
      { title: "FAFSA Verification Email", detail: "Email appearing to be from 'Federal Student Aid' with a link to 'verify your account.' The site looks identical to FAFSA.gov but harvests your FSA ID and password." },
      { title: "Financial Aid Consultant Scam", detail: "Someone claims they can get you significantly more aid for a $300 consultation fee. FAFSA is free — no consultant can change your Expected Family Contribution." }
    ],
    tips: [
      "FAFSA is always free at FAFSA.gov — never pay anyone to file it",
      "Bookmark the official site: studentaid.gov",
      "The FSA never contacts you by text about account issues",
      "Your school's financial aid office will contact you from a .edu email address"
    ]
  },
  {
    id: "student_loans",
    icon: CreditCard,
    color: "bg-red-100 text-red-700",
    title: "Student Loan Scams",
    count: "High Volume",
    preview: "Fake loan forgiveness programs that steal your payments.",
    description: "With student loan debt at record levels, scammers exploit borrowers with fake forgiveness programs and 'debt relief' services.",
    redFlags: [
      "Promises guaranteed loan forgiveness or elimination",
      "Asks for your FSA ID to 'apply on your behalf'",
      "Upfront fee required to access relief programs",
      "Pressure to act before a deadline",
      "Claims to be affiliated with the Department of Education but has a non-.gov email"
    ],
    examples: [
      { title: "Loan Forgiveness Scam", detail: "Company charges $500 to 'apply' for loan forgiveness programs that are actually free through studentaid.gov. They pocket your money and do nothing." },
      { title: "FSA ID Theft", detail: "Scammers posing as 'student loan advocates' ask for your FSA ID to 'process your relief application.' With your login, they redirect payments and steal your identity." }
    ],
    tips: [
      "All federal loan forgiveness programs are free at studentaid.gov",
      "Never share your FSA ID — treat it like a bank password",
      "Legitimate loan servicers are listed at studentaid.gov/manage-loans/repayment/servicers",
      "If in doubt, call your actual loan servicer directly"
    ]
  },
  {
    id: "admissions_consultants",
    icon: Users,
    color: "bg-rose-100 text-rose-700",
    title: "Fake College Admissions Consultants",
    count: "Growing",
    preview: "Paid thousands for 'guaranteed admission' that never came.",
    description: "Fake admissions consultants prey on anxious students and parents by promising guaranteed results they can't deliver.",
    redFlags: [
      "Guarantees admission to specific schools",
      "Claims 'special relationships' with admissions officers",
      "Asks for large upfront payments (thousands of dollars)",
      "No verifiable credentials, reviews, or references",
      "Won't provide a written contract"
    ],
    examples: [
      { title: "Guaranteed Ivy League Admission", detail: "Consultant charges $15,000 and promises 'guaranteed' admission to Ivy League schools through alleged 'inside connections.' Student applies, gets rejected, consultant disappears." }
    ],
    tips: [
      "No legitimate consultant can guarantee admission",
      "Verify consultants through the Independent Educational Consultants Association (IECA)",
      "Your school's college counselor offers free guidance",
      "Be wary of any service asking for large upfront payments"
    ]
  },
  {
    id: "study_abroad",
    icon: Globe,
    color: "bg-cyan-100 text-cyan-700",
    title: "Fake Study Abroad Programs",
    count: "Seasonal",
    preview: "Paid thousands for a study abroad program that didn't exist.",
    description: "Fake study abroad programs collect deposits and tuition then disappear, leaving students stranded.",
    redFlags: [
      "Program not affiliated with an accredited university",
      "Asks for large deposits before official acceptance",
      "Limited online presence or vague program details",
      "No verifiable alumni or reviews",
      "Communication feels rushed or inconsistent"
    ],
    examples: [
      { title: "European Summer Semester Scam", detail: "Students pay $4,000 deposits for a 'semester abroad in Paris.' Upon arrival, the housing doesn't exist and the organization has vanished." }
    ],
    tips: [
      "Only use study abroad programs approved by your school's international office",
      "Verify programs with the Forum on Education Abroad",
      "Never pay deposits before official university enrollment confirmation",
      "Check if credits will transfer before committing"
    ]
  },
  {
    id: "ambassador_programs",
    icon: Star,
    color: "bg-orange-100 text-orange-700",
    title: "Fake Ambassador Programs",
    count: "Social Media Driven",
    preview: "Free products, big commissions — actually a pyramid scheme.",
    description: "Fake campus ambassador programs use social media to recruit students into pyramid schemes or unpaid promotion.",
    redFlags: [
      "Promises high commissions for 'just sharing' a product",
      "Requires you to recruit others to earn",
      "Products are overpriced or of questionable quality",
      "No guaranteed base pay",
      "Emphasis is on recruitment, not actual sales"
    ],
    examples: [
      { title: "Wellness Product Ambassador", detail: "Recruited on Instagram to sell supplements as a 'Campus Brand Ambassador.' You must buy $200 of product to start and are paid only when you recruit new ambassadors, not on sales." }
    ],
    tips: [
      "Real ambassador programs pay you — they don't require you to buy product",
      "Research the company's business model before joining",
      "If income depends on recruiting, it's likely a pyramid scheme",
      "Legitimate brand deals come through verified company contacts, not random DMs"
    ]
  },
  {
    id: "research_opportunities",
    icon: FlaskConical,
    color: "bg-indigo-100 text-indigo-700",
    title: "Fake Research Opportunities",
    count: "Academic Targeting",
    preview: "Paid research stipend that required 'processing fees' first.",
    description: "Fake research positions target academically motivated students with prestigious-sounding opportunities.",
    redFlags: [
      "Unsolicited email offering a prestigious research position",
      "Requires payment for background check, materials, or training",
      "Professor or institution cannot be verified",
      "Communication from a personal Gmail, not a university email",
      "Asks for personal information very early in the process"
    ],
    examples: [
      { title: "NIH Remote Research Scam", detail: "Email from 'Dr. Johnson at NIH' offering a $2,500/month remote research stipend. To 'process your appointment,' they require a $150 background check fee paid by gift card." }
    ],
    tips: [
      "Legitimate university research positions are posted on official department websites",
      "Real research opportunities come from faculty you've worked with or applied to through official channels",
      "Federal agencies like NIH and NSF never charge fees",
      "Verify researchers at their institution's faculty directory"
    ]
  },
  {
    id: "academic_competitions",
    icon: Trophy,
    color: "bg-yellow-100 text-yellow-700",
    title: "Fake Academic Competitions",
    count: "Niche Scam",
    preview: "Won a national competition you never entered — suspicious!",
    description: "Fake academic competitions collect entry fees from ambitious students and award prizes that don't exist.",
    redFlags: [
      "You're notified you've won without entering",
      "Requires an entry fee or 'processing fee' to claim prize",
      "Award ceremony requires you to buy tickets or travel",
      "Organization has no credible history or verifiable winners",
      "Winning notification comes via generic email or text"
    ],
    examples: [
      { title: "National Academic Achievement Award", detail: "Letter notifies you of a $1,000 award for 'academic excellence.' To attend the ceremony and collect your award, you must purchase a $350 ticket and register online — where your info is harvested." }
    ],
    tips: [
      "You cannot win a competition you didn't enter",
      "Verify competitions through your school's academic affairs office",
      "Legitimate competitions are listed on official educational organization websites",
      "Any fee to receive a prize is a definitive scam indicator"
    ]
  }
];

export default function StudentCenter() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const cat = categories.find(c => c.id === selected);
    const Icon = cat.icon;
    return (
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-12">
        <Button variant="ghost" size="sm" className="gap-1.5 mb-4 text-muted-foreground" onClick={() => setSelected(null)}>
          <ArrowLeft className="w-4 h-4" /> Back to Student Center
        </Button>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${cat.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold">{cat.title}</h1>
              <Badge variant="secondary" className="text-[10px] mt-0.5">{cat.count}</Badge>
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3 border border-blue-100">
          <GraduationCap className="w-3.5 h-3.5" />
          Student Safety Center
        </div>
        <h1 className="text-2xl font-heading font-bold">Scams Targeting Students</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Comprehensive guides for {categories.length} scam types specifically targeting students, college applicants, and young adults
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
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{cat.title}</h3>
                        <Badge variant="outline" className="text-[10px] shrink-0">{cat.count}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-snug">{cat.preview}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <span>{cat.redFlags.length} red flags</span>
                        <span>·</span>
                        <span>{cat.examples.length} example{cat.examples.length !== 1 ? "s" : ""}</span>
                      </div>
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