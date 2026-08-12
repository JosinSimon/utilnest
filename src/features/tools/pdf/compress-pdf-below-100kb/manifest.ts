import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "compress-pdf-below-100kb",
  name: "Compress PDF Below 100KB",
  slug: "compress-pdf-below-100kb",
  category: "pdf",
  path: "pdf/pdf-compress",

  shortDescription:
    "Compress PDF files toward 100KB for forms, email and upload portals. Private browser-based PDF compression.",
  longDescription:
    "Use this exact-intent PDF compressor page when a website, form or email system asks for a PDF below 100KB. The tool reuses UtilNest's browser PDF compressor with sensible defaults for this size target.",
  schemaType: "Generator",
  sections: [
    { heading: "100KB upload-limit preset", body: "The compression controls are tuned for users trying to get a PDF below 100KB. Exact output depends on the original PDF, especially scanned image-heavy documents." },
    { heading: "Private in-browser compression", body: "Your PDF is processed locally in your browser. The file is not uploaded to UtilNest or stored on a server." },
    { heading: "Check before submitting", body: "After downloading, check the final file size. Very large scans may need another pass or image optimization before they can fit under 100KB." },
  ],
  examples: [
    { title: "Upload-limit PDF", input: "Choose a PDF larger than 100KB", output: "Download a smaller PDF candidate" },
  ],

  primaryKeyword: "compress pdf below 100kb",
  keywords: ["compress pdf below 100kb", "compress pdf below 100kb", "reduce pdf size to 100kb", "pdf compressor 100kb", "compress pdf online free", "reduce pdf file size"],
  searchAliases: ["pdf under 100kb", "make pdf 100kb", "compress pdf to 100kb"],
  searchWeight: 97,
  relatedTools: ["pdf-compress", "pdf-to-jpg", "images-to-pdf", "pdf-split"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-12",
  lastUpdated: "2026-08-12",
  icon: "gauge",
  faq: [
    { question: "Can this guarantee a PDF below 100KB?", answer: "No browser compressor can guarantee every PDF will fit below 100KB. Text-heavy PDFs usually compress well; large scanned PDFs may remain bigger and need source image resizing." },
    { question: "Is my PDF uploaded?", answer: "No. Compression runs locally in your browser." },
    { question: "Will the layout change?", answer: "The tool preserves page dimensions and pagination, but strong compression can reduce image sharpness." },
    { question: "What should I do if it is still too large?", answer: "Try stronger compression again, reduce scanned image resolution before making the PDF, or split unnecessary pages." },
  ],
  howTo: [
    { title: "Choose a PDF", description: "Select the PDF you want to reduce below 100KB." },
    { title: "Use the preset", description: "This page opens with a 100KB oriented compression preset." },
    { title: "Compress locally", description: "Run compression in your browser without uploading the file." },
    { title: "Download and check", description: "Save the compressed PDF and check whether it meets the upload limit." },
  ],
  engine: "file",
  privacyNote: "client",
  preset: { compressionLevel: "1", quality: 55 },
}
