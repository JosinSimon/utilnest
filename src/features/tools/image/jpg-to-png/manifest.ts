import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "jpg-to-png",
  name: "JPG to PNG Converter",
  slug: "jpg-to-png",
  category: "image",
  path: "image/image-converter",

  shortDescription:
    "Convert JPG or JPEG images to PNG online for editing, sharing and compatibility. Free, private and browser-based.",
  longDescription:
    "Convert JPG or JPEG images to PNG without uploading. This page opens the image converter with PNG already selected and explains transparency, quality and file-size expectations clearly.",
  schemaType: "Converter",
  sections: [
    { heading: "JPG to PNG output preset", body: "PNG is selected automatically, so you can upload a JPG/JPEG and download a PNG file without changing settings." },
    { heading: "Transparency note", body: "Converting a JPG to PNG does not magically add transparency because JPG files do not contain transparent pixels." },
    { heading: "Best for editing compatibility", body: "PNG is useful when an editor, design tool or upload portal asks specifically for PNG input." },
    { heading: "Private browser conversion", body: "Your image is decoded and re-encoded locally in your browser. It is never uploaded to a server." },
  ],
  examples: [
    { title: "Quick conversion", input: "Upload your source image", output: "Download a PNG file" },
  ],
  primaryKeyword: "jpg to png converter",
  keywords: ["jpg to png", "convert jpg to png", "jpg image to png", "jpeg to png converter", "jpg png converter"],
  searchAliases: ["jpeg to png", "convert jpeg to png", "jpg2png"],
  searchWeight: 98,
  relatedTools: ["image-converter", "png-to-jpg", "webp-to-png", "image-compressor"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-12",
  lastUpdated: "2026-08-12",
  icon: "refresh-cw",
  faq: [
    { question: "Will JPG become transparent after converting to PNG?", answer: "No. JPG has no transparency data, so converting to PNG preserves the visible image but does not create a transparent background." },
    { question: "Does JPG to PNG improve quality?", answer: "No. Conversion changes the file format; it cannot restore quality already lost in the JPG." },
    { question: "Why is the PNG larger than the JPG?", answer: "PNG is lossless, so PNG output can be larger than JPG for photos." },
    { question: "Is my image uploaded?", answer: "No. Conversion runs in your browser." },
  ],
  howTo: [
    { title: "Upload image", description: "Choose your source image from your device." },
    { title: "Keep PNG selected", description: "The output format is already selected for this exact conversion." },
    { title: "Convert in browser", description: "Run the conversion without uploading your file." },
    { title: "Download", description: "Save the converted image locally." },
  ],
  engine: "file",
  privacyNote: "client",
  preset: { outputFormat: "png" },
}
