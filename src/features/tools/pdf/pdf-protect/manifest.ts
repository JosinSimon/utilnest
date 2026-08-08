import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "pdf-protect",
  name: "Protect PDF",
  slug: "pdf-protect",
  category: "pdf",
  path: "pdf/pdf-protect",

  shortDescription:
    "Password-protect a PDF with strong AES-256 encryption, right in your browser. Your document and password never leave your device.",
  longDescription:
    "Add a password to any PDF so only people you choose can open it. The document is encrypted with AES-256 (the PDF standard's R6 algorithm) using the Web Crypto API — everything runs locally in your browser, so your file and your password never touch a server. Optionally set a separate owner password for permission-level control. Your document and password never leave your device.",
  sections: [
    {
      heading: "Strong local encryption",
      body: "Uses AES-256 R6 via the Web Crypto API — the same scheme Preview and Acrobat read. No password or file ever leaves your browser.",
    },
    {
      heading: "Two passwords, if you want",
      body: "Set the open password anyone needs to read the file, and optionally a separate owner password for stronger permission control.",
    },
    {
      heading: "Private by design",
      body: "With zero server round-trips, encrypting a PDF here is like doing it on your own machine.",
    },
  ],

  examples: [],

  primaryKeyword: "protect pdf with password",
  keywords: [
    "password protect pdf",
    "lock pdf online",
    "encrypt pdf",
    "add password to pdf",
    "secure pdf file",
    "pdf password protect free",
  ],
  searchAliases: ["lock a pdf document", "encrypt pdf locally", "password protect pdf in browser"],
  searchWeight: 84,

  relatedTools: ["pdf-unlock", "pdf-compress", "pdf-page-manager"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-08",
  lastUpdated: "2026-08-08",

  schemaType: "Generator",
  icon: "lock",
  faq: [
    {
      question: "Is my password sent to a server?",
      answer: "Never. AES-256 encryption runs entirely in your browser with the Web Crypto API.",
    },
    {
      question: "Which algorithm is used for protection?",
      answer: "AES-256 using the PDF 2.0 R6 standard, compatible with Preview, Acrobat and most readers.",
    },
    {
      question: "Can I remove the password later?",
      answer: "Yes — use the Unlock PDF tool with the same password to remove protection.",
    },
    {
      question: "What is an owner password?",
      answer: "An optional second password referenced by PDF readers to control printing and editing permissions.",
    },
  ],
  howTo: [
    { title: "Choose a PDF", description: "Upload the file you want to protect." },
    { title: "Set a password", description: "Pick a strong password (and optionally an owner password)." },
    { title: "Protect", description: "AES-256 encryption runs locally, fast." },
    { title: "Download", description: "Save your protected PDF and share the password securely." },
  ],

  engine: "file",
  privacyNote: "client",
}