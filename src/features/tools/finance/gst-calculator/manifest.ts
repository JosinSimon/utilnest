import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "gst-calculator",
  name: "GST Calculator",
  slug: "gst-calculator",
  category: "finance",
  path: "finance/gst-calculator",

  shortDescription:
    "Calculate GST (CGST, SGST/IGST and total) instantly — exclusive or inclusive. Free, accurate and works entirely in your browser.",
  longDescription:
    "Our free GST calculator lets you add or remove GST on any amount instantly. Whether you need GST-exclusive or GST-inclusive math, it splits the tax into CGST and SGST (or IGST for inter-state sales) at the correct rate. No sign-up, no uploads — everything runs on your device.",

  sections: [
    {
      heading: "What is GST?",
      body: "GST (Goods and Services Tax) is the indirect tax levied on the supply of goods and services across India. It replaced multiple older taxes like VAT, service tax and excise duty. GST is charged as CGST and SGST for intra-state sales, and as IGST for inter-state sales. When you want know how much tax is included in a price, a GST calculator gives you the answer instantly.",
    },
    {
      heading: "Why use our GST calculator?",
      body: "It handles two modes in one place: adding GST to a net amount and extracting GST from a gross amount. It splits the total tax into CGST and SGST at all standard rates (0%, 3%, 5%, 12%, 18%, 28%). Results update instantly as you type, are formatted in Indian Rupees, and are always 100% private.",
    },
  ],

  examples: [
    {
      title: "GST exclusive",
      input: "Amount ₹10,000 at 18% GST",
      output: "GST ₹1,800 · Total ₹11,800 (CGST ₹900 + SGST ₹900)",
    },
    {
      title: "GST inclusive",
      input: "Amount ₹11,800 includes 18% GST",
      output: "Base ₹10,000 · GST ₹1,800 (CGST ₹900 + SGST ₹900)",
    },
  ],

  primaryKeyword: "gst calculator",
  keywords: [
    "online gst calculator",
    "gst calculator india",
    "gst calculator free",
    "gst inclusive calculator",
    "cgst sgst calculator",
    "gst amount calculator",
  ],
  searchAliases: ["gst calc", "gst on goods", "gst rate calculator", "igst calculator"],
  searchWeight: 100,

  relatedTools: [],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-06",
  lastUpdated: "2026-08-06",

  schemaType: "Calculator",
  icon: "indian-rupee",
  faq: [
    {
      question: "What is the difference between CGST, SGST and IGST?",
      answer:
        "CGST and SGST are charged on intra-state supplies (within the same state), one collected by the Central government and the other by the State. IGST is charged on inter-state supplies (across state borders) and is collected entirely by the Centre, later apportioned to the destination state.",
    },
    {
      question: "What are the GST rates in India?",
      answer:
        "The principal GST slab rates in India are 0%, 3%, 5%, 12%, 18% and 28%. Most goods and services fall under 5% or 18%; luxury items and demerit goods sit at 28%.",
    },
    {
      question: "Is a 7% or 10% GST rate standard for this calculator service?",
      answer:
        "No. GST is only applied on specified categories and may not always be included even for those services. For items where GST does not apply, set the GST rate to 0%.",
    },
    {
      question: "Why do CGST and SGST sometimes differ by one paisa?",
      answer:
        "When the GST amount splits into an uneven half, the odd paisa is allocated to SGST so that CGST + SGST always equals the total GST to the exact paisa. Some systems round each half independently, which can make the two halves sum to one paisa more than the GST itself; we prefer results that always reconcile.",
    },
  ],
  howTo: [
    {
      title: "Enter your amount",
      description: "Type the amount you want to add GST to or extract GST from.",
    },
    {
      title: "Choose Add GST or Remove GST",
      description:
        "Add GST (exclusive) taxes an amount that doesn't include tax. Remove GST (inclusive) finds the tax inside an amount that already includes it.",
    },
    {
      title: "Pick the GST rate",
      description: "Select a standard slab (0%, 3%, 5%, 12%, 18% or 28%) or enter a custom rate.",
    },
    {
      title: "Choose the sale type",
      description:
        "Intra-state sales split tax into CGST + SGST. Inter-state sales charge IGST.",
    },
    {
      title: "Read your results",
      description:
        "See the amount before GST, the GST charged, the total including GST and the tax split immediately.",
    },
  ],

  engine: "calculator",
  privacyNote: "none",
}