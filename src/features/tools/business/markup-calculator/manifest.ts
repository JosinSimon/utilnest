import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "markup-calculator",
  name: "Markup Calculator",
  slug: "markup-calculator",
  category: "business",
  path: "business/markup-calculator",
  shortDescription: "Calculate selling price from cost and markup, or find markup from prices.",
  longDescription: "Easily calculate your ideal selling price based on your target markup percentage, or work backwards to find the markup percentage you're currently applying to your cost price.",
  sections: [
    {
      heading: "Markup vs Margin",
      body: "Markup = profit ÷ cost price. Margin = profit ÷ selling price. For the exact same profit amount, you will have different percentages because the denominator changes."
    }
  ],
  examples: [
    {
      title: "Target 25% Markup",
      input: "Cost: ₹800, Markup: 25%",
      output: "Selling Price: ₹1,000, Margin: 20%"
    }
  ],
  primaryKeyword: "markup calculator",
  keywords: ["markup percentage calculator", "cost plus markup", "selling price calculator", "markup vs margin"],
  searchAliases: ["markup", "cost plus", "pricing"],
  searchWeight: 75,
  relatedTools: ["profit-margin-calculator", "discount-calculator", "break-even-calculator"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-08-10",
  schemaType: "Calculator",
  icon: "percent",
  faq: [
    {
      question: "What is markup?",
      answer: "Markup = (selling price − cost) / cost × 100. It tells you how much above cost you're selling."
    },
    {
      question: "25% markup on ₹800 cost?",
      answer: "Selling price = ₹800 × 1.25 = ₹1,000. Margin is 20% (₹200/₹1,000)."
    },
    {
      question: "Why is markup always higher than margin?",
      answer: "For the same profit, cost < selling price, so dividing by cost always gives a larger percentage."
    }
  ],
  howTo: [
    { title: "Step 1", description: "Choose mode" },
    { title: "Step 2", description: "Enter cost price" },
    { title: "Step 3", description: "Enter markup% or selling price" },
    { title: "Step 4", description: "See results" }
  ],
  engine: "calculator",
  privacyNote: "none"
}
