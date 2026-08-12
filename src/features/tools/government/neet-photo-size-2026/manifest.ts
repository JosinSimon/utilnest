import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "neet-photo-size-2026",
  name: "NEET Photo Size 2026",
  slug: "neet-photo-size-2026",
  category: "government",
  path: "government/exam-preset",
  shortDescription:
    "Prepare NEET UG 2026 photo and signature images with focused presets, browser processing and clear specification notes.",
  longDescription:
    "Use focused NEET UG photo and signature presets to resize and compress images for the 2026 application workflow. Requirements can change, so always compare the result with the latest NTA bulletin before upload.",
  schemaType: "Utility",
  sections: [
    { heading: "NEET-focused presets", body: "The picker shows only NEET UG photo and signature options instead of the full exam registry." },
    { heading: "Specification notes included", body: "The tool displays dimensions, KB range, format and source notes from the preset registry before you process your image." },
    { heading: "Private image processing", body: "Uploaded photos and signatures are resized locally in your browser and never sent to a server." },
  ],
  examples: [
    { title: "NEET photo", input: "Recent passport photo", output: "NEET preset output with verified size" },
  ],
  primaryKeyword: "neet photo size 2026",
  keywords: ["neet photo size", "neet signature size", "neet photo resizer", "neet ug photo size 2026"],
  searchAliases: ["neet photo upload size", "neet image size", "neet signature resize"],
  searchWeight: 96,
  relatedTools: ["government-exam-photo", "exam-preset", "compress-image", "signature-resizer"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-12",
  lastUpdated: "2026-08-12",
  icon: "id-card",
  faq: [
    { question: "Does this page use NEET-specific presets?", answer: "Yes. It limits the tool to NEET UG photo and signature presets for a focused workflow." },
    { question: "Are NEET requirements always the same?", answer: "No. Always check the latest NTA bulletin before final submission." },
    { question: "Can I resize both photo and signature?", answer: "Yes. The focused picker includes both NEET photo and signature presets." },
    { question: "Is my NEET photo uploaded to UtilNest?", answer: "No. Processing happens in your browser." },
  ],
  howTo: [
    { title: "Select NEET preset", description: "Choose photo or signature in the focused picker." },
    { title: "Check the requirement", description: "Review the displayed dimensions, format and KB range." },
    { title: "Upload image", description: "Choose your photo or signature file." },
    { title: "Download result", description: "Save the generated file after validation." },
  ],
  engine: "file",
  privacyNote: "client",
  preset: { presetIds: ["neet-ug-photo", "neet-ug-signature"] },
}
