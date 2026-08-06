import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "fd-calculator",
  name: "FD Calculator",
  slug: "fd-calculator",
  category: "finance",
  path: "finance/fd-calculator",

  shortDescription:
    "Calculate your Fixed Deposit maturity value and interest earnings with quarterly compounding. Free, instant and 100% private — runs in your browser.",
  longDescription:
    "Our free FD calculator tells you exactly how much your fixed deposit will grow. Enter the deposit amount, annual interest rate and tenure (in years and months) to instantly see the maturity value and the total interest you will earn. It uses quarterly compounding, the standard convention for most Indian banks and non-banking finance companies. No sign-up, no uploads — everything runs on your device.",
  sections: [
    {
      heading: "What is a Fixed Deposit?",
      body: "A Fixed Deposit (FD) is a bank investment where you lock in a lump sum for a fixed tenure at a guaranteed interest rate. Interest is usually compounded quarterly and credited at maturity or at regular intervals, making FDs one of the most predictable savings instruments.",
    },
    {
      heading: "Why use our FD calculator?",
      body: "It shows the full effect of quarterly compounding on your savings, separating your deposit from the interest earned. Compare tenures and rates live to find the best combination for your goal.",
    },
  ],

  examples: [
    {
      title: "Standard deposit",
      input: "₹5,00,000 at 7% for 5 years",
      output: "Maturity ≈ ₹7,08,000 · Interest ≈ ₹2,08,000",
    },
    {
      title: "Short tenure",
      input: "₹1,00,000 at 6.5% for 1 year",
      output: "Maturity ≈ ₹1,06,700 · Interest ≈ ₹6,700",
    },
  ],

  primaryKeyword: "fd calculator",
  keywords: [
    "fixed deposit calculator",
    "fd maturity calculator",
    "fixed deposit interest calculator",
    "bank fd calculator",
    "fd return calculator",
    "fd calculator india",
  ],
  searchAliases: ["fd", "fixed deposit", "fd maturity", "deposit calculator"],
  searchWeight: 85,

  relatedTools: ["sip-calculator", "rd-calculator", "interest-calculator"],
  featured: true,
  trending: false,
  popular: true,
  addedAt: "2026-08-06",
  lastUpdated: "2026-08-06",

  schemaType: "Calculator",
  icon: "landmark",
  faq: [
    {
      question: "How is FD interest compounded?",
      answer:
        "Most banks compound FD interest quarterly. The calculator applies the formula Maturity = Principal × (1 + annual rate ÷ 4)^(tenure in years × 4) so your growth matches bank practice.",
    },
    {
      question: "Is the FD rate guaranteed?",
      answer:
        "Yes — unlike market investments, the interest rate on a fixed deposit is fixed at the time of booking for the full tenure. The calculator reflects that fixed rate.",
    },
    {
      question: "Does this include tax deducted at source (TDS)?",
      answer:
        "No. Banks deduct TDS on FD interest above certain thresholds under Indian tax rules; that deduction is separate and not shown here.",
    },
  ],
  howTo: [
    {
      title: "Enter the deposit amount",
      description: "Type the lump sum you want to deposit.",
    },
    {
      title: "Set the interest rate",
      description: "Enter the annual rate your bank offers.",
    },
    {
      title: "Choose the tenure",
      description: "Enter the period in years and any extra months.",
    },
    {
      title: "Read the maturity value",
      description: "See the maturity value and total interest earned instantly.",
    },
  ],

  engine: "calculator",
  privacyNote: "none",
}
