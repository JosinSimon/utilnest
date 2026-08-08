import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "pdf-to-jpg",
  name: "PDF to JPG",
  slug: "pdf-to-jpg",
  category: "pdf",
  path: "pdf/pdf-to-jpg",

  shortDescription:
    "Turn every page of a PDF into a JPG image, packed into a zip. Rendered on-device in your browser — nothing is uploaded.",
  longDescription:
    "Convert a PDF to JPEG images: each page is rendered to a high-quality JPG and all of them arrive in a single zip. Choose the resolution (basic, good for the web, or high for print) to balance quality and file size. Rendering runs locally in your browser with the open-source pdf.js engine, so your document is never uploaded.",
  sections: [
    {
      heading: "Each page an image",
      body: "Every page becomes its own JPG, named page-1.jpg, page-2.jpg and so on, all returned in one zip.",
    },
    {
      heading: "Resolution you pick",
      body: "Choose between tight and printable resolutions, and slide the JPEG quality to match the job.",
    },
    {
      heading: "Private by design",
      body: "Rendering happens entirely on your device — pdf.js reads your file in the browser and nothing is uploaded.",
    },
  ],

  examples: [],

  primaryKeyword: "convert pdf to jpg",
  keywords: [
    "pdf to image",
    "pdf to jpeg converter",
    "convert pdf pages to jpg",
    "extract images from pdf",
    "pdf to picture",
    "pdf as jpg online",
  ],
  searchAliases: ["pdf into jpg", "save pdf pages as jpg", "pdf to jpg high quality"],
  searchWeight: 80,

  relatedTools: ["pdf-compress", "images-to-pdf", "pdf-split", "pdf-watermark"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-08",
  lastUpdated: "2026-08-08",

  schemaType: "Generator",
  icon: "file-image",
  faq: [
    {
      question: "Does the quality depend on original?",
      answer:
        "The PDF is rendered at up to 150dpi equivalent. Images that are or vector text all come out sharp; you can push resolution higher with the quality pick.",
    },
    {
      question: "Where do I get the JPGs?",
      answer: "A zip with one JPG per page (page-1.jpg, page-2.jpg …) downloads automatically.",
    },
    {
      question: "Is my file uploaded to your server?",
      answer:
        "No. The PDF is rendered in your browser using the local PDF engine — nothing leaves the browser.",
    },
  ],
  howTo: [
    { title: "Choose a PDF", description: "Upload the document." },
    { title: "Pick resolution", description: "Choose low / medium / high or the default web-ready." },
    { title: "Convert", description: "Each page is rendered to a JPG locally." },
    { title: "Download zip", description: "Get all images in one archive." },
  ],

  engine: "file",
  privacyNote: "client",
}