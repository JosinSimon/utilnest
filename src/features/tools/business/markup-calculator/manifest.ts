import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "markup-calculator",
  name: "Markup Calculator",
  slug: "markup-calculator",
  category: "business",
  path: "business/markup-calculator",
  shortDescription:
    "Find a selling price from cost and markup %, work out the markup on any price, or set a price that hits a target profit margin.",
  longDescription:
    "Price your products with three modes. Cost → Price adds a markup percentage to your cost. Find Markup % works backwards from a cost and a selling price. Target Margin → Price tells you what to charge to keep a chosen share of the selling price as profit. Each mode shows the profit amount, markup and margin side by side, with a markup-to-margin reference table.",
  sections: [
    {
      heading: "Markup formula",
      body: "Markup is profit as a percentage of cost. Selling price = Cost × (1 + Markup % ÷ 100). Markup % = (Selling price − Cost) ÷ Cost × 100. Example: a product that costs you ₹800 with a 25% markup sells for ₹800 × 1.25 = ₹1,000, giving ₹200 profit. Going the other way, if you buy at ₹450 and sell at ₹600, your profit is ₹150 and your markup is ₹150 ÷ ₹450 = 33.33%.",
    },
    {
      heading: "Markup vs margin",
      body: "Both measure the same profit, but against different bases. Markup divides profit by cost. Margin divides profit by selling price. In the ₹800 → ₹1,000 example, the ₹200 profit is a 25% markup but only a 20% margin. Markup is always the higher number when you make a profit. Mixing them up is a common pricing mistake: a shop owner who wants a 30% margin but adds 30% to cost ends up with only about 23.08% margin.",
    },
    {
      heading: "Converting between markup and margin",
      body: "Margin = Markup ÷ (1 + Markup), and Markup = Margin ÷ (1 − Margin), using decimals. Some useful pairs: 20% markup = 16.67% margin, 25% markup = 20% margin, 50% markup = 33.33% margin, and 100% markup = 50% margin. The calculator shows a full reference table, so you can read off the matching figure without doing the maths. A margin can never reach 100%, but a markup can be any size.",
    },
    {
      heading: "Pricing for a target margin",
      body: "If you know the margin you want, use Target Margin → Price. Selling price = Cost ÷ (1 − Margin % ÷ 100). Example: an item costs ₹700 and you want a 30% margin. ₹700 ÷ 0.70 = ₹1,000. Your profit is ₹300, which is 30% of the price and a 42.86% markup on cost. This mode is useful when your business plan, distributor or marketplace talks in margins rather than markups.",
    },
    {
      heading: "What to count as cost",
      body: "Use your full landed cost per unit: purchase price plus inward freight, packing and any other cost to get the item ready to sell. If you are GST registered and claim input tax credit, use the cost before GST, and add GST on top of your selling price separately. Do not include fixed costs like rent and salaries here. Check those with the Break-Even Calculator, which tells you how many units you need to sell at your chosen price.",
    },
  ],
  examples: [
    {
      title: "Cost plus 25% markup",
      input: "Cost ₹800 · Markup 25%",
      output: "Selling price ₹1,000 · Profit ₹200 · Margin 20%",
    },
    {
      title: "Find the markup",
      input: "Cost ₹450 · Selling price ₹600",
      output: "Profit ₹150 · Markup 33.33% · Margin 25%",
    },
    {
      title: "Price for a 30% margin",
      input: "Cost ₹700 · Target margin 30%",
      output: "Selling price ₹1,000 · Profit ₹300 · Markup 42.86%",
    },
  ],
  primaryKeyword: "markup calculator",
  keywords: [
    "markup percentage calculator",
    "cost plus markup",
    "selling price calculator",
    "markup vs margin",
    "markup to margin calculator",
    "how to calculate markup",
    "markup formula",
    "price from cost and margin",
    "retail markup calculator",
  ],
  searchAliases: ["markup", "cost plus", "pricing", "mark up", "selling price from cost", "markup percentage"],
  searchWeight: 75,
  relatedTools: ["profit-margin-calculator", "discount-calculator", "break-even-calculator", "gst-calculator"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-11-11",
  schemaType: "Calculator",
  icon: "percent",
  faq: [
    {
      question: "How do I calculate markup?",
      answer:
        "Subtract the cost from the selling price, divide by the cost and multiply by 100. Cost ₹450 and price ₹600 give ₹150 profit and a 33.33% markup.",
    },
    {
      question: "What is the selling price with a 25% markup on ₹800?",
      answer:
        "₹800 × 1.25 = ₹1,000. The profit is ₹200, which is a 25% markup and a 20% margin.",
    },
    {
      question: "What is the difference between markup and margin?",
      answer:
        "Markup is profit divided by cost. Margin is profit divided by selling price. The same ₹200 profit on a ₹1,000 sale is a 25% markup but a 20% margin.",
    },
    {
      question: "Why is markup always higher than margin?",
      answer:
        "When you make a profit, cost is lower than the selling price. Dividing the same profit by a smaller number always gives a bigger percentage.",
    },
    {
      question: "What markup gives a 30% margin?",
      answer:
        "About 42.86%. Use Markup = Margin ÷ (1 − Margin): 0.30 ÷ 0.70 = 0.4286. On a ₹700 cost, that means a ₹1,000 selling price.",
    },
    {
      question: "Is a 100% markup the same as a 100% margin?",
      answer:
        "No. A 100% markup doubles the cost, so ₹500 becomes ₹1,000, which is a 50% margin. A 100% margin is not possible because it would mean the item cost nothing.",
    },
  ],
  howTo: [
    {
      title: "Choose a mode",
      description: "Pick Cost → Price, Find Markup %, or Target Margin → Price depending on what you already know.",
    },
    {
      title: "Enter your cost price",
      description: "Type what one unit costs you to buy or make, before GST if you claim input tax credit.",
    },
    {
      title: "Enter markup, price or margin",
      description: "Add the markup %, your current selling price, or the margin % you want, based on the mode.",
    },
    {
      title: "Read the results",
      description: "See the selling price, profit, markup and margin together, and use the reference table to compare markup and margin.",
    },
  ],
  engine: "calculator",
  privacyNote: "none",
}
