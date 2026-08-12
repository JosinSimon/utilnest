import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "receipt-generator",
  name: "Receipt Generator",
  slug: "receipt-generator",
  category: "business",
  path: "business/receipt-generator",
  shortDescription: "Generate professional payment receipts instantly for cash, UPI, bank transfer and business payments.",
  longDescription: "Create, download, and print professional payment receipts. Simple and easy-to-use receipt maker for your business.",
  sections: [
    { heading: "About", body: "Generate customized payment receipts easily. Add your business details, customer information, and payment breakdown to create a professional receipt." }
  ],
  examples: [
    { title: "Cash Receipt", input: "₹1500 Cash", output: "Professional receipt layout for ₹1500" }
  ],
  primaryKeyword: "receipt generator",
  keywords: ["payment receipt generator", "receipt maker", "cash receipt generator", "online receipt"],
  searchAliases: ["receipt maker", "payment receipt", "cash receipt"],
  searchWeight: 75,
  relatedTools: ["invoice-generator", "quotation-generator", "number-to-words"],
  featured: false,
  trending: false,
  popular: false,
  addedAt: "2026-08-10",
  lastUpdated: "2026-08-10",
  schemaType: "Generator",
  icon: "receipt",
  faq: [
    { question: "Is the receipt legally valid?", answer: "This is a simple acknowledgement receipt. For GST-compliant tax invoices, use the Invoice Generator." },
    { question: "Is data stored anywhere?", answer: "No. All information stays in your browser." },
    { question: "Can I customise the receipt?", answer: "Yes, all fields are editable." }
  ],
  howTo: [
    { title: "Fill Details", description: "Enter your business info, customer info, and the payment amount." },
    { title: "Preview", description: "Check the live preview to ensure all details are correct." },
    { title: "Download or Print", description: "Use the buttons to instantly download as HTML or print to PDF." }
  ],
  engine: "calculator",
  privacyNote: "none"
}
