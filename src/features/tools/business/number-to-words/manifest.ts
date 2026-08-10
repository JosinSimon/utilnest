import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "number-to-words",
  name: "Number to Words Converter",
  slug: "number-to-words",
  category: "business",
  path: "business/number-to-words",
  shortDescription: "Convert numbers into words for cheques and documents.",
  longDescription: "Convert numbers into words easily. Supports Indian format (Lakhs, Crores) and International format (Millions, Billions), with plain text or currency modes.",
  sections: [
    {
      heading: "Writing Cheques Correctly",
      body: "When writing cheques, it is important to clearly write the amount in words to avoid fraud. Always append 'Only' at the end of the amount."
    }
  ],
  examples: [
    {
      title: "Convert ₹12,45,678",
      input: "1245678, System: Indian, Mode: Currency",
      output: "Twelve Lakh Forty Five Thousand Six Hundred Seventy Eight Rupees Only"
    }
  ],
  primaryKeyword: "number to words",
  keywords: ["number to words converter", "amount in words", "rupees in words", "cheque amount words", "amount words indian"],
  searchAliases: ["amount in words", "rupees to words"],
  searchWeight: 82,
  relatedTools: ["invoice-generator", "receipt-generator", "quotation-generator"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-08-10",
  schemaType: "Converter",
  icon: "case-sensitive",
  faq: [
    { question: "What is 12,45,678 in words?", answer: "Twelve Lakh Forty Five Thousand Six Hundred Seventy Eight." },
    { question: "How to write ₹1,00,000 in words for a cheque?", answer: "One Lakh Rupees Only." },
    { question: "What about amounts with paise?", answer: "₹999.50 → Nine Hundred Ninety Nine Rupees and Fifty Paise Only." }
  ],
  howTo: [
    { title: "Step 1", description: "Enter the number" },
    { title: "Step 2", description: "Choose Indian or International system" },
    { title: "Step 3", description: "Choose currency or plain mode" },
    { title: "Step 4", description: "Copy the result" }
  ],
  engine: "calculator",
  privacyNote: "none",
}
