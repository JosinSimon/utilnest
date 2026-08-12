import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "compress-image-to-50kb",
  name: "Compress Image to 50KB",
  slug: "compress-image-to-50kb",
  category: "image",
  path: "government/compress-image",

  shortDescription:
    "Compress JPG or PNG images to 50KB or less for online forms, exams and uploads. Private, free and browser-based.",
  longDescription:
    "Compress an image to 50KB or less without uploading it. This exact-intent page opens the same private compression engine with a 50KB target already selected for form photos, exam uploads, job applications and document portals.",
  schemaType: "Utility",
  sections: [
    {
      heading: "Built for strict 50KB upload limits",
      body: "Many exam, job and document portals reject photos above 50KB. This page starts with the 50KB target selected so you can upload, compress and verify the real output size quickly.",
    },
    {
      heading: "Works for JPG and PNG photos",
      body: "Upload a JPG or PNG and the tool encodes a browser-generated JPEG that fits under the target when technically possible. If a photo cannot reach 50KB cleanly, the tool tells you instead of hiding the problem.",
    },
    {
      heading: "Private browser processing",
      body: "Your photo stays on your device. Compression runs in browser memory and no image pixels are uploaded to UtilNest servers.",
    },
  ],
  examples: [
    { title: "Exam photo", input: "A 1.2 MB phone photo", output: "JPEG compressed below 50KB" },
    { title: "Form upload", input: "A PNG document photo", output: "Upload-ready image under 50KB" },
  ],
  primaryKeyword: "compress image to 50kb",
  keywords: ["compress image to 50 kb", "photo under 50kb", "jpg to 50kb", "reduce image size to 50kb", "compress photo for online form"],
  searchAliases: ["50kb image compressor", "make photo 50kb", "image size reducer 50kb"],
  searchWeight: 95,
  relatedTools: ["image-compressor", "compress-image-to-100kb", "image-resizer", "government-exam-photo"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-12",
  lastUpdated: "2026-08-12",
  icon: "compress",
  faq: [
    { question: "Can I compress a JPG to 50KB?", answer: "Yes. Upload your JPG and the tool will reduce quality and size to fit under 50KB when the target is technically possible." },
    { question: "Is my photo uploaded?", answer: "No. The image is processed inside your browser and never leaves your device." },
    { question: "Will the image quality reduce?", answer: "Yes, some quality reduction is usually needed for a strict 50KB limit. The tool tries to preserve as much quality as possible." },
    { question: "What if the image cannot reach 50KB?", answer: "The tool reports that the requested size is not possible instead of giving you a non-compliant file." },
  ],
  howTo: [
    { title: "Upload image", description: "Choose a JPG or PNG from your device." },
    { title: "Keep 50KB selected", description: "The maximum size is already set to 50KB." },
    { title: "Compress", description: "Run compression and check the verified output size." },
    { title: "Download", description: "Save the compressed image for your form or upload." },
  ],
  engine: "file",
  privacyNote: "client",
  preset: { targetKb: 50 },
}
