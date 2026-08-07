import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "line-counter",
  name: "Line Counter",
  slug: "line-counter",
  category: "text",
  path: "text/line-counter",

  shortDescription:
    "Count lines, non-empty lines, blank lines and average line length instantly. Free, fast and 100% private in your browser.",
  longDescription:
    "Our free line counter instantly counts the number of lines in your text, along with non-empty lines, blank lines, total characters, longest line length and average line length. It handles Windows and Mac line endings automatically. Perfect for logs, code, CSV exports and any line-based text. Everything runs in your browser, so your text never leaves your device.",

  sections: [
    {
      heading: "Why use a line counter?",
      body: "When you need to know exactly how many lines are in a log file, a list or pasted source code, an instant count beats scanning by eye. This tool also separates blank lines from real content so you get a useful breakdown, not just one number.",
    },
    {
      heading: "How are lines counted?",
      body: "Lines are split on newline characters, handling both Windows (CRLF) and Unix (LF) endings. A single trailing newline is not counted as an extra empty line, matching how editors count the same text.",
    },
  ],

  examples: [
    {
      title: "Log file",
      input: "A pasted log with many entries",
      output: "Total lines, blank lines and longest line",
    },
    {
      title: "Reviewing code",
      input: "Count lines of pasted source",
      output: "Separates blank from non-empty lines",
    },
  ],

  primaryKeyword: "line counter",
  keywords: [
    "count lines online",
    "number of lines in text",
    "line counter free",
    "count non-empty lines",
    "count lines in text",
  ],
  searchAliases: ["count lines", "line count", "lines counter", "how many lines"],
  searchWeight: 80,

  relatedTools: ["character-counter", "word-counter", "case-converter"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-08-07",

  schemaType: "Utility",
  icon: "list-ordered",
  faq: [
    {
      question: "Are blank lines included in the count?",
      answer:
        "Total lines includes everything. We also show non-empty lines and blank lines separately, so you can quickly see how much is real content versus gaps.",
    },
    {
      question: "Does a trailing newline add a line?",
      answer:
        "No. A single newline at the very end of your text is not counted as a phantom empty line, matching how editors report line counts.",
    },
    {
      question: "Is my text uploaded anywhere?",
      answer:
        "No. Your text is processed entirely in your browser and never leaves your device.",
    },
  ],
  howTo: [
    {
      title: "Type or paste your text",
      description: "Paste a log, list or any text with line breaks.",
    },
    {
      title: "Watch the live count",
      description: "Line totals, blanks and lengths update instantly.",
    },
    {
      title: "Read the breakdown",
      description: "See total, non-empty, blank lines plus average and longest line length.",
    },
  ],

  engine: "text",
  privacyNote: "none",
}