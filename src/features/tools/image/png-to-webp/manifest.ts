import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "png-to-webp",
  name: "PNG to WebP Converter",
  slug: "png-to-webp",
  category: "image",
  path: "image/image-converter",

  shortDescription:
    "Convert PNG images to WebP online for smaller website images and modern browser delivery. Private and free.",
  longDescription:
    "Convert PNG to WebP with WebP selected automatically. Use it to reduce large PNG files for websites while keeping a modern image format.",
  schemaType: "Converter",
  sections: [
    { heading: "PNG to WebP output preset", body: "WebP is selected automatically for smaller modern web output." },
    { heading: "Useful for large PNGs", body: "Converting PNG screenshots or graphics to WebP can reduce file size for websites." },
    { heading: "Transparency support", body: "WebP can support transparency in modern browsers, depending on image content and encoding." },
    { heading: "Private browser conversion", body: "Your image is decoded and re-encoded locally in your browser. It is never uploaded to a server." },
  ],
  examples: [
    { title: "Quick conversion", input: "Upload your source image", output: "Download a WEBP file" },
  ],
  primaryKeyword: "png to webp converter",
  keywords: ["png to webp", "convert png to webp", "png image to webp", "webp from png"],
  searchAliases: ["png2webp", "convert png to webp online"],
  searchWeight: 94,
  relatedTools: ["image-converter", "jpg-to-webp", "webp-to-png", "image-compressor"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-12",
  lastUpdated: "2026-08-12",
  icon: "refresh-cw",
  faq: [
    { question: "Why convert PNG to WebP?", answer: "WebP can make large PNG images smaller for websites and modern apps." },
    { question: "Does WebP support transparency?", answer: "Modern WebP supports transparency, but always preview the output before publishing." },
    { question: "Can I adjust quality?", answer: "Yes. WebP uses the quality slider." },
    { question: "Is my PNG uploaded?", answer: "No. It stays in your browser." },
  ],
  howTo: [
    { title: "Upload image", description: "Choose your source image from your device." },
    { title: "Keep WEBP selected", description: "The output format is already selected for this exact conversion." },
    { title: "Convert in browser", description: "Run the conversion without uploading your file." },
    { title: "Download", description: "Save the converted image locally." },
  ],
  engine: "file",
  privacyNote: "client",
  preset: { outputFormat: "webp" },
}
