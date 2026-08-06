import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "income-tax-calculator",
  name: "Income Tax Calculator",
  slug: "income-tax-calculator",
  category: "finance",
  path: "finance/income-tax-calculator",

  shortDescription:
    "Estimate your FY 2026-27 income tax under both the new and old regimes — with standard deduction, §87A rebate and 4% cess. Free and 100% private.",
  longDescription:
    "Our free income tax calculator estimates your tax liability for FY 2026-27 (AY 2027-28). Enter your annual gross income, choose between the new and old tax regimes, and optionally add your old-regime deductions (80C, 80D, HRA, home loan interest) to instantly see your taxable income, tax before rebate, §87A rebate, 4% cess and the final tax payable. The calculator uses the slabs announced in Budget 2025 and unchanged by Budget 2026. No sign-up, no uploads — everything runs on your device.",
  sections: [
    {
      heading: "New vs old tax regime",
      body: "The new tax regime (the default) offers lower rates and a ₹60,000 §87A rebate that makes income up to ₹12 lakh tax-free, but allows almost no deductions. The old regime has higher rates but lets you claim deductions for investments, insurance, HRA and home loan interest, with a ₹12,500 rebate that makes income up to ₹5 lakh tax-free. Which is cheaper depends on how many deductions you claim.",
    },
    {
      heading: "Why use our tax calculator?",
      body: "It computes the full tax pipeline in one place — standard deduction, slab-by-slab tax, rebate, cess and effective rate — for either regime, so you can compare both and plan your deductions before filing.",
    },
  ],

  examples: [
    {
      title: "New regime, zero tax",
      input: "₹12,00,000 salary, new regime",
      output: "Tax ₹0 (rebate of ₹60,000)",
    },
    {
      title: "Above the rebate limit",
      input: "₹15,00,000 salary, new regime",
      output: "Taxable ₹14,25,000 · Tax + cess ≈ ₹97,500",
    },
    {
      title: "Old regime with deductions",
      input: "₹15,00,000 salary, old regime, ₹2,00,000 deductions",
      output: "Taxable ₹12,50,000 · Tax + cess ≈ ₹1,95,000",
    },
  ],

  primaryKeyword: "income tax calculator",
  keywords: [
    "income tax calculator 2026",
    "income tax calculator india",
    "new tax regime calculator",
    "old tax regime calculator",
    "tax calculator fy 2026-27",
    "salary tax calculator",
  ],
  searchAliases: ["income tax", "tax calculator", "new regime", "old regime", "salary tax"],
  searchWeight: 100,

  relatedTools: ["hra-calculator", "gratuity-calculator"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-06",
  lastUpdated: "2026-08-06",

  schemaType: "Calculator",
  icon: "file-signature",
  faq: [
    {
      question: "What are the income tax slabs for FY 2026-27?",
      answer:
        "New regime: 0% up to ₹4L, 5% to ₹8L, 10% to ₹12L, 15% to ₹16L, 20% to ₹20L, 25% to ₹24L and 30% above ₹24L. Old regime: 0% up to ₹2.5L, 5% to ₹5L, 20% to ₹10L and 30% above ₹10L. Budget 2026 kept these unchanged.",
    },
    {
      question: "Is income up to ₹12 lakh tax-free?",
      answer:
        "Under the new regime, yes for a salaried individual: the ₹75,000 standard deduction plus the ₹60,000 §87A rebate means gross salary up to ₹12.75 lakh can be entirely tax-free. The rebate is not available on special-rate incomes like capital gains.",
    },
    {
      question: "Does the calculator include surcharge?",
      answer:
        "No. Surcharge applies only to very high incomes (above ₹50 lakh) and is not modeled here. The 4% health and education cess, which applies to everyone, is included.",
    },
  ],
  howTo: [
    {
      title: "Enter your annual income",
      description: "Type your total gross income for the financial year.",
    },
    {
      title: "Pick a tax regime",
      description: "Compare the new and old regimes to see which suits your deductions.",
    },
    {
      title: "Add deductions (old regime only)",
      description: "Enter your 80C/80D/HRA/home loan deductions to lower taxable income.",
    },
    {
      title: "Read your tax estimate",
      description: "See taxable income, tax, rebate, cess and the final amount payable.",
    },
  ],

  engine: "calculator",
  privacyNote: "none",
}
