import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "password-generator",
  name: "Password Generator",
  slug: "password-generator",
  category: "utilities",
  path: "utilities/password-generator",

  shortDescription: "Generate cryptographically secure, customizable passwords using Web Crypto API.",
  longDescription:
    "Free online Password Generator using browser-native Web Crypto API (`crypto.getRandomValues`). Customize length, uppercase/lowercase letters, numbers, symbols, and exclude ambiguous characters. Includes password strength analysis with 100% zero-server client-side security.",

  sections: [
    {
      heading: "Web Crypto API Hardware Security",
      body: "Our generator uses `window.crypto.getRandomValues()` directly from your device operating system to generate cryptographically unbiased random entropy. Passwords are never sent over the internet or logged anywhere.",
    },
    {
      heading: "Entropy & Strength Evaluation",
      body: "Evaluate password strength based on information entropy (bits of randomness), character pool size, and length. Get clear visual feedback on password complexity.",
    },
  ],

  primaryKeyword: "password generator",
  keywords: [
    "strong password generator",
    "random password generator",
    "secure password generator",
    "web crypto password",
    "password strength checker",
  ],
  searchAliases: [
    "password maker",
    "secure key generator",
  ],
  searchWeight: 95,

  relatedTools: ["uuid-generator", "qr-code-generator", "random-number-generator"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-08-10",

  schemaType: "Generator",
  icon: "key-round",
  faq: [
    {
      question: "Are generated passwords saved on your servers?",
      answer: "No! All password generation happens 100% inside your browser using client-side JavaScript. Nothing is sent to any server.",
    },
    {
      question: "What makes a password strong?",
      answer: "A strong password has at least 16 characters, combines uppercase, lowercase, numbers, and symbols, and avoids dictionary words or repeating patterns.",
    },
  ],
  howTo: [
    { title: "Choose Options", description: "Select length, uppercase, lowercase, numbers, and special symbols." },
    { title: "Exclusion & Quantity", description: "Optionally exclude ambiguous characters or generate multiple passwords." },
    { title: "Copy & Use", description: "Click Copy Password to securely copy to your clipboard." },
  ],

  engine: "calculator",
  privacyNote: "client",
}

export default definition
