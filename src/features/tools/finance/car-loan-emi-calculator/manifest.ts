import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "car-loan-emi-calculator",
  name: "Car EMI Calculator",
  slug: "car-loan-emi-calculator",
  category: "finance",
  path: "finance/emi-calculator",

  shortDescription:
    "Car EMI calculator for India: see your monthly car loan EMI, total interest and full repayment schedule for a new car. Free, instant, no sign-up.",
  longDescription:
    "Work out the monthly EMI on a new car loan in India before you visit the showroom. Enter the loan amount (on-road price minus your down payment), the interest rate your bank or NBFC quoted and the tenure, and you instantly get the EMI, total interest, total amount payable and a month-by-month amortization schedule. It works for hatchbacks, sedans, SUVs and EVs, for loans from ₹2 lakh to ₹50 lakh, and runs entirely in your browser.",
  sections: [
    {
      heading: "How car EMI is calculated",
      body: "Car loans in India are reducing-balance loans, so the EMI uses the standard formula EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1). P is the amount you borrow, r is the annual rate divided by 12 and then by 100, and n is the number of months. Example: ₹8,00,000 at 9.5% for 5 years gives r = 0.0079 and n = 60, so the EMI is about ₹16,801. Early EMIs are mostly interest; the principal share grows every month.",
    },
    {
      heading: "On-road price, down payment and loan amount",
      body: "Banks lend against the on-road price (ex-showroom price + RTO registration + insurance), but most finance 80% to 90% of it, so expect to pay 10% to 20% yourself. If a car costs ₹10,00,000 on-road and you put down ₹2,00,000, enter ₹8,00,000 as the loan amount. A bigger down payment lowers both the EMI and the total interest, and can help you get a better rate.",
    },
    {
      heading: "3, 5 or 7 years: how tenure changes your EMI",
      body: "For ₹8,00,000 at 9.5%: a 3-year loan costs about ₹25,626 a month with ₹1,22,549 total interest; a 5-year loan costs about ₹16,801 a month with ₹2,08,089 interest; a 7-year loan drops the EMI to about ₹13,075 but the interest rises to ₹2,98,316. A shorter tenure means a higher EMI but far less interest, so pick the shortest tenure whose EMI you can comfortably pay.",
    },
    {
      heading: "What car loan interest rate to enter",
      body: "Use the exact rate in your sanction letter or the lender's quote. New-car loan rates vary by lender, your credit score, the car model and the tenure, and they change often, so compare a few quotes. Also ask about processing fees and foreclosure charges: they don't change the EMI, but they change the true cost of the loan.",
    },
    {
      heading: "New car or used car?",
      body: "This page is set up for new cars. Used car loans usually come with higher interest rates, shorter tenures and a lower loan-to-value ratio. For a second-hand car, use the Used Car Loan EMI Calculator, which starts with typical used-car settings.",
    },
    {
      heading: "Private by design",
      body: "Everything is calculated in your browser. Your loan amount, rate and tenure are never sent to a server, and you don't need to share a phone number or sign up to see the result.",
    },
  ],
  examples: [
    {
      title: "₹8 lakh car loan for 5 years",
      input: "₹8,00,000 at 9.5% for 5 years",
      output: "EMI ≈ ₹16,801 · Total interest ≈ ₹2,08,089",
    },
    {
      title: "Same loan over 3 years",
      input: "₹8,00,000 at 9.5% for 3 years",
      output: "EMI ≈ ₹25,626 · Total interest ≈ ₹1,22,549",
    },
    {
      title: "₹10 lakh SUV loan for 5 years",
      input: "₹10,00,000 at 9.5% for 5 years",
      output: "EMI ≈ ₹21,002 · Total interest ≈ ₹2,60,112",
    },
  ],
  primaryKeyword: "car emi calculator",
  keywords: [
    "car emi calculator india",
    "car loan emi calculator",
    "new car emi calculator",
    "car emi calculation",
    "car loan calculator india",
    "vehicle emi calculator",
    "car emi interest rate",
    "auto loan emi calculator",
  ],
  searchAliases: [
    "car emi",
    "car loan emi",
    "auto loan emi",
    "vehicle loan emi",
    "monthly car installment",
  ],
  searchWeight: 96,

  relatedTools: [
    "used-car-loan-emi-calculator",
    "emi-calculator",
    "personal-loan-emi-calculator",
    "interest-calculator",
  ],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-12",
  lastUpdated: "2026-11-11",

  schemaType: "Calculator",
  icon: "trending-up",
  faq: [
    {
      question: "How do I calculate car loan EMI?",
      answer:
        "Use EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), where P is the loan amount, r is the monthly interest rate (annual rate ÷ 12 ÷ 100) and n is the number of months. This calculator does it instantly and also shows total interest and the full repayment schedule.",
    },
    {
      question: "What is the EMI for an ₹8 lakh car loan?",
      answer:
        "At 9.5% interest, an ₹8,00,000 car loan costs about ₹16,801 a month over 5 years, ₹25,626 a month over 3 years, or ₹13,075 a month over 7 years. Change the rate or tenure above to see your own figure.",
    },
    {
      question: "Should I enter the ex-showroom or on-road price?",
      answer:
        "Neither. Enter the amount you will borrow: the on-road price minus your down payment. If the on-road price is ₹10 lakh and you pay ₹2 lakh upfront, enter ₹8 lakh.",
    },
    {
      question: "What is the best tenure for a car loan?",
      answer:
        "Most buyers choose 3 to 5 years. A shorter tenure has a higher EMI but much lower total interest. On ₹8 lakh at 9.5%, a 3-year loan costs about ₹85,500 less in interest than a 5-year loan.",
    },
    {
      question: "Can I use this for a used car loan?",
      answer:
        "Yes, the formula is the same, but used car loans usually have higher rates and shorter tenures. The Used Car Loan EMI Calculator starts with typical used-car settings.",
    },
    {
      question: "Is my data uploaded or stored?",
      answer:
        "No. The calculation runs entirely in your browser. Nothing you enter is sent to a server.",
    },
  ],
  howTo: [
    {
      title: "Enter the loan amount",
      description: "On-road price minus your down payment, for example 800000 for an ₹8,00,000 loan.",
    },
    {
      title: "Enter the interest rate",
      description: "Use the annual rate your bank or NBFC quoted, for example 9.5%.",
    },
    {
      title: "Choose the tenure",
      description: "Pick 3 to 7 years. Try more than one tenure to compare.",
    },
    {
      title: "Read your EMI and interest",
      description: "See the monthly EMI, total interest, total payable and the month-by-month schedule.",
    },
  ],

  engine: "calculator",
  privacyNote: "none",
  preset: { defaultPrincipal: 1000000, defaultAnnualRate: 9.5, defaultTenureYears: 5 },
}
