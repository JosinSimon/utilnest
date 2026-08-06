import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "rd-calculator",
  name: "RD Calculator",
  slug: "rd-calculator",
  category: "finance",
  path: "finance/rd-calculator",

  shortDescription:
    "Calculate your Recurring Deposit maturity value and interest with quarterly compounding. Free, instant and 100% private — runs entirely in your browser.",
  longDescription:
    "Our free RD calculator shows how much your monthly recurring deposit will be worth at maturity. Enter your monthly deposit, annual interest rate and tenure to instantly see the maturity value, total deposited and interest earned. It uses the standard bank recurring deposit formula with quarterly compounding. No sign-up, no uploads — everything runs on your device.",
  sections: [
    {
      heading: "What is a Recurring Deposit?",
      body: "A Recurring Deposit (RD) is a savings product where you deposit a fixed amount every month for a chosen tenure and earn interest, usually compounded quarterly. It is a popular way to build a savings habit with the safety of a bank deposit and guaranteed returns.",
    },
    {
      heading: "Why use our RD calculator?",
      body: "It separates your own deposits from the interest earned, so you can see exactly how much the quarterly compounding adds. Adjust the monthly amount, rate and tenure live to compare plans.",
    },
  ],

  examples: [
    {
      title: "Regular saving plan",
      input: "₹5,000/month at 7% for 5 years",
      output: "Deposited ₹3,00,000 · Maturity ≈ ₹3,61,000",
    },
    {
      title: "Long-term RD",
      input: "₹10,000/month at 7.5% for 10 years",
      output: "Deposited ₹12,00,000 · Maturity ≈ ₹17,42,000",
    },
  ],

  primaryKeyword: "rd calculator",
  keywords: [
    "recurring deposit calculator",
    "rd maturity calculator",
    "recurring deposit interest calculator",
    "monthly rd calculator",
    "bank rd calculator",
    "rd calculator india",
  ],
  searchAliases: ["rd", "recurring deposit", "rd maturity", "monthly deposit calculator"],
  searchWeight: 85,

  relatedTools: [],
  featured: true,
  trending: false,
  popular: true,
  addedAt: "2026-08-06",
  lastUpdated: "2026-08-06",

  schemaType: "Calculator",
  icon: "refresh-cw",
  faq: [
    {
      question: "How is RD interest calculated?",
      answer:
        "Banks calculate RD interest using quarterly compounding. The calculator applies the standard formula M = P × ((1+i)^n − 1) ÷ (1 − (1+i)^(−1/3)), where P is the monthly deposit, i is the quarterly rate and n is the number of quarters.",
    },
    {
      question: "Can I choose my RD tenure?",
      answer:
        "Yes. Most banks allow RDs from 6 months to 10 years. This calculator accepts any tenure in years and months.",
    },
    {
      question: "Is the RD rate guaranteed?",
      answer:
        "Yes — the interest rate is fixed at account opening for the full tenure, and the calculator reflects that fixed rate.",
    },
  ],
  howTo: [
    {
      title: "Enter the monthly deposit",
      description: "Type the fixed amount you will deposit every month.",
    },
    {
      title: "Set the interest rate",
      description: "Enter the annual rate your bank offers.",
    },
    {
      title: "Choose the tenure",
      description: "Enter the period in years and any extra months.",
    },
    {
      title: "Read the maturity value",
      description: "See maturity value, total deposited and interest earned instantly.",
    },
  ],

  engine: "calculator",
  privacyNote: "none",
}
