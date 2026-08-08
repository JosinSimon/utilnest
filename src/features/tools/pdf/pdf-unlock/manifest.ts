import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "pdf-unlock",
  name: "Unlock PDF",
  slug: "pdf-unlock",
  category: "pdf",
  path: "pdf/pdf-unlock",

  shortDescription:
    "Remove password protection from a PDF you own, right in your browser. Decryption runs locally — your file and password never leave your device.",
  longDescription:
    "Open password-protected PDFs locally by decrypting them with the password you provide. The decryption runs entirely in your browser using the Web Crypto API, so the file and the password never touch a server. Works with AES-256 encrypted documents, the standard used by Preview, Acrobat and most readers — including documents protected by the Protect PDF tool.",
  sections: [
    {
      heading: "Decrypt locally",
      body: "Enter the password and the document is unlocked in your browser with Web Crypto. Nothing is uploaded.",
    },
    {
      heading: "Works with standard encryption",
      body: "Supports the AES-256 R6 scheme used by modern readers, including PDFs protected by our Protect tool.",
    },
    {
      heading: "Private by design",
      body: "Your password and your document never leave your device — decryption is 100% local.",
    },
  ],

  examples: [],

  primaryKeyword: "unlock pdf",
  keywords: [
    "remove pdf password",
    "unlock pdf online",
    "decrypt pdf",
    "crack pdf password free",
    "remove password from pdf",
  ],
  searchAliases: ["remove pdf password protection", "open locked pdf", "unlock encrypted pdf"],
  searchWeight: 83,

  relatedTools: ["pdf-protect", "pdf-compress", "pdf-page-manager"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-08",
  lastUpdated: "2026-08-08",

  schemaType: "Generator",
  icon: "unlock",
  faq: [
    {
      question: "Do you support all password types?",
      answer: "If the PDF uses the AES-256 R6 encryption, common since 2017, then yes — it decrypts with the supplied password. Very old export schemes (RC4) may not be supported.",
    },
    {
      question: "Is my password uploaded?",
      answer: "Never. Unlocking is entirely local in your browser with Web Crypto.",
    },
    {
      question: "What if the password is wrong?",
      answer: "The tool reports a clear error — the same on-device algorithm used by your reader to verify the password.",
    },
  ],
  howTo: [
    { title: "Choose a PDF", description: "Upload the locked document." },
    { title: "Enter the password", description: "Type the open password for the file." },
    { title: "Unlock", description: "Decryption runs locally, instantly." },
    { title: "Download", description: "Save the unlocked PDF." },
  ],

  engine: "file",
  privacyNote: "client",
}