import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "document-scanner",
  name: "Document Scanner",
  slug: "document-scanner",
  category: "government",
  path: "government/document-scanner",

  shortDescription:
    "Turn photos or scanned pages of documents into a single PDF — rotate and combine in your browser.",
  longDescription:
    "Upload one or more photos of a document (form, certificate, letters) and this tool combines them into a single PDF. You can rotate pages, fit them to A4, and download a clean, shareable PDF. It does not perform automatic edge detection or perspective correction. All processing is done locally — your documents never leave your device.",
  schemaType: "Utility",

  sections: [
    {
      heading: "Combine into one PDF",
      body: "Upload multiple pages in the order you need them; the tool stitches them into a single PDF you can submit or share.",
    },
    {
      heading: "Straighten and orient",
      body: "Rotate any set of uploads by 90° steps to correct sideways scans, and choose A4 page size for a uniform document.",
    },
    {
      heading: "Private by design",
      body: "Images are decoded and re-encoded entirely in the browser. Nothing is uploaded to a server.",
    },
  ],

  examples: [],

  primaryKeyword: "document scanner",
  keywords: [
    "photo to pdf",
    "scan document to pdf online",
    "combine images into pdf",
    "document photo to pdf",
    "certificate scan to pdf",
    "form pages to pdf",
  ],
  searchAliases: ["scan to pdf", "photo to pdf", "images to pdf", "document to pdf"],
  searchWeight: 60,

  relatedTools: ["compress-image", "aadhaar-pan"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-08-07",

  icon: "scanner",
  faq: [
    {
      question: "Is my document uploaded to a server?",
      answer:
        "No. All PDF creation happens in your browser using pdf-lib; nothing is uploaded.",
    },
    {
      question: "Can I combine multiple pages?",
      answer: "Yes. Select several images and they are merged into a single PDF in order.",
    },
  ],
  howTo: [
    { title: "Upload pages", description: "Select one or more document photos." },
    { title: "Set options", description: "Choose page size and rotation." },
    { title: "Download", description: "Save the combined PDF." },
  ],

  engine: "file",
  privacyNote: "client",
}