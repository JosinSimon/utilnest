import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "sip-calculator",
  name: "SIP Calculator",
  slug: "sip-calculator",
  category: "finance",
  path: "finance/sip-calculator",

  shortDescription:
    "Calculate the maturity value of your monthly SIP investments. See total invested vs estimated gains at any return rate. Free and 100% in-browser.",
  longDescription:
    "Our free SIP calculator projects how much your monthly mutual fund investments will be worth at maturity. Enter your monthly investment, expected annual return and the investment period (in years and months) to instantly see the maturity value, the total amount invested and the estimated gain. It assumes monthly contributions at the start of each month, matching how most fund houses execute SIPs. No sign-up, no uploads — everything runs on your device.",
  sections: [
    {
      heading: "What is a SIP?",
      body: "A SIP (Systematic Investment Plan) is a way of investing a fixed amount in a mutual fund every month. Because you invest regularly, you average out your purchase price over time — this is called rupee cost averaging. A SIP calculator shows the compounding effect of that disciplined monthly investing.",
    },
    {
      heading: "Why use our SIP calculator?",
      body: "It separates how much you actually invest from how much your money grows, so you can see the true power of compounding at a glance. Adjust the monthly amount, rate and duration live and watch the maturity value update instantly.",
    },
  ],

  examples: [
    {
      title: "Long-term wealth building",
      input: "₹10,000/month at 12% for 10 years",
      output: "Invested ₹12,00,000 · Maturity ≈ ₹23,23,000",
    },
    {
      title: "Aggressive growth",
      input: "₹25,000/month at 15% for 20 years",
      output: "Invested ₹60,00,000 · Maturity ≈ ₹3,52,90,000",
    },
  ],

  primaryKeyword: "sip calculator",
  keywords: [
    "sip calculator online",
    "monthly sip calculator",
    "sip return calculator",
    "sip maturity calculator",
    "mutual fund sip calculator",
    "sip calculator india",
  ],
  searchAliases: ["sip", "mutual fund calculator", "monthly investment calculator"],
  searchWeight: 90,

  relatedTools: [],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-06",
  lastUpdated: "2026-08-06",

  schemaType: "Calculator",
  icon: "trending-up",
  faq: [
    {
      question: "Is this an accurate prediction of my mutual fund returns?",
      answer:
        "No. Mutual fund returns are market-linked and never guaranteed. The calculator projects future value assuming a constant annual return so you can compare scenarios — actual returns will differ.",
    },
    {
      question: "What is rupee cost averaging?",
      answer:
        "By investing a fixed amount every month you buy more units when prices are low and fewer when they are high, smoothing out the average cost of your investment over time.",
    },
    {
      question: "Does the calculator include fund expenses or taxes?",
      answer:
        "No. It models the gross investment growth only. Fund expense ratios and capital gains tax are separate and are not deducted here.",
    },
  ],
  howTo: [
    {
      title: "Enter your monthly investment",
      description: "Type the fixed amount you invest each month.",
    },
    {
      title: "Set the expected annual return",
      description: "Use a conservative estimate (8–12%) or a historic market rate to compare scenarios.",
    },
    {
      title: "Choose the investment duration",
      description: "Enter the period in years and any extra months.",
    },
    {
      title: "Read your projected maturity value",
      description: "See total invested, estimated gain and maturity value instantly.",
    },
  ],

  engine: "calculator",
  privacyNote: "none",
}
