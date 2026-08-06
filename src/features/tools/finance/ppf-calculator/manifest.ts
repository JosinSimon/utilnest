import type { ToolDefinition } from "@/data/types"
import { PPF_CONFIG } from "./config"

const RATE = PPF_CONFIG.annualRatePct.toFixed(1)

export const definition: ToolDefinition = {
  id: "ppf-calculator",
  name: "PPF Calculator",
  slug: "ppf-calculator",
  category: "finance",
  path: "finance/ppf-calculator",

  shortDescription: `Calculate your PPF maturity value, tax-free interest and total deposits. Based on the current ${RATE}% rate. Free, instant and 100% private.`,
  longDescription: `Our free PPF calculator projects the maturity value of your Public Provident Fund savings. Enter your annual deposit and the investment horizon to instantly see the maturity value, your total deposits and the interest earned. It compounds annually at the current ${RATE}% rate. PPF is fully tax-free — on interest, maturity and withdrawals — making it one of India's most popular long-term savings options. No sign-up, no uploads — everything runs on your device.`,
  sections: [
    {
      heading: "What is a PPF?",
      body: "The Public Provident Fund (PPF) is a government-backed, long-term savings scheme with a 15-year lock-in. Contributions are eligible for tax deduction under Section 80C, and the interest plus the final maturity amount are completely tax-free (EEE status). It offers attractive, compounding returns with sovereign safety.",
    },
    {
      heading: "How PPF interest works",
      body: "Interest compounds annually at the government-declared rate. This calculator assumes each year's deposit is made at the start of the financial year (before 5 April), so it earns interest for the full year — the standard way to maximise returns. After the 15-year lock-in, the account can be extended in blocks of 5 years, and the calculator lets you project 20, 25, 30 years and beyond.",
    },
    {
      heading: "Why use our PPF calculator?",
      body: "It shows the powerful effect of annual compounding on your deposits and separates your own contributions from the interest the government pays. See how the maturity value grows as you adjust your yearly deposit and horizon.",
    },
  ],

  examples: [
    {
      title: "Maximum contribution",
      input: `₹1,50,000/year for 15 years at ${RATE}%`,
      output: "Deposited ₹22,50,000 · Maturity ≈ ₹40,68,209",
    },
    {
      title: "Extended block",
      input: `₹1,50,000/year for 20 years at ${RATE}%`,
      output: "Deposited ₹30,00,000 · Maturity ≈ ₹66,58,288",
    },
  ],

  primaryKeyword: "ppf calculator",
  keywords: [
    "public provident fund calculator",
    "ppf maturity calculator",
    "ppf interest calculator",
    "ppf return calculator",
    "ppf calculator india",
  ],
  searchAliases: ["ppf", "public provident fund", "ppf maturity", "ppf 80c"],
  searchWeight: 85,

  relatedTools: ["sip-calculator", "fd-calculator", "interest-calculator"],
  featured: true,
  trending: false,
  popular: true,
  addedAt: "2026-08-06",
  lastUpdated: "2026-08-06",

  schemaType: "Calculator",
  icon: "shield-check",
  faq: [
    {
      question: "What is the current PPF interest rate?",
      answer: `The government reviews PPF rates quarterly. As of the current period the rate is ${RATE}% per annum, compounded annually — this calculator uses that rate, so expect slight changes if it is revised.`,
    },
    {
      question: "Is PPF tax-free?",
      answer:
        "Yes. PPF enjoys EEE (Exempt-Exempt-Exempt) status: contributions are deductible up to ₹1.5 lakh under Section 80C, and both the interest and the maturity amount are tax-free.",
    },
    {
      question: "What is the minimum and maximum deposit?",
      answer: `The minimum annual contribution is ₹${PPF_CONFIG.minDeposit.toLocaleString("en-IN")} and the maximum is ₹${PPF_CONFIG.maxDeposit.toLocaleString("en-IN")} per financial year. A minimum of one deposit per year is required to keep the account active.`,
    },
    {
      question: "When should I deposit to earn maximum interest?",
      answer: `Deposits made before the 5th of a month earn interest for that full month. This calculator assumes you deposit at the start of each financial year (before 5 April), so the whole year's deposit earns interest for the full year — the most favourable assumption.`,
    },
    {
      question: "Can I invest beyond the 15-year lock-in?",
      answer: `Yes. A PPF account matures after ${PPF_CONFIG.lockInYears} years but can be extended indefinitely in ${PPF_CONFIG.extensionBlockYears}-year blocks (${PPF_CONFIG.lockInYears}, ${PPF_CONFIG.lockInYears + PPF_CONFIG.extensionBlockYears}, ${PPF_CONFIG.lockInYears + PPF_CONFIG.extensionBlockYears * 2}, … years). Use the 20/25/30-year options in the calculator to project an extended tenure.`,
    },
  ],
  howTo: [
    {
      title: "Enter your annual deposit",
      description: `Type how much you deposit each year (up to ₹${PPF_CONFIG.maxDeposit.toLocaleString("en-IN")}).`,
    },
    {
      title: "Choose the duration",
      description: `Set the number of years you plan to keep investing — from the ${PPF_CONFIG.lockInYears}-year lock-in, optionally extended in ${PPF_CONFIG.extensionBlockYears}-year blocks.`,
    },
    {
      title: "Read the maturity value",
      description: "See maturity value, total deposit and tax-free interest instantly.",
    },
  ],

  engine: "calculator",
  privacyNote: "none",
}