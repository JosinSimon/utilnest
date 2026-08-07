import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "resize-image",
  name: "Resize Image to Exact Pixels",
  slug: "resize-image",
  category: "government",
  path: "government/resize-image",

  shortDescription:
    "Resize any photo to an exact pixel size (e.g. 453 × 453) in your browser. Free, fast and fully private.",
  longDescription:
    "Enter the exact pixel width and height required (or set one side and keep the aspect ratio) and this tool renders your photo to those exact dimensions in-browser. Ideal when a form mandates a precise pixel size but no file-size constraint. JPEG and PNG output are supported.",
  schemaType: "Utility",

  sections: [
    {
      heading: "Exact pixel output",
      body: "The resized image is rendered to precisely the requested width and height using high-quality canvas resampling. What you download matches the pixels you asked for.",
    },
    {
      heading: "Aspect ratio control",
      body: "Set both width and height for exact dimensions, or set one side and the tool keeps the original aspect ratio for the other.",
    },
    {
      heading: "Private by design",
      body: "Your image is decoded, resized and encoded entirely in the browser — nothing is uploaded.",
    },
  ],

  examples: [],

  primaryKeyword: "resize image to exact pixels",
  keywords: [
    "resize image to 453x453",
    "photo exact pixel size",
    "resize jpg to specific dimensions",
    "image dimensions resizer",
    "resize png online",
  ],
  searchAliases: ["resize photo pixels", "exact image size", "set image pixel size"],
  searchWeight: 72,

  relatedTools: ["compress-image"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-08-07",

  icon: "maximize",
  faq: [
    {
      question: "Does it keep my files private?",
      answer: "Yes. All decoding, resizing and encoding happen in your browser; nothing is uploaded.",
    },
    {
      question: "Can I keep the aspect ratio?",
      answer: "Yes. Leave one dimension empty and the other side is derived from the original ratio.",
    },
    {
      question: "What formats can I output?",
      answer: "JPEG or PNG. Choose JPEG for photos and PNG for images that need transparency or crisp edges.",
    },
  ],
  howTo: [
    { title: "Upload an image", description: "Choose a JPEG or PNG from your device." },
    { title: "Set the pixel size", description: "Enter the required width and height (or one side)." },
    { title: "Choose format", description: "Pick JPEG or PNG output." },
    { title: "Download", description: "Save the resized image locally." },
  ],

  engine: "file",
  privacyNote: "client",
}