import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "invoice-generator",
  name: "Invoice Generator",
  slug: "invoice-generator",
  category: "business",
  path: "business/invoice-generator",
  shortDescription: "Generate professional GST-compliant invoices.",
  longDescription: "Create, download, and print professional tax invoices for your business. Supports CGST, SGST, IGST, discounts, and logo uploads. 100% free and runs in your browser.",
  sections: [
    { heading: "About", body: "Generate customized GST-compliant tax invoices instantly." }
  ],
  examples: [
    { title: "Standard Tax Invoice", input: "Items with GST", output: "Professional PDF-ready GST Invoice" }
  ],
  primaryKeyword: "invoice generator",
  keywords: ["gst invoice generator", "free invoice maker", "invoice format india", "tax invoice generator", "online invoice creator", "gst bill format"],
  searchAliases: ["bill maker", "tax invoice maker", "gst bill generator"],
  searchWeight: 95,
  relatedTools: ["gst-calculator", "number-to-words", "discount-calculator", "quotation-generator"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-08-10",
  schemaType: "Generator",
  icon: "file-text",
  faq: [
    { question: "Is this GST-compliant?", answer: "Yes. The invoice correctly computes CGST+SGST for intra-state and IGST for inter-state sales per Indian GST rules." },
    { question: "Is my data uploaded?", answer: "No. Everything stays in your browser." },
    { question: "Can I add my logo?", answer: "Yes, upload a PNG/JPG up to 200KB and it appears on the invoice." },
    { question: "How do I add multiple items?", answer: "Click Add Item to add unlimited line items." },
    { question: "Can I download the invoice?", answer: "Yes as an HTML file (open in browser and print to PDF) or print directly." }
  ],
  howTo: [
    { title: "Fill Details", description: "Add your business info, customer info, and upload your logo." },
    { title: "Add Line Items", description: "Input your products/services, rates, discounts, and GST percentages." },
    { title: "Export", description: "Print or download the final invoice." }
  ],
  engine: "calculator",
  privacyNote: "none"
}
