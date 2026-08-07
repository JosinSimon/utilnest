import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "image-compressor",
  name: "Image Compressor",
  slug: "image-compressor",
  category: "image",
  path: "image/image-compressor",

  shortDescription:
    "Compress an image to a target file size such as 20, 50 or 100 KB, right in your browser. Files never leave your device.",
  longDescription:
    "Set a target size (20 KB, 50 KB, 100 KB or a custom value) and this tool shrinks your image to fit it. JPEG quality is binary-searched so the real encoded file size lands under your limit — no guesswork. If a target is genuinely impossible, the tool says so instead of silently outputting a non-compliant file.",
  schemaType: "Utility",

  sections: [
    {
      heading: "How compression works",
      body: "The image is decoded once, then JPEG quality is adjusted so the actual encoded byte count fits under your target. The real file size is read after every step.",
    },
    {
      heading: "Honest limits",
      body: "If even the lowest quality is still larger than your target, the tool reports it cannot reach the size rather than producing a file that still exceeds the limit.",
    },
    {
      heading: "Private by design",
      body: "Decoding, resizing and encoding all happen in your browser. No pixels are ever uploaded.",
    },
  ],

  examples: [],

  primaryKeyword: "compress image to 50kb",
  keywords: [
    "image compressor",
    "compress image online",
    "image under 100kb",
    "reduce photo file size",
    "compress jpeg to 20kb",
    "shrink image file size",
  ],
  searchAliases: ["make image smaller kb", "reduce image size to 50kb", "compress photo to 100kb"],
  searchWeight: 88,

  relatedTools: ["image-resizer", "image-base64"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-08-07",

  icon: "compress",
  faq: [
    {
      question: "Does it work offline?",
      answer: "Yes. The image is decoded, resized and encoded fully in your browser; nothing is uploaded.",
    },
    {
      question: "What if my image can't reach the target size?",
      answer: "The tool reports honestly that the file cannot satisfy the requested size instead of producing a non-compliant file.",
    },
    {
      question: "Which formats are supported?",
      answer: "Any browser-decoded image can be uploaded. Output is JPEG, which lets you hit tight byte targets.",
    },
  ],
  howTo: [
    { title: "Upload an image", description: "Choose a picture from your device." },
    { title: "Pick a target size", description: "Tap 20/50/100/200/500 KB or enter a custom maximum." },
    { title: "Compress", description: "Run the compression — the real size is verified." },
    { title: "Download", description: "Save the compressed image locally." },
  ],

  engine: "file",
  privacyNote: "client",
}
