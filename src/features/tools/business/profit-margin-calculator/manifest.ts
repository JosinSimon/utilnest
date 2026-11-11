import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "profit-margin-calculator",
  name: "Profit Margin Calculator",
  slug: "profit-margin-calculator",
  category: "business",
  path: "business/profit-margin-calculator",
  shortDescription:
    "Calculate profit, gross margin, markup and net margin from cost and selling price, with shipping, ad spend and payment gateway fees per sale.",
  longDescription:
    "Enter your cost price and selling price to see gross profit, gross margin and markup. Then add shipping, ad cost per sale and payment gateway fee to find the net profit you actually keep on each order. A colour bar splits the selling price into product cost, shipping, ads, gateway fee and net profit, so you can see where the money goes.",
  sections: [
    {
      heading: "Profit margin formula",
      body: "Gross profit = Selling price − Cost price. Gross margin % = Gross profit ÷ Selling price × 100. Markup % = Gross profit ÷ Cost price × 100. Example: you buy a product for ₹800 and sell it for ₹1,000. Gross profit is ₹200, gross margin is 20%, and markup is 25%. Margin tells you how much of every rupee of sales is profit. Markup tells you how much you added on top of cost. The same profit gives two different percentages, so always say which one you mean.",
    },
    {
      heading: "Gross margin vs net margin",
      body: "Gross margin only looks at the product cost. Net margin also takes off the costs of making each sale. In this calculator, Net profit = Selling price − (Cost + Shipping + Ad cost + Gateway fee), and Net margin = Net profit ÷ Selling price × 100. The gateway fee is a percentage of the selling price. These are per-unit figures. Rent, salaries and other fixed overheads are not included, so your business-wide net margin will be lower.",
    },
    {
      heading: "Worked example for an online seller",
      body: "A product costs ₹800 and sells for ₹1,500. Gross profit is ₹700, a 46.67% gross margin and an 87.5% markup. Now add ₹100 courier per order, ₹200 of ad spend per sale and a 2% gateway fee (₹30). Total cost per order becomes ₹1,130, so net profit is ₹370 and net margin is 24.67%. The breakdown bar shows the product taking 53.33% of the price, ads 13.33%, shipping 6.67%, the gateway 2% and net profit 24.67%.",
    },
    {
      heading: "GST and your margin",
      body: "If you are GST registered, the GST you collect from buyers is not your income: you pass it on to the government after claiming input tax credit. So work out margins on prices before GST. For example, if a customer pays ₹1,180 including 18% GST, your selling price for margin purposes is ₹1,000. If you are not registered and cannot claim credit, the GST you pay on purchases is part of your cost, so include it in the cost price.",
    },
    {
      heading: "Common mistakes and how to fix a thin margin",
      body: "The most common mistake is confusing markup with margin. Adding 30% to cost gives only a 23.08% margin, not 30%. Another is ignoring per-order costs such as shipping, return-to-origin losses, ad spend and gateway fees, which can turn a healthy gross margin into a loss. If your net margin is too low, the levers are a higher price, lower purchase cost, cheaper shipping, or lower ad cost per sale. Use the Markup Calculator to find the price for a target margin, and the Break-Even Calculator to see how many sales cover your fixed costs.",
    },
  ],
  examples: [
    {
      title: "Retail product",
      input: "Cost ₹800 · Selling price ₹1,000",
      output: "Profit ₹200 · Margin 20% · Markup 25%",
    },
    {
      title: "Online order with expenses",
      input: "Cost ₹800 · Price ₹1,500 · Shipping ₹100 · Ads ₹200 · Gateway 2%",
      output: "Gross margin 46.67% · Net profit ₹370 · Net margin 24.67%",
    },
    {
      title: "Selling below cost",
      input: "Cost ₹1,200 · Selling price ₹1,000",
      output: "Loss ₹200 · Margin −20% · Markup −16.67%",
    },
  ],
  primaryKeyword: "profit margin calculator",
  keywords: [
    "profit calculator",
    "margin calculator",
    "profit margin formula",
    "gross profit margin calculator",
    "net profit margin calculator",
    "how to calculate profit margin",
    "profit percentage calculator",
    "ecommerce profit calculator india",
    "selling price and cost price calculator",
  ],
  searchAliases: ["margin", "profit", "markup", "profit percentage", "gross margin", "net margin"],
  searchWeight: 85,
  relatedTools: ["markup-calculator", "discount-calculator", "break-even-calculator", "gst-calculator"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-11-11",
  schemaType: "Calculator",
  icon: "trending-up",
  faq: [
    {
      question: "How do I calculate profit margin?",
      answer:
        "Subtract the cost from the selling price to get profit, divide the profit by the selling price and multiply by 100. Cost ₹800 and price ₹1,000 give ₹200 profit and a 20% margin.",
    },
    {
      question: "What is the difference between margin and markup?",
      answer:
        "Margin divides profit by the selling price. Markup divides profit by the cost. A ₹200 profit on an ₹800 cost and ₹1,000 price is a 20% margin and a 25% markup.",
    },
    {
      question: "What is the difference between gross and net margin?",
      answer:
        "Gross margin only subtracts the product cost. Net margin here also subtracts shipping, ad cost and the payment gateway fee for each sale, so it shows what you really keep per order.",
    },
    {
      question: "Should I include GST in the selling price?",
      answer:
        "If you are GST registered, no. Use prices before GST, because the tax you collect is passed on to the government. A ₹1,180 price that includes 18% GST is ₹1,000 for margin purposes.",
    },
    {
      question: "What is a good profit margin?",
      answer:
        "It depends on the industry, the product and your overheads, so there is no single number. Compare your net margin with what you need to cover fixed costs and leave a profit, using the Break-Even Calculator.",
    },
    {
      question: "Can the margin be negative?",
      answer:
        "Yes. If you sell below cost, the profit and margin are negative. Selling a ₹1,200 item for ₹1,000 is a ₹200 loss and a −20% margin.",
    },
  ],
  howTo: [
    {
      title: "Enter the cost price",
      description: "Type what one unit costs you to buy or make, before GST if you claim input tax credit.",
    },
    {
      title: "Enter the selling price",
      description: "Type the price the customer pays per unit, before GST if you are registered.",
    },
    {
      title: "Add per-sale expenses",
      description: "Under Add Expenses, enter shipping per unit, ad cost per sale and the payment gateway fee %.",
    },
    {
      title: "Compare gross and net",
      description: "Read gross profit, gross margin, markup, net profit and net margin, and check the revenue breakdown bar.",
    },
  ],
  engine: "calculator",
  privacyNote: "none",
}
