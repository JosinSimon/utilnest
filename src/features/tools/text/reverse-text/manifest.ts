import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "reverse-text",
  name: "Reverse Text",
  slug: "reverse-text",
  category: "text",
  path: "text/reverse-text",

  shortDescription:
    "Reverse text by letters, words or lines. Write text backwards, flip word order or turn a list upside down. Free, instant and private.",
  longDescription:
    "Type or paste text and reverse it in one of three ways: letter by letter, by word order, or by line order. Use it to write text backwards for a puzzle or social post, check palindromes, or flip a list so the last item comes first. The result updates as you type and your text stays in your browser.",

  sections: [
    {
      heading: "Three ways to reverse",
      body: "Characters writes the whole text backwards, so \"Hello, world!\" becomes \"!dlrow ,olleH\". Words keeps each word spelled normally but reverses their order, so \"UtilNest is free\" becomes \"free is UtilNest\". Lines keeps every line as it is but reverses the order of the lines, so the last line comes first. Pick the mode with the buttons above the result. Characters is selected when the page opens.",
    },
    {
      heading: "How punctuation, spaces and lines are handled",
      body: "In Characters mode, punctuation is treated like any other character and moves with the text. In Words mode, punctuation stays attached to its word, so \"Hello, world!\" becomes \"world! Hello,\". The spaces between words are kept, including double spaces. Words mode reverses all the words in the text as one sequence, so in a text with several lines the line breaks move too. If you want each line to stay in place, use Lines mode. Lines mode drops a single trailing line break and returns standard line endings.",
    },
    {
      heading: "Emoji and Indian scripts stay intact",
      body: "One visible character can be made of several hidden code points, and reversing those code points one by one can break emoji and accented letters into stray symbols. This tool reverses by visible characters, so an emoji such as a thumbs-up stays whole and accented letters keep their marks. In Hindi and other Indian scripts, vowel signs stay joined to their letter. The reversed text will not read as real words, but you will not get stray marks or empty boxes.",
    },
    {
      heading: "Practical uses",
      body: "Reverse a numbered list or a log file so the newest entry is on top. Flip the order of names or steps without retyping them. Check whether a word or phrase is a palindrome: \"racecar\" reads the same in Characters mode. Create backwards text for a word game, quiz or riddle. Test how an app or form handles reversed or unusual input. For sorting a list alphabetically rather than flipping it, use the Text Sorter instead.",
    },
    {
      heading: "Private and instant",
      body: "Reversing happens in your browser as you type. Your text is not sent to a server, so it is safe to paste notes, lists or code. Press Copy to put the reversed text on your clipboard.",
    },
  ],

  examples: [
    {
      title: "Backwards text (Characters)",
      input: "Hello, world!",
      output: "!dlrow ,olleH",
    },
    {
      title: "Reverse word order (Words)",
      input: "UtilNest is free",
      output: "free is UtilNest",
    },
    {
      title: "Flip a list (Lines)",
      input: "first line / second line / third line (one per line)",
      output: "third line / second line / first line",
    },
  ],

  primaryKeyword: "reverse text",
  keywords: [
    "reverse text online",
    "reverse text generator",
    "write text backwards",
    "backwards text generator",
    "reverse letters",
    "reverse a string online",
    "reverse words in a sentence",
    "reverse word order",
    "reverse lines",
    "reverse list order",
    "palindrome checker text",
    "backwards text",
  ],
  searchAliases: [
    "flip text",
    "reverse",
    "backwards words",
    "mirror text",
    "text backwards",
    "reverse string",
  ],
  searchWeight: 76,

  relatedTools: ["text-sorter", "case-converter", "remove-extra-spaces", "remove-duplicate-lines"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-11-11",

  schemaType: "Utility",
  icon: "refresh-cw",
  faq: [
    {
      question: "How do I write text backwards?",
      answer:
        "Paste your text and keep the Characters mode selected. The whole text is reversed letter by letter, and you can copy it with one tap.",
    },
    {
      question: "How do I reverse the order of words in a sentence?",
      answer:
        "Choose Words. Each word stays spelled the same, but the order is reversed, so \"one two three\" becomes \"three two one\".",
    },
    {
      question: "How do I reverse a list so the last item is first?",
      answer:
        "Put one item on each line and choose Lines. The lines are returned in reverse order and each line stays unchanged.",
    },
    {
      question: "Does it flip letters upside down or mirror them?",
      answer:
        "No. It changes the order of characters, words or lines. It does not turn letters upside down or create mirror-image letters.",
    },
    {
      question: "Will emoji break when I reverse text?",
      answer:
        "No. Text is reversed by visible characters, so emoji and accented letters stay whole.",
    },
    {
      question: "Is my text uploaded anywhere?",
      answer: "No. Reversing happens in your browser and your text never leaves your device.",
    },
  ],
  howTo: [
    {
      title: "Paste your text",
      description: "Type or paste a word, a sentence or a list with one item per line.",
    },
    {
      title: "Choose a mode",
      description: "Pick Characters to write it backwards, Words to flip word order, or Lines to flip a list.",
    },
    {
      title: "Check the result",
      description: "The reversed text appears below and updates as you type or change mode.",
    },
    {
      title: "Copy it",
      description: "Press Copy and paste the reversed text wherever you need it.",
    },
  ],

  engine: "text",
  privacyNote: "none",
}
