import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "aadhaar-pan",
  name: "Aadhaar / PAN Resizer",
  slug: "aadhaar-pan",
  category: "government",
  path: "government/aadhaar-pan",

  shortDescription:
    "Resize and compress photographs for Aadhaar and PAN application forms to the required size in your browser.",
  longDescription:
    "Choose Aadhaar or PAN, and this tool sizes your photograph to the commonly required dimensions (resolved in centimetres to pixels) and compresses it to the specified file-size range. Processing runs entirely in-browser and the output is validated so you don't submit a non-compliant file.",
  schemaType: "Utility",

  sections: [
    {
      heading: "Document-specific presets",
      body: "Aadhaar and PAN each have their own expected photo size and background. Presets are resolved from centimetre dimensions at a selectable DPI.",
    },
    {
      heading: "White background reminder",
      body: "A plain white background is required. The tool flags a dark background as a warning before download.",
    },
  ],

  examples: [],

  primaryKeyword: "aadhaar photo resizer",
  keywords: [
    "aadhaar photo size",
    "pan photo resize",
    "pan card photo size",
    "aadhaar photo compress",
    "uidai photo resizer",
    "passport size photo for aadhaar",
  ],
  searchAliases: ["aadhaar photo", "pan photo", "uidai photo resize"],
  searchWeight: 64,

  relatedTools: ["passport-photo-maker", "resize-image"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-08-07",

  icon: "fingerprint",
  faq: [
    {
      question: "What size should Aadhaar/PAN photos be?",
      answer:
        "The commonly cited reference is a passport-size photo (3.5×2.5 cm for PAN, 3.5×4.5 cm for Aadhaar) on white background. A PAN signature preset is also available. Presets are marked 'awaiting verification' pending official confirmation.",
    },
  ],
  howTo: [
    { title: "Pick the document", description: "Choose Aadhaar or PAN." },
    { title: "Upload", description: "Add your photograph." },
    { title: "Download", description: "Save the resized image." },
  ],

  engine: "file",
  privacyNote: "client",
}