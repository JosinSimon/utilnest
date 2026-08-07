import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "image-dpi-converter",
  name: "DPI Converter",
  slug: "image-dpi-converter",
  category: "image",
  path: "image/image-dpi-converter",

  shortDescription:
    "Change the DPI metadata of a JPG or PNG to 72, 96, 150, 200, 300 or 600 — without resampling a single pixel.",
  longDescription:
    "Set the DPI value stored inside a JPG or PNG file. Common targets are 72 DPI (screen), 150 DPI (draft print) and 300 DPI (print quality). The tool rewrites the DPI metadata directly in the file header, so pixel dimensions never change — this affects how the image is interpreted for print, not its actual resolution.",
  schemaType: "Utility",

  sections: [
    {
      heading: "What DPI actually changes",
      body: "DPI (dots per inch) is metadata, not resolution. Two files with the same pixels can print at different physical sizes depending on their DPI value. This tool rewrites that value in the JPEG JFIF or PNG pHYs header.",
    },
    {
      heading: "No resampling",
      body: "Pixels are never resized, re-encoded or quality-reduced. Only the DPI tag in the file is changed, so the image stays byte-for-byte sharp.",
    },
    {
      heading: "Private by design",
      body: "All editing happens in your browser. Your file never leaves your device.",
    },
  ],

  examples: [],

  primaryKeyword: "change image dpi",
  keywords: [
    "dpi converter",
    "change dpi of jpg",
    "set dpi to 300",
    "png dpi converter",
    "image dpi to 72",
    "change photo dpi to 150",
  ],
  searchAliases: ["set jpg dpi to 300", "change image resolution dpi", "dpi to 96 online"],
  searchWeight: 72,

  relatedTools: ["dimensions-checker", "image-resizer"],
  featured: false,
  trending: false,
  popular: false,
  addedAt: "2026-08-07",
  lastUpdated: "2026-08-07",

  icon: "scan-line",
  faq: [
    {
      question: "Does changing DPI change the image quality?",
      answer: "No. Only the DPI metadata tag changes; the pixel data is untouched, so quality stays exactly the same.",
    },
    {
      question: "Which formats are supported?",
      answer: "JPEG (JFIF APP0 density tag) and PNG (pHYs chunk).",
    },
    {
      question: "What is a common DPI for print?",
      answer: "300 DPI is the standard for quality print; 72–96 DPI is typical for screens. Many upload portals require a specific DPI value.",
    },
  ],
  howTo: [
    { title: "Upload an image", description: "Choose a JPG or PNG from your device." },
    { title: "Pick a DPI", description: "Select a preset (72/96/150/200/300/600) or enter a custom value." },
    { title: "Convert", description: "The DPI tag is rewritten in the file header." },
    { title: "Download", description: "Save the DPI-adjusted image locally." },
  ],

  engine: "file",
  privacyNote: "client",
}
