import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "pdf-rotate",
  name: "Rotate PDF",
  slug: "pdf-rotate",
  category: "pdf",
  path: "pdf/pdf-rotate",

  shortDescription:
    "Turn PDF pages 90°, 180° or 270° in one click — the whole document or specific pages only. Runs in your browser, nothing uploaded.",
  longDescription:
    "Fix upside-down scans and sideways pages. Rotate the entire document by 90, 180 or 270 degrees, or rotate only the pages you select by page number. The orientation is applied to the saved PDF so it stays fixed in every reader. Everything runs locally on your device.",
  schemaType: "Generator",

  sections: [
    {
      heading: "Whole document or a few pages",
      body: "Rotate every page in one action, or enter specific page numbers to rotate only those.",
    },
    {
      heading: "Saved into the file",
      body: "The rotation is written into the PDF itself, so the fix persists in any viewer or printer.",
    },
    {
      heading: "Private by design",
      body: "All processing happens in your browser with no upload and no file stored on any server.",
    },
  ],

  examples: [],

  primaryKeyword: "rotate pdf",
  keywords: [
    "rotate pdf pages",
    "rotate pdf 90 degrees",
    "rotate pdf 180 degrees",
    "flip pdf upside down",
    "rotate pdf clockwise",
    "rotate scanned pdf",
  ],
  searchAliases: ["rotate pdf online", "turn pdf sideways", "rotate selected pdf pages"],
  searchWeight: 87,

  relatedTools: ["pdf-page-manager", "pdf-merge", "pdf-split", "images-to-pdf"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-08",
  lastUpdated: "2026-08-08",

  icon: "rotate-cw",
  faq: [
    {
      question: "Can I rotate only some pages?",
      answer: "Yes — enter the page numbers you want to rotate (e.g. 2, 5, 9). Leave blank to rotate every page.",
    },
    {
      question: "Is the rotation permanent?",
      answer: "Yes. The rotation is baked into the output PDF so the pages stay fixed in every reader.",
    },
    {
      question: "Will rotating change my file quality?",
      answer: "No. pdf-lib only updates the page orientation metadata, so text and images keep their exact quality.",
    },
  ],
  howTo: [
    { title: "Choose a PDF", description: "Pick the document to fix." },
    { title: "Pick the angle", description: "90°, 180° or 270° clockwise." },
    { title: "Optional pages", description: "List specific pages or rotate everything." },
    { title: "Rotate & download", description: "Get the corrected PDF instantly." },
  ],

  engine: "file",
  privacyNote: "client",
}