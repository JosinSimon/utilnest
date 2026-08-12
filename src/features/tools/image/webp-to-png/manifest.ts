import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "webp-to-png",
  name: "WebP to PNG Converter",
  slug: "webp-to-png",
  category: "image",
  path: "image/image-converter",

  shortDescription:
    "Convert WebP images to PNG online for editors, design tools and upload portals. Free and private in your browser.",
  longDescription:
    "Convert WebP to PNG when an editor, website or form does not accept WebP. PNG is selected automatically and conversion runs fully in your browser.",
  schemaType: "Converter",
  sections: [
    { heading: "WebP to PNG output preset", body: "PNG is selected automatically for compatibility with older editors and upload forms." },
    { heading: "Useful for design workflows", body: "PNG works well when you need lossless output or when a design tool rejects WebP." },
    { heading: "File size expectations", body: "PNG output may be larger than WebP because PNG is lossless." },
    { heading: "Private browser conversion", body: "Your image is decoded and re-encoded locally in your browser. It is never uploaded to a server." },
  ],
  examples: [
    { title: "Quick conversion", input: "Upload your source image", output: "Download a PNG file" },
  ],
  primaryKeyword: "webp to png converter",
  keywords: ["webp to png", "convert webp to png", "webp image to png", "webp png converter"],
  searchAliases: ["webp2png", "save webp as png", "webp to png online"],
  searchWeight: 96,
  relatedTools: ["image-converter", "jpg-to-png", "png-to-jpg", "jpg-to-webp"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-12",
  lastUpdated: "2026-08-12",
  icon: "refresh-cw",
  faq: [
    { question: "Why convert WebP to PNG?", answer: "Use PNG when a form, editor or app does not support WebP." },
    { question: "Will PNG be larger than WebP?", answer: "Usually yes. WebP is optimized for smaller web images, while PNG is lossless." },
    { question: "Does this keep transparency?", answer: "If the browser decodes transparency from the WebP, PNG can preserve it." },
    { question: "Is my WebP uploaded?", answer: "No. It is converted in your browser." },
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
