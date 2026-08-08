import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "pdf-merge",
  name: "Merge PDF",
  slug: "pdf-merge",
  category: "pdf",
  path: "pdf/pdf-merge",

  shortDescription:
    "Combine two or more PDFs into one document in seconds. Reorder the files any way you like — all done in your browser, nothing is uploaded.",
  longDescription:
    "Join PDF files end-to-end into a single document, in the order you choose. Add as many PDFs as you need from your device, drag the list to arrange them, then merge. Page size and orientation of each file are preserved exactly. Everything runs locally on your device, so your documents never leave your browser.",
  schemaType: "Generator",

  sections: [
    {
      heading: "Combine in the order you want",
      body: "Add several PDFs and drag them into the arrangement you need before merging. The pages of each file are concatenated in that order.",
    },
    {
      heading: "Every page preserved",
      body: "Page size, orientation and content of each source PDF are kept intact in the merged document.",
    },
    {
      heading: "Private by design",
      body: "Your files are processed entirely in your browser with on-device logic. There is no upload, no server queue, no copy of your data anywhere.",
    },
  ],

  examples: [],

  primaryKeyword: "merge pdf files",
  keywords: [
    "combine pdf",
    "join pdf files",
    "merge pdfs online",
    "merge multiple pdf into one",
    "combine pdf documents",
    "pdf merger",
  ],
  searchAliases: ["combine pdf pages", "merge two pdfs", "join pdf documents"],
  searchWeight: 90,

  relatedTools: ["pdf-split", "pdf-rotate", "pdf-page-manager", "images-to-pdf"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-08",
  lastUpdated: "2026-08-08",

  icon: "merge",
  faq: [
    {
      question: "Is my data uploaded?",
      answer:
        "No. Merging happens entirely in your browser using a local PDF library. Your files never leave your device.",
    },
    {
      question: "Can I merge more than two PDFs?",
      answer: "Yes. Accept any number of PDF files and merge them all into one document.",
    },
    {
      question: "Can I reorder files before merging?",
      answer: "Yes — the tool shows your added files and lets you move each one up or down to set the final page order.",
    },
    {
      question: "Will page layout be preserved?",
      answer: "Yes. Each source keeps its own page size and orientation, so merged output looks exactly like the originals.",
    },
  ],
  howTo: [
    { title: "Add PDFs", description: "Choose multiple PDF files from your device." },
    { title: "Set the order", description: "Move files up or down until the sequence is right." },
    { title: "Merge", description: "Combine everything into a single PDF in the browser." },
    { title: "Download", description: "Save your merged document instantly." },
  ],

  engine: "file",
  privacyNote: "client",
}