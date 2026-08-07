import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "image-converter",
  name: "Image Converter (JPG / PNG / WebP)",
  slug: "image-converter",
  category: "image",
  path: "image/image-converter",

  shortDescription:
    "Convert images between JPG, PNG and WebP in your browser. Adjustable quality for lossy formats, 100% on-device.",
  longDescription:
    "Upload any image and convert it to JPG, PNG or WebP. Tune the quality slider for JPG and WebP to balance file size against visual fidelity; PNG stays lossless. Everything is decoded and re-encoded locally — nothing is uploaded.",
  schemaType: "Utility",

  sections: [
    {
      heading: "Three formats, one tool",
      body: "JPG for small file sizes, PNG for lossless detail and transparency, WebP for modern web performance. Pick the output and hit convert.",
    },
    {
      heading: "Quality control",
      body: "For JPG and WebP a quality slider controls the trade-off between file size and sharpness. PNG output is always lossless.",
    },
    {
      heading: "Private by design",
      body: "Decoding and encoding happen entirely in your browser. Your image never leaves your device.",
    },
  ],

  examples: [],

  primaryKeyword: "jpg to png converter",
  keywords: [
    "jpg to png",
    "png to jpg",
    "webp to png",
    "jpg to webp",
    "image format converter",
    "convert image online",
  ],
  searchAliases: ["convert jpg to webp", "png to jpg converter", "webp to jpeg"],
  searchWeight: 82,

  relatedTools: ["image-resizer", "image-compressor"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-08-07",

  icon: "refresh-cw",
  faq: [
    {
      question: "Which conversions are supported?",
      answer: "Any of JPG, PNG or WebP as output. Any browser-decoded image can be uploaded as input.",
    },
    {
      question: "Does the quality slider affect PNG?",
      answer: "No. PNG output is always lossless; the slider only applies to the lossy JPG and WebP formats.",
    },
    {
      question: "Is my image uploaded anywhere?",
      answer: "No. Conversion runs entirely in your browser.",
    },
  ],
  howTo: [
    { title: "Upload an image", description: "Choose a picture from your device." },
    { title: "Pick the output format", description: "Select JPG, PNG or WebP." },
    { title: "Adjust quality", description: "For JPG/WebP, move the quality slider as needed." },
    { title: "Download", description: "Save the converted image locally." },
  ],

  engine: "file",
  privacyNote: "client",
}
