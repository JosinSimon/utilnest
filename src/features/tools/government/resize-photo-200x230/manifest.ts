import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "resize-photo-200x230",
  name: "Resize Photo to 200x230 Pixels",
  slug: "resize-photo-200x230",
  category: "government",
  path: "government/compress-image",
  shortDescription:
    "Resize and compress a photo to 200x230 pixels for common Indian exam and job form uploads. Private and free.",
  longDescription:
    "Resize a photo to 200x230 pixels with a 50KB target for forms that require this common passport-photo ratio. The tool runs in your browser and verifies the final dimensions and file size.",
  schemaType: "Utility",
  sections: [
    { heading: "200x230 photo preset", body: "The pixel width and height are prefilled as 200x230, commonly requested by Indian recruitment and exam portals." },
    { heading: "Compress for upload limits", body: "A 50KB target is selected by default, and the final byte size is checked before success is shown." },
    { heading: "Use with official specs", body: "Requirements vary by form, so compare the final image with the latest official instructions before uploading." },
  ],
  examples: [
    { title: "Application photo", input: "Phone camera passport photo", output: "200x230 px compressed JPEG" },
  ],
  primaryKeyword: "resize photo 200x230",
  keywords: ["photo resize 200x230", "200x230 photo size", "resize photo for exam", "photo 200 230 pixels"],
  searchAliases: ["200x230 photo resizer", "resize image 200x230", "exam photo 200x230"],
  searchWeight: 92,
  relatedTools: ["government-exam-photo", "resize-image", "compress-image", "resize-signature-140x60"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-12",
  lastUpdated: "2026-08-12",
  icon: "id-card",
  faq: [
    { question: "What does 200x230 photo mean?", answer: "The final image should be 200 pixels wide and 230 pixels tall." },
    { question: "Can I keep the photo under 50KB?", answer: "Yes. The page uses a 50KB target and tells you if the target cannot be reached." },
    { question: "Does it crop my photo?", answer: "The compression workflow can resize/downscale for upload limits. For careful face cropping, use the exam photo preset tool." },
    { question: "Does my photo leave my device?", answer: "No. It is processed locally in your browser." },
  ],
  howTo: [
    { title: "Upload photo", description: "Select the photo from your phone or computer." },
    { title: "Use 200x230 preset", description: "The width, height and KB target are already filled in." },
    { title: "Process image", description: "Resize and compress the photo in your browser." },
    { title: "Download", description: "Save the 200x230 output file." },
  ],
  engine: "file",
  privacyNote: "client",
  preset: { targetKb: 50, width: 200, height: 230 },
}
