import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "resize-signature-140x60",
  name: "Resize Signature to 140x60 Pixels",
  slug: "resize-signature-140x60",
  category: "government",
  path: "government/compress-image",
  shortDescription:
    "Resize and compress a signature to 140x60 pixels for Indian exam and recruitment forms. Private browser processing.",
  longDescription:
    "Prepare a signature image at 140x60 pixels for forms that ask for this common Indian exam signature size. This page preselects the pixel dimensions and a 20KB target, while letting you verify the final output before download.",
  schemaType: "Utility",
  sections: [
    { heading: "140x60 signature preset", body: "The width and height fields are already set to 140 and 60 pixels, a common signature size for exam and recruitment uploads." },
    { heading: "Compress with verification", body: "The tool checks the real file size after encoding so you know whether the result fits the required KB limit." },
    { heading: "Check the latest notification", body: "Signature requirements can change by exam cycle. Always compare the final dimensions and KB size with your latest official notice." },
  ],
  examples: [
    { title: "Exam signature", input: "Scanned signature image", output: "140x60 px compressed JPEG" },
  ],
  primaryKeyword: "resize signature 140x60",
  keywords: ["signature resize 140x60", "140x60 signature size", "signature resize for exam", "signature compressor 20kb"],
  searchAliases: ["resize signature to 140 60", "signature 140 x 60", "exam signature resize"],
  searchWeight: 94,
  relatedTools: ["signature-resizer", "exam-preset", "compress-image", "resize-image"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-12",
  lastUpdated: "2026-08-12",
  icon: "pen-line",
  faq: [
    { question: "What is 140x60 signature size?", answer: "It means the final signature image should be 140 pixels wide and 60 pixels tall." },
    { question: "Can I compress the signature below 20KB?", answer: "Yes. This page starts with a 20KB target and verifies the final encoded size." },
    { question: "Should the signature be JPG or PNG?", answer: "Most exam portals prefer JPG/JPEG, but you should check your exact notification before uploading." },
    { question: "Is my signature uploaded?", answer: "No. The signature is resized and compressed inside your browser." },
  ],
  howTo: [
    { title: "Upload signature", description: "Choose your scanned or photographed signature image." },
    { title: "Use 140x60 preset", description: "The required width and height are already filled in." },
    { title: "Compress and verify", description: "Run the tool and check the final pixels and KB size." },
    { title: "Download", description: "Save the resized signature for upload." },
  ],
  engine: "file",
  privacyNote: "client",
  preset: { targetKb: 20, width: 140, height: 60 },
}
