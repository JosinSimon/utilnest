import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "jpg-to-webp",
  name: "JPG to WebP Converter",
  slug: "jpg-to-webp",
  category: "image",
  path: "image/image-converter",

  shortDescription:
    "Convert JPG images to WebP online for smaller modern web images. Free, fast and browser-based.",
  longDescription:
    "Convert JPG or JPEG to WebP with WebP selected automatically. This is useful for website images, faster loading pages and smaller modern image files.",
  schemaType: "Converter",
  sections: [
    { heading: "JPG to WebP output preset", body: "WebP is selected by default for modern browser-friendly image output." },
    { heading: "Good for website performance", body: "WebP often produces smaller files than JPG at similar visual quality." },
    { heading: "Adjustable quality", body: "Use the quality slider to balance sharpness and file size." },
    { heading: "Private browser conversion", body: "Your image is decoded and re-encoded locally in your browser. It is never uploaded to a server." },
  ],
  examples: [
    { title: "Quick conversion", input: "Upload your source image", output: "Download a WEBP file" },
  ],
  primaryKeyword: "jpg to webp converter",
  keywords: ["jpg to webp", "convert jpg to webp", "jpeg to webp", "jpg image to webp", "webp converter"],
  searchAliases: ["jpeg to webp", "jpg2webp", "convert jpeg to webp"],
  searchWeight: 95,
  relatedTools: ["image-converter", "webp-to-png", "png-to-jpg", "image-compressor"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-12",
  lastUpdated: "2026-08-12",
  icon: "refresh-cw",
  faq: [
    { question: "Is WebP smaller than JPG?", answer: "Often yes, but the exact size depends on the photo and quality setting." },
    { question: "Can all websites use WebP?", answer: "Most modern browsers support WebP, but some older workflows still require JPG or PNG." },
    { question: "Can I adjust quality?", answer: "Yes. The quality slider applies to WebP output." },
    { question: "Is my JPG uploaded?", answer: "No. Conversion happens locally in your browser." },
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
