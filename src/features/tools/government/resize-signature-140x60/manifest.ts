import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "resize-signature-140x60",
  name: "Resize Signature to 140 x 60 Pixels",
  slug: "resize-signature-140x60",
  category: "government",
  path: "government/compress-image",
  shortDescription:
    "Resize your signature to 140 x 60 pixels and 10–20 KB JPG for IBPS, bank and SSC exam forms. Size is verified before download. Free, no upload.",
  longDescription:
    "Many Indian recruitment forms ask for the signature as a 140 x 60 pixel JPG between 10 KB and 20 KB. This page is preset to exactly that: 140 pixels wide, 60 pixels tall, under 20 KB. Choose a photo or scan of your signature, and download a file that fits, with the final pixels and KB checked before you upload. Your signature is processed on your device and never uploaded.",
  schemaType: "Utility",
  sections: [
    {
      heading: "What does 140 x 60 pixels mean?",
      body: "It is the image size in pixels: 140 pixels wide and 60 pixels tall, a wide strip that fits a signature. It is not a size in cm or KB. Forms that use it usually also set a file-size range, most often 10 KB to 20 KB, and a format, usually JPG/JPEG. This page sets all three for you.",
    },
    {
      heading: "Which exams use a 140 x 60 signature?",
      body: "The IBPS PO and Clerk 2026 notification specifies the signature as 140 x 60 pixels, 10–20 KB, JPEG, in black ink on white paper. Many other bank recruitment forms follow the same size, and the same size is widely reported for SSC exams. Requirements can change each cycle, so always confirm the size in your official notification before uploading.",
    },
    {
      heading: "How to get a clean signature image",
      body: "Sign with a black ink pen on plain white paper, larger than you normally would. Photograph it in good light, straight on, without shadows, then crop close around the signature. A wide, tightly cropped signature fills the 140 x 60 frame better and stays readable after resizing. Avoid blue ink, lined paper and pencil.",
    },
    {
      heading: "Fixing a rejected signature upload",
      body: "If the form says the file is too large, keep the 20 KB target and compress again. If it says the dimensions are wrong, make sure width is 140 and height is 60, not the other way round. If it says the file is too small (under 10 KB), your image may be almost empty: crop closer so the signature fills more of the frame.",
    },
    {
      heading: "Private and free",
      body: "Your signature is a sensitive document. This tool resizes and compresses it in your browser, adds no watermark and needs no sign-up. Nothing is uploaded to UtilNest or anywhere else.",
    },
  ],
  examples: [
    { title: "Phone photo of a signature", input: "3 MB JPG photo of a signature on white paper", output: "140 x 60 px JPG, under 20 KB" },
    { title: "Scanned signature", input: "PNG scan, 1200 x 500 px", output: "140 x 60 px JPG, 10–20 KB" },
  ],
  primaryKeyword: "resize signature 140x60",
  keywords: [
    "140 x 60 pixels",
    "140x60 signature",
    "signature resize 140x60",
    "140x60 signature size",
    "ibps signature size",
    "signature 140x60 10-20kb",
    "signature resize for exam",
    "signature compressor 20kb",
  ],
  searchAliases: ["resize signature to 140 60", "signature 140 x 60", "140 60 pixel signature", "exam signature resize"],
  searchWeight: 94,
  relatedTools: ["resize-photo-200x230", "ibps-photo-signature-resize", "ssc-signature-resize", "signature-resizer"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-12",
  lastUpdated: "2026-11-11",
  icon: "pen-line",
  faq: [
    {
      question: "What is 140 x 60 pixels in a signature?",
      answer:
        "It means the signature image must be 140 pixels wide and 60 pixels tall. Forms that use this size usually also require a JPG file between 10 KB and 20 KB.",
    },
    {
      question: "How do I resize my signature to 140 x 60 pixels?",
      answer:
        "Choose your signature photo or scan on this page. Width 140, height 60 and a 20 KB limit are already filled in. Press compress and download the result.",
    },
    {
      question: "What is the IBPS signature size?",
      answer:
        "The IBPS PO and Clerk 2026 notification lists the signature as 140 x 60 pixels, 10–20 KB, in JPEG format. The photo is a separate upload at 200 x 230 pixels, 20–50 KB.",
    },
    {
      question: "Should the signature be JPG or PNG?",
      answer:
        "Use JPG/JPEG unless your notification says otherwise. This tool saves the signature as JPG.",
    },
    {
      question: "Why is my signature file rejected as too small?",
      answer:
        "If the file is under 10 KB, the image is probably mostly blank. Crop closer around the signature so it fills the frame, then compress again.",
    },
    {
      question: "Is my signature uploaded?",
      answer: "No. It is resized and compressed inside your browser and never leaves your device.",
    },
  ],
  howTo: [
    { title: "Sign on white paper", description: "Use a black pen, then photograph or scan the signature." },
    { title: "Choose the image", description: "Upload the photo or scan. Width 140 and height 60 are preset." },
    { title: "Compress to 20 KB", description: "The tool resizes to 140 x 60 and keeps the file under 20 KB." },
    { title: "Check and download", description: "Confirm the pixels and KB shown, then save the file for your form." },
  ],
  engine: "file",
  privacyNote: "client",
  preset: { targetKb: 20, width: 140, height: 60 },
}
