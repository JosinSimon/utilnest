import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "ssc-signature-resize",
  name: "SSC Signature Resize",
  slug: "ssc-signature-resize",
  category: "government",
  path: "government/exam-preset",
  shortDescription:
    "Resize and compress an SSC signature using the focused signature preset with clear verification and privacy notes.",
  longDescription:
    "Prepare an SSC signature image with a focused preset for the common 140x60 signature requirement. SSC requirements may change by cycle, so compare the result with the latest official instructions before upload.",
  schemaType: "Utility",
  sections: [
    { heading: "Focused SSC signature preset", body: "This page opens directly to the SSC signature option instead of showing every exam preset." },
    { heading: "Clear verification status", body: "The preset card displays dimensions, KB range, format and verification notes before processing." },
    { heading: "Private browser workflow", body: "Your signature image is handled in browser memory and is not uploaded." },
  ],
  examples: [
    { title: "SSC signature", input: "Scanned black-ink signature", output: "SSC signature preset output" },
  ],
  primaryKeyword: "ssc signature resize",
  keywords: ["ssc signature size", "ssc signature 140x60", "ssc cgl signature resize", "ssc signature compressor"],
  searchAliases: ["resize ssc signature", "ssc sign resize", "ssc signature kb size"],
  searchWeight: 94,
  relatedTools: ["signature-resizer", "exam-preset", "resize-signature-140x60", "compress-image"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-12",
  lastUpdated: "2026-08-12",
  icon: "pen-line",
  faq: [
    { question: "Does this page focus only on SSC signature?", answer: "Yes. It opens with the SSC signature preset selected." },
    { question: "Is the SSC signature size always 140x60?", answer: "Not always. The preset reflects a common reported size; verify against the latest SSC instructions." },
    { question: "Can it compress the signature to the required KB range?", answer: "Yes, when technically possible. The output is checked against the selected preset." },
    { question: "Is my signature uploaded?", answer: "No. It is processed locally in your browser." },
  ],
  howTo: [
    { title: "Open SSC signature preset", description: "The focused preset is already selected." },
    { title: "Upload signature", description: "Choose your scanned or photographed signature." },
    { title: "Process and validate", description: "Resize, compress and check the output." },
    { title: "Download", description: "Save the generated signature file." },
  ],
  engine: "file",
  privacyNote: "client",
  preset: { presetIds: ["ssc-cgl-signature"] },
}
