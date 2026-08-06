import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "emi-calculator",
  name: "EMI Calculator",
  slug: "emi-calculator",
  category: "finance",
  path: "finance/emi-calculator",

  shortDescription:
    "Calculate home, car and personal loan EMI instantly — monthly payment, total interest and full amortization schedule. Free, accurate and 100% in-browser.",
  longDescription:
    "Our free EMI calculator works out the exact equated monthly installment for any loan: home loan, car loan, personal loan or business loan. Enter the loan amount, annual interest rate and tenure (in years and months) to instantly see your monthly EMI, the total amount you will pay back and the total interest over the loan's life — plus a month-by-month amortization schedule showing how each payment is split between principal and interest. No sign-up, no uploads; everything runs on your device.",
  sections: [
    {
      heading: "What is an EMI?",
      body: "EMI (Equated Monthly Installment) is the fixed amount you pay a lender every month until the loan is fully repaid. It includes both interest and principal: early payments go mostly toward interest, and over time the balance shifts so later payments mostly reduce the principal. An EMI calculator reveals exactly how that split works and how much the loan really costs.",
    },
    {
      heading: "Why use our EMI calculator?",
      body: "It handles any amount, rate and tenure — including half-yearly odd months like 2 years 6 months. Results update live as you type, are formatted in Indian Rupees, and come with a full amortization schedule so you can see the outstanding balance month by month.",
    },
  ],

  examples: [
    {
      title: "Home loan",
      input: "₹50,00,000 at 8.5% for 20 years",
      output: "Monthly EMI ≈ ₹43,391 · Total interest ≈ ₹54,13,900",
    },
    {
      title: "Car loan",
      input: "₹8,00,000 at 9.5% for 5 years",
      output: "Monthly EMI ≈ ₹16,803 · Total interest ≈ ₹2,08,200",
    },
  ],

  primaryKeyword: "emi calculator",
  keywords: [
    "loan emi calculator",
    "home loan emi calculator",
    "car loan emi calculator",
    "personal loan emi calculator",
    "monthly emi calculator",
    "emi calculator india",
  ],
  searchAliases: ["emi", "loan calculator", "monthly installment", "loan repayment"],
  searchWeight: 95,

  relatedTools: [],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-06",
  lastUpdated: "2026-08-06",

  schemaType: "Calculator",
  icon: "house",
  faq: [
    {
      question: "What is the EMI formula?",
      answer:
        "EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), where P is the loan amount, r is the monthly interest rate (annual rate ÷ 12 ÷ 100) and n is the number of monthly payments. The calculator applies this formula and rounds the result to the nearest paisa.",
    },
    {
      question: "Why is my interest higher in the early months?",
      answer:
        "Interest is charged on the outstanding balance, which is largest at the start. As you repay the principal, the balance shrinks, so the interest component of each EMI falls and the principal component rises. This is the standard amortization pattern.",
    },
    {
      question: "Does this include processing fees or prepayment?",
      answer:
        "No. The calculator covers principal and interest only. Lenders usually add one-time processing fees and may charge penalties for prepayment, which are separate.",
    },
  ],
  howTo: [
    {
      title: "Enter the loan amount",
      description: "Type the amount you want to borrow in Rupees.",
    },
    {
      title: "Set the annual interest rate",
      description: "Enter the rate your lender quoted, or tap a common rate for quick selection.",
    },
    {
      title: "Choose the tenure",
      description: "Enter the loan term in years and any extra months.",
    },
    {
      title: "Read your EMI and schedule",
      description: "See the monthly EMI, total payment, total interest and the first-year amortization breakdown instantly.",
    },
  ],

  engine: "calculator",
  privacyNote: "none",
}
