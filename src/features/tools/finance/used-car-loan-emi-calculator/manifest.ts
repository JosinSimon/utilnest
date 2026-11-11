import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "used-car-loan-emi-calculator",
  name: "Used Car Loan EMI Calculator",
  slug: "used-car-loan-emi-calculator",
  category: "finance",
  path: "finance/emi-calculator",

  shortDescription:
    "Used car loan EMI calculator for India: monthly EMI, total interest and repayment schedule for a second-hand car loan. Free and instant.",
  longDescription:
    "Planning to buy a second-hand car? Enter the used car loan amount, the interest rate your lender quoted and the tenure to see your monthly EMI, total interest, total payable and a month-by-month schedule. The calculator starts with typical used-car settings (₹4 lakh at 12.5% for 4 years) that you can change, and it runs entirely in your browser.",
  sections: [
    {
      heading: "How used car loan EMI is calculated",
      body: "A used car loan is a reducing-balance loan, just like a new car loan, so the EMI uses EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1). P is the loan amount, r is the annual rate ÷ 12 ÷ 100 and n is the number of months. Example: ₹4,00,000 at 12.5% for 4 years works out to an EMI of about ₹10,632 and total interest of about ₹1,10,336.",
    },
    {
      heading: "How used car loans differ from new car loans",
      body: "Lenders see a used car as riskier, so used car loans usually have a higher interest rate (often a few percentage points above new-car rates), a shorter maximum tenure and a lower loan-to-value ratio. Many lenders also cap the tenure so the loan ends before the car reaches a certain age. Check the exact terms in your lender's quote.",
    },
    {
      heading: "How much loan to enter",
      body: "Lenders fund a percentage of the car's valuation, not the seller's asking price. If the car is valued at ₹5,00,000 and the lender funds 80%, the loan is ₹4,00,000 and you pay the remaining ₹1,00,000 plus RC transfer and insurance costs yourself. Enter only the amount you are borrowing.",
    },
    {
      heading: "Compare tenures before you sign",
      body: "On ₹5,00,000 at 13%, a 3-year loan costs about ₹16,847 a month with ₹1,06,491 interest, while a 5-year loan drops the EMI to about ₹11,377 but the interest rises to ₹1,82,592. If the EMI fits your budget, the shorter tenure saves a lot of money.",
    },
    {
      heading: "Private by design",
      body: "The calculation runs in your browser. Your loan amount, rate and tenure are never uploaded, and you don't need to sign up or share a phone number.",
    },
  ],
  examples: [
    {
      title: "₹4 lakh used car loan",
      input: "₹4,00,000 at 12.5% for 4 years",
      output: "EMI ≈ ₹10,632 · Total interest ≈ ₹1,10,336",
    },
    {
      title: "₹5 lakh loan over 3 years",
      input: "₹5,00,000 at 13% for 3 years",
      output: "EMI ≈ ₹16,847 · Total interest ≈ ₹1,06,491",
    },
    {
      title: "₹3 lakh hatchback loan",
      input: "₹3,00,000 at 14% for 3 years",
      output: "EMI ≈ ₹10,253 · Total interest ≈ ₹69,118",
    },
  ],
  primaryKeyword: "used car loan emi calculator",
  keywords: [
    "used car emi calculator",
    "second hand car loan emi calculator",
    "used car loan calculator india",
    "pre owned car loan emi",
    "used car loan emi",
    "used cars emi calculator",
    "emi calculator used car",
  ],
  searchAliases: [
    "used car emi",
    "second hand car emi",
    "pre-owned car loan",
    "old car loan emi",
  ],
  searchWeight: 90,

  relatedTools: [
    "car-loan-emi-calculator",
    "emi-calculator",
    "personal-loan-emi-calculator",
    "interest-calculator",
  ],
  featured: false,
  trending: true,
  popular: false,
  addedAt: "2026-11-11",
  lastUpdated: "2026-11-11",

  schemaType: "Calculator",
  icon: "trending-up",
  faq: [
    {
      question: "How is used car loan EMI calculated?",
      answer:
        "With the same reducing-balance formula as any loan: EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1). Enter the loan amount, rate and tenure above and the calculator does the math, including total interest and the repayment schedule.",
    },
    {
      question: "What is the EMI for a ₹4 lakh used car loan?",
      answer:
        "At 12.5% for 4 years, a ₹4,00,000 used car loan costs about ₹10,632 a month, with total interest of about ₹1,10,336. Your figure depends on the rate and tenure your lender offers.",
    },
    {
      question: "Why are used car loan rates higher?",
      answer:
        "A used car's value is harder to judge and it loses value as it ages, so lenders take more risk and charge more. Your credit score, the car's age and the lender also affect the rate.",
    },
    {
      question: "What is the maximum tenure for a used car loan?",
      answer:
        "It is usually shorter than for a new car, and many lenders also limit it by the car's age at the end of the loan. Check your lender's terms, then compare tenures here.",
    },
    {
      question: "Is anything I enter uploaded?",
      answer: "No. Everything is calculated in your browser and nothing is sent to a server.",
    },
  ],
  howTo: [
    {
      title: "Enter the loan amount",
      description: "The amount the lender will fund, for example 400000 for ₹4,00,000.",
    },
    {
      title: "Enter the interest rate",
      description: "Use the annual rate from your lender's quote, for example 12.5%.",
    },
    {
      title: "Choose the tenure",
      description: "Try 3, 4 and 5 years to compare EMI and total interest.",
    },
    {
      title: "Check the schedule",
      description: "Read the monthly EMI, total interest and the month-by-month repayment table.",
    },
  ],

  engine: "calculator",
  privacyNote: "none",
  preset: { defaultPrincipal: 400000, defaultAnnualRate: 12.5, defaultTenureYears: 4 },
}
