import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "random-text-generator",
  name: "Random Text Generator",
  slug: "random-text-generator",
  category: "text",
  path: "text/random-text-generator",

  shortDescription:
    "Generate lorem ipsum placeholder text as words, sentences or paragraphs. Choose how many, regenerate, and copy. Free and works in your browser.",
  longDescription:
    "Make lorem ipsum style filler text for designs, mockups, templates and test data. Choose words, sentences or paragraphs, set how many you need, and press Regenerate for a new mix. The text is built in your browser and copied with one click.",
  schemaType: "Generator",

  sections: [
    {
      heading: "What the generator produces",
      body: "The text is made from a fixed list of 63 Latin-style words taken from the classic lorem ipsum passage, such as lorem, ipsum, dolor, amet and consectetur. Words are picked at random, so a word can repeat, sometimes twice in a row. The text has no meaning, which is the point: readers focus on the layout instead of the words. It is not English, and it is not suitable for passwords or anything that needs to be secret.",
    },
    {
      heading: "Words, sentences and paragraphs",
      body: "Words gives the number of lowercase words you ask for, separated by single spaces, with no capitals or punctuation. That is handy for tags, short labels or testing a word limit. Sentences gives full sentences of 6 to 12 words each, starting with a capital letter and ending with a full stop. Paragraphs gives blocks of 4 or 5 sentences each, with a blank line between paragraphs. Set the count from 1 to 100 with the number box.",
    },
    {
      heading: "Regenerate and repeatable results",
      body: "When the page opens, it shows the same starting text every time. Press Regenerate to get a new mix. Each press moves to the next variation in a fixed order, so the sequence of results is the same on every visit. That is useful when you want to recreate the same filler for a screenshot later. If you need something different, press Regenerate a few more times.",
    },
    {
      heading: "Where to use placeholder text",
      body: "Fill a website or app design before the real copy is ready, so you can judge spacing and font size. Check how a card, table cell or button handles long text. Mock up a brochure, invoice template or slide deck. Test a form field, database column or character limit with realistic-looking input. Need an exact length? Generate a few paragraphs, then trim them with the Word Counter or Character Counter open alongside.",
    },
    {
      heading: "Common mistakes to avoid",
      body: "Do not publish a page while placeholder text is still on it. Visitors read lorem ipsum as a sign of an unfinished page, so search your pages for \"lorem\" before going live. Do not rely on filler text to judge final layout in languages with longer words, such as German, or in Indian scripts, which can need more height per line. Test with real text in the target language once you have it.",
    },
  ],

  examples: [
    {
      title: "One sentence (first result on page)",
      input: "Sentences, count 1",
      output: "Lorem consequat est est magna reprehenderit nulla ullamco laborum nisi.",
    },
    {
      title: "Eight words (first result on page)",
      input: "Words, count 8",
      output: "voluptate lorem consequat est est magna reprehenderit nulla",
    },
    {
      title: "Three paragraphs",
      input: "Paragraphs, count 3",
      output: "Three blocks of 4 or 5 sentences each, separated by blank lines",
    },
  ],

  primaryKeyword: "random text generator",
  keywords: [
    "lorem ipsum generator",
    "lorem ipsum text",
    "dummy text generator",
    "placeholder text generator",
    "filler text generator",
    "random text online",
    "generate random words",
    "random paragraph generator",
    "random sentence generator",
    "dummy text for website",
    "sample text generator",
    "lorem ipsum copy paste",
  ],
  searchAliases: [
    "lorem ipsum",
    "random words",
    "filler text",
    "placeholder text",
    "dummy text",
    "fake text",
  ],
  searchWeight: 78,

  relatedTools: ["case-converter", "word-counter", "character-counter", "reverse-text"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-11-11",

  icon: "wand-2",
  faq: [
    {
      question: "What is lorem ipsum?",
      answer:
        "Lorem ipsum is placeholder text based on Latin words. Designers and developers use it to fill a layout before the real text is ready, so attention stays on the design.",
    },
    {
      question: "How do I generate dummy text?",
      answer:
        "Choose Words, Sentences or Paragraphs, enter how many you need, and copy the result. Press Regenerate if you want a different mix.",
    },
    {
      question: "Does it start with \"Lorem ipsum dolor sit amet\"?",
      answer:
        "No. Every word is picked at random from the lorem ipsum word list, so the text does not begin with the classic opening line.",
    },
    {
      question: "How many paragraphs can I generate?",
      answer:
        "Up to 100 at a time. Each paragraph has 4 or 5 sentences, and each sentence has 6 to 12 words.",
    },
    {
      question: "Is the text random every time?",
      answer:
        "The page always opens with the same text, and Regenerate steps through new variations in a fixed order. It is fine for filler text but should not be used for passwords or codes.",
    },
    {
      question: "Is anything sent to a server?",
      answer: "No. The text is generated in your browser.",
    },
  ],
  howTo: [
    {
      title: "Choose the unit",
      description: "Pick Words, Sentences or Paragraphs depending on how much text you need.",
    },
    {
      title: "Set the count",
      description: "Type a number from 1 to 100 in the Count box.",
    },
    {
      title: "Regenerate if needed",
      description: "Press Regenerate for a different mix of words until you like the result.",
    },
    {
      title: "Copy the text",
      description: "Press Copy and paste the placeholder text into your design, document or form.",
    },
  ],

  engine: "text",
  privacyNote: "none",
}
