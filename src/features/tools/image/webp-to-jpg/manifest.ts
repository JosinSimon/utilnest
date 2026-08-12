import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "webp-to-jpg",
  name: "WebP to JPG Converter",
  slug: "webp-to-jpg",
  category: "image",
  path: "image/image-converter",

  shortDescription:
    "Convert WebP images to JPG online for compatibility with forms, email and apps that need JPEG. Private browser tool.",
  longDescription:
    "Convert WebP to JPG/JPEG with JPG selected automatically. Use it when a website, app, email tool or document workflow rejects WebP images.",
  schemaType: "Converter",
  sections: [
    { heading: "WebP to JPG output preset", body: "JPG is selected by default for compatibility with older tools and upload forms." },
    { heading: "Transparency handling", body: "Transparent WebP areas are flattened onto white because JPG does not support transparency." },
    { heading: "Adjustable quality", body: "Use the quality slider to control final JPG size and sharpness." },
    { heading: "Private browser conversion", body: "Your image is decoded and re-encoded locally in your browser. It is never uploaded to a server." },
  ],
  examples: [
    { title: "Quick conversion", input: "Upload your source image", output: "Download a JPG file" },
  ],
  primaryKeyword: "webp to jpg converter",
  keywords: ["webp to jpg", "convert webp to jpg", "webp image to jpg", "webp to jpeg converter"],
  searchAliases: ["webp2jpg", "webp to jpeg", "save webp as jpg"],
  searchWeight: 93,
  relatedTools: ["image-converter", "webp-to-png", "png-to-jpg", "image-compressor"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-12",
  lastUpdated: "2026-08-12",
  icon: "refresh-cw",
  faq: [
    { question: "Why convert WebP to JPG?", answer: "JPG is accepted by more older apps, email tools and upload forms than WebP." },
    { question: "What happens to transparency?", answer: "It is flattened onto white because JPG does not support transparent pixels." },
    { question: "Can I reduce file size?", answer: "Yes. Lower the quality slider for a smaller JPG." },
    { question: "Is my WebP uploaded?", answer: "No. It converts locally in your browser." },
  ],
  howTo: [
    { title: "Upload image", description: "Choose your source image from your device." },
    { title: "Keep JPG selected", description: "The output format is already selected for this exact conversion." },
    { title: "Convert in browser", description: "Run the conversion without uploading your file." },
    { title: "Download", description: "Save the converted image locally." },
  ],
  engine: "file",
  privacyNote: "client",
  preset: { outputFormat: "jpeg" },
}
