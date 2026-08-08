import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "pdf-watermark",
  name: "Watermark PDF",
  slug: "pdf-watermark",
  category: "pdf",
  path: "pdf/pdf-watermark",

  shortDescription:
    "Stamp a diagonal text watermark across every page of a PDF — instantly, in your browser, with nothing uploaded.",
  longDescription:
    "Add a permanent text watermark — like “CONFIDENTIAL”, “DRAFT” or your name — across a PDF. The watermark is drawn diagonally across the full page, with a density and opacity you control. It's baked into the file itself, so it persists in every viewer and printer. Everything runs locally with pdf-lib in your browser.",
  sections: [
    {
      heading: "Text that's baked in",
      body: "The watermark is drawn directly into the PDF using an embedded font, so it shows up in any viewer, editor or printout — it's baked in, not just a preview.",
    },
    {
      heading: "Tune opacity & density",
      body: "Two sliders let you decide how subtle or prominent your watermark is across the diagonal.",
    },
    {
      heading: "Private by design",
      body: "Watermarks are stamped locally in your browser. Your PDF is never uploaded anywhere.",
    },
  ],

  examples: [],

  primaryKeyword: "add watermark to pdf",
  keywords: [
    "watermark pdf document",
    "pdf watermark online free",
    "add text to pdf page",
    "confidential pdf watermark",
    "stamp pdf with text",
    "draft watermark pdf",
    "repeat watermark across pdf",
  ],
  searchAliases: ["insert watermark pdf", "add text watermark to pdf", "watermark every page of pdf"],
  searchWeight: 78,

  relatedTools: ["pdf-protect", "pdf-compress", "pdf-rotate", "pdf-page-manager"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-08",
  lastUpdated: "2026-08-08",

  schemaType: "Generator",
  icon: "file-watermark",
  faq: [
    {
      question: "Is the watermark visible everywhere?",
      answer:
        "Yes. It's drawn directly onto the page — it appears in Preview, Acrobat, browsers, and printouts.",
    },
    {
      question: "Can I make it subtler?",
      answer: "Use the opacity slider. Lower values keep the paper readable while still marking it.",
    },
    {
      question: "Is my file uploaded?",
      answer: "No. The PDF never leaves your browser during watermarking.",
    },
  ],
  howTo: [
    { title: "Choose a PDF", description: "Upload the document to watermark." },
    { title: "Type the watermark", description: "Enter the text you want stamped on every page." },
    { title: "Fine-tune", description: "Adjust opacity, size and how many stamps appear." },
    { title: "Watermark & download", description: "Get your stamped PDF instantly." },
  ],

  engine: "file",
  privacyNote: "client",
}