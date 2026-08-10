import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "discount-calculator",
  name: "Discount Calculator",
  slug: "discount-calculator",
  category: "business",
  path: "business/discount-calculator",
  shortDescription: "Calculate final price, savings, and stacked discounts instantly.",
  longDescription: "Easily determine your savings and the final price after applying a discount. You can also calculate stacked or additional discounts for multi-offer promotions.",
  sections: [
    {
      heading: "Understanding Stacked Discounts",
      body: "When discounts are stacked (e.g., '20% off plus an extra 10% off'), the second discount applies to the already discounted price, not the original price. Our calculator handles this automatically."
    }
  ],
  examples: [
    {
      title: "Standard Discount",
      input: "Original: ₹2,000, Discount: 20%",
      output: "Final Price: ₹1,600, Savings: ₹400"
    }
  ],
  primaryKeyword: "discount calculator",
  keywords: ["discount percentage calculator", "sale price calculator", "percentage off calculator", "discount amount calculator"],
  searchAliases: ["discount", "sale", "offer"],
  searchWeight: 80,
  relatedTools: ["profit-margin-calculator", "markup-calculator", "gst-calculator"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-08-10",
  schemaType: "Calculator",
  icon: "tag",
  faq: [
    {
      question: "How to calculate discount?",
      answer: "Savings = original × discount% / 100. Final price = original − savings."
    },
    {
      question: "What is ₹2,000 with 20% off?",
      answer: "Savings ₹400, Final price ₹1,600."
    },
    {
      question: "How do stacked discounts work?",
      answer: "First discount applies to original price, second to the already-discounted price. 20% + 10% ≠ 30%."
    }
  ],
  howTo: [
    { title: "Step 1", description: "Enter original price" },
    { title: "Step 2", description: "Enter discount %" },
    { title: "Step 3", description: "See savings instantly" }
  ],
  engine: "calculator",
  privacyNote: "none"
}
