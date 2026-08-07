import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "image-watermark",
  name: "Image Watermark",
  slug: "image-watermark",
  category: "image",
  path: "image/image-watermark",

  shortDescription:
    "Add a text or logo watermark to an image in your browser. Control position, size and opacity, then download.",
  longDescription:
    "Protect or brand your photos by adding a text or logo watermark. Pick a corner or the centre, adjust the size and transparency, and save the result as JPEG or PNG. Everything runs locally — your image never leaves your device.",
  schemaType: "Utility",

  sections: [
    {
      heading: "Text and logo watermarks",
      body: "Add a line of text such as a name or copyright, or a transparent logo PNG. Use one or both together.",
    },
    {
      heading: "Full control",
      body: "Choose a position (corners or center), set the opacity for a subtle or bold mark, and scale it to the image.",
    },
    {
      heading: "Private by design",
      body: "Watermarking happens entirely in your browser. Your images are never uploaded.",
    },
  ],

  examples: [],

  primaryKeyword: "watermark image",
  keywords: [
    "add watermark to photo",
    "image watermark online",
    "text watermark tool",
    "logo watermark generator",
    "photo watermark png",
    "protect image with watermark",
  ],
  searchAliases: ["watermark my photos", "add copyright text to image", "image branding tool"],
  searchWeight: 74,

  relatedTools: ["image-converter", "image-resizer"],
  featured: false,
  trending: false,
  popular: false,
  addedAt: "2026-08-07",
  lastUpdated: "2026-08-07",

  icon: "droplets",
  faq: [
    {
      question: "Can I use both text and a logo?",
      answer: "Yes. Add text and a logo image to the same output if you like.",
    },
    {
      question: "Does it support transparency?",
      answer: "Yes. An opacity slider controls how bold the watermark appears. Use PNG output to keep transparency in the file.",
    },
    {
      question: "Is my image uploaded?",
      answer: "No. Watermarking runs entirely in your browser.",
    },
  ],
  howTo: [
    { title: "Upload an image", description: "Choose the photo you want to protect or brand." },
    { title: "Add a watermark", description: "Type text and/or upload a logo." },
    { title: "Style it", description: "Pick the position, opacity and size." },
    { title: "Download", description: "Save the watermarked image locally." },
  ],

  engine: "file",
  privacyNote: "client",
}