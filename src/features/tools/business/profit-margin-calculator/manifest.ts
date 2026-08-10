import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "profit-margin-calculator",
  name: "Profit Margin Calculator",
  slug: "profit-margin-calculator",
  category: "business",
  path: "business/profit-margin-calculator",
  shortDescription: "Calculate profit, margin%, and markup% instantly from cost and selling price.",
  longDescription: "Easily determine your profit amount, gross margin percentage, and markup percentage. Just enter your cost price and selling price, and we'll calculate the rest instantly.",
  sections: [
    {
      heading: "Understanding Margin vs. Markup",
      body: "Margin and markup are two ways to look at profit. Margin is your profit divided by the selling price, while markup is profit divided by the cost price. For the exact same profit, your markup percentage will always be higher than your margin percentage because cost is lower than selling price."
    }
  ],
  examples: [
    {
      title: "Standard Retail",
      input: "Cost: ₹800, Sell: ₹1,000",
      output: "Profit: ₹200, Margin: 20%, Markup: 25%"
    }
  ],
  primaryKeyword: "profit margin calculator",
  keywords: ["profit calculator", "margin calculator", "markup calculator online", "profit margin formula", "gross profit margin", "net profit margin"],
  searchAliases: ["margin", "profit", "markup"],
  searchWeight: 85,
  relatedTools: ["markup-calculator", "discount-calculator", "break-even-calculator", "gst-calculator"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-08-10",
  schemaType: "Calculator",
  icon: "trending-up",
  faq: [
    {
      question: "What is profit margin?",
      answer: "Profit margin is profit divided by selling price × 100. If you sell ₹1,000 worth for ₹1,200, margin is ₹200/₹1,200 = 16.67%."
    },
    {
      question: "What is the difference between margin and markup?",
      answer: "Margin uses selling price as denominator; markup uses cost price. A 20% margin equals a 25% markup."
    },
    {
      question: "Cost ₹800, sell ₹1,000 — what is the margin?",
      answer: "Profit ₹200. Margin = ₹200/₹1,000 = 20%. Markup = ₹200/₹800 = 25%."
    }
  ],
  howTo: [
    { title: "Step 1", description: "Enter cost price" },
    { title: "Step 2", description: "Enter selling price" },
    { title: "Step 3", description: "See profit/margin/markup instantly" }
  ],
  engine: "calculator",
  privacyNote: "none"
}
