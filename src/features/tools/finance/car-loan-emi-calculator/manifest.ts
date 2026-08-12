import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "car-loan-emi-calculator",
  name: "Car Loan EMI Calculator",
  slug: "car-loan-emi-calculator",
  category: "finance",
  path: "finance/emi-calculator",

  shortDescription:
    "Calculate car loan EMI in India — monthly payment, total interest and amortization schedule for new or used cars. Free, accurate and private.",
  longDescription:
    "This free car loan EMI calculator is made for Indian auto finance. Work out the monthly EMI for a hatchback, sedan or SUV loan — typically ₹3 lakh to ₹25 lakh — at car loan interest rates around 9% to 10.5% as of FY 2026-27, over tenures of 3 to 7 years. Enter the loan amount (after your down payment), annual interest rate and tenure to instantly see your monthly EMI, total payment, total interest and the full amortization schedule. Everything runs on your device — no sign-up, no uploads.",
  sections: [
    {
      heading: "Calculate your monthly car EMI",
      body: "A car loan works on the same amortizing principle as any loan: EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1). The monthly interest rate is your annual rate divided by 12, and n is the number of monthly payments. Each EMI covers interest first, then principal, so the outstanding balance falls fastest in the later years of the loan.",
    },
    {
      heading: "Down payment and loan amount",
      body: "Lenders typically finance 80% to 90% of a new car's on-road price, so plan a 10% to 20% down payment. If a ₹10,00,000 car needs 20% down, the financed amount is ₹8,00,000 — enter that lower figure here to compute the actual EMI you will pay.",
    },
    {
      heading: "How tenure changes the math",
      body: "Car loans usually run 3 to 7 years. A 5-year loan spreads the cost thinly but adds interest; a 3-year loan raises the EMI by roughly 60% while cutting total interest in half. Compare both here before signing — the difference on a ₹10 lakh loan is usually several lakh in interest.",
    },
    {
      heading: "Keeping it private",
      body: "This is a pure browser calculation. Your loan amount, rate and tenure stay on your device, so you can explore financing options without sharing any personal or financial data.",
    },
  ],
  examples: [
    {
      title: "Typical 5-year car loan",
      input: "₹8,00,000 at 9.5% for 5 years",
      output: "Monthly EMI ≈ ₹16,803 · Total interest ≈ ₹2,08,200",
    },
    {
      title: "Shorter 3-year car loan",
      input: "₹8,00,000 at 9.5% for 3 years",
      output: "Monthly EMI ≈ ₹25,602 · Total interest ≈ ₹1,21,700",
    },
  ],
  primaryKeyword: "car loan emi calculator",
  keywords: [
    "auto loan emi calculator",
    "vehicle loan emi calculator",
    "car loan calculator india",
    "monthly car emi",
    "car finance calculator",
    "car emi calculator india",
  ],
  searchAliases: [
    "car emi",
    "auto loan emi",
    "vehicle loan emi",
    "monthly car installment",
  ],
  searchWeight: 95,

  relatedTools: [
    "emi-calculator",
    "home-loan-emi-calculator",
    "personal-loan-emi-calculator",
    "interest-calculator",
  ],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-12",
  lastUpdated: "2026-08-12",

  schemaType: "Calculator",
  icon: "trending-up",
  faq: [
    {
      question: "How is car loan EMI calculated?",
      answer:
        "With the standard formula EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), where P is the financed amount, r is the monthly interest rate and n is the number of monthly payments. The calculator returns the monthly EMI, total interest and full amortization schedule.",
    },
    {
      question: "What is a typical car loan tenure?",
      answer:
        "Indian banks and NBFCs offer car loan tenures from 1 to 7 years, with 3 to 5 years being the most common for new cars. Used car loans usually cap at 4 to 5 years depending on the vehicle's age.",
    },
    {
      question: "Should I choose a shorter tenure?",
      answer:
        "If the higher EMI fits your budget, a shorter tenure saves a large amount of interest — a 3-year loan typically costs about half the interest of a 5-year loan on the same amount. Use this calculator to compare both before deciding.",
    },
    {
      question: "Can this calculate used car loan EMI?",
      answer:
        "Yes. Used car loans work exactly the same way — enter the financed amount for the used vehicle, the rate quoted by the lender and the tenure. Rates for used cars are usually a little higher than new-car rates.",
    },
    {
      question: "Is anything uploaded?",
      answer:
        "No. The calculation runs entirely in your browser. No amount, rate or tenure data is uploaded to any server.",
    },
  ],
  howTo: [
    {
      title: "Enter the financed amount",
      description: "After down payment — for example 800000 for a car financed at ₹8,00,000.",
    },
    {
      title: "Set the annual interest rate",
      description: "Use the rate your bank or NBFC quoted, e.g. 9.5%.",
    },
    {
      title: "Choose the tenure",
      description: "Enter 3 to 7 years, or 2 years 6 months for non-standard terms.",
    },
    {
      title: "Compare your EMI options",
      description: "Read the monthly EMI, total interest and schedule, then try a different tenure to compare.",
    },
  ],

  engine: "calculator",
  privacyNote: "none",
  preset: { defaultPrincipal: 1000000, defaultAnnualRate: 9.5, defaultTenureYears: 5 },
}