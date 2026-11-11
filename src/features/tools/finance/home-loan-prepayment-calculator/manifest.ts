import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "home-loan-prepayment-calculator",
  name: "Home Loan Prepayment Calculator",
  slug: "home-loan-prepayment-calculator",
  category: "finance",
  path: "finance/home-loan-prepayment-calculator",

  shortDescription:
    "See how much interest a home loan prepayment saves. Add a lump sum, yearly or monthly part-payment and compare reducing tenure vs reducing EMI.",
  longDescription:
    "Planning to pay extra on your home loan from a bonus, an FD maturity or a monthly surplus? Enter your loan, then add a one-time prepayment, a yearly prepayment, an extra amount every month, or all three. The calculator runs your loan month by month and shows the interest you save, how many years earlier the loan ends, or how much lower your EMI becomes.",
  sections: [
    {
      heading: "How prepayment saves interest",
      body: "Home loan interest is charged every month on the outstanding balance. A prepayment goes straight to the principal, so every later month is charged interest on a smaller balance. That is why prepaying early in the loan saves the most: on a ₹50 lakh loan at 8.5% for 20 years, a single ₹5 lakh prepayment after year 3 saves about ₹13,19,639 in interest and ends the loan 3 years 5 months early.",
    },
    {
      heading: "Reduce tenure or reduce EMI?",
      body: "After a prepayment, lenders usually let you either keep the EMI and shorten the loan, or keep the end date and lower the EMI. Reducing the tenure saves far more interest. In the same example, reducing the EMI instead lowers it from ₹43,391 to ₹38,750 but saves only about ₹4,46,858. Choose a lower EMI only if you need the monthly cash flow; otherwise keep the EMI and finish early.",
    },
    {
      heading: "Lump sum, yearly or monthly: which works best?",
      body: "Small regular prepayments add up. On the ₹50 lakh example, paying ₹1 lakh extra every year saves about ₹18,55,389 and clears the loan in 14 years instead of 20. Paying ₹5,000 extra every month saves about ₹13,89,250 and ends the loan 4 years 5 months early. Use the fields above to test what fits your budget, including a mix of all three.",
    },
    {
      heading: "Prepayment charges",
      body: "Under RBI rules, banks and housing finance companies cannot charge a prepayment or foreclosure penalty on floating-rate home loans taken by individuals. Fixed-rate loans may carry a charge, and some lenders set a minimum part-payment amount or limit how often you can prepay. Check your loan agreement before you pay.",
    },
    {
      heading: "Prepay, or invest the money?",
      body: "Prepaying gives a guaranteed, tax-free return equal to your loan rate. Investing might earn more but carries risk. Also keep an emergency fund before prepaying. If you claim the home loan interest deduction under the old tax regime (Section 24(b), up to ₹2 lakh a year for a self-occupied home), lower interest also means a smaller deduction, which slightly reduces the benefit.",
    },
    {
      heading: "How this calculator works",
      body: "It uses the standard reducing-balance EMI formula, then applies each prepayment after the EMI of the month it falls in. In reduce-EMI mode it recalculates the EMI on the remaining balance over the remaining months after every prepayment. Lenders may apply part-payments on slightly different dates, so treat the result as a close estimate. Everything runs in your browser.",
    },
  ],
  examples: [
    {
      title: "₹5 lakh one-time prepayment",
      input: "₹50,00,000 at 8.5% for 20 years · ₹5,00,000 after year 3 · reduce tenure",
      output: "Interest saved ≈ ₹13,19,639 · loan ends 3 years 5 months early",
    },
    {
      title: "Same prepayment, reduce EMI",
      input: "₹50,00,000 at 8.5% for 20 years · ₹5,00,000 after year 3 · reduce EMI",
      output: "EMI drops from ₹43,391 to ₹38,750 · interest saved ≈ ₹4,46,858",
    },
    {
      title: "₹1 lakh every year",
      input: "₹50,00,000 at 8.5% for 20 years · ₹1,00,000 every year",
      output: "Interest saved ≈ ₹18,55,389 · loan closes in 14 years",
    },
  ],
  primaryKeyword: "home loan prepayment calculator",
  keywords: [
    "home loan emi calculator with prepayment",
    "home loan part payment calculator",
    "home loan prepayment calculator india",
    "prepayment calculator",
    "home loan foreclosure calculator",
    "reduce emi or tenure calculator",
    "home loan extra payment calculator",
  ],
  searchAliases: ["part payment calculator", "loan prepayment", "prepay home loan", "home loan foreclosure"],
  searchWeight: 88,
  relatedTools: ["home-loan-emi-calculator", "home-loan-eligibility-calculator", "emi-calculator", "income-tax-calculator"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-11-11",
  lastUpdated: "2026-11-11",
  schemaType: "Calculator",
  icon: "trending-up",
  faq: [
    {
      question: "How much interest does a home loan prepayment save?",
      answer:
        "It depends on the amount, the timing and your rate. On a ₹50 lakh loan at 8.5% for 20 years, a ₹5 lakh prepayment after year 3 saves about ₹13.2 lakh in interest if you keep the same EMI. Enter your own numbers above.",
    },
    {
      question: "Is it better to reduce EMI or tenure after prepayment?",
      answer:
        "Reducing tenure saves much more interest, because the loan ends sooner. Reduce the EMI only if you need lower monthly payments.",
    },
    {
      question: "Is there a penalty for prepaying a home loan?",
      answer:
        "RBI does not allow prepayment or foreclosure penalties on floating-rate home loans taken by individuals. Fixed-rate loans may have a charge, so check your loan agreement.",
    },
    {
      question: "When is the best time to prepay?",
      answer:
        "As early as possible. In the early years most of each EMI is interest, so reducing the balance then saves the most.",
    },
    {
      question: "Can I make small prepayments every month?",
      answer:
        "Many lenders accept it, though some set a minimum part-payment amount. Use the 'Extra every month' field to see the effect: ₹5,000 a month on a ₹50 lakh loan at 8.5% ends it about 4 years 5 months early.",
    },
    {
      question: "Is my data stored?",
      answer: "No. The calculation runs in your browser and nothing you enter is uploaded.",
    },
  ],
  howTo: [
    { title: "Enter your loan", description: "Outstanding amount, interest rate and remaining tenure." },
    { title: "Add prepayments", description: "A one-time amount and its year, a yearly amount, an extra monthly amount, or any mix." },
    { title: "Choose a strategy", description: "Reduce tenure (same EMI) or reduce EMI (same end date)." },
    { title: "Compare the savings", description: "Read the interest saved, the new loan length or the new EMI." },
  ],
  engine: "calculator",
  privacyNote: "none",
  preset: { defaultPrincipal: 5000000, defaultAnnualRate: 8.5, defaultTenureYears: 20 },
}
