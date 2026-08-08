import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "images-to-pdf",
  name: "Images to PDF",
  slug: "images-to-pdf",
  category: "pdf",
  path: "pdf/images-to-pdf",

  shortDescription:
    "Turn JPG, PNG and WebP images into a single PDF in seconds. Choose page size and layout — all in your browser, nothing uploaded.",
  longDescription:
    "Drop in a stack of photos or scans and get one tidy PDF. Choose how each image fits the page — original size, or a standard paper size like A4 or Letter with your chosen margin — and rotate any image if it was taken sideways. The converter embeds the originals without recompression, so quality is preserved and processing is instant. Everything runs locally on your device.",
  schemaType: "Generator",

  sections: [
    {
      heading: "One click, one PDF",
      body: "Select several JPG, PNG or WebP images and they become pages in a single PDF, in the order you added them.",
    },
    {
      heading: "Layout you control",
      body: "Keep each image's native size or fit it onto A4, A5 or Letter pages with a custom margin. Rotate any image 90 degrees at a time.",
    },
    {
      heading: "Lossless embeds",
      body: "Images are embedded as-is (no resampling), so quality is identical to your originals and conversion is fast.",
    },
  ],

  examples: [],

  primaryKeyword: "convert images to pdf",
  keywords: [
    "jpg to pdf",
    "jpeg to pdf",
    "png to pdf",
    "image to pdf converter",
    "photos to pdf",
    "make a pdf from images",
    "webp to pdf",
  ],
  searchAliases: ["multiple images into one pdf", "pictures to pdf", "photo to pdf online"],
  searchWeight: 92,

  relatedTools: ["pdf-merge", "pdf-compress", "pdf-rotate", "pdf-page-manager"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-08",
  lastUpdated: "2026-08-08",

  icon: "file-image",
  faq: [
    {
      question: "Which image formats are supported?",
      answer: "JPG, PNG and WebP uploads are all accepted and embedded without recompression.",
    },
    {
      question: "Can I control the page size?",
      answer: "Yes — keep each image at its own size, or place images onto A4, A5 or Letter pages with an optional margin.",
    },
    {
      question: "Is my PDF saved on a server?",
      answer: "No. Everything is assembled in your browser with pdf-lib; your images are never uploaded.",
    },
  ],
  howTo: [
    { title: "Add images", description: "Pick JPG, PNG or WebP files from your device." },
    { title: "Set the layout", description: "Choose image size vs paper size, and an optional rotation." },
    { title: "Convert", description: "Each image becomes a page in one PDF, built locally." },
    { title: "Download", description: "Save your images.pdf instantly." },
  ],

  engine: "file",
  privacyNote: "client",
}