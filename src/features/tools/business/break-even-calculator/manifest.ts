import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "break-even-calculator",
  name: "Break-Even Calculator",
  slug: "break-even-calculator",
  category: "business",
  path: "business/break-even-calculator",
  shortDescription: "Calculate how many units you need to sell to cover your costs.",
  longDescription: "Determine your break-even point in units and revenue. By analyzing your fixed and variable costs, this calculator shows you exactly when your business starts making a profit.",
  sections: [
    {
      heading: "Understanding the Break-Even Point",
      body: "Your break-even point is when your total revenue equals your total costs (fixed + variable). At this exact point, you are neither making a profit nor a loss. Every unit sold past this point contributes directly to your profit."
    }
  ],
  examples: [
    {
      title: "Simple Product",
      input: "Fixed Costs: ₹50,000, Variable Cost/Unit: ₹100, Selling Price/Unit: ₹200",
      output: "Contribution per unit: ₹100, Break-even: 500 units (₹1,00,000 revenue)"
    }
  ],
  primaryKeyword: "break even calculator",
  keywords: ["break even point calculator", "breakeven analysis", "break even units calculator", "fixed cost variable cost"],
  searchAliases: ["break even", "breakeven", "bep"],
  searchWeight: 70,
  relatedTools: ["profit-margin-calculator", "markup-calculator", "commission-calculator"],
  featured: false,
  trending: false,
  popular: false,
  addedAt: "2026-08-10",
  lastUpdated: "2026-08-10",
  schemaType: "Calculator",
  icon: "activity",
  faq: [
    {
      question: "What is the break-even formula?",
      answer: "Break-even units = Fixed Costs ÷ (Selling Price − Variable Cost per Unit)."
    },
    {
      question: "Fixed ₹50,000, variable ₹100/unit, sell ₹200/unit — break-even?",
      answer: "Contribution = ₹100. Break-even = 500 units = ₹1,00,000 revenue."
    },
    {
      question: "What is contribution margin?",
      answer: "Selling price minus variable cost per unit. It's the amount each unit contributes toward fixed costs."
    }
  ],
  howTo: [
    { title: "Step 1", description: "Enter fixed costs" },
    { title: "Step 2", description: "Enter variable cost per unit" },
    { title: "Step 3", description: "Enter selling price" },
    { title: "Step 4", description: "See break-even units and revenue" }
  ],
  engine: "calculator",
  privacyNote: "none"
}
