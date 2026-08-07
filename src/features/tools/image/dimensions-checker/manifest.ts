import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "dimensions-checker",
  name: "Image Dimensions Checker",
  slug: "dimensions-checker",
  category: "image",
  path: "image/dimensions-checker",

  shortDescription:
    "Check the pixel dimensions, aspect ratio, megapixels, format and DPI of a JPG or PNG in one click.",
  longDescription:
    "Upload an image and instantly see its width × height, aspect ratio, megapixel count, file size, format and stored DPI (when available). Useful before resizing, cropping or submitting images to portals that require exact dimensions. Reads the file directly in your browser.",
  schemaType: "Utility",

  sections: [
    {
      heading: "Everything about your image at a glance",
      body: "Dimensions, aspect ratio, megapixels, file size, format and DPI are read straight from the file. No uploads, no waiting.",
    },
    {
      heading: "Aspect ratio made clear",
      body: "The ratio is shown as reduced integers (e.g. 16:9 or 4:5) so you know the image shape at a glance.",
    },
    {
      heading: "Private and instant",
      body: "The image is read entirely on your device — nothing is uploaded to any server.",
    },
  ],

  examples: [],

  primaryKeyword: "check image dimensions",
  keywords: [
    "image dimensions checker",
    "image pixel size checker",
    "what size is my image",
    "aspect ratio of image",
    "jpeg dimensions online",
    "image megapixels checker",
  ],
  searchAliases: ["image width height tool", "check photo resolution", "image dpi checker"],
  searchWeight: 68,

  relatedTools: ["image-dpi-converter", "image-resizer"],
  featured: false,
  trending: false,
  popular: false,
  addedAt: "2026-08-07",
  lastUpdated: "2026-08-07",

  icon: "ruler",
  faq: [
    {
      question: "What information does it show?",
      answer: "Pixel width and height, aspect ratio, megapixels, file size, format (JPG/PNG) and the stored DPI when the file includes it.",
    },
    {
      question: "Which formats are supported?",
      answer: "JPG and PNG. Their dimensions are read straight from the header.",
    },
    {
      question: "Is my image uploaded?",
      answer: "No. Everything is read locally on your device.",
    },
  ],
  howTo: [
    { title: "Upload an image", description: "Choose a JPG or PNG from your device." },
    { title: "Read the details", description: "Dimensions, ratio, size, format and DPI are shown instantly." },
  ],

  engine: "text",
  privacyNote: "client",
}