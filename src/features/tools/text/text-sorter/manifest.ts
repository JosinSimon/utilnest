import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "text-sorter",
  name: "Text Sorter",
  slug: "text-sorter",
  category: "text",
  path: "text/text-sorter",

  shortDescription:
    "Sort lines alphabetically, numerically or by length — ascending or descending. Free, instant and 100% private in your browser.",
  longDescription:
    "Our free text sorter rearranges the lines of your text in one click. Sort alphabetically (A to Z or Z to A), numerically, or by line length, in either direction. Perfect for lists, glossaries, CSV rows and any ordered data. Everything runs in your browser, so your text never leaves your device.",

  sections: [
    {
      heading: "Why sort your text?",
      body: "Ordered data is easier to scan and compare. Whether you're alphabetizing a list, sorting grades numerically or re-ordering names by length, a sort tool saves you from doing it by hand.",
    },
    {
      heading: "What sorting modes are available?",
      body: "Alphabetical (case-insensitive), numeric, and by line length — each ascending or descending. Numeric mode handles mixed text gracefully by leaving non-numeric lines last.",
    },
  ],

  examples: [
    {
      title: "Alphabetize a list",
      input: "Names in any order",
      output: "Sorted A to Z",
    },
    {
      title: "Sort numbers",
      input: "Scores 10, 2, 20, 1",
      output: "Sorted 1, 2, 10, 20",
    },
  ],

  primaryKeyword: "text sorter",
  keywords: [
    "sort text online",
    "alphabetical order tool",
    "sort lines alphabetically",
    "sort numbers online",
    "sort lines by length",
    "text sorting tool",
  ],
  searchAliases: ["sort text", "alphabetize", "sort lines", "arrange text"],
  searchWeight: 82,

  relatedTools: ["case-converter", "remove-duplicate-lines", "reverse-text"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-08-07",

  schemaType: "Utility",
  icon: "arrow-up-down",
  faq: [
    {
      question: "Does the alphabetical sort ignore capitalization?",
      answer:
        "Yes. 'Apple' and 'apple' compare as equal, so their relative order is preserved rather than pushing lowercase words first.",
    },
    {
      question: "How does numeric sorting work?",
      answer:
        "Each line that is a number is sorted numerically, so 10 comes after 2 (not after 1). Lines that aren't numbers are grouped at the end in alphabetical order.",
    },
    {
      question: "Is my text uploaded anywhere?",
      answer: "No. Everything runs in your browser and your text never leaves your device.",
    },
  ],
  howTo: [
    {
      title: "Paste your lines",
      description: "Add the data you want to sort.",
    },
    {
      title: "Pick a sort mode",
      description: "Choose alphabetical, numeric or by length, and direction.",
    },
    {
      title: "Copy the result",
      description: "Grab your sorted text for reuse.",
    },
  ],

  engine: "text",
  privacyNote: "none",
}