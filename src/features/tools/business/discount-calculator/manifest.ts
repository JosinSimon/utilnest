import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "discount-calculator",
  name: "Discount Calculator",
  slug: "discount-calculator",
  category: "business",
  path: "business/discount-calculator",
  shortDescription:
    "Work out the sale price and savings for any % off, including stacked offers like 20% + 5% extra, and see how a discount cuts a seller's profit.",
  longDescription:
    "Enter the original price and the discount percentage to see what you pay and how much you save. Add a second discount to compare a straight 20% + 5% with a sequential \"extra 5% off the sale price\" offer. Sellers can also enter their cost price to see how much profit and margin are left after the discount.",
  sections: [
    {
      heading: "Discount formula",
      body: "Savings = Original price × Discount % ÷ 100. Final price = Original price − Savings. Example: a ₹2,000 kurta at 20% off saves ₹400, so you pay ₹1,600. To find the discount percentage from two prices, use Discount % = (Original price − Sale price) ÷ Original price × 100. A shirt marked down from ₹1,299 to ₹999 carries a ₹300 discount, which is about 23.09%.",
    },
    {
      heading: "Stacked discounts: added or one after the other",
      body: "Offers like \"20% off + extra 5%\" can be applied in two ways, and the tool lets you pick. Direct Addition adds the percentages: 20% + 5% = 25% off. Sequential applies the second discount to the already reduced price. On ₹2,500, Direct Addition gives ₹1,875. Sequential gives ₹2,000 after 20% and then ₹1,900 after another 5%, which is an effective 24% off. Many \"extra % off\" coupon and bank offers work the sequential way, so check the offer terms before you assume the bigger saving.",
    },
    {
      heading: "Why 50% + 20% is not 70% off",
      body: "When discounts are applied one after the other, each one works on a smaller price. A ₹4,000 jacket at 50% off becomes ₹2,000. An extra 20% off that sale price takes off ₹400, leaving ₹1,600. You save ₹2,400 in total, which is 60% of the original price, not 70%. Use the Sequential mode to see the real effective discount for any combination.",
    },
    {
      heading: "For sellers: how much profit does a discount cost you?",
      body: "Turn on Add Product Cost and enter what the item cost you. The calculator shows your profit and margin before and after the discount, and how much of your profit the discount removes. Example: you sell at ₹2,500 and the item cost ₹1,800, so your profit is ₹700 (a 28% margin). A 10% discount cuts the price to ₹2,250 and your profit to ₹450, a 20% margin. That small-looking 10% removes 35.71% of your profit. Stack another 15% and you are close to selling at cost.",
    },
    {
      heading: "MRP, GST and discounts in India",
      body: "In Indian retail, the MRP printed on a pack includes all taxes, so the discounted price you calculate from MRP is usually what you pay at the counter. A business that quotes prices before GST is different: apply the discount first, then add GST on the reduced price. You can use the GST Calculator for that second step. Remember that a discount is always worked out on the original price shown, so a \"sale\" price that was raised first is not a real saving.",
    },
  ],
  examples: [
    {
      title: "Simple percentage off",
      input: "Original ₹2,000 · 20% off",
      output: "You save ₹400 · Final price ₹1,600",
    },
    {
      title: "Stacked offer, sequential",
      input: "Original ₹2,500 · 20% then extra 5%",
      output: "Final price ₹1,900 · Saved ₹600 · Effective 24% off",
    },
    {
      title: "Seller profit check",
      input: "Price ₹2,500 · Cost ₹1,800 · 20% + 5% added (25%)",
      output: "Final ₹1,875 · Profit falls from ₹700 to ₹75 · Margin 4%",
    },
  ],
  primaryKeyword: "discount calculator",
  keywords: [
    "discount percentage calculator",
    "sale price calculator",
    "percentage off calculator",
    "discount amount calculator",
    "stacked discount calculator",
    "double discount calculator",
    "how to calculate discount percentage",
    "price after discount calculator",
    "mrp discount calculator",
  ],
  searchAliases: ["discount", "sale", "offer", "percent off", "price after discount", "extra discount"],
  searchWeight: 80,
  relatedTools: ["profit-margin-calculator", "markup-calculator", "gst-calculator", "break-even-calculator"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-11-11",
  schemaType: "Calculator",
  icon: "tag",
  faq: [
    {
      question: "How do I calculate a discount?",
      answer:
        "Multiply the original price by the discount percentage and divide by 100 to get the savings, then subtract the savings from the original price. ₹2,000 at 20% off saves ₹400, so the final price is ₹1,600.",
    },
    {
      question: "How do I find the discount percentage from two prices?",
      answer:
        "Subtract the sale price from the original price, divide by the original price and multiply by 100. ₹1,299 reduced to ₹999 is a ₹300 cut, or about 23.09% off.",
    },
    {
      question: "Is 20% + 10% off the same as 30% off?",
      answer:
        "Only if the shop adds the two percentages. If the extra 10% applies to the already reduced price, the total is 28%: ₹1,000 becomes ₹800 and then ₹720.",
    },
    {
      question: "What is ₹2,500 with 20% off and an extra 5% off?",
      answer:
        "Added together (25%), you pay ₹1,875. Applied one after the other, you pay ₹1,900 and the effective discount is 24%.",
    },
    {
      question: "How much profit do I lose by giving a discount?",
      answer:
        "Enter your cost price in the seller section. With a ₹2,500 price and ₹1,800 cost, a 10% discount cuts profit from ₹700 to ₹450, which removes 35.71% of your profit.",
    },
    {
      question: "Is GST charged before or after the discount?",
      answer:
        "When a discount is shown on the invoice at the time of sale, GST is generally charged on the price after the discount. In retail, the MRP already includes GST.",
    },
  ],
  howTo: [
    {
      title: "Enter the original price",
      description: "Type the MRP or list price in rupees.",
    },
    {
      title: "Enter the discount",
      description: "Add the main discount %, and an additional discount % if the offer has a second part.",
    },
    {
      title: "Pick how discounts combine",
      description: "Choose Direct Addition (20% + 5% = 25%) or Sequential (5% off the already reduced price).",
    },
    {
      title: "Check savings and profit",
      description: "Read the final price, total savings and effective discount. Sellers can add a cost price to see remaining profit and margin.",
    },
  ],
  engine: "calculator",
  privacyNote: "none",
}
