import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "personal-loan-emi-calculator",
  name: "Personal Loan EMI Calculator",
  slug: "personal-loan-emi-calculator",
  category: "finance",
  path: "finance/emi-calculator",

  shortDescription:
    "Calculate personal loan EMI in India instantly — monthly payment, total interest and schedule at typical personal loan rates. Free, accurate and private.",
  longDescription:
    "This free personal loan EMI calculator is built for unsecured lending in India. Personal loans carry the highest interest rates — typically 10.5% to 24% as of FY 2026-27 — and shorter tenures of 1 to 5 years. Enter the loan amount (usually ₹50,000 to ₹50 lakh), the annual rate your lender quoted and the tenure to instantly see your monthly EMI, total payment, total interest and a month-by-month amortization schedule. Everything runs on your device — no sign-up, no data leaving your browser.",
  sections: [
    {
      heading: "Calculate EMI for personal loans",
      body: "Personal loans are unsecured, so lenders price them with higher rates and shorter tenures than home or car loans. The EMI still follows the standard formula: EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1). Interest is charged on the outstanding balance, so early EMIs are interest-heavy and the principal is repaid faster in later months.",
    },
    {
      heading: "Short tenure vs total interest",
      body: "On a ₹5,00,000 loan at 13%, a 3-year term costs about ₹1,06,700 in interest, while stretching to 5 years pushes total interest to roughly ₹1,84,100. The monthly EMI drops from about ₹16,853 to ₹11,380 — a temptation that costs nearly ₹77,400 extra. Run both here and decide consciously.",
    },
    {
      heading: "Higher interest rate warning",
      body: "Because personal loans are unsecured, rates are 2 to 3 times a home loan rate. A small rate difference matters enormously at these levels: on a 3-year ₹5 lakh loan, moving from 12% to 16% raises the EMI by about ₹330 and adds roughly ₹11,900 in interest over the term.",
    },
    {
      heading: "Compare affordability before you borrow",
      body: "Banks generally expect your total monthly obligations to stay below 50% of income. Use this calculator to check that the EMI fits your cash flow for the whole tenure — not just the first few months — before applying.",
    },
  ],
  examples: [
    {
      title: "Typical 3-year personal loan",
      input: "₹5,00,000 at 13% for 3 years",
      output: "Monthly EMI ≈ ₹16,853 · Total interest ≈ ₹1,06,700",
    },
    {
      title: "Extended 5-year tenure",
      input: "₹5,00,000 at 13% for 5 years",
      output: "Monthly EMI ≈ ₹11,380 · Total interest ≈ ₹1,82,800",
    },
  ],
  primaryKeyword: "personal loan emi calculator",
  keywords: [
    "personal loan calculator india",
    "monthly personal loan emi",
    "personal loan interest calculator",
    "unsecured loan emi calculator",
    "personal loan emi india",
    "salary loan emi calculator",
  ],
  searchAliases: [
    "personal loan emi",
    "unsecured loan emi",
    "salary loan emi",
    "monthly personal loan installment",
  ],
  searchWeight: 95,

  relatedTools: [
    "emi-calculator",
    "home-loan-emi-calculator",
    "car-loan-emi-calculator",
    "interest-calculator",
  ],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-12",
  lastUpdated: "2026-08-12",

  schemaType: "Calculator",
  icon: "credit-card",
  faq: [
    {
      question: "How is personal loan EMI calculated?",
      answer:
        "Using the standard formula EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), where P is the loan amount, r is the monthly interest rate (annual rate ÷ 12 ÷ 100) and n is the number of monthly payments. The calculator also shows total interest and the amortization schedule.",
    },
    {
      question: "Why is personal loan interest higher?",
      answer:
        "Personal loans are unsecured — there is no asset the lender can repossess — so lenders charge higher rates (typically 10.5% to 24%) to cover the added risk. Rates depend on your credit score, income and the lender.",
    },
    {
      question: "Can I use this for salary loan EMI?",
      answer:
        "Yes. Salary loans and other unsecured personal loans are amortized the same way. Enter the amount, the rate from your bank or employer's scheme and the tenure.",
    },
    {
      question: "What happens if I choose a longer tenure?",
      answer:
        "Your monthly EMI falls, but total interest rises substantially — on a ₹5 lakh loan at 13%, extending from 3 to 5 years adds roughly ₹76,000 in interest. Prefer the shortest tenure your budget allows.",
    },
    {
      question: "Is this private?",
      answer:
        "Yes. The EMI calculation runs entirely in your browser and no loan data is uploaded or stored anywhere.",
    },
  ],
  howTo: [
    {
      title: "Enter the loan amount",
      description: "Type the principal — for example 500000 for a ₹5,00,000 loan.",
    },
    {
      title: "Set the annual interest rate",
      description: "Use the rate quoted by your lender, e.g. 13%.",
    },
    {
      title: "Choose the tenure",
      description: "Enter 1 to 5 years, with extra months if needed.",
    },
    {
      title: "Check affordability",
      description: "Read the monthly EMI and total interest, then compare with a shorter tenure.",
    },
  ],

  engine: "calculator",
  privacyNote: "none",
  preset: { defaultPrincipal: 500000, defaultAnnualRate: 13, defaultTenureYears: 3 },
}