import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "signature-resizer",
  name: "Signature Resizer",
  slug: "signature-resizer",
  category: "government",
  path: "government/signature-resizer",

  shortDescription:
    "Resize and compress your signature to exact exam specifications (SSC, NEET, IBPS) in your browser.",
  longDescription:
    "Upload a scanned or photographed signature and this tool resizes it to the exact pixel dimensions and file-size range specified for the selected exam. It processes entirely in-browser and validates the final output so you never submit a signature that fails the official spec.",
  schemaType: "Utility",

  sections: [
    {
      heading: "Exam signature presets",
      body: "Covers the signature specifications for SSC CGL, NEET UG and IBPS. The required dimensions and KB range are shown before you upload.",
    },
    {
      heading: "Spec-compliant output",
      body: "The signature is resized to exact pixels and compressed to the required KB range. If it cannot satisfy the preset, the tool reports that clearly.",
    },
  ],

  examples: [],

  primaryKeyword: "signature resizer",
  keywords: [
    "signature resize online",
    "signature ssc size",
    "signature neet size",
    "signature compress kb",
    "exam signature photo size",
    "signature under 20 kb",
  ],
  searchAliases: ["signature size", "resize signature", "signature for exam"],
  searchWeight: 76,

  relatedTools: ["government-exam-photo", "exam-preset"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-08-07",

  icon: "pen-line",
  faq: [
    {
      question: "What size should exam signatures be?",
      answer: "SSC and IBPS commonly require around 140×60 px at 10–20 KB; NEET around 275×118 px at 4–30 KB. Presets are marked 'awaiting verification' until confirmed against official sources.",
    },
  ],
  howTo: [
    { title: "Upload signature", description: "Choose your scanned signature image." },
    { title: "Pick the exam", description: "Select SSC, NEET or IBPS." },
    { title: "Download", description: "Save the spec-ready signature." },
  ],

  engine: "file",
  privacyNote: "client",
}