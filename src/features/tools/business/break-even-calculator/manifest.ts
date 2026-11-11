import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "break-even-calculator",
  name: "Break-Even Calculator",
  slug: "break-even-calculator",
  category: "business",
  path: "business/break-even-calculator",
  shortDescription:
    "Find how many units you must sell to cover fixed costs, the break-even revenue, days to break even, and profit at a planned sales target.",
  longDescription:
    "Enter your fixed costs, the variable cost of each unit and your selling price to find the break-even point in units and in rupees. Add your expected daily sales to see roughly how many days and months it takes to break even, and a planned sales target to see the profit or loss at that level.",
  sections: [
    {
      heading: "Break-even formula",
      body: "Contribution per unit = Selling price − Variable cost per unit. Break-even units = Fixed costs ÷ Contribution per unit. Break-even revenue = Break-even units × Selling price. Example: fixed costs of ₹50,000 a month, a variable cost of ₹100 per unit and a price of ₹200. Each unit contributes ₹100, so you need 500 units, or ₹1,00,000 of sales, to cover your costs. Unit 501 is the first one that makes a profit.",
    },
    {
      heading: "Fixed costs vs variable costs",
      body: "Fixed costs stay the same whether you sell one unit or a thousand in a period: rent, salaries, loan EMIs, software subscriptions and insurance. Variable costs rise with each unit sold: raw material, packing, per-order shipping, payment gateway fees and sales commission. Keep both for the same period. If you enter monthly rent and salaries as fixed costs, the answer is units per month. Leaving out a variable cost makes break-even look easier than it is.",
    },
    {
      heading: "Why the answer is rounded up",
      body: "You cannot sell part of a unit, so the calculator rounds the break-even units up to the next whole number. Example: fixed costs ₹1,20,000, variable cost ₹180 and price ₹299 give a contribution of ₹119. ₹1,20,000 ÷ ₹119 is about 1,008.4, so you need 1,009 units. Break-even revenue is then 1,009 × ₹299 = ₹3,01,691. If your selling price is equal to or below your variable cost, there is no break-even point, because every sale adds to the loss.",
    },
    {
      heading: "Time to break even and planned profit",
      body: "Enter expected daily sales and the tool divides the break-even units by that number and rounds up to whole days, then converts to months using 30 days a month. At 20 units a day, 500 units take 25 days, or about 0.8 months. Enter a planned sales target to see your profit: Profit = Contribution per unit × Planned units − Fixed costs. At 800 units, that is ₹100 × 800 − ₹50,000 = ₹30,000.",
    },
    {
      heading: "Using break-even to make decisions",
      body: "Break-even is a quick way to test a plan before you spend money. Try a higher price and watch the units fall: in the first example, raising the price from ₹200 to ₹220 lifts contribution to ₹120 and cuts break-even from 500 to 417 units. Try a cheaper supplier, or check whether a new hire or a bigger shop still pays off at realistic sales. The model assumes one product at one price, so for a mix of products, use an average contribution per unit as an estimate.",
    },
  ],
  examples: [
    {
      title: "Small product business",
      input: "Fixed ₹50,000 · Variable ₹100/unit · Price ₹200 · 20 sales/day",
      output: "Contribution ₹100 · Break-even 500 units (₹1,00,000) · 25 days",
    },
    {
      title: "Rounded-up result",
      input: "Fixed ₹1,20,000 · Variable ₹180/unit · Price ₹299",
      output: "Contribution ₹119 · Break-even 1,009 units · Revenue ₹3,01,691",
    },
    {
      title: "Café with a sales target",
      input: "Fixed ₹3,00,000 · Variable ₹45/cup · Price ₹120 · Target 5,000 cups",
      output: "Break-even 4,000 cups (₹4,80,000) · Profit at target ₹75,000",
    },
  ],
  primaryKeyword: "break even calculator",
  keywords: [
    "break even point calculator",
    "breakeven analysis",
    "break even units calculator",
    "fixed cost variable cost",
    "break even formula",
    "contribution margin calculator",
    "break even revenue calculator",
    "how to calculate break even point",
    "break even analysis for small business",
  ],
  searchAliases: ["break even", "breakeven", "bep", "break-even point", "contribution margin", "payback units"],
  searchWeight: 70,
  relatedTools: ["profit-margin-calculator", "markup-calculator", "commission-calculator", "discount-calculator"],
  featured: false,
  trending: false,
  popular: false,
  addedAt: "2026-08-10",
  lastUpdated: "2026-11-11",
  schemaType: "Calculator",
  icon: "activity",
  faq: [
    {
      question: "What is the break-even formula?",
      answer:
        "Break-even units = Fixed costs ÷ (Selling price − Variable cost per unit). Multiply the units by the selling price to get break-even revenue.",
    },
    {
      question: "What is the break-even point for ₹50,000 fixed costs, ₹100 variable cost and a ₹200 price?",
      answer:
        "Each unit contributes ₹100, so you need ₹50,000 ÷ ₹100 = 500 units, which is ₹1,00,000 of sales.",
    },
    {
      question: "What is contribution margin?",
      answer:
        "It is the selling price minus the variable cost per unit. It is the amount each sale puts towards fixed costs, and after break-even, towards profit.",
    },
    {
      question: "What counts as a fixed cost?",
      answer:
        "Costs that do not change with sales volume in the period, such as rent, salaries, loan EMIs, subscriptions and insurance. Raw material, packing and per-order shipping are variable costs.",
    },
    {
      question: "What if my selling price is lower than my variable cost?",
      answer:
        "Then there is no break-even point. Each unit loses money, so selling more makes the loss bigger. The calculator shows a warning in this case.",
    },
    {
      question: "How long will it take to break even?",
      answer:
        "Enter your expected daily sales. The tool divides break-even units by daily sales and rounds up. 500 units at 20 a day takes 25 days, about 0.8 months.",
    },
  ],
  howTo: [
    {
      title: "Enter fixed costs",
      description: "Add up rent, salaries, EMIs and other costs for a period, such as one month, and enter the total.",
    },
    {
      title: "Enter variable cost per unit",
      description: "Type what each extra unit costs you: material, packing, shipping and fees per sale.",
    },
    {
      title: "Enter the selling price",
      description: "Type the price per unit, before GST if you are registered. It must be higher than the variable cost.",
    },
    {
      title: "Add daily sales or a target",
      description: "Optionally enter expected daily sales for time to break even, or planned units for projected profit.",
    },
  ],
  engine: "calculator",
  privacyNote: "none",
}
