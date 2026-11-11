import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "case-converter",
  name: "Case Converter",
  slug: "case-converter",
  category: "text",
  path: "text/case-converter",

  shortDescription:
    "Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, kebab-case or snake_case. Free, instant and private.",
  longDescription:
    "Paste any text and switch it between nine case styles with one click: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, kebab-case, snake_case and SCREAMING_CASE. It is useful for fixing text typed with Caps Lock on, tidying headings, and naming variables, files or URLs. The result updates as you type and stays in your browser.",

  sections: [
    {
      heading: "The nine case styles",
      body: "UPPERCASE turns every letter into a capital, and lowercase does the opposite. Both keep your punctuation, spaces and line breaks exactly as they are. Title Case starts every word with a capital letter. Sentence case gives a capital to the first letter of the text and makes the rest lowercase. The other five are naming styles used in code and file names: camelCase, PascalCase, kebab-case, snake_case, and SCREAMING_CASE (also called CONSTANT_CASE), which joins upper-case words with underscores.",
    },
    {
      heading: "Fixing text typed with Caps Lock on",
      body: "If a paragraph came out as \"MONTHLY SALES REPORT. PLEASE CHECK.\", lowercase gives \"monthly sales report. please check.\" with the full stops still in place. Sentence case gives \"Monthly sales report. please check.\" Note that Sentence case only capitalises the very first letter of the whole text, not the start of each later sentence, and it lowercases names and acronyms such as \"India\" or \"PAN\". For a long paragraph, convert it, then fix those few capitals by hand.",
    },
    {
      heading: "What Title Case and the code styles do to punctuation",
      body: "Title Case, camelCase, PascalCase, kebab-case, snake_case and SCREAMING_CASE treat spaces, hyphens, underscores and punctuation as word breaks. They keep only letters and numbers, so \"hello-world foo_bar\" becomes \"Hello World Foo Bar\" in Title Case. Commas, full stops and line breaks are removed, and all words end up on one line. That is what you want for a heading or a variable name, but for a full paragraph use UPPERCASE, lowercase or Sentence case instead. Title Case also capitalises short words like \"to\" and \"of\" and lowercases the rest of each word, so \"ITR\" becomes \"Itr\".",
    },
    {
      heading: "Which naming style to use in code",
      body: "camelCase (firstName) is common for variables and functions in JavaScript and Java. PascalCase (FirstName) is used for class and component names. snake_case (first_name) is the usual choice in Python and for database columns. kebab-case (first-name) suits URLs, CSS class names and file names. SCREAMING_CASE (FIRST_NAME) is used for constants and environment variables. Numbers are kept, so \"annual report 2026\" becomes annualReport2026 in camelCase. Accented letters such as é are kept too.",
    },
    {
      heading: "Private and instant",
      body: "The conversion runs in your browser as you type. Your text is not sent to a server, so you can safely paste emails, contracts or code. Press Copy to put the result on your clipboard, then paste it wherever you need it.",
    },
  ],

  examples: [
    {
      title: "Heading in Title Case",
      input: "the quick brown fox",
      output: "The Quick Brown Fox",
    },
    {
      title: "Variable name in camelCase",
      input: "user login count",
      output: "userLoginCount",
    },
    {
      title: "Caps Lock text in Sentence case",
      input: "MONTHLY SALES REPORT. PLEASE CHECK.",
      output: "Monthly sales report. please check.",
    },
  ],

  primaryKeyword: "case converter",
  keywords: [
    "case converter online",
    "uppercase converter",
    "lowercase converter",
    "convert uppercase to lowercase",
    "title case converter",
    "sentence case converter",
    "capitalize first letter of each word",
    "camelcase converter",
    "snake case converter",
    "kebab case converter",
    "pascal case converter",
    "text case converter online",
  ],
  searchAliases: [
    "change case",
    "uppercase",
    "lowercase",
    "title case",
    "capitalize text",
    "caps lock fix",
    "small letters to capital letters",
  ],
  searchWeight: 85,

  relatedTools: ["text-sorter", "reverse-text", "character-counter", "remove-extra-spaces"],
  featured: true,
  trending: false,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-11-11",

  schemaType: "Utility",
  icon: "case-sensitive",
  faq: [
    {
      question: "How do I convert capital letters to small letters?",
      answer:
        "Paste your text and press lowercase. Every capital letter becomes a small letter, and your punctuation and line breaks stay the same.",
    },
    {
      question: "What is the difference between Title Case and Sentence case?",
      answer:
        "Title Case capitalises the first letter of every word, for example \"The Quick Brown Fox\". Sentence case capitalises only the first letter of the text, for example \"The quick brown fox\".",
    },
    {
      question: "Why did my punctuation disappear?",
      answer:
        "Title Case and the code styles (camelCase, PascalCase, kebab-case, snake_case, SCREAMING_CASE) keep only letters and numbers. Use UPPERCASE, lowercase or Sentence case to keep punctuation and line breaks.",
    },
    {
      question: "What case formats can I convert to?",
      answer:
        "UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, kebab-case, snake_case and SCREAMING_CASE (CONSTANT_CASE).",
    },
    {
      question: "Does it keep numbers?",
      answer:
        "Yes. Numbers stay in every style. In the code styles they join the word next to them, so \"game 2 is here\" becomes game2IsHere in camelCase.",
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
      description: "Add a word, a heading or a whole paragraph in the text box.",
    },
    {
      title: "Choose a case style",
      description: "Press a button such as Title Case, lowercase or camelCase. The default is Title Case.",
    },
    {
      title: "Check the result",
      description: "The converted text appears below and updates as you type or switch styles.",
    },
    {
      title: "Copy the result",
      description: "Press Copy and paste the text into your document, code or form.",
    },
  ],

  engine: "text",
  privacyNote: "none",
}
