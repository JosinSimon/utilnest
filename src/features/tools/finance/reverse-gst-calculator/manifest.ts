import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "reverse-gst-calculator",
  name: "Reverse GST Calculator",
  slug: "reverse-gst-calculator",
  category: "finance",
  path: "finance/gst-calculator",

  shortDescription:
    "Remove GST from a total amount instantly — work out the pre-GST value, the GST component and CGST/SGST split at 5%, 12%, 18% or 28%. Free, accurate and private.",
  longDescription:
    "Whenever a price or invoice already includes GST, the reverse GST calculation tells you how much of that amount is tax. This free reverse GST calculator opens in Remove-GST mode: enter the inclusive total, pick the rate, and instantly see the base amount before GST, the GST component, and the CGST + SGST (or IGST) split. Ideal for invoices, client bills, expense claims, input tax credit work and retail prices in India. Everything runs on your device — no sign-up, no uploads.",
  sections: [
    {
      heading: "What reverse GST means",
      body: "Forward GST adds tax to a net amount. Reverse GST does the opposite: when a total already includes tax, it works backwards to find the base amount and the tax hidden inside it. If you pay ₹11,800 for something that includes 18% GST, the base is ₹10,000 and the tax included is ₹1,800.",
    },
    {
      heading: "The reverse GST formula",
      body: "Base amount = Total ÷ (1 + GST rate ÷ 100), and GST amount = Total − Base amount. At 18%, for example, the base is Total ÷ 1.18. The calculator applies this instantly and rounds the CGST/SGST split so the two halves always reconcile to the GST amount to the exact paisa.",
    },
    {
      heading: "Common GST rates in India",
      body: "Indian GST slabs are 0%, 3%, 5%, 12%, 18% and 28%. Essentials like food grains sit at 0% or 5%, most processed goods and services around 12% and 18%, and luxury or demerit goods at 28%. Select the slab that applies to the item on your invoice — when no GST applies, use 0%.",
    },
    {
      heading: "Where reverse GST matters",
      body: "Use it to validate inclusive prices on retail receipts, prepare reverse-charge entries, work out input tax credit from inclusive purchase bills, or reconstruct a net amount for quotations. You can also switch the sale type to break the tax into CGST + SGST for intra-state purchases or IGST for inter-state ones.",
    },
    {
      heading: "Private browser calculation",
      body: "This is a pure browser calculation. Your amounts, rates and splits never leave your device — safe to use for business figures.",
    },
  ],
  examples: [
    {
      title: "Invoice total includes 18% GST",
      input: "₹11,800 inclusive at 18%",
      output: "Base ₹10,000 · GST ₹1,800 (CGST ₹900 + SGST ₹900)",
    },
    {
      title: "Price includes 5% GST",
      input: "₹1,050 inclusive at 5%",
      output: "Base ₹1,000 · GST ₹50 (CGST ₹25 + SGST ₹25)",
    },
  ],
  primaryKeyword: "reverse gst calculator",
  keywords: [
    "remove gst from total amount",
    "calculate pre gst amount",
    "gst inclusive calculator",
    "reverse gst formula",
    "gst calculator india",
    "gst component calculator",
  ],
  searchAliases: [
    "reverse gst",
    "gst backward calculation",
    "gst remove from price",
    "gst in total",
  ],
  searchWeight: 95,

  relatedTools: ["gst-calculator", "income-tax-calculator", "hra-calculator", "sip-calculator"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-12",
  lastUpdated: "2026-08-12",

  schemaType: "Calculator",
  icon: "percent",
  faq: [
    {
      question: "How do I remove GST from a total amount?",
      answer:
        "Divide the total by 1 + (rate ÷ 100). At 18%, divide by 1.18. This calculator does it instantly in Remove GST mode: enter the inclusive total, pick the rate, and read the base amount and the GST component.",
    },
    {
      question: "What is the reverse GST formula?",
      answer:
        "Base amount = Total ÷ (1 + GST rate ÷ 100), and GST amount = Total − Base amount. Example: ₹11,800 ÷ 1.18 = ₹10,000 base, so the GST within the total is ₹1,800.",
    },
    {
      question: "How do I calculate GST included in a price?",
      answer:
        "Use the reverse formula on the inclusive price: subtract the computed base amount from the total. The calculator shows both the base and the GST, plus the CGST + SGST (or IGST) split.",
    },
    {
      question: "Which GST rate should I use?",
      answer:
        "Use the slab that applies to the goods or service on your invoice: 0%, 3%, 5%, 12%, 18% or 28%. Most business-to-business items fall at 18%; essentials at 5% or 0%. When in doubt, your invoice should state the rate.",
    },
    {
      question: "Is this calculator India-specific?",
      answer:
        "Yes. It uses Indian GST slabs and splits the tax into CGST + SGST for intra-state supplies and IGST for inter-state supplies, exactly as Indian invoices are drawn.",
    },
  ],
  howTo: [
    {
      title: "Enter the total including GST",
      description: "Type the invoice or price amount that already includes tax.",
    },
    {
      title: "Keep Remove GST mode selected",
      description: "This page opens with the inclusive mode active, so GST is extracted from the total.",
    },
    {
      title: "Pick the GST rate",
      description: "Select the slab on the invoice: 5%, 12%, 18% or 28%.",
    },
    {
      title: "Choose the sale type",
      description: "Intra-state gives a CGST + SGST split; inter-state shows IGST.",
    },
    {
      title: "Read base, GST and split",
      description: "See the pre-GST amount, the GST component and the tax split immediately.",
    },
  ],

  engine: "calculator",
  privacyNote: "none",
  preset: { gstMode: "reverse", defaultGstRate: 18 },
}