import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "compress-image",
  name: "Compress Image to Target KB",
  slug: "compress-image",
  category: "government",
  path: "government/compress-image",

  shortDescription:
    "Resize and compress a photo to any exact target file size (e.g. under 50 KB) in your browser. Files never leave your device.",
  longDescription:
    "Set a minimum, maximum or exact file size and this tool resizes + compresses your photo to fit it. It reads the real encoded file size after each quality step (no guesswork) using pure browser JPEG/PNG encoding. When a target is genuinely impossible — like the photo is too big to ever fit within the limit, or too small to reach a required minimum — the tool says so clearly instead of silently outputting a non-compliant file.",
  schemaType: "Utility",

  sections: [
    {
      heading: "How the compression works",
      body: "Your photo is resized once to the target dimensions, then JPEG quality is binary-searched so the actual encoded byte count lands in your requested range. The tool only reports success when the real file size satisfies the spec.",
    },
    {
      heading: "What happens when the target is impossible",
      body: "If even the lowest JPEG quality is still above your maximum, the tool reports it cannot hit the target (never a silent non-compliant file). If the image is too small ever to reach a required minimum, it reports that too.",
    },
    {
      heading: "Private by design",
      body: "Decoding, resizing and encoding all happen in your browser with no canvas pixels ever uploaded to a server.",
    },
  ],

  examples: [],

  primaryKeyword: "compress image to 50kb",
  keywords: [
    "photo under 50kb",
    "compress image to 50 kb",
    "jpg under 100 kb",
    "resize and compress photo",
    "image file size reducer",
    "compress jpeg online free",
  ],
  searchAliases: ["compress photo to size", "reduce image file size", "jpg size reducer"],
  searchWeight: 78,

  relatedTools: ["resize-image"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-08-07",

  icon: "compress",
  faq: [
    {
      question: "Does it work entirely offline?",
      answer:
        "Yes. The image is decoded, resized and compressed fully in your browser; nothing is uploaded.",
    },
    {
      question: "What if my image can't hit the target size?",
      answer:
        "The tool reports honestly that the file cannot satisfy the requested size rather than producing a non-compliant file, so you never submit a photo that is outside the official limit.",
    },
    {
      question: "Which formats are supported?",
      answer: "JPEG and PNG. JPEG lets you hit exact pixel + byte targets; PNG is used where JPEG is not accepted.",
    },
  ],
  howTo: [
    { title: "Upload a photo", description: "Choose a JPEG or PNG image from your device." },
    { title: "Set the target size", description: "Enter the required KB range or exact size." },
    { title: "Set dimensions (optional)", description: "Provide the required pixel width and height, if any." },
    { title: "Download", description: "Save the resized, compressed image locally." },
  ],

  engine: "file",
  privacyNote: "client",
}