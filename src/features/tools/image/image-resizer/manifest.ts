import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "image-resizer",
  name: "Image Resizer",
  slug: "image-resizer",
  category: "image",
  path: "image/image-resizer",

  shortDescription:
    "Resize an image to exact pixel dimensions in your browser. Aspect ratio is preserved automatically when you set one side.",
  longDescription:
    "Upload any image and set the exact pixel width and/or height you need. Leave one side blank and the tool keeps the original proportions automatically. Download the resized image as JPEG or PNG. Everything is processed on your device — nothing is uploaded.",
  schemaType: "Utility",

  sections: [
    {
      heading: "Exact pixels, instant results",
      body: "Enter the target width and height in pixels. The image is decoded, resized once and encoded locally, so results are accurate and fast.",
    },
    {
      heading: "Automatic aspect ratio",
      body: "Provide only the width or only the height and the other dimension is computed from the original proportions — no distortion, no manual math.",
    },
    {
      heading: "JPEG or PNG output",
      body: "Pick JPEG for a smaller file size or PNG for a lossless result. Web images for social media often need exact dimensions and a compact size.",
    },
  ],

  examples: [],

  primaryKeyword: "resize image",
  keywords: [
    "image resizer",
    "resize image online",
    "change image dimensions",
    "resize photo to pixels",
    "resize image jpg png",
    "image dimensions in px",
  ],
  searchAliases: ["resize a picture", "change photo size pixels", "scale image to exact size"],
  searchWeight: 85,

  relatedTools: ["image-compressor", "image-base64"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-08-07",

  icon: "scaling",
  faq: [
    {
      question: "Does resizing work offline?",
      answer: "Yes. The image never leaves your device — it is decoded, resized and encoded entirely in your browser.",
    },
    {
      question: "What happens if I only enter one dimension?",
      answer: "The missing side is calculated to preserve the original aspect ratio, so the image is never distorted.",
    },
    {
      question: "Which formats can I upload and download?",
      answer: "Any browser-decoded image can be uploaded; output is JPEG or PNG at your chosen dimensions.",
    },
  ],
  howTo: [
    { title: "Upload an image", description: "Choose a picture from your device." },
    { title: "Set dimensions", description: "Enter the pixel width and/or height you need." },
    { title: "Choose the format", description: "Pick JPEG or PNG output." },
    { title: "Download", description: "Save the resized image locally." },
  ],

  engine: "file",
  privacyNote: "client",
}
