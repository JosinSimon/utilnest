import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "pdf-compress",
  name: "Compress PDF",
  slug: "pdf-compress",
  category: "pdf",
  path: "pdf/pdf-compress",

  shortDescription:
    "Shrink PDF file size for email and the web. Compression runs entirely in your browser — pick a level, download the smaller file, nothing uploaded.",
  longDescription:
    "Reduce the size of a PDF to make it easier to share and store. The document is re-encoded in your browser with the local pdf engine: pages are drawn down and re-embedded at a quality you choose, while Acrobat-style object streams are used on the text level. Pick strong, balanced or light compression and see exactly how much you save before downloading.",
  sections: [
    {
      heading: "Three strength levels",
      body: "Strong shrinks most (best for web), Light works best for text-heavy PDFs. The result is a smaller PDF that still opens everywhere.",
    },
    {
      heading: "Quality you control",
      body: "A quality slider tunes the raster step, so you can balance size against image fidelity for your specific file.",
    },
    {
      heading: "Private by design",
      body: "Compression happens entirely in your browser — your file is never uploaded or stored anywhere.",
    },
  ],

  examples: [],

  primaryKeyword: "compress pdf",
  keywords: [
    "reduce pdf file size",
    "compress pdf online free",
    "shrink pdf size",
    "make pdf smaller",
    "pdf compressor",
    "reduce pdf size for email",
  ],
  searchAliases: ["compress pdf in browser", "reduce pdf file size", "smaller pdf online"],
  searchWeight: 88,

  relatedTools: ["pdf-to-jpg", "images-to-pdf", "pdf-merge", "pdf-protect"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-08",
  lastUpdated: "2026-08-08",

  schemaType: "Utility",
  icon: "gauge",
  faq: [
    {
      question: "How much can I save?",
      answer:
        "Image-heavy PDFs typically shrink by 50–80%. Text-only PDFs may save little because they're already compact; the tool shows the exact percentage after each run.",
    },
{
      question: "Does it change layout?",
      answer:
        "Each page is re-rendered at the same dimensions, so the visual layout and pagination are preserved. Quality of the images decreases as you compress harder.",
    },
{
      question: "Is it safe?",
      answer:
        "Yes. Compression runs entirely in your browser, your file is never uploaded, and it never touches your original (you can download a new file).",
    },
  ],
  howTo: [
    { title: "Choose a PDF", description: "Pick the file to shrink." },
    { title: "Pick strength", description: "Strong, balanced or weak, and tune quality." },
    { title: "Compress", description: "Re-encode pages locally." },
    { title: "Download", description: "Get your smaller PDF." },
  ],

  engine: "file",
  privacyNote: "client",
}