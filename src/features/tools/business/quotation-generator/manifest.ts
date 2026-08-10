import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "quotation-generator",
  name: "Quotation Generator",
  slug: "quotation-generator",
  category: "business",
  path: "business/quotation-generator",
  shortDescription: "Create professional business quotations and estimates.",
  longDescription: "Generate professional price quotes, estimates, and proposals. Easily calculate GST, apply discounts, and share with your clients.",
  sections: [
    { heading: "About", body: "Generate customized quotations and estimates for your business deals." }
  ],
  examples: [
    { title: "Standard Quotation", input: "Line items with GST", output: "Professional PDF-ready quote" }
  ],
  primaryKeyword: "quotation generator",
  keywords: ["quotation maker", "quotation format", "business quotation", "price quotation generator"],
  searchAliases: ["quote maker", "estimate generator", "price quote"],
  searchWeight: 78,
  relatedTools: ["invoice-generator", "gst-calculator", "discount-calculator", "number-to-words"],
  featured: false,
  trending: false,
  popular: false,
  addedAt: "2026-08-10",
  lastUpdated: "2026-08-10",
  schemaType: "Generator",
  icon: "clipboard-list",
  faq: [
    { question: "Is this GST-compliant?", answer: "The quotation shows CGST/SGST or IGST correctly per Indian GST rules." },
    { question: "How do I add multiple items?", answer: "Click Add Item to add more rows." },
    { question: "Can I download the quotation?", answer: "Yes, as a print-ready HTML file or print directly." }
  ],
  howTo: [
    { title: "Fill Info", description: "Add your business and client details." },
    { title: "Add Line Items", description: "Input items, quantity, price, discount, and select GST." },
    { title: "Export", description: "Print or download the quotation." }
  ],
  engine: "calculator",
  privacyNote: "none"
}
