import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "random-text-generator",
  name: "Random Text Generator",
  slug: "random-text-generator",
  category: "text",
  path: "text/random-text-generator",

  shortDescription:
    "Generate lorem-style random text — words, sentences or paragraphs — in one click. Free, instant and fully private in your browser.",
  longDescription:
    "Our free random text generator instantly produces filler text in Latin style. Choose word, sentence or paragraph units and pick how many to generate. Handy for web design mockups, document layouts, testing and proofing. Everything runs in your browser, so nothing is uploaded or stored.",
  schemaType: "Generator",

  sections: [
    {
      heading: "Why generate random text?",
      body: "Designers and developers use realistic filler to preview layouts, typography and spacing before real content is ready. A quick generator saves you from typing placeholder text manually.",
    },
    {
      heading: "What can it produce?",
      body: "Choose between individual words, full sentences (6–12 words each) and paragraphs (4–5 sentences each), then set how many units you need.",
    },
  ],

  examples: [
    {
      title: "Web design mockup",
      input: "3 paragraphs",
      output: "Lorem-style copy to fill a page",
    },
    {
      title: "Quick placeholder",
      input: "10 words",
      output: "A short Latin filler line",
    },
  ],

  primaryKeyword: "random text generator",
  keywords: [
    "lorem ipsum generator",
    "random text online",
    "filler text generator",
    "generate random words",
    "placeholder text generator",
    "lorem ipsum",
  ],
  searchAliases: ["lorem ipsum", "random words", "filler text", "placeholder text"],
  searchWeight: 78,

  relatedTools: ["case-converter", "word-counter", "reverse-text"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-08-07",

  icon: "wand-2",
  faq: [
    {
      question: "Is lorem text the only option?",
      answer:
        "This generator produces Latin (lorem ipsum) style filler. You can generate words, sentences or paragraphs and control how many.",
    },
    {
      question: "Can I reproduce the same text?",
      answer:
        "Yes. The generator uses a deterministic seed, and the app's regenerate button produces consistent, reproducible output.",
    },
    {
      question: "Is my input uploaded anywhere?",
      answer: "No. Everything runs in your browser and nothing leaves your device.",
    },
  ],
  howTo: [
    {
      title: "Pick a unit",
      description: "Choose words, sentences or paragraphs.",
    },
    {
      title: "Set the count",
      description: "Choose how many units to generate.",
    },
    {
      title: "Generate & copy",
      description: "Generate, regenerate and copy the result.",
    },
  ],

  engine: "text",
  privacyNote: "none",
}