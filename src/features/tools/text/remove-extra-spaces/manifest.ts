import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "remove-extra-spaces",
  name: "Remove Extra Spaces",
  slug: "remove-extra-spaces",
  category: "text",
  path: "text/remove-extra-spaces",

  shortDescription:
    "Clean up messy text: collapse multiple spaces, trim every line and remove blank lines. Free, instant and 100% private in your browser.",
  longDescription:
    "Our free text cleaner removes extra spaces from your text in one click. It collapses runs of spaces and tabs into a single space, trims the start and end of every line, and drops blank lines. Each option can be toggled off. Perfect for pasted email, formatted documents, CSV data and code. Everything runs in your browser, so your text never leaves your device.",

  sections: [
    {
      heading: "Why clean up extra spaces?",
      body: "Text pasted from emails, PDFs or word processors often carries double spaces, misaligned indentation and stray blank lines. This tool normalizes it in one click so you can reuse it anywhere without cleanup.",
    },
    {
      heading: "What does it do?",
      body: "Three independent steps: collapse multiple spaces/tabs to one, trim each line's edges, and remove empty lines. Enable or disable each option to fit your need.",
    },
  ],

  examples: [
    {
      title: "Pasted email text",
      input: "Text with  double  spaces and blank gaps",
      output: "Single-spaced, trimmed lines",
    },
    {
      title: "Cleaning a list",
      input: "Items with uneven indentation",
      output: "Aligned list without stray blanks",
    },
  ],

  primaryKeyword: "remove extra spaces",
  keywords: [
    "remove extra spaces online",
    "delete extra spaces from text",
    "remove double spaces",
    "clean text spacing",
    "remove blank lines",
    "trim text online",
  ],
  searchAliases: ["extra spaces remover", "clean spaces", "trim text", "collapse spaces"],
  searchWeight: 78,

  relatedTools: ["remove-duplicate-lines", "text-sorter", "case-converter"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-08-07",

  schemaType: "Utility",
  icon: "move-up",
  faq: [
    {
      question: "Will this remove all spaces from my text?",
      answer:
        "No. It collapses multiple spaces into a single space — it does not delete every space. Enable or disable the trim and blank-line options individually to control the result.",
    },
    {
      question: "Does it preserve line breaks?",
      answer:
        "Yes. Newlines are kept; only spaces and tabs between words are collapsed, and each line's edges are trimmed.",
    },
    {
      question: "Is my text uploaded anywhere?",
      answer:
        "No. Everything runs in your browser and your text never leaves your device.",
    },
  ],
  howTo: [
    {
      title: "Paste your text",
      description: "Add the messy text you want to clean.",
    },
    {
      title: "Adjust the options",
      description: "Toggle collapse, trim and blank-line removal as needed.",
    },
    {
      title: "Copy the result",
      description: "Grab the cleaned text and reuse it anywhere.",
    },
  ],

  engine: "text",
  privacyNote: "none",
}