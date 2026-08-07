import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "image-base64",
  name: "Image to Base64",
  slug: "image-base64",
  category: "image",
  path: "image/image-base64",

  shortDescription:
    "Convert an image to a Base64 data URL, or decode Base64 back into a download-ready image. All in your browser.",
  longDescription:
    "Encode any image as a Base64 data URL for embedding in HTML, CSS or JSON — or paste a Base64 string / data URL and turn it back into a viewable, downloadable image. The mime type (PNG/JPEG/WebP/GIF) is detected automatically. Nothing is uploaded.",
  schemaType: "Utility",

  sections: [
    {
      heading: "Encode image to Base64",
      body: "Upload an image and get its data URL. Useful for embedding small images directly into code without a separate file request.",
    },
    {
      heading: "Decode Base64 to image",
      body: "Paste a Base64 string or a data:image/... URL. The tool detects the format, previews the image and lets you download it.",
    },
    {
      heading: "Private by design",
      body: "Encoding and decoding happen entirely in your browser. Your image never leaves your device.",
    },
  ],

  examples: [],

  primaryKeyword: "image to base64",
  keywords: [
    "image to base64 converter",
    "encode image to base64",
    "base64 to image",
    "image data url",
    "base64 image converter online",
    "jpg to base64",
  ],
  searchAliases: ["turn image into base64 string", "decode base64 image", "image base64 encoder decoder"],
  searchWeight: 70,

  relatedTools: ["image-resizer", "image-compressor"],
  featured: false,
  trending: false,
  popular: false,
  addedAt: "2026-08-07",
  lastUpdated: "2026-08-07",

  icon: "binary",
  faq: [
    {
      question: "What is a Base64 data URL?",
      answer:
        "A data URL embeds an image directly in text using the prefix data:image/...;base64,... It can be used in HTML src, CSS url() or JSON without a separate file.",
    },
    {
      question: "Do you detect the image format when decoding?",
      answer:
        "Yes. The PNG, JPEG, WebP and GIF formats are recognised automatically from the file signature, or read from the data URL prefix if present.",
    },
    {
      question: "Is my image uploaded anywhere?",
      answer: "No. The conversion happens entirely in your browser; the image never leaves your device.",
    },
  ],
  howTo: [
    { title: "Pick encode or decode", description: "Choose the direction you need." },
    { title: "Upload or paste", description: "Upload an image to encode, or paste Base64 to decode." },
    { title: "Copy or download", description: "Copy the data URL, or download the reconstructed image." },
  ],

  engine: "text",
  privacyNote: "client",
}