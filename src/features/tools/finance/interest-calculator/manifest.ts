import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "interest-calculator",
  name: "Interest Calculator",
  slug: "interest-calculator",
  category: "finance",
  path: "finance/interest-calculator",

  shortDescription:
    "Calculate simple and compound interest on any principal, rate and tenure. Choose yearly, half-yearly, quarterly or monthly compounding. Free and 100% private.",
  longDescription:
    "Our free interest calculator works out both simple and compound interest on any amount. Enter the principal, annual interest rate and tenure to instantly see the interest earned and the maturity value. Switch between simple interest and compound interest, and choose how often interest compounds — yearly, half-yearly, quarterly or monthly. No sign-up, no uploads — everything runs on your device.",
  sections: [
    {
      heading: "Simple vs compound interest",
      body: "Simple interest is calculated only on the original principal, so it grows linearly. Compound interest is calculated on the principal plus previously earned interest, so it grows faster over time — the more often it compounds, the more you earn. This calculator lets you compare both side by side.",
    },
    {
      heading: "Why use our interest calculator?",
      body: "It makes the difference between simple and compound growth visible instantly, and lets you test different compounding frequencies to understand how banks and deposit schemes calculate your earnings.",
    },
  ],

  examples: [
    {
      title: "Simple interest",
      input: "₹10,000 at 5% for 3 years",
      output: "Interest ₹1,500 · Maturity ₹11,500",
    },
    {
      title: "Compound interest",
      input: "₹10,000 at 5% for 3 years, yearly",
      output: "Interest ₹1,576.25 · Maturity ₹11,576.25",
    },
  ],

  primaryKeyword: "interest calculator",
  keywords: [
    "simple interest calculator",
    "compound interest calculator",
    "monthly compound interest calculator",
    "interest rate calculator",
    "interest calculator india",
  ],
  searchAliases: ["interest", "compound interest", "simple interest", "ci calculator"],
  searchWeight: 80,

  relatedTools: ["emi-calculator", "fd-calculator", "sip-calculator"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-06",
  lastUpdated: "2026-08-06",

  schemaType: "Calculator",
  icon: "percent",
  faq: [
    {
      question: "What is the difference between simple and compound interest?",
      answer:
        "Simple interest is paid only on the original amount you invested or borrowed. Compound interest is also paid on the interest you have already earned, so your money grows at an increasing rate over time.",
    },
    {
      question: "How does compounding frequency affect my returns?",
      answer:
        "Interest that compounds more often earns more, because each period's interest starts earning interest sooner. For the same annual rate, monthly compounding yields more than quarterly, which yields more than yearly.",
    },
    {
      question: "Can I use this for loans too?",
      answer:
        "Yes. Enter the borrowed amount and rate to see how much interest accrues. Note that most loans also carry processing fees, and some use reducing-balance methods, which are not modeled here.",
    },
  ],
  howTo: [
    {
      title: "Choose simple or compound",
      description: "Pick the interest type you want to calculate.",
    },
    {
      title: "Enter the principal and rate",
      description: "Type the starting amount and the annual interest rate.",
    },
    {
      title: "Set the tenure",
      description: "Enter the period in years and any extra months.",
    },
    {
      title: "Read the interest and maturity value",
      description: "See the total interest and final amount instantly.",
    },
  ],

  engine: "calculator",
  privacyNote: "none",
}
