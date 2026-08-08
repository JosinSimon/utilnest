import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "background-remover",
  name: "Background Remover",
  slug: "background-remover",
  category: "image",
  path: "image/background-remover",

  shortDescription:
    "Remove, replace or blur the background of any image in seconds. Instant solid-background mode plus on-device AI for complex shots — nothing is ever uploaded.",
  longDescription:
    "Cut out the subject of a photo with a clean, hair-friendly edge. If the background is a solid colour (white, a studio backdrop), the lightning-fast Solid mode removes it instantly, fully offline. For complex photos, the AI mode downloads a segmentation model once, then runs locally in your browser. Choose transparent cutout, a solid replacement colour, or a portrait-style background blur. Returned engine output supports transparent PNG and high-quality JPEG.",
  schemaType: "Generator",

  sections: [
    {
      heading: "Two modes, one result",
      body: "Solid mode removes a uniform background in milliseconds with zero downloads. AI mode handles complex scenes with soft edges, using a local model.",
    },
    {
      heading: "Anything you need the cutout for",
      body: "Remove (transparent PNG), replace with a colour, or blur the background for a portrait effect. The cutout is yours to download and reuse anywhere.",
    },
    {
      heading: "Private by design",
      body: "Your images never leave your device. In AI mode the model is fetched once and cached; after that everything runs offline.",
    },
  ],

  examples: [],

  primaryKeyword: "remove background from image",
  keywords: [
    "remove image background",
    "background remover online",
    "transparent background photo",
    "remove background from picture",
    "cutout image background",
    "ai background remover",
    "blur background of photo",
    "replace image background",
  ],
  searchAliases: ["transparent png background remover", "make image background transparent", "photo cutout tool"],
  searchWeight: 90,

  relatedTools: ["image-watermark", "image-resizer", "image-cropper", "image-converter"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-08",
  lastUpdated: "2026-08-08",

  icon: "scan",
  faq: [
    {
      question: "Is my image uploaded to a server?",
      answer:
        "No. Everything runs locally in your browser. In AI mode, a segmentation model is downloaded once from a CDN and cached; your photo never leaves your device.",
    },
    {
      question: "Solid or AI — which should I use?",
      answer:
        "Solid is instant and works perfectly when the background is one clean colour (white, studio backdrops). AI handles complex photos with soft edges. The tool recommends a mode automatically based on the photo.",
    },
    {
      question: "What output formats are supported?",
      answer: "Transparent cutouts export as PNG. Colour-replaced and blurred exports default to high-quality JPEG.",
    },
    {
      question: "Is the AI model free and offline?",
      answer:
        "The model is a permissively-licensed open model. It is downloaded once, cached in the browser, and then runs fully offline — there is no per-use cost and no API key.",
    },
  ],
  howTo: [
    { title: "Upload an image", description: "Choose a JPG or PNG from your device." },
    { title: "Pick a mode", description: "Solid for clean backgrounds, AI for complex ones — or follow the recommendation." },
    { title: "Tune and output", description: "Adjust tolerance / smoothing and choose transparent, colour or blur." },
    { title: "Remove & download", description: "Watch the preview appear instantly and download your cutout." },
  ],

  engine: "file",
  privacyNote: "client",
}