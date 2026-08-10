import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "random-number-generator",
  name: "Random Number Generator",
  slug: "random-number-generator",
  category: "utilities",
  path: "utilities/random-number-generator",

  shortDescription: "Generate random numbers, random decimals, or unique number lists using Web Crypto API.",
  longDescription:
    "Free online Random Number Generator using browser-native Web Crypto API (`crypto.getRandomValues`). Pick custom minimum and maximum bounds, generate multiple numbers, toggle unique results, or create random decimal numbers. 100% private, fast, and runs locally in your browser.",

  sections: [
    {
      heading: "Cryptographically Secure Web Crypto Randomness",
      body: "Unlike basic tools using Math.random(), our generator relies on `window.crypto.getRandomValues()` to ensure cryptographically unbiased random integer and decimal sampling.",
    },
    {
      heading: "Unique List Sampling & Boundary Validation",
      body: "Need non-repeating numbers for a raffle or lottery draw? Enable the 'Unique Numbers' toggle to guarantee zero duplicates within your specified range.",
    },
  ],

  primaryKeyword: "random number generator",
  keywords: [
    "random number generator online",
    "random number between 1 and 100",
    "random decimal generator",
    "unique random numbers",
    "number picker",
    "web crypto random",
  ],
  searchAliases: [
    "rng online",
    "random integer generator",
    "random list generator",
  ],
  searchWeight: 90,

  relatedTools: ["uuid-generator", "password-generator", "unit-converter"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-08-10",

  schemaType: "Generator",
  icon: "hash",
  faq: [
    {
      question: "How does Web Crypto API ensure unbiased random numbers?",
      answer: "The browser's Web Crypto API draws entropy directly from OS-level hardware state, eliminating algorithmic pseudo-random bias present in standard PRNGs.",
    },
    {
      question: "What happens if unique mode is requested for more numbers than exist in range?",
      answer: "The engine automatically validates your request and alerts you if the requested count exceeds the available range size.",
    },
  ],
  howTo: [
    { title: "Set Min & Max", description: "Enter lower and upper numerical bounds." },
    { title: "Select Quantity & Mode", description: "Choose integer vs decimal mode and number of results." },
    { title: "Generate & Copy", description: "Click Generate to get instant cryptographically random results and copy to clipboard." },
  ],

  engine: "calculator",
  privacyNote: "client",
}

export default definition
