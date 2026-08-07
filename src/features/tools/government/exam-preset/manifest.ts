import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "exam-preset",
  name: "Exam Preset Resizer",
  slug: "exam-preset",
  category: "government",
  path: "government/exam-preset",

  shortDescription:
    "Apply a ready-made exam preset to your photograph or signature — exact pixels and file size for SSC, NEET and IBPS in one click.",
  longDescription:
    "Skip the manual resizing: this tool applies a complete official exam preset (dimensions + file-size range + format) to your photo or signature automatically. It processes the file in-browser and validates the result against the preset before you download.",
  schemaType: "Utility",

  sections: [
    {
      heading: "Preset in one tap",
      body: "Choose SSC CGL, NEET UG or IBPS PO/Clerk and a photo or signature preset. The tool handles resize + compression + validation for you.",
    },
    {
      heading: "Spec-aware output",
      body: "The output is validated in-browser. If it cannot satisfy the preset, you are told honestly rather than given a non-compliant file.",
    },
  ],

  examples: [],

  primaryKeyword: "exam photo preset",
  keywords: [
    "exam photo size preset",
    "preset photo resizer",
    "ssc neet ibps photo size",
    "one click exam photo",
  ],
  searchAliases: ["exam preset", "photo preset"],
  searchWeight: 58,

  relatedTools: ["government-exam-photo", "signature-resizer"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-08-07",

  icon: "list-checks",
  faq: [
    {
      question: "How is this different from the Govt Form Photo Resizer?",
      answer: "It is the same engine — this is a shortcut preset picker for the most common exams.",
    },
  ],
  howTo: [
    { title: "Pick a preset", description: "Select exam + document type." },
    { title: "Upload", description: "Add your image." },
    { title: "Download", description: "Save the spec-ready file." },
  ],

  engine: "file",
  privacyNote: "client",
}