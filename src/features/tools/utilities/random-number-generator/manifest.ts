import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "random-number-generator",
  name: "Random Number Generator",
  slug: "random-number-generator",
  category: "utilities",
  path: "utilities/random-number-generator",

  shortDescription:
    "Pick random numbers between any min and max. Whole numbers or 2-decimal values, up to 1,000 at once, with a no-duplicates option for draws.",
  longDescription:
    "Generate random numbers in any range for lucky draws, games, classroom picks, sampling and test data. Choose whole numbers or decimals, set how many you need (1 to 1,000), and turn on Unique to avoid repeats. Numbers are drawn with your browser's cryptographic random source and are never sent anywhere.",

  sections: [
    {
      heading: "How to use the range",
      body: "Enter a Minimum and a Maximum. In Integers mode, both ends are included, so 1 to 100 can return 1, 100 or anything between. Negative numbers work too, for example -10 to 10. In Decimals mode, the tool returns values with 2 decimal places between the two whole numbers you enter, such as 0 to 1 giving results like 0.37 or 0.82. If Minimum is larger than Maximum, the tool shows an error instead of guessing what you meant.",
    },
    {
      heading: "Unique numbers for draws and selections",
      body: "Tick Unique numbers only when no number should appear twice, such as picking prize winners, assigning seats or choosing questions. The tool keeps drawing until it has the count you asked for with no repeats. A unique draw cannot ask for more numbers than the range holds: 1 to 10 has only 10 whole numbers, so asking for 11 unique ones shows an error. Untick Unique when repeats are fine, for example when simulating 20 dice rolls with 1 to 6.",
    },
    {
      heading: "How fair is it?",
      body: "Each number comes from crypto.getRandomValues, the secure random source built into your browser, rather than the simpler Math.random. For whole numbers, the tool discards any random value that would make some results slightly more likely than others, a problem called modulo bias. So in a 1 to 100 range, each number has the same 1% chance on every draw. Previous results do not affect the next one, so a number that just came up is as likely as any other next time.",
    },
    {
      heading: "Running a lucky draw or giveaway",
      body: "Number your entries first, for example in a spreadsheet, from 1 to the total. Then set Minimum to 1, Maximum to the number of entries, Quantity to the number of winners and tick Unique. With 250 entries and 3 prizes, enter 1, 250 and 3. Note the winning numbers, match them to your list and share a screenshot of the result for transparency. Click Generate New Random Numbers only if you need a fresh draw.",
    },
    {
      heading: "Other practical uses",
      body: "Teachers pick roll numbers to answer a question or to form groups. Auditors and quality checkers pick a random sample, such as 10 invoices out of 500, so the sample is not chosen by habit. Game hosts roll dice (1 to 6) or toss a coin (1 to 2). Developers fill test data with random values. For random IDs that must never clash, use the UUID Generator, and for passwords use the Password Generator.",
    },
  ],

  examples: [
    {
      title: "Lucky draw winners",
      input: "Min 1 · Max 250 · Quantity 3 · Unique on",
      output: "3 different entry numbers between 1 and 250",
    },
    {
      title: "Dice rolls",
      input: "Min 1 · Max 6 · Quantity 10 · Unique off",
      output: "10 rolls, repeats allowed, each face has a 1 in 6 chance",
    },
    {
      title: "Random decimals",
      input: "Decimals mode · Min 0 · Max 1 · Quantity 5",
      output: "5 values with 2 decimal places, such as 0.37",
    },
  ],

  primaryKeyword: "random number generator",
  keywords: [
    "random number generator 1 to 100",
    "random number picker",
    "random number generator without repeats",
    "lucky draw number generator",
    "random number between two numbers",
    "random decimal generator",
    "pick a random number",
    "dice roller online",
    "random winner picker",
    "unique random numbers",
  ],
  searchAliases: ["rng", "number picker", "lucky draw", "random picker", "dice roll", "number generator"],
  searchWeight: 90,

  relatedTools: ["uuid-generator", "password-generator", "unit-converter"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-11-11",

  schemaType: "Generator",
  icon: "hash",
  faq: [
    {
      question: "Are the minimum and maximum included?",
      answer:
        "Yes. In Integers mode both ends are possible results, so 1 to 6 can return 1 or 6, just like a die.",
    },
    {
      question: "How do I get random numbers without repeats?",
      answer:
        "Tick Unique numbers only (no duplicates). The tool will not repeat a number in that batch. The quantity cannot be more than the number of values in the range.",
    },
    {
      question: "Is this random number generator truly random?",
      answer:
        "It uses your browser's cryptographic random source and removes modulo bias, so every whole number in the range is equally likely. It is suitable for games, draws and sampling.",
    },
    {
      question: "How many numbers can I generate at once?",
      answer:
        "Up to 1,000 per batch. Click Copy Results to copy them as a comma-separated list for a spreadsheet or message.",
    },
    {
      question: "Can I generate decimal numbers?",
      answer:
        "Yes. Switch to Decimals mode to get values with 2 decimal places between your minimum and maximum.",
    },
    {
      question: "Can I use negative numbers?",
      answer:
        "Yes. Enter a negative minimum, such as -50 to 50. The minimum must not be larger than the maximum.",
    },
  ],
  howTo: [
    {
      title: "Choose a mode",
      description: "Pick Integers for whole numbers or Decimals for values with 2 decimal places.",
    },
    {
      title: "Set the range",
      description: "Enter the Minimum and Maximum. Both ends are included in Integers mode.",
    },
    {
      title: "Set quantity and repeats",
      description: "Enter how many numbers you need (1 to 1,000) and tick Unique if no number should repeat.",
    },
    {
      title: "Generate and copy",
      description: "Read the results, click Generate New Random Numbers for a new set, or Copy Results to save them.",
    },
  ],

  engine: "calculator",
  privacyNote: "client",
}

export default definition
