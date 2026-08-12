import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "home-loan-emi-calculator",
  name: "Home Loan EMI Calculator",
  slug: "home-loan-emi-calculator",
  category: "finance",
  path: "finance/emi-calculator",

  shortDescription:
    "Calculate home loan EMI for India instantly — monthly payment, total interest and full amortization schedule for any tenure. Free, private and in-browser.",
  longDescription:
    "Our free home loan EMI calculator is built for Indian housing loans. Work out the monthly EMI for any home loan amount — typically ₹25 lakh to ₹2 crore or more — at your lender's prevailing rate (housing finance companies and banks typically quote 8.25% to 9.5% as of FY 2026-27) over tenures of 10, 15, 20 or 30 years. Enter the loan amount, annual interest rate and tenure to instantly see your monthly EMI, total payment, total interest and a month-by-month amortization schedule. Everything runs on your device — no sign-up, no data leaving your browser.",
  sections: [
    {
      heading: "How home loan EMI is calculated",
      body: "Home loan EMI follows the same formula as any amortizing loan: EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), where P is the loan principal, r is the monthly interest rate (annual rate ÷ 12 ÷ 100) and n is the number of monthly payments. Because interest is charged on the outstanding balance, early EMIs are mostly interest and later EMIs mostly principal. This calculator applies the exact formula and rounds every figure to the nearest rupee.",
    },
    {
      heading: "Principal, rate and tenure — how they interact",
      body: "For a home loan, tenure has the strongest effect on total interest. A ₹50 lakh loan at 8.5% costs about ₹54 lakh in interest over 20 years but only about ₹24 lakh over 10 years — a saving of roughly ₹30 lakh for halving the term, despite a much higher monthly EMI. A small rate difference also compounds: every 0.25% reduction on a 20-year loan saves several lakh in interest. Adjust the three inputs here to see how your own numbers move.",
    },
    {
      heading: "Why tenure choice matters",
      body: "Lenders offer home loan tenures up to 30 years, and a longer tenure lowers the monthly EMI — which can help qualify when income is constrained. But it triples the total interest you pay. Use this calculator to compare a shorter tenure against a higher EMI, so you can pick the term that balances monthly cash flow with total cost.",
    },
    {
      heading: "Made for Indian home loan borrowers",
      body: "Inputs are formatted in Indian Rupees (lakhs and crores), rates are entered as your Indian bank or housing finance company quotes them, and results match how Indian lenders quote EMI — including odd tenures like 18 years 6 months for pre-EMI or balance-transfer cases. No uploads, no account — purely a browser calculation.",
    },
  ],
  examples: [
    {
      title: "Typical 20-year home loan",
      input: "₹50,00,000 at 8.5% for 20 years",
      output: "Monthly EMI ≈ ₹43,391 · Total interest ≈ ₹54,13,900",
    },
    {
      title: "Shorter 10-year tenure",
      input: "₹50,00,000 at 8.5% for 10 years",
      output: "Monthly EMI ≈ ₹61,992 · Total interest ≈ ₹24,39,000",
    },
  ],
  primaryKeyword: "home loan emi calculator",
  keywords: [
    "housing loan emi calculator",
    "home loan calculator india",
    "home loan monthly emi",
    "calculate home loan emi",
    "home loan interest calculator",
    "home loan emi india",
  ],
  searchAliases: [
    "home emi",
    "housing loan emi",
    "monthly home loan installment",
    "home loan repayment calculator",
  ],
  searchWeight: 100,

  relatedTools: [
    "emi-calculator",
    "car-loan-emi-calculator",
    "personal-loan-emi-calculator",
    "interest-calculator",
    "income-tax-calculator",
  ],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-12",
  lastUpdated: "2026-08-12",

  schemaType: "Calculator",
  icon: "house",
  faq: [
    {
      question: "How is home loan EMI calculated?",
      answer:
        "Using the standard formula EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), where P is the loan amount, r is the monthly interest rate (annual rate ÷ 12 ÷ 100) and n is the total number of monthly payments. The calculator shows the monthly EMI, total interest and full amortization schedule instantly.",
    },
    {
      question: "What tenure should I choose for a home loan?",
      answer:
        "A shorter tenure means a higher EMI but far less total interest — halving a 20-year term typically more than halves the interest paid. Choose the shortest tenure whose EMI your monthly budget can comfortably service.",
    },
    {
      question: "Does a lower EMI mean a lower total cost?",
      answer:
        "No — the opposite. A lower EMI comes from a longer tenure, and a longer tenure increases total interest substantially. Compare the 'Total payment' figure here rather than the monthly EMI alone to judge the real cost of a loan.",
    },
    {
      question: "Is this calculator for India home loans?",
      answer:
        "Yes. Amounts are in Indian Rupees, rates match how Indian banks and housing finance companies quote interest, and results are formatted in lakhs and crores with a month-by-month schedule in Indian currency.",
    },
    {
      question: "Is my data stored?",
      answer:
        "No. The calculation runs entirely in your browser and no loan amount, rate or tenure data is uploaded or stored anywhere.",
    },
  ],
  howTo: [
    {
      title: "Enter the home loan amount",
      description: "Type the principal — for example 5000000 for a ₹50,00,000 loan.",
    },
    {
      title: "Set the annual interest rate",
      description: "Use the rate your bank or housing finance company quoted, e.g. 8.5%.",
    },
    {
      title: "Choose the tenure",
      description: "Enter years (and extra months if the term is not whole years).",
    },
    {
      title: "Read your EMI and total interest",
      description: "See the monthly EMI, total payment, total interest and first-year amortization schedule.",
    },
  ],

  engine: "calculator",
  privacyNote: "none",
  preset: { defaultPrincipal: 5000000, defaultAnnualRate: 8.5, defaultTenureYears: 20 },
}