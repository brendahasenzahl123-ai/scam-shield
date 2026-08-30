/**
 * Legal document content for ScamShield.
 * Used by LegalModal and TermsAgreement components.
 * Apple App Store Review Guideline 1.2 compliance.
 */

export const SUPPORT_EMAIL = "scamshieldsafety@gmail.com";

export const TERMS_OF_USE = `
# Terms of Use / EULA

Last updated: August 2026

## 1. Agreement to Terms

By creating an account or using ScamShield, you agree to be bound by these Terms of Use ("Terms"). If you do not agree to these Terms, do not use the app.

## 2. Description of Service

ScamShield is a community-powered consumer protection platform that helps users detect, understand, and report online scams. The app provides scam analysis tools, educational content, community reporting, and alert services.

## 3. ZERO TOLERANCE Policy

ScamShield has a ZERO TOLERANCE policy for the following types of user-generated content:

- Harassment or bullying
- Threats of violence or harm
- Hate speech or discriminatory content
- Sexually explicit or obscene material
- Scams or fraudulent content
- Spam or repetitive unsolicited content
- Abusive behavior toward other users
- Illegal content or activities
- Any other objectionable user-generated content

Violating content will be removed. Accounts responsible for serious or repeated violations may be suspended or permanently removed from the platform.

## 4. User-Generated Content

You are solely responsible for any content you post to ScamShield, including community reports, comments, and profile information. You agree not to post content that:

- Violates the Community Standards
- Is unlawful, harmful, threatening, abusive, harassing, defamatory, or hateful
- Contains personal information of others without consent
- Infringes on intellectual property rights
- Impersonates another person or entity

ScamShield reserves the right to moderate, remove, or restrict access to any content that violates these Terms.

## 5. Content Moderation

All user-generated content is subject to moderation. ScamShield uses automated filtering and human review to enforce Community Standards. Content may be removed without notice if it violates these Terms.

## 6. Reporting and Blocking

Users can report objectionable content and block other users. Reports are reviewed by our moderation team within 24 hours. Blocked users' content will not appear in your feed.

## 7. Account Suspension

ScamShield may suspend or terminate accounts that violate these Terms. Suspended or banned users cannot publish content.

## 8. Disclaimer of Warranties

ScamShield is provided "as is" without warranties of any kind. Scam analysis results are for informational purposes only and do not constitute legal, financial, or professional advice.

## 9. Limitation of Liability

ScamShield is not liable for damages arising from the use of the app or reliance on its content.

## 10. Changes to Terms

ScamShield may update these Terms at any time. Continued use after changes constitutes acceptance.

## 11. Contact

For questions about these Terms, contact: [${SUPPORT_EMAIL}](mailto:${SUPPORT_EMAIL})
`;

export const PRIVACY_POLICY = `
# Privacy Policy

Last updated: August 2026

## 1. Information We Collect

- **Account information**: Email address, display name, and authentication data when you create an account.
- **Scan data**: Text, links, and images you submit for scam analysis.
- **Community content**: Posts, comments, and reports you create.
- **Usage data**: How you interact with the app (pages visited, features used).

## 2. How We Use Your Information

- To provide scam analysis and educational content
- To display your community contributions
- To improve our services and features
- To enforce Community Standards and Terms of Use

## 3. Data Redaction

Personal information (emails, phone numbers, SSNs, credit card numbers) is automatically redacted from user-generated content before publication.

## 4. Data Sharing

We do not sell your personal information. We may share data when required by law or to protect the safety of users.

## 5. Data Retention

Your data is retained while your account is active. You can request account deletion at any time.

## 6. Your Rights

You can access, correct, or delete your personal information. Contact [${SUPPORT_EMAIL}](mailto:${SUPPORT_EMAIL}) for data requests.

## 7. Children's Privacy

ScamShield is not directed at children under 13 and does not knowingly collect data from children under 13.

## 8. Security

We implement reasonable security measures to protect your data. No method of transmission is 100% secure.

## 9. Changes to This Policy

We may update this Privacy Policy at any time. Continued use after changes constitutes acceptance.

## 10. Contact

For privacy questions, contact: [${SUPPORT_EMAIL}](mailto:${SUPPORT_EMAIL})
`;

export const COMMUNITY_STANDARDS = `
# Community Standards

Last updated: August 2026

## Our Commitment

ScamShield is a community-powered platform dedicated to protecting people from online scams. We require all community members to treat each other with respect and contribute to a safe, educational environment.

## ZERO TOLERANCE Policy

ScamShield has ZERO TOLERANCE for the following content:

### Harassment and Bullying
- Targeted attacks, intimidation, or humiliation of other users
- Repeated unwanted contact or messaging
- Posting private information about others (doxxing)

### Threats
- Threats of violence or physical harm
- Threats of sexual violence
- Encouragement of self-harm or suicide

### Hate Speech
- Slurs or derogatory language based on race, ethnicity, religion, gender, sexual orientation, disability, or nationality
- Content that promotes discrimination or exclusion

### Sexually Explicit Content
- Pornography or sexually explicit images
- Sexual solicitation or exploitation
- Content sexualizing minors

### Scams and Fraud
- Using the platform to scam or defraud others
- Posting fraudulent offers or schemes
- Promoting illegal activities

### Spam
- Repetitive or unsolicited content
- Excessive links or promotional content
- Irrelevant or off-topic posts

### Abusive Behavior
- Verbal abuse or name-calling
- Trolling or deliberately disruptive behavior
- Impersonation of other users

### Illegal Content
- Content that violates applicable laws
- Promotion of illegal goods or services
- Content that facilitates illegal activity

## Consequences

Violating content will be removed. Accounts responsible for serious or repeated violations may be:
- Temporarily suspended
- Permanently banned

## Reporting

If you see content that violates these standards, use the Report option on any post or comment. Reports are reviewed within 24 hours.

## Blocking

You can block any user whose content you do not wish to see. Blocked users' content will immediately disappear from your feed and will not appear in the future.

## Educational Content

Discussions about scams, fraud techniques, and how to recognize them are encouraged. Using scam-related terminology in an educational context is NOT a violation of these standards.

## Contact

To report a violation or ask about a moderation decision, contact: [${SUPPORT_EMAIL}](mailto:${SUPPORT_EMAIL})
`;

export const REPORT_REASONS = [
  { value: "harassment", label: "Harassment or bullying" },
  { value: "hate_speech", label: "Hate speech" },
  { value: "threats", label: "Threatening or dangerous content" },
  { value: "sexual", label: "Sexual or inappropriate content" },
  { value: "scam_fraud", label: "Scam or fraud" },
  { value: "spam", label: "Spam" },
  { value: "misinformation", label: "False or misleading information" },
  { value: "other", label: "Other" },
];