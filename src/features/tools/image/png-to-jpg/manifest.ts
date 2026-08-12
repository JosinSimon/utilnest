import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "png-to-jpg",
  name: "PNG to JPG Converter",
  slug: "png-to-jpg",
  category: "image",
  path: "image/image-converter",

  shortDescription:
    "Convert PNG images to JPG online for smaller files, email, forms and compatibility. Private browser conversion.",
  longDescription:
    "Convert PNG to JPG with the JPG output selected by default. This is useful for reducing file size and creating upload-compatible JPEG images from PNG files.",
  schemaType: "Converter",
  sections: [
    { heading: "PNG to JPG output preset", body: "JPG is selected automatically so you can upload a PNG and download a JPEG quickly." },
    { heading: "Transparency handling", body: "Transparent PNG areas are flattened onto a white background because JPG does not support transparency." },
    { heading: "Smaller photo files", body: "JPG is often smaller than PNG for photos, screenshots and documents with many colors." },
    { heading: "Private browser conversion", body: "Your image is decoded and re-encoded locally in your browser. It is never uploaded to a server." },
  ],
  examples: [
    { title: "Quick conversion", input: "Upload your source image", output: "Download a JPG file" },
  ],
  primaryKeyword: "png to jpg converter",
  keywords: ["png to jpg", "convert png to jpg", "png image to jpg", "png to jpeg converter", "transparent png to jpg"],
  searchAliases: ["png2jpg", "png to jpeg", "convert png to jpeg"],
  searchWeight: 97,
  relatedTools: ["image-converter", "jpg-to-png", "jpg-to-webp", "image-compressor"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-12",
  lastUpdated: "2026-08-12",
  icon: "refresh-cw",
  faq: [
    { question: "What happens to transparent PNG areas?", answer: "They are flattened onto a white background because JPG/JPEG does not support transparency." },
    { question: "Will JPG be smaller than PNG?", answer: "Often yes, especially for photos and screenshots, because JPG uses lossy compression." },
    { question: "Can I adjust JPG quality?", answer: "Yes. Use the quality slider to balance file size and visual sharpness." },
    { question: "Is the PNG uploaded?", answer: "No. It is converted locally in your browser." },
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
