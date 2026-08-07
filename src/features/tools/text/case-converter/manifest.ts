import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "case-converter",
  name: "Case Converter",
  slug: "case-converter",
  category: "text",
  path: "text/case-converter",

  shortDescription:
    "Convert text to uppercase, lowercase, Title Case, Sentence case, camelCase, PascalCase, kebab-case and snake_case instantly. Free and 100% private.",
  longDescription:
    "Our free case converter instantly switches your text between uppercase, lowercase, Title Case, Sentence case, camelCase, PascalCase, kebab-case, snake_case and SCREAMING_SNAKE_CASE. Perfect for writers, developers and anyone fixing inconsistent capitalization. Everything runs in your browser, so your text never leaves your device.",

  sections: [
    {
      heading: "Why use a case converter?",
      body: "Fixing inconsistent capitalization by hand is tedious. This tool converts entire blocks of text in one click — ideal for headings, database IDs, file names and code identifiers that follow different naming conventions.",
    },
    {
      heading: "Which formats are supported?",
      body: "Uppercase, lowercase, Title Case (every word), Sentence case (only the first letter), plus developer naming styles: camelCase, PascalCase, kebab-case, snake_case and constant case.",
    },
  ],

  examples: [
    {
      title: "Fixing a heading",
      input: "the quick brown fox",
      output: "The Quick Brown Fox (Title Case)",
    },
    {
      title: "Creating a variable",
      input: "user login count",
      output: "userLoginCount (camelCase)",
    },
  ],

  primaryKeyword: "case converter",
  keywords: [
    "uppercase converter",
    "lowercase converter",
    "title case converter",
    "camelcase converter",
    "snake case converter",
    "text case converter online",
  ],
  searchAliases: ["change case", "uppercase", "lowercase", "title case", "capitalize text"],
  searchWeight: 85,

  relatedTools: ["text-sorter", "reverse-text", "character-counter"],
  featured: true,
  trending: false,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-08-07",

  schemaType: "Utility",
  icon: "case-sensitive",
  faq: [
    {
      question: "What case formats can I convert to?",
      answer:
        "Uppercase, lowercase, Title Case, Sentence case, camelCase, PascalCase, kebab-case, snake_case and SCREAMING_SNAKE_CASE (CONSTANT_CASE).",
    },
    {
      question: "Is my text uploaded anywhere?",
      answer:
        "No. Conversion happens entirely in your browser and your text never leaves your device.",
    },
  ],
  howTo: [
    {
      title: "Type or paste your text",
      description: "Add the text you want to reformat.",
    },
    {
      title: "Choose a format",
      description: "Pick the target case from the buttons.",
    },
    {
      title: "Copy the result",
      description: "Use the copy button to grab the converted text.",
    },
  ],

  engine: "text",
  privacyNote: "none",
}