import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "passport-photo-maker",
  name: "Passport Photo Maker",
  slug: "passport-photo-maker",
  category: "government",
  path: "government/passport-photo-maker",

  shortDescription:
    "Create a compliant Indian passport photograph from any upload — sized to the 3.5×4.5 cm requirement with a clean white background.",
  longDescription:
    "Upload a photo and this tool sizes it to the official Indian passport photograph dimensions (3.5 cm × 4.5 cm, white background). Physical dimensions are resolved to pixels at a selectable DPI, then the file is compressed to the required range. Validation is run in-browser and the result tells you honestly whether it meets the specification.",
  schemaType: "Utility",

  sections: [
    {
      heading: "Physical size done right",
      body: "Passport photos are specified in centimetres, not pixels. This tool converts 3.5×4.5 cm to pixels at your chosen DPI (300 by default), producing a physically correct print file.",
    },
    {
      heading: "Background guidance",
      body: "The sortation detects a dark (non-white) background and warns you — a white background is a hard requirement for passport photos — but never silently passes it.",
    },
  ],

  examples: [],

  primaryKeyword: "passport photo maker",
  keywords: [
    "passport photo 3.5x3.5 cm",
    "indian passport photo size",
    "passport photo resizer",
    "passport photo white background",
    "passport photo pixel size",
    "passport photo 300 dpi",
  ],
  searchAliases: ["passport photo", "passport size photo", "passport photo resize"],
  searchWeight: 85,

  relatedTools: ["government-exam-photo", "signature-resizer"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-08-07",

  icon: "book-user",
  faq: [
    {
      question: "What size is an Indian passport photo?",
      answer: "3.5 cm × 4.5 cm on a plain white background. The tool resolves this at the DPI you choose.",
    },
    {
      question: "Why can I adjust the DPI?",
      answer:
        "The same 3.5 cm size means different pixel counts at different DPI. 300 DPI is the standard for print; adjust only if the upload portal states a specific pixel size.",
    },
    {
      question: "Is the size verified?",
      answer:
        "3.5×4.5 cm is the commonly cited Passport Seva requirement. Pending confirmation against the official portal it is marked 'awaiting verification'.",
    },
  ],
  howTo: [
    { title: "Upload your photo", description: "Choose a front-facing photo on a light background." },
    { title: "Set DPI (optional)", description: "Defaults to 300 DPI for print clarity." },
    { title: "Download", description: "Save your passport-sized photo." },
  ],

  engine: "file",
  privacyNote: "client",
}