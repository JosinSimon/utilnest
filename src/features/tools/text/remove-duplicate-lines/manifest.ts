import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "remove-duplicate-lines",
  name: "Remove Duplicate Lines",
  slug: "remove-duplicate-lines",
  category: "text",
  path: "text/remove-duplicate-lines",

  shortDescription:
    "Remove duplicate lines from any text instantly. Keeps the first occurrence and reports how many lines were removed. Free and 100% private.",
  longDescription:
    "Our free duplicate line remover scans your text and keeps only the first occurrence of every repeated line, preserving the original order. Options let you ignore capitalization and trim whitespace when comparing lines. It also tells you exactly how many duplicate lines were removed. Perfect for lists, CSV data, email lists and logs. Everything runs in your browser, so your data never leaves your device.",

  sections: [
    {
      heading: "Why remove duplicate lines?",
      body: "Lists pasted from spreadsheets, emails and logs often repeat the same line many times. This tool cleans them up in one click while keeping the first appearance of each entry and its original order.",
    },
    {
      heading: "How does comparison work?",
      body: "By default identical lines are removed. You can enable case-insensitive matching so 'Apple' and 'apple' count as duplicates, and toggle whether leading/trailing spaces are trimmed when comparing.",
    },
  ],

  examples: [
    {
      title: "Cleaning an email list",
      input: "Pasted addresses with repeats",
      output: "Unique addresses, first occurrence kept",
    },
    {
      title: "CSV row cleanup",
      input: "Rows that appear more than once",
      output: "Only unique rows remain",
    },
  ],

  primaryKeyword: "remove duplicate lines",
  keywords: [
    "delete duplicate lines online",
    "remove repeated lines",
    "duplicate line remover",
    "deduplicate text lines",
    "remove duplicate lines csv",
  ],
  searchAliases: ["dedupe lines", "remove duplicates", "unique lines", "dedup text"],
  searchWeight: 80,

  relatedTools: ["remove-extra-spaces", "text-sorter", "case-converter"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-08-07",

  schemaType: "Utility",
  icon: "eraser",
  faq: [
    {
      question: "Which occurrence of a duplicate is kept?",
      answer:
        "The first occurrence is always kept, and the order of the remaining lines is preserved. Duplicates after it are removed.",
    },
    {
      question: "Is the comparison case-sensitive?",
      answer:
        "By default, yes. Turn on 'Ignore capitalization' to treat 'Apple' and 'apple' as the same line.",
    },
    {
      question: "Is my text uploaded anywhere?",
      answer:
        "No. Everything runs in your browser and your text never leaves your device.",
    },
  ],
  howTo: [
    {
      title: "Paste your lines",
      description: "Add the list or text with duplicate lines.",
    },
    {
      title: "Set comparing options",
      description: "Toggle ignoring capitalization or trimming whitespace as needed.",
    },
    {
      title: "Copy the cleaned list",
      description: "Use the copy button and see how many lines were removed.",
    },
  ],

  engine: "text",
  privacyNote: "none",
}