import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "hra-calculator",
  name: "HRA Exemption Calculator",
  slug: "hra-calculator",
  category: "finance",
  path: "finance/hra-calculator",

  shortDescription:
    "Calculate the tax-exempt portion of your House Rent Allowance. Uses the Section 10(13A) rules with metro and non-metro limits. Free and 100% private.",
  longDescription:
    "Our free HRA calculator works out how much of your House Rent Allowance is exempt from income tax under Section 10(13A). Enter your monthly basic salary, the HRA you receive and the rent you pay, and choose your city type — the calculator instantly shows your monthly tax-free HRA, the taxable balance and a full breakdown of the three exemption limits it compares. No sign-up, no uploads — everything runs on your device.",
  sections: [
    {
      heading: "How does HRA exemption work?",
      body: "Under Section 10(13A), the exempt part of your HRA is the lowest of three amounts: the actual HRA you receive, your rent minus 10% of your basic salary, and 50% of your basic salary if you live in a metro city (Delhi, Mumbai, Kolkata, Chennai) or 40% otherwise. Whatever is left is added to your taxable income.",
    },
    {
      heading: "Why use our HRA calculator?",
      body: "It compares all three limits automatically and shows you exactly why a particular figure applies, so you can plan rent and HRA to maximise your tax savings without manual math.",
    },
  ],

  examples: [
    {
      title: "Metro employee",
      input: "Basic ₹50,000, HRA ₹20,000, rent ₹18,000/month (metro)",
      output: "Exemption ₹13,000/month · Taxable HRA ₹7,000",
    },
    {
      title: "No rent → no exemption",
      input: "Basic ₹50,000, HRA ₹20,000, rent ₹0",
      output: "Exemption ₹0 · Entire HRA ₹20,000 taxable",
    },
  ],

  primaryKeyword: "hra calculator",
  keywords: [
    "hra exemption calculator",
    "hra tax exemption calculator",
    "house rent allowance calculator",
    "hra calculator india",
  ],
  searchAliases: ["hra", "house rent allowance", "hra exemption"],
  searchWeight: 75,

  relatedTools: ["income-tax-calculator", "gratuity-calculator"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-06",
  lastUpdated: "2026-08-06",

  schemaType: "Calculator",
  icon: "house",
  faq: [
    {
      question: "Which cities count as metro for HRA?",
      answer:
        "Only Delhi, Mumbai, Kolkata and Chennai qualify for the 50% of basic salary limit. For all other Indian cities the limit is 40%.",
    },
    {
      question: "What if my rent is less than 10% of my basic salary?",
      answer:
        "The 'rent minus 10% of basic' component becomes zero or negative, which usually means you get no HRA exemption for that period.",
    },
    {
      question: "Can I claim HRA without rent receipts?",
      answer:
        "Rent receipts are required for exemption claims. If your rent exceeds ₹1 lakh a year, you typically also need the landlord's PAN details.",
    },
  ],
  howTo: [
    {
      title: "Choose your city type",
      description: "Select metro (Delhi, Mumbai, Kolkata, Chennai) or non-metro.",
    },
    {
      title: "Enter basic salary, HRA and rent",
      description: "Use monthly figures for the period you want to check.",
    },
    {
      title: "Read the exemption breakdown",
      description: "See the tax-free HRA, taxable balance and each limit compared.",
    },
  ],

  engine: "calculator",
  privacyNote: "none",
}
