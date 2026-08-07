import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "word-counter",
  name: "Word Counter",
  slug: "word-counter",
  category: "text",
  path: "text/word-counter",

  shortDescription:
    "Count words, characters, sentences and paragraphs instantly. Includes reading time and top keywords. Free, fast and fully private.",
  longDescription:
    "Our free word counter instantly counts words, characters (with and without spaces), sentences and paragraphs as you type. It also estimates reading time and shows your most frequent keywords — perfect for essays, SEO content, resumes and social media posts. Everything runs in your browser, so your text never leaves your device.",

  sections: [
    {
      heading: "Why use a word counter?",
      body: "Whether you're meeting a college essay word limit, trimming a resume to one page, or writing SEO meta descriptions, knowing your exact word and character count matters. This tool updates live with every keystroke, so there's no copy-paste or wait time.",
    },
    {
      heading: "What metrics are included?",
      body: "Alongside words and characters, you get sentence and paragraph counts, estimated reading time, and a top keywords list showing your most used words — a quick way to check for overused terms in your writing.",
    },
  ],

  examples: [
    {
      title: "Reading time estimate",
      input: "A 500-word article",
      output: "About 2 minutes of reading time",
    },
    {
      title: "Character limit",
      input: "Meta description, max 160 characters",
      output: "Counted in real time as you type",
    },
  ],

  primaryKeyword: "word counter",
  keywords: [
    "word count",
    "character counter",
    "count words online",
    "word counter online free",
    "sentence counter",
    "paragraph counter",
  ],
  searchAliases: ["wc", "word count", "char counter", "count words"],
  searchWeight: 90,

  relatedTools: ["character-counter", "line-counter", "case-converter"],
  featured: true,
  trending: false,
  popular: true,
  addedAt: "2026-08-06",
  lastUpdated: "2026-08-06",

  schemaType: "Utility",
  icon: "type",
  faq: [
    {
      question: "Does this word counter count characters with spaces?",
      answer:
        "Yes. You get both: a total character count including spaces and a separate count excluding spaces. This is useful for Twitter/X posts, SMS and meta descriptions.",
    },
    {
      question: "Is my text uploaded to a server?",
      answer:
        "No. Your text is processed entirely in your browser with JavaScript. It never leaves your device, and nothing is stored.",
    },
  ],
  howTo: [
    {
      title: "Type or paste your text",
      description: "Write directly in the box or paste from anywhere.",
    },
    {
      title: "Watch the live counts",
      description: "Words, characters, sentences and paragraphs update instantly.",
    },
    {
      title: "Check reading time and keywords",
      description: "Use the reading time estimate and top keywords to refine your writing.",
    },
  ],

  engine: "text",
  privacyNote: "none",
}