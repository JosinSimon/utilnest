import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "image-cropper",
  name: "Image Cropper",
  slug: "image-cropper",
  category: "image",
  path: "image/image-cropper",

  shortDescription:
    "Crop an image with a draggable, resizable box and save as JPG or PNG. Crop aspect presets included, 100% in your browser.",
  longDescription:
    "Upload an image, drag the crop box to frame the part you want, then save the result as JPEG or PNG. Optional aspect-ratio presets keep your crop perfectly square, 1:1, 4:3, 3:2 or 16:9. Everything runs locally — nothing is uploaded.",
  schemaType: "Utility",

  sections: [
    {
      heading: "Draggable crop box",
      body: "Move and resize a selection box over the image to choose exactly what to keep. The crop preview stays sharp because cropping happens at full resolution.",
    },
    {
      heading: "Aspect-ratio presets",
      body: "Free-form crop or lock to 1:1, 4:3, 3:2 or 16:9 — ideal for profile pictures, thumbnails, and social posts.",
    },
    {
      heading: "Private by design",
      body: "The image is decoded and cropped entirely in your browser. It never leaves your device.",
    },
  ],

  examples: [],

  primaryKeyword: "crop image",
  keywords: [
    "image cropper",
    "crop photo online",
    "crop image to square",
    "crop picture aspect ratio",
    "crop jpg",
    "crop png image",
  ],
  searchAliases: ["cut part of image", "crop photo to 16:9", "square crop image"],
  searchWeight: 80,

  relatedTools: ["image-resizer", "image-converter"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-08-07",

  icon: "crop",
  faq: [
    {
      question: "Does cropping reduce quality?",
      answer: "No. The crop is taken from the full-resolution source image, so the result matches the rest of the original.",
    },
    {
      question: "Can I lock the aspect ratio?",
      answer: "Yes. Choose 1:1, 4:3, 3:2 or 16:9 to keep the crop proportional, or use Free to crop any shape.",
    },
    {
      question: "Is my image uploaded anywhere?",
      answer: "No. Cropping happens entirely in your browser.",
    },
  ],
  howTo: [
    { title: "Upload an image", description: "Choose a picture from your device." },
    { title: "Position the crop box", description: "Drag and resize to frame what you want." },
    { title: "Pick the format", description: "Choose JPEG or PNG output." },
    { title: "Save", description: "Download the cropped image locally." },
  ],

  engine: "file",
  privacyNote: "client",
}