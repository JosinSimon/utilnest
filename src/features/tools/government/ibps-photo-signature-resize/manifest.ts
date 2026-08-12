import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "ibps-photo-signature-resize",
  name: "IBPS Photo and Signature Resize",
  slug: "ibps-photo-signature-resize",
  category: "government",
  path: "government/exam-preset",
  shortDescription:
    "Resize and compress IBPS photo and signature images with focused presets for PO, Clerk and banking exam forms.",
  longDescription:
    "Prepare IBPS photo and signature uploads using focused presets from the shared exam registry. The tool shows the required pixels, KB range and format, then processes everything privately in your browser.",
  schemaType: "Utility",
  sections: [
    { heading: "IBPS-only workflow", body: "The preset picker is limited to IBPS photo and signature options so applicants do not have to search through unrelated exams." },
    { heading: "Photo and signature support", body: "Use one page for both the IBPS photograph and signature upload steps, with the relevant size ranges shown before processing." },
    { heading: "Browser-based privacy", body: "Your application photo and signature are processed locally and are not uploaded to UtilNest." },
  ],
  examples: [
    { title: "IBPS signature", input: "Black-ink scanned signature", output: "140x60 px IBPS signature preset" },
  ],
  primaryKeyword: "ibps photo signature resize",
  keywords: ["ibps photo resize", "ibps signature resize", "ibps photo and signature size", "ibps image compressor"],
  searchAliases: ["ibps photo signature compressor", "ibps upload photo size", "ibps signature 140x60"],
  searchWeight: 95,
  relatedTools: ["exam-preset", "government-exam-photo", "signature-resizer", "resize-photo-200x230"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-12",
  lastUpdated: "2026-08-12",
  icon: "id-card",
  faq: [
    { question: "Can I resize both IBPS photo and signature here?", answer: "Yes. The focused picker includes both IBPS photo and signature presets." },
    { question: "What is the IBPS signature size?", answer: "The registry includes the common 140x60 pixel signature preset; verify against the latest IBPS notification before uploading." },
    { question: "Does it verify the final file size?", answer: "Yes. The tool validates the output against the selected preset's pixel and KB requirements." },
    { question: "Is the file uploaded?", answer: "No. Image processing runs locally in your browser." },
  ],
  howTo: [
    { title: "Choose IBPS photo or signature", description: "Select the required IBPS preset." },
    { title: "Review specs", description: "Check dimensions, KB limit and format." },
    { title: "Upload file", description: "Choose the image from your device." },
    { title: "Download verified output", description: "Save the processed file for the IBPS portal." },
  ],
  engine: "file",
  privacyNote: "client",
  preset: { presetIds: ["ibps-po-photo", "ibps-signature"] },
}
