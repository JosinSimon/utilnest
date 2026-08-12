import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "income-tax-calculator",
  name: "Income Tax Calculator",
  slug: "income-tax-calculator",
  category: "finance",
  path: "finance/income-tax-calculator",

  shortDescription:
    "Estimate FY 2026-27 income tax under new and old regimes — slabs, rebate, surcharge, marginal relief and cess. Free and private.",
  longDescription:
    "Our free income tax calculator estimates your tax liability for FY 2026-27 (AY 2027-28). Enter your annual gross income, choose between the new and old tax regimes, and optionally add your old-regime deductions (80C, 80D, HRA, home loan interest) to instantly see your taxable income, income tax, §87A rebate, surcharge (from ₹50 lakh), marginal relief, 4% cess and the final tax payable. The calculator uses the slabs announced in Budget 2025 and unchanged by Budget 2026, with surcharge capped at 25% under the new regime. No sign-up, no uploads — everything runs on your device.",
  sections: [
    {
      heading: "New vs old tax regime",
      body: "The new tax regime (the default) offers lower rates and a ₹60,000 §87A rebate that makes income up to ₹12 lakh tax-free, but allows almost no deductions. The old regime has higher rates but lets you claim deductions for investments, insurance, HRA and home loan interest, with a ₹12,500 rebate that makes income up to ₹5 lakh tax-free. Which is cheaper depends on how many deductions you claim. The calculator compares both side by side for the same income.",
    },
    {
      heading: "Surcharge & marginal relief",
      body: "On incomes above ₹50 lakh a surcharge applies on top of the slab tax relative to total income — 10% to ₹1 crore, 15% to ₹2 crore, 25% to ₹5 crore and up to 37% above that (capped at 25% in the new regime). Marginal relief ensures that where income only slightly crosses a threshold, the surcharge never creates a sudden jump beyond the extra income. The calculator applies and displays both.",
    },
    {
      heading: "Standard deduction and old-regime deductions",
      body: "The calculator applies the standard deduction automatically in both regimes — ₹75,000 in the new regime and ₹50,000 in the old. Under the old regime you can additionally enter 80C, 80D, HRA and home-loan-interest deductions, which lower your taxable income before the slabs are applied. These fields only affect the old regime, matching actual rules.",
    },
    {
      heading: "Built for salaried employees",
      body: "Enter your annual gross salary (including allowances that are fully taxable) and the calculator returns the full pipeline: taxable income, slab-by-slab tax, §87A rebate, surcharge with marginal relief, 4% health and education cess and the final tax payable — for planning purposes only, not as a substitute for professional advice or official filing guidance.",
    },
    {
      heading: "Why use our tax calculator?",
      body: "It computes the full tax pipeline in one place — standard deduction, slab-by-slab tax, rebate, surcharge, marginal relief, cess and effective rate — for either regime, so you can compare both and plan your deductions before filing. Everything runs in your browser; no income data leaves your device.",
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

  primaryKeyword: "income tax calculator fy 2026-27",
  keywords: [
    "income tax calculator 2026",
    "income tax calculator india",
    "new tax regime calculator",
    "old tax regime calculator",
    "old vs new regime calculator",
    "salary income tax calculator",
    "income tax slabs fy 2026-27",
  ],
  searchAliases: [
    "income tax",
    "tax calculator",
    "new regime",
    "old regime",
    "salary tax",
    "tax slabs 2026",
    "tax filing estimate",
  ],
  searchWeight: 100,

  relatedTools: ["hra-calculator", "gratuity-calculator", "gst-calculator", "fd-calculator", "sip-calculator"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-06",
  lastUpdated: "2026-08-06",

  schemaType: "Calculator",
  icon: "file-signature",
  faq: [
    {
      question: "Which financial year does this income tax calculator support?",
      answer:
        "FY 2026-27 (AY 2027-28), with the slabs announced in Budget 2025 and kept unchanged by Budget 2026. The engine is data-driven, so the financial year is explicit in every result.",
    },
    {
      question: "Does it compare old and new tax regimes?",
      answer:
        "Yes. Enter your income and add any old-regime deductions, then switch between the regimes to see taxable income, tax, rebate, surcharge, marginal relief, cess and total tax for both, side by side.",
    },
    {
      question: "Does it include standard deduction?",
      answer:
        "Yes, automatically: ₹75,000 under the new regime and ₹50,000 under the old regime are deducted before slabs are applied, matching the rules for salaried taxpayers.",
    },
    {
      question: "Does the calculator include surcharge?",
      answer:
        "Yes. Surcharge applies from income above ₹50 lakh: 10% up to ₹1 crore, 15% up to ₹2 crore, 25% up to ₹5 crore and 37% above ₹5 crore in the old regime — capped at 25% in the new regime. Marginal relief is applied automatically so the surcharge never causes a jump larger than the extra income, and the 4% health and education cess is added on the combined tax and surcharge.",
    },
    {
      question: "Can salaried employees use it?",
      answer:
        "Yes. The calculator is built for salary income: it applies the standard deduction automatically, lets old-regime users add 80C, 80D, HRA and home loan deductions, and returns the full tax pipeline for FY 2026-27. Estimates are for planning — verify before filing.",
    },
    {
      question: "Is my income data stored?",
      answer:
        "No. The calculation runs entirely in your browser and no income, deduction or regime data is uploaded or stored anywhere.",
    },
    {
      question: "Is this a substitute for professional tax advice?",
      answer:
        "No. This is a planning and comparison aid that estimates tax from the figures you enter. Use it to compare regimes and plan deductions, but verify the final numbers with the official rules or a tax professional before filing.",
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
