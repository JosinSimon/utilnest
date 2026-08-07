import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "character-counter",
  name: "Character Counter",
  slug: "character-counter",
  category: "text",
  path: "text/character-counter",

  shortDescription:
    "Count characters, letters, digits, punctuation and words instantly. Includes a no-spaces count. Free, fast and 100% private in your browser.",
  longDescription:
    "Our free character counter instantly counts characters, characters without spaces, letters, digits, punctuation, words and lines as you type. It counts emoji and accented characters accurately as single characters. Perfect for Twitter/X posts, SMS, meta descriptions, essays and any text with a character limit. Everything runs in your browser, so your text never leaves your device.",

  sections: [
    {
      heading: "Why use a character counter?",
      body: "Whether you're fitting a post to a character limit, trimming a snippet for a search result, or auditing an essay, you need an exact character count that updates as you type. This tool gives you a full breakdown — not just a single number.",
    },
    {
      heading: "How are characters counted?",
      body: "Characters are counted as grapheme clusters, so an emoji or an accented letter made of two code points counts as a single character — the same way Word and Google Docs do.",
    },
  ],

  examples: [
    {
      title: "Twitter / X post",
      input: "A post capped at 280 characters",
      output: "Counted live as you type",
    },
    {
      title: "Meta description",
      input: "Max 160 characters for SEO snippets",
      output: "Counted including a no-space total",
    },
  ],

  primaryKeyword: "character counter",
  keywords: [
    "character count",
    "count characters online",
    "character counter with spaces",
    "character count without spaces",
    "char counter free",
    "length of text",
  ],
  searchAliases: ["char counter", "count characters", "text length", "characters counter"],
  searchWeight: 88,

  relatedTools: ["word-counter", "line-counter", "case-converter"],
  featured: true,
  trending: false,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-08-07",

  schemaType: "Utility",
  icon: "case-sensitive",
  faq: [
    {
      question: "Does the character counter count spaces?",
      answer:
        "Yes. You get a total count that includes spaces and a separate character count without spaces. Letters, digits and punctuation are also broken out individually.",
    },
    {
      question: "How does it handle emoji and accented characters?",
      answer:
        "Emoji and characters made of multiple code points (like an accented letter or a flag) are counted as a single character, matching how Word and Google Docs count them.",
    },
    {
      question: "Is my text uploaded anywhere?",
      answer:
        "No. Your text is processed entirely in your browser with JavaScript. It never leaves your device and nothing is stored.",
    },
  ],
  howTo: [
    {
      title: "Type or paste your text",
      description: "Write in the box or paste from anywhere.",
    },
    {
      title: "Watch the live count",
      description: "Character totals update instantly with every keystroke.",
    },
    {
      title: "Use the breakdown",
      description: "Check letters, digits, punctuation, no-space count and unique characters.",
    },
  ],

  engine: "text",
  privacyNote: "none",
}