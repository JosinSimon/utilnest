import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "ppf-calculator",
  name: "PPF Calculator",
  slug: "ppf-calculator",
  category: "finance",
  path: "finance/ppf-calculator",

  shortDescription:
    "Calculate your PPF maturity value, tax-free interest and total deposits. Based on the current 7.1% rate. Free, instant and 100% private.",
  longDescription:
    "Our free PPF calculator projects the maturity value of your Public Provident Fund savings. Enter your annual deposit and the investment horizon to instantly see the maturity value, your total deposits and the interest earned. It compounds annually at the current 7.1% rate. PPF is fully tax-free — on interest, maturity and withdrawals — making it one of India's most popular long-term savings options. No sign-up, no uploads — everything runs on your device.",
  sections: [
    {
      heading: "What is a PPF?",
      body: "The Public Provident Fund (PPF) is a government-backed, long-term savings scheme with a 15-year lock-in. Contributions are eligible for tax deduction under Section 80C, and the interest plus the final maturity amount are completely tax-free (EEE status). It offers attractive, compounding returns with sovereign safety.",
    },
    {
      heading: "Why use our PPF calculator?",
      body: "It shows the powerful effect of annual compounding on your deposits and separates your own contributions from the interest the government pays. See how the maturity value grows as you adjust your yearly deposit and horizon.",
    },
  ],

  examples: [
    {
      title: "Maximum contribution",
      input: "₹1,50,000/year for 15 years at 7.1%",
      output: "Deposited ₹22,50,000 · Maturity ≈ ₹40,68,000",
    },
    {
      title: "Extended block",
      input: "₹1,50,000/year for 20 years at 7.1%",
      output: "Deposited ₹30,00,000 · Maturity ≈ ₹65,72,000",
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

  relatedTools: [],
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
      answer:
        "The government reviews PPF rates quarterly. As of the current period the rate is 7.1% per annum, compounded annually — this calculator uses that rate, so expect slight changes if it is revised.",
    },
    {
      question: "Is PPF tax-free?",
      answer:
        "Yes. PPF enjoys EEE (Exempt-Exempt-Exempt) status: contributions are deductible up to ₹1.5 lakh under Section 80C, and both the interest and the maturity amount are tax-free.",
    },
    {
      question: "What is the minimum and maximum deposit?",
      answer:
        "The minimum annual contribution is ₹500 and the maximum is ₹1,50,000 per financial year. A minimum of one deposit per year is required to keep the account active.",
    },
  ],
  howTo: [
    {
      title: "Enter your annual deposit",
      description: "Type how much you deposit each year (up to ₹1,50,000).",
    },
    {
      title: "Choose the duration",
      description: "Set the number of years you plan to keep investing (typically 15).",
    },
    {
      title: "Read the maturity value",
      description: "See maturity value, total deposit and tax-free interest instantly.",
    },
  ],

  engine: "calculator",
  privacyNote: "none",
}