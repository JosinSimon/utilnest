import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "pdf-page-manager",
  name: "PDF Page Manager",
  slug: "pdf-page-manager",
  category: "pdf",
  path: "pdf/pdf-page-manager",

  shortDescription:
    "Reorder, delete and tidy PDF pages visually — then download the cleaned document. Runs entirely in your browser, nothing uploaded.",
  longDescription:
    "Put the pages of any PDF in the order you need and drop the ones you don't. The tool shows every page with controls to move it up or down and an easy checkbox to remove it. When you're done it builds a new PDF with just the pages you kept, in exactly the order you set. Everything happens locally on your device.",
  schemaType: "Generator",

  sections: [
    {
      heading: "See every page",
      body: "A simple list shows each page with its number — tick the ones to keep, untick the ones to remove, and move pages up or down to reorder.",
    },
    {
      heading: "One click to apply",
      body: "The new document is built instantly from your selection, deleting the rest and matching your exact order.",
    },
    {
      heading: "Private by design",
      body: "Every page operation happens in your browser. Your document is never uploaded or stored elsewhere.",
    },
  ],

  examples: [],

  primaryKeyword: "reorder pdf pages",
  keywords: [
    "delete pages from pdf",
    "delete pdf pages",
    "reorder pages in pdf",
    "remove pages from pdf online",
    "organize pdf pages",
    "move pages in pdf",
  ],
  searchAliases: ["delete page from pdf", "rearrange pdf pages", "remove pdf pages"],
  searchWeight: 86,

  relatedTools: ["pdf-merge", "pdf-split", "pdf-rotate", "pdf-compress"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-08",
  lastUpdated: "2026-08-08",

  icon: "layers",
  faq: [
    {
      question: "Can I delete more than one page at once?",
      answer: "Yes. Tick the pages you want to remove (or keep) and apply — the deleted pages are dropped from the new PDF.",
    },
    {
      question: "Can I change the order?",
      answer: "Yes. Use the up/down controls next to each page to arrange them, then apply the new order.",
    },
    {
      question: "Is it possible to undo?",
      answer: "Re-upload the original — or tick pages again. Nothing is modified on your original file; the tool always returns a new PDF.",
    },
  ],
  howTo: [
    { title: "Choose a PDF", description: "Upload the document whose pages you want to manage." },
    { title: "Edit the page list", description: "Tick to keep, remove to drop, and reorder to arrange." },
    { title: "Apply", description: "Build the new PDF from your selection." },
    { title: "Download", description: "Save your organized document." },
  ],

  engine: "file",
  privacyNote: "client",
}