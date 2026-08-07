import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "reverse-text",
  name: "Reverse Text",
  slug: "reverse-text",
  category: "text",
  path: "text/reverse-text",

  shortDescription:
    "Reverse text by characters, words or lines instantly. Emoji and accented letters stay intact. Free and 100% private in your browser.",
  longDescription:
    "Our free reverse text tool reverses your text three ways — character by character, word order, or line order. Character reversal is grapheme-aware, so emoji and combined characters stay intact. Perfect for puzzles, learning reading in reverse, or just playing with text. Everything runs in your browser, so your text never leaves your device.",

  sections: [
    {
      heading: "Why reverse text?",
      body: "Reversing text is useful for word games, checking palindromes, and a fun way to review letters. Word reversal can help you check a sentence from the end, and line reversal is handy for re-ordering lists.",
    },
    {
      heading: "Which reversal modes are available?",
      body: "Reverse characters (the whole string), reverse the order of words within each line (keeping your spacing), or reverse the order of lines in a multi-line body.",
    },
  ],

  examples: [
    {
      title: "Character reversal",
      input: "hello",
      output: "olleh",
    },
    {
      title: "Reverse word order",
      input: "one two three",
      output: "three two one",
    },
  ],

  primaryKeyword: "reverse text",
  keywords: [
    "reverse text online",
    "flip text",
    "reverse letters",
    "backwards text",
    "reverse words",
    "reverse lines",
  ],
  searchAliases: ["flip text", "reverse", "backwards words", "mirror text"],
  searchWeight: 76,

  relatedTools: ["text-sorter", "case-converter", "remove-extra-spaces"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-08-07",

  schemaType: "Utility",
  icon: "refresh-cw",
  faq: [
    {
      question: "Does reversing break emoji or accented characters?",
      answer:
        "No. Characters are reversed as whole graphemes, so emoji, accents and combined characters stay intact rather than splitting into broken pieces.",
    },
    {
      question: "Is my text uploaded anywhere?",
      answer: "No. Everything runs in your browser and your text never leaves your device.",
    },
  ],
  howTo: [
    {
      title: "Paste your text",
      description: "Add the text you want to reverse.",
    },
    {
      title: "Choose a mode",
      description: "Pick characters, words or lines.",
    },
    {
      title: "Copy the result",
      description: "Grab your reversed text.",
    },
  ],

  engine: "text",
  privacyNote: "none",
}