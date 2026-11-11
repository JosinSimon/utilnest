import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "home-loan-eligibility-calculator",
  name: "Home Loan Eligibility Calculator",
  slug: "home-loan-eligibility-calculator",
  category: "finance",
  path: "finance/home-loan-eligibility-calculator",

  shortDescription:
    "How much home loan can I get? Check eligibility from your salary, existing EMIs and co-applicant income, with RBI loan-to-value limits. Free, instant.",
  longDescription:
    "Find out roughly how much home loan you can get before you apply. Enter your take-home income, any EMIs you already pay, a co-applicant's income if you have one, and the rate and tenure. The calculator works out the largest EMI lenders usually allow, the loan that EMI can repay, and, if you add the property cost, the RBI loan-to-value limit and the down payment you'll need.",
  sections: [
    {
      heading: "How lenders decide your home loan amount",
      body: "Lenders first check how much of your income can go to EMIs. This is called FOIR (fixed obligation to income ratio). If your take-home pay is ₹1,00,000 and the lender allows 50%, all your EMIs together can be up to ₹50,000. Subtract EMIs you already pay, such as a ₹10,000 car loan, and you can take a home loan EMI of up to ₹40,000. At 8.5% for 20 years, that EMI repays a loan of about ₹46,09,234.",
    },
    {
      heading: "What FOIR to use",
      body: "FOIR varies by lender and by income. Many lenders allow around 40% to 60%, with higher limits for higher incomes. The calculator starts at 50%. Use the figure your bank quotes if you have one, and try a lower value for a conservative estimate.",
    },
    {
      heading: "The RBI loan-to-value limit",
      body: "Even with high income, banks can only lend part of the property's cost. RBI caps the loan-to-value (LTV) ratio for individual home loans at 90% for loans up to ₹30 lakh, 80% for loans above ₹30 lakh up to ₹75 lakh, and 75% for loans above ₹75 lakh. Lenders usually exclude stamp duty and registration charges from the property cost for this. Enter the property cost to see both limits and the down payment you'll need.",
    },
    {
      heading: "How tenure changes your eligibility",
      body: "A longer tenure lets the same EMI repay a bigger loan. With a ₹50,000 EMI at 8.5%, you can borrow about ₹50,77,485 over 15 years, ₹57,61,542 over 20 years, ₹62,09,428 over 25 years and ₹65,02,682 over 30 years. Lenders usually also want the loan to end by around retirement age, so older applicants may get a shorter tenure.",
    },
    {
      heading: "Ways to increase your eligibility",
      body: "Add a co-applicant with income, such as a spouse or parent. Close or prepay small loans to free up EMI room. Choose a longer tenure. Keep your credit score high, since it affects approval and the rate you're offered. A lower rate also raises the loan a given EMI can repay.",
    },
    {
      heading: "This is an estimate",
      body: "Banks also look at your age, job type and stability, credit history and the property's legal and technical checks, so the final sanction can differ. Use this calculator to plan your budget and compare lenders. It runs in your browser and does not store anything you enter.",
    },
  ],
  examples: [
    {
      title: "Salaried, with a car loan",
      input: "₹1,00,000 take-home · ₹10,000 existing EMI · 8.5% · 20 years · FOIR 50%",
      output: "Max EMI ₹40,000 · eligible loan ≈ ₹46,09,234",
    },
    {
      title: "With a co-applicant",
      input: "₹60,000 + ₹40,000 co-applicant · no EMIs · 8.5% · 20 years · FOIR 50%",
      output: "Max EMI ₹50,000 · eligible loan ≈ ₹57,61,542",
    },
    {
      title: "Limited by property cost",
      input: "Same as first example, property cost ₹50,00,000",
      output: "RBI LTV cap 80% → loan ₹40,00,000 · down payment ₹10,00,000",
    },
  ],
  primaryKeyword: "home loan eligibility calculator",
  keywords: [
    "home loan eligibility calculator india",
    "how much home loan can i get",
    "home loan eligibility based on salary",
    "home loan eligibility and emi calculator",
    "housing loan eligibility calculator",
    "home loan eligibility with co-applicant",
    "foir calculator",
  ],
  searchAliases: ["loan eligibility", "home loan eligibility", "how much loan can i get", "housing loan eligibility"],
  searchWeight: 87,
  relatedTools: ["home-loan-emi-calculator", "home-loan-prepayment-calculator", "emi-calculator", "income-tax-calculator"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-11-11",
  lastUpdated: "2026-11-11",
  schemaType: "Calculator",
  icon: "trending-up",
  faq: [
    {
      question: "How much home loan can I get on my salary?",
      answer:
        "Roughly, multiply your take-home pay by the FOIR your lender allows (often around 50%), subtract your existing EMIs, and find the loan that EMI can repay. With ₹1,00,000 take-home, no other EMIs, 8.5% and 20 years, that's about ₹57.6 lakh.",
    },
    {
      question: "What is FOIR in a home loan?",
      answer:
        "FOIR (fixed obligation to income ratio) is the share of your monthly income lenders let you spend on all EMIs together. Many lenders allow around 40% to 60%.",
    },
    {
      question: "How much down payment is needed for a home loan?",
      answer:
        "At least 10% for loans up to ₹30 lakh, 20% for loans above ₹30 lakh up to ₹75 lakh, and 25% above ₹75 lakh, because of RBI loan-to-value limits. Stamp duty and registration are usually extra.",
    },
    {
      question: "Does adding a co-applicant increase eligibility?",
      answer:
        "Yes. Lenders usually add the co-applicant's income, which raises the EMI you can afford and so the loan amount.",
    },
    {
      question: "Do existing EMIs reduce home loan eligibility?",
      answer:
        "Yes. Every rupee of current EMIs reduces the home loan EMI you can take. Closing a small loan before applying can raise your eligibility.",
    },
    {
      question: "Is this the amount the bank will sanction?",
      answer:
        "It's an estimate. The bank also checks your credit score, age, job and the property, so the final amount can differ.",
    },
  ],
  howTo: [
    { title: "Enter your income", description: "Your take-home monthly pay, plus a co-applicant's if any." },
    { title: "Add existing EMIs", description: "Total of car, personal and other loan EMIs you pay now." },
    { title: "Set rate, tenure and FOIR", description: "Use your lender's quoted rate; 50% FOIR is a common starting point." },
    { title: "Add the property cost", description: "Optional: see the RBI loan-to-value limit and your down payment." },
  ],
  engine: "calculator",
  privacyNote: "none",
  preset: { defaultAnnualRate: 8.5, defaultTenureYears: 20 },
}
