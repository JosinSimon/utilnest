import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "pdf-split",
  name: "Split PDF",
  slug: "pdf-split",
  category: "pdf",
  path: "pdf/pdf-split",

  shortDescription:
    "Cut a PDF into separate documents — every page into its own file, or split at custom page boundaries. Runs in your browser, nothing uploaded.",
  longDescription:
    "Break one PDF into smaller PDFs. Split every page into its own single-page file, or tell the tool where to cut (for example after page 3 and 7) and it produces one PDF per section. All parts are returned together in a zip archive. Everything runs locally on your device.",
  schemaType: "Generator",

  sections: [
    {
      heading: "Two ways to split",
      body: "One PDF per page, or custom cuts: enter the pages after which to break the document and each section becomes its own PDF.",
    },
    {
      heading: "Sections as a zip",
      body: "Every part is downloaded at once as a tidy zip archive (each section a separate PDF inside).",
    },
    {
      heading: "Private by design",
      body: "Splitting happens entirely in your browser with no upload and no copy of your document left anywhere.",
    },
  ],

  examples: [],

  primaryKeyword: "split pdf",
  keywords: [
    "split pdf into pages",
    "separate pdf pages",
    "split pdf by page ranges",
    "break pdf into parts",
    "extract pages into separate pdf",
  ],
  searchAliases: ["split pdf into multiple files", "separate pdf pages", "pdf into single pages"],
  searchWeight: 88,

  relatedTools: ["pdf-merge", "pdf-page-manager", "pdf-rotate", "images-to-pdf"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-08",
  lastUpdated: "2026-08-08",

  icon: "split",
  faq: [
    {
      question: "What formats can I split?",
      answer: "PDF only. Upload any PDF and choose single-page mode or custom split points.",
    },
    {
      question: "How do I get the parts?",
      answer: "All split sections are packaged in a single zip file that downloads automatically. Each PDF keeps its page size and appearance.",
    },
    {
      question: "Can I choose where to cut?",
      answer: "Yes — enter page boundaries (e.g. split after pages 3 and 9) to create custom ranges. Use single-page mode to get one file per page.",
    },
  ],
  howTo: [
    { title: "Choose a PDF", description: "Pick the document you want to divide." },
    { title: "Pick a split style", description: "Every page separately, or split at the boundaries you enter." },
    { title: "Split", description: "The browser divides your file on the spot." },
    { title: "Download the zip", description: "Grab all parts in one archive." },
  ],

  engine: "file",
  privacyNote: "client",
}