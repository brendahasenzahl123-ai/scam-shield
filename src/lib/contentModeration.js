/**
 * Content moderation utility — screens user-generated content BEFORE publication.
 * Catches profanity, hate speech, sexual content, threats, and spam patterns.
 * Does NOT block educational discussions about scams, fraud, or phishing.
 */

// Severe profanity (checked as whole words to reduce false positives)
const PROFANITY_WORDS = [
  "fuck", "fucking", "fucker", "motherfucker",
  "shit", "shitty",
  "bitch", "bastard",
  "asshole", "dickhead", "douchebag",
  "slut", "whore",
];

// Hate speech: racial slurs, homophobic slurs, ableist slurs
const HATE_SPEECH_WORDS = [
  "nigger", "nigga", "chink", "spic", "kike", "wetback",
  "raghead", "towelhead", "gook",
  "faggot", "tranny", "retard", "midget", "cripple",
];

// Sexually explicit terms (educational terms like "sexting" excluded)
const SEXUAL_WORDS = [
  "porn", "penis", "vagina", "boobs", "tits", "cock",
  "pussy", "dick pic", "nudes", "horny",
  "masturbat", "orgasm", "cumshot", "creampie",
];

// Threat phrases (checked as substrings in normalized text)
const THREAT_PATTERNS = [
  "i will kill you", "i'll kill you", "i will kill u",
  "i will hurt you", "i'll hurt you",
  "i will find you", "i'll find you",
  "i'm going to kill", "i am going to kill",
  "i will rape", "i'll rape", "i'm going to rape",
  "i will beat you", "i'll beat you",
  "i will attack you", "i'll attack you",
  "going to shoot you", "will shoot you",
  "you should die", "go kill yourself", "go die",
];

function normalize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function checkWordList(text, wordList) {
  const normalized = normalize(text);
  const words = normalized.split(" ");
  for (const word of wordList) {
    if (words.includes(word)) return word;
  }
  return null;
}

function checkSubstrings(text, patterns) {
  const normalized = normalize(text);
  for (const pattern of patterns) {
    if (normalized.includes(pattern)) return pattern;
  }
  return null;
}

function checkSpam(text) {
  if (!text) return null;
  // Excessive caps: >60% caps and at least 20 letters
  const letters = text.replace(/[^a-zA-Z]/g, "");
  if (letters.length > 20) {
    const caps = letters.replace(/[^A-Z]/g, "").length;
    if (caps / letters.length > 0.6) return "excessive capitalization";
  }
  // Repeated single character (e.g. "!!!!!!!" or "aaaaaaa")
  if (/(.)\1{7,}/.test(text)) return "repeated characters";
  // Excessive URLs
  const urls = text.match(/https?:\/\/\S+/gi);
  if (urls && urls.length > 3) return "excessive links";
  return null;
}

/**
 * Moderate a single text field.
 * @param {string} text
 * @returns {{ isViolating: boolean, violationType?: string, matchedTerm?: string, message?: string }}
 */
export function moderateContent(text) {
  if (!text || !text.trim()) return { isViolating: false };

  const profanity = checkWordList(text, PROFANITY_WORDS);
  if (profanity) {
    return {
      isViolating: true,
      violationType: "profanity",
      matchedTerm: profanity,
      message: "This content contains profanity that violates our Community Standards. Please remove inappropriate language and try again.",
    };
  }

  const hate = checkWordList(text, HATE_SPEECH_WORDS);
  if (hate) {
    return {
      isViolating: true,
      violationType: "hate_speech",
      matchedTerm: hate,
      message: "This content contains hate speech that violates our Community Standards. Please remove offensive language and try again.",
    };
  }

  const sexual = checkSubstrings(text, SEXUAL_WORDS);
  if (sexual) {
    return {
      isViolating: true,
      violationType: "sexual",
      matchedTerm: sexual,
      message: "This content contains sexually explicit material that violates our Community Standards. Please remove it and try again.",
    };
  }

  const threat = checkSubstrings(text, THREAT_PATTERNS);
  if (threat) {
    return {
      isViolating: true,
      violationType: "threats",
      matchedTerm: threat,
      message: "This content contains threatening language that violates our Community Standards. Please remove it and try again.",
    };
  }

  const spam = checkSpam(text);
  if (spam) {
    return {
      isViolating: true,
      violationType: "spam",
      matchedTerm: spam,
      message: "This content appears to be spam. Please revise your post and try again.",
    };
  }

  return { isViolating: false };
}

/**
 * Moderate multiple text fields at once.
 * Returns the first violation found, or { isViolating: false } if all pass.
 * @param {string[]} texts
 */
export function moderateContentArray(texts) {
  for (const text of texts) {
    const result = moderateContent(text);
    if (result.isViolating) return result;
  }
  return { isViolating: false };
}