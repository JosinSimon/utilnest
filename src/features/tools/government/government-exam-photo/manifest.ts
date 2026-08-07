import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "government-exam-photo",
  name: "Govt Form Photo Resizer",
  slug: "government-exam-photo",
  category: "government",
  path: "government/government-exam-photo",

  shortDescription:
    "Resize and compress your photo or signature to official government-exam specifications (SSC, NEET, IBPS) in your browser.",
  longDescription:
    "Pick your exam and document type, then this tool resizes and compresses your photo or signature to the exact pixel dimensions and file-size range specified by the exam authority. The final output is validated against the specification and you are told clearly if it cannot satisfy it — nothing is ever silently shrunk or padded.",
  schemaType: "Utility",

  sections: [
    {
      heading: "Select your exam",
      body: "Choose the exam and document type (photograph or signature). The required dimensions and file-size range are shown before you upload, along with verification status.",
    },
    {
      heading: "Exact spec processing",
      body: "Your image is decoded with EXIF orientation handled, resized to the exact prescribed pixels, then compressed so the real encoded size lands in the required KB range.",
    },
    {
      heading: "Honest validation",
      body: "If the final file cannot satisfy the specification — for example the photo can never reach the required minimum size — the tool says so instead of producing a non-compliant image.",
    },
  ],

  examples: [],

  primaryKeyword: "ssc photo resizer",
  keywords: [
    "ssc cgl photo resize",
    "neet photo resizer",
    "ibps photo compress",
    "government exam photo size",
    "photo under 50 kb ssc",
    "exam form photo resize",
  ],
  searchAliases: ["ssc photo", "neet photo", "ibps photo", "exam photo resizer", "photo for exam form"],
  searchWeight: 90,

  relatedTools: ["exam-preset", "compress-image", "resize-image", "signature-resizer"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-08-07",

  icon: "id-card",
  faq: [
    {
      question: "Which exams are covered?",
      answer:
        "The current preset registry includes SSC CGL, NEET UG and IBPS PO/Clerk (photo + signature). More presets are added as official sources are confirmed.",
    },
    {
      question: "What if my exam isn't listed?",
      answer:
        "Use the Compress Image to Target KB and Resize Image to Exact Pixels tools with the values printed on your official notification.",
    },
    {
      question: "Are the specifications verified?",
      answer:
        "Every preset is sourced from official notifications where possible. Any preset not yet confirmed against an official source is clearly marked 'awaiting verification'.",
    },
  ],
  howTo: [
    { title: "Pick your exam", description: "Select the exam and document type." },
    { title: "Check the spec", description: "Review the required pixels and KB range." },
    { title: "Upload your photo", description: "Choose the image from your device." },
    { title: "Download the result", description: "Save the spec-compliant image locally." },
  ],

  engine: "file",
  privacyNote: "client",
}