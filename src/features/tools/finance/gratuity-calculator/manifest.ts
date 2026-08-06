import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "gratuity-calculator",
  name: "Gratuity Calculator",
  slug: "gratuity-calculator",
  category: "finance",
  path: "finance/gratuity-calculator",

  shortDescription:
    "Calculate the gratuity you receive on leaving your job — last basic + DA × 15/26 per completed year, capped at ₹20 lakh. Free and 100% private.",
  longDescription:
    "Our free gratuity calculator tells you the gratuity amount due on leaving a job after 5+ years of service. Enter your last drawn basic salary and DA, plus your years (and extra months) of service, to instantly see the gratuity using the Payment of Gratuity Act formula: 15 days' salary for each completed year of service, capped at ₹20,00,000. No sign-up, no uploads — everything runs on your device.",
  sections: [
    {
      heading: "What is gratuity?",
      body: "Gratuity is a lump-sum payment an employer gives an employee as a reward for long service, typically payable on resignation or retirement after completing at least five years with the same employer. It is governed by the Payment of Gratuity Act, 1972.",
    },
    {
      heading: "Why use our gratuity calculator?",
      body: "It applies the exact Act formula — 15/26 of your last drawn (basic + DA) salary for each completed year of service — and applies the ₹20 lakh statutory cap automatically, so you know precisely what to expect.",
    },
  ],

  examples: [
    {
      title: "Standard case",
      input: "Basic ₹50,000, no DA, 10 years of service",
      output: "Gratuity ≈ ₹2,88,462",
    },
    {
      title: "Above the cap",
      input: "Basic ₹3,00,000, 30 years of service",
      output: "Gratuity capped at ₹20,00,000",
    },
  ],

  primaryKeyword: "gratuity calculator",
  keywords: [
    "gratuity calculator india",
    "gratuity amount calculator",
    "gratuity formula",
    "payment of gratuity act calculator",
  ],
  searchAliases: ["gratuity", "gratuity amount", "gratuity act"],
  searchWeight: 75,

  relatedTools: ["income-tax-calculator", "hra-calculator"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-06",
  lastUpdated: "2026-08-06",

  schemaType: "Calculator",
  icon: "gift",
  faq: [
    {
      question: "Who is eligible for gratuity?",
      answer:
        "Employees covered under the Payment of Gratuity Act, 1972 who have completed five or more continuous years of service. For non-covered employees, gratuity may still be paid per the Act formula but is fully taxable.",
    },
    {
      question: "How is gratuity calculated?",
      answer:
        "The formula is: Last drawn (basic + DA) × 15 ÷ 26 × completed years of service. 'Completed' means full years, and under the Act the days or months are not proportioned.",
    },
    {
      question: "Is gratuity taxable?",
      answer:
        "Gratuity received by an employee covered under the Act is tax-exempt up to ₹20 lakh. The excess and gratuity paid to non-covered employees are taxable.",
    },
  ],
  howTo: [
    {
      title: "Enter your last salary",
      description: "Type your last drawn basic salary and any DA.",
    },
    {
      title: "Enter your service years",
      description: "Give your completed years and extra months of service.",
    },
    {
      title: "Read the gratuity amount",
      description: "See the computed gratuity and note whether the cap applies.",
    },
  ],

  engine: "calculator",
  privacyNote: "none",
}