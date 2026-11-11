import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "commission-calculator",
  name: "Commission Calculator",
  slug: "commission-calculator",
  category: "business",
  path: "business/commission-calculator",
  shortDescription:
    "Calculate sales or agent commission from a percentage, with slab (tiered) rates and 18% GST on commission. See commission and net amount instantly.",
  longDescription:
    "Work out how much commission a salesperson, agent or broker earns on a sale, and how much the business keeps. Use a single flat rate or a two-slab (tiered) structure that pays a higher rate above a target, and optionally add 18% GST on the commission for invoicing. Results update as you type and nothing leaves your browser.",
  sections: [
    {
      heading: "Commission formula",
      body: "Commission = Sale amount × Commission rate ÷ 100. The amount the business keeps is Sale amount − Commission. Example: on a ₹1,50,000 sale at 5%, the commission is ₹7,500 and the business keeps ₹1,42,500.",
    },
    {
      heading: "Slab (tiered) commission",
      body: "Many sales teams pay one rate up to a target and a higher rate on sales above it. Choose Tiered / Slab Rate, enter the target (threshold), the base rate and the higher rate. Example: 5% up to ₹1,00,000 and 10% above it, on a ₹1,50,000 sale: ₹5,000 + ₹5,000 = ₹10,000 commission, an effective rate of 6.67%.",
    },
    {
      heading: "GST on commission",
      body: "When a GST-registered agent or broker invoices their commission, GST is usually charged on the commission at 18%. Turn on the GST option to see the GST amount and the total to invoice. Example: ₹7,500 commission + ₹1,350 GST = ₹8,850. The GST applies to the commission only, not the full sale value.",
    },
    {
      heading: "Common uses",
      body: "Sales incentive payouts, real estate brokerage, insurance and mutual fund distributor payouts, marketplace and aggregator fees, freelance referral fees and dealer margins. For property deals, brokerage is often quoted as 1% to 2% of the deal value: enter the deal value as the sale amount and the brokerage as the rate.",
    },
    {
      heading: "Find the rate from an amount",
      body: "If you know the commission amount and want the rate, use Rate = Commission ÷ Sale amount × 100. For example, ₹12,000 commission on a ₹3,00,000 sale is a 4% rate. In tiered mode the calculator shows this as the effective rate.",
    },
  ],
  examples: [
    {
      title: "Flat 5% sales commission",
      input: "Sale ₹1,50,000 at 5%",
      output: "Commission ₹7,500 · Business keeps ₹1,42,500",
    },
    {
      title: "Slab commission",
      input: "Sale ₹1,50,000 · 5% up to ₹1,00,000, 10% above",
      output: "Commission ₹10,000 · Effective rate 6.67%",
    },
    {
      title: "Property brokerage with GST",
      input: "Deal ₹50,00,000 at 1% + 18% GST",
      output: "Brokerage ₹50,000 + GST ₹9,000 = ₹59,000",
    },
  ],
  primaryKeyword: "commission calculator",
  keywords: [
    "sales commission calculator",
    "commission percentage calculator",
    "agent commission calculator",
    "brokerage calculator",
    "tiered commission calculator",
    "commission calculator with gst",
    "how to calculate commission",
  ],
  searchAliases: ["sales commission", "commission percent", "broker commission", "slab commission"],
  searchWeight: 78,
  relatedTools: ["break-even-calculator", "profit-margin-calculator", "markup-calculator", "salary-hike-calculator"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-11-11",
  schemaType: "Calculator",
  icon: "hand-coins",
  faq: [
    {
      question: "How do I calculate commission?",
      answer:
        "Multiply the sale amount by the commission rate and divide by 100. ₹1,00,000 at 5% gives ₹5,000 commission, and the business keeps ₹95,000.",
    },
    {
      question: "How does tiered or slab commission work?",
      answer:
        "One rate applies up to a threshold and a higher rate applies only to the amount above it. With 5% up to ₹1,00,000 and 10% above, a ₹1,50,000 sale earns ₹5,000 + ₹5,000 = ₹10,000.",
    },
    {
      question: "Is GST charged on commission?",
      answer:
        "When a GST-registered agent or broker bills their commission, GST is usually charged at 18% on the commission amount, not on the full sale. Turn on the GST option to see it.",
    },
    {
      question: "How do I find the commission percentage?",
      answer:
        "Divide the commission by the sale amount and multiply by 100. ₹12,000 on a ₹3,00,000 sale is 4%.",
    },
    {
      question: "Is my data saved anywhere?",
      answer: "No. The calculator runs in your browser and nothing you enter is uploaded or stored.",
    },
  ],
  howTo: [
    { title: "Choose the structure", description: "Pick a flat rate or a tiered (slab) structure." },
    { title: "Enter the sale amount", description: "The sale or deal value the commission is based on." },
    { title: "Enter the rate(s)", description: "Your commission %, plus the threshold and higher rate for slabs." },
    { title: "Add GST if needed", description: "Turn on GST to see 18% GST and the total commission invoice." },
  ],
  engine: "calculator",
  privacyNote: "none",
}
