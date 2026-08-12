import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "compress-image-to-100kb",
  name: "Compress Image to 100KB",
  slug: "compress-image-to-100kb",
  category: "image",
  path: "government/compress-image",

  shortDescription:
    "Compress JPG or PNG images to 100KB or less for forms, email and document uploads. Private and browser-based.",
  longDescription:
    "Reduce image size to 100KB or less using UtilNest's private browser compression engine. This page preselects the 100KB target for users who need a safer upload limit than 50KB while keeping good visual quality.",
  schemaType: "Utility",
  sections: [
    { heading: "100KB upload-ready images", body: "Use this page when a website, exam portal or email form asks for an image under 100KB. The maximum size is already selected for you." },
    { heading: "Better quality than very small limits", body: "A 100KB target often keeps more detail than 20KB or 50KB compression, especially for passport-size photos and document images." },
    { heading: "No upload required", body: "All compression happens locally in your browser, so private photos and documents are never sent to a server." },
  ],
  examples: [
    { title: "Profile photo", input: "800KB JPG", output: "JPEG under 100KB" },
    { title: "Document portal", input: "Large phone image", output: "Compressed upload-ready image" },
  ],
  primaryKeyword: "compress image to 100kb",
  keywords: ["compress image to 100 kb", "photo under 100kb", "jpg to 100kb", "reduce image size to 100kb", "image compressor 100kb"],
  searchAliases: ["100kb photo compressor", "make photo 100kb", "image size reducer 100kb"],
  searchWeight: 93,
  relatedTools: ["image-compressor", "compress-image-to-50kb", "image-resizer", "government-exam-photo"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-12",
  lastUpdated: "2026-08-12",
  icon: "compress",
  faq: [
    { question: "Can I compress PNG to 100KB?", answer: "Yes. Upload a PNG and the tool will generate an upload-ready compressed image when possible." },
    { question: "Is 100KB enough for online forms?", answer: "Many portals accept 100KB images, but always check the limit printed on your form or notification." },
    { question: "Does this work on mobile?", answer: "Yes. It runs in modern mobile browsers and does not require app installation." },
    { question: "Is the compressed file size verified?", answer: "Yes. The tool checks the actual encoded output size before reporting success." },
  ],
  howTo: [
    { title: "Choose image", description: "Upload a JPG or PNG from your device." },
    { title: "Use 100KB target", description: "The maximum size is preset to 100KB." },
    { title: "Compress image", description: "Let the browser reduce and verify the file size." },
    { title: "Download result", description: "Save the final image under 100KB." },
  ],
  engine: "file",
  privacyNote: "client",
  preset: { targetKb: 100 },
}
