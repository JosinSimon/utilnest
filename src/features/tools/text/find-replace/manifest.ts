import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "find-replace",
  name: "Find & Replace",
  slug: "find-replace",
  category: "text",
  path: "text/find-replace",

  shortDescription:
    "Find and replace text instantly with optional case-sensitivity and whole-word matching. Free, offline tool that never uploads your text.",
  longDescription:
    "Replace words or phrases across any body of text in one click. Supports whole-word-only matches, case-sensitive search, literal text and optional regex mode. Perfect for cleaning up lists, renaming terms, reformatting copy and editing drafts. All processing happens in your browser — your content never leaves your device.",
  schemaType: "Utility",

  sections: [
    {
      heading: "When is find & replace useful?",
      body: "Rename a repeated term across a document, fix a recurring typo, standardise formatting or clean up copied content — without manually scanning every line.",
    },
    {
      heading: "Literal or regex search",
      body: "By default the search term is treated as plain text, so special characters match literally. Turn on regex mode when you intentionally want regular-expression matching.",
    },
    {
      heading: "Whole word option",
      body: "Use whole-word matching to avoid replacing partially inside longer words — e.g. 'cat' won't replace the 'cat' inside 'catalogue'.",
    },
  ],

  examples: [
    {
      title: "Fix a typo",
      input: "teh ... teh ...",
      output: "the ... the ...",
    },
    {
      title: "Rename a term",
      input: "search 'foo' replace 'bar'",
      output: "All 'foo' become 'bar'",
    },
  ],

  primaryKeyword: "find and replace",
  keywords: [
    "find and replace text",
    "find replace online",
    "replace word in text",
    "text replace tool",
    "case sensitive search and replace",
    "whole word replace",
  ],
  searchAliases: ["find replace", "replace text", "find and replace words", "text replace"],
  searchWeight: 76,

  relatedTools: ["case-converter", "text-sorter", "word-counter"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-08-07",

  icon: "search",
  faq: [
    {
      question: "Does it work with special characters?",
      answer:
        "Yes. The search term is treated as literal text, so characters like *, . and [ are matched exactly and do not need escaping.",
    },
    {
      question: "Can I replace only whole words?",
      answer:
        "Yes. Enable Whole Word to only replace complete words and leave partial matches inside longer words untouched.",
    },
    {
      question: "Is my text uploaded anywhere?",
      answer: "No. Processing happens entirely in your browser and your text is never sent to a server.",
    },
  ],
  howTo: [
    {
      title: "Paste your text",
      description: "Add the text you want to edit.",
    },
    {
      title: "Set find & replace",
      description: "Enter what to search for and its replacement.",
    },
    {
      title: "Tune options",
      description: "Toggle case-sensitive and whole-word matching.",
    },
    {
      title: "Get the result",
      description: "Review the replacement count and copy the output.",
    },
  ],

  engine: "text",
  privacyNote: "none",
}