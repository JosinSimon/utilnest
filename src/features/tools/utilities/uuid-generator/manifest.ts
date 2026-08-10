import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "uuid-generator",
  name: "UUID Generator",
  slug: "uuid-generator",
  category: "utilities",
  path: "utilities/uuid-generator",

  shortDescription: "Generate RFC 4122 compliant UUID v4 identifiers instantly using Web Crypto API.",
  longDescription:
    "Free online UUID v4 Generator. Create single or bulk Universally Unique Identifiers (UUIDs) using `crypto.randomUUID()`. Supports uppercase formatting, hyphen removal, and one-click bulk copying. 100% private, fast, and generated locally in your browser.",

  sections: [
    {
      heading: "RFC 4122 Standard Compliant UUID v4",
      body: "Our UUID Generator creates version-4 cryptographically pseudo-random UUIDs conforming strictly to RFC 4122. Each 128-bit identifier guarantees maximum uniqueness across distributed systems.",
    },
    {
      heading: "Bulk Generation & Instant Copying",
      body: "Generate up to 100 UUIDs at once. Custom formatting toggles allow uppercase characters or removing hyphens for clean database keys.",
    },
  ],

  primaryKeyword: "uuid generator",
  keywords: [
    "uuid v4 generator",
    "guid generator",
    "generate uuid online",
    "bulk uuid generator",
    "crypto random uuid",
  ],
  searchAliases: [
    "guid maker",
    "unique id generator",
  ],
  searchWeight: 90,

  relatedTools: ["random-number-generator", "password-generator", "qr-code-generator"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-08-10",

  schemaType: "Generator",
  icon: "fingerprint",
  faq: [
    {
      question: "What is a UUID v4?",
      answer: "A UUID (Universally Unique Identifier) version 4 is a 128-bit value formatted as 32 hexadecimal digits separated by hyphens (e.g., 123e4567-e89b-42d3-a456-426614174000).",
    },
    {
      question: "What is the probability of a UUID collision?",
      answer: "The collision probability of UUID v4 is negligible. You would need to generate tens of trillions of UUIDs to have a 1-in-a-billion chance of collision.",
    },
  ],
  howTo: [
    { title: "Select Quantity", description: "Choose how many UUIDs you want to generate (1 to 100)." },
    { title: "Choose Options", description: "Toggle uppercase letters or hyphen removal if needed." },
    { title: "Copy UUIDs", description: "Copy individual UUIDs or click 'Copy All' to copy the complete list." },
  ],

  engine: "calculator",
  privacyNote: "client",
}

export default definition
