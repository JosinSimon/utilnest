import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "commission-calculator",
  name: "Commission Calculator",
  slug: "commission-calculator",
  category: "business",
  path: "business/commission-calculator",
  shortDescription: "Calculate sales commission and net amount retained.",
  longDescription: "Calculate sales commission based on a percentage rate. Find out how much commission is earned by the agent and the net amount retained by the business.",
  sections: [
    {
      heading: "What is Sales Commission?",
      body: "Sales commission is the amount of money paid to an employee upon completion of a task, usually selling a certain amount of goods or services. It is typically a percentage of the total sale amount."
    }
  ],
  examples: [
    {
      title: "Sale ₹1,00,000 at 5% commission",
      input: "Sale: ₹1,00,000, Rate: 5%",
      output: "Commission: ₹5,000, Net: ₹95,000"
    }
  ],
  primaryKeyword: "commission calculator",
  keywords: ["sales commission calculator", "commission percentage calculator", "agent commission calculator"],
  searchAliases: ["sales commission", "commission percent"],
  searchWeight: 72,
  relatedTools: ["break-even-calculator", "profit-margin-calculator", "salary-hike-calculator"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-08-10",
  schemaType: "Calculator",
  icon: "hand-coins",
  faq: [
    { question: "How to calculate sales commission?", answer: "Commission = Sale Amount × Rate% / 100." },
    { question: "Sale ₹1,00,000 at 5% commission?", answer: "Commission ₹5,000. Net ₹95,000." },
    { question: "Can I calculate commission for different rates?", answer: "Yes, just change the rate field." }
  ],
  howTo: [
    { title: "Step 1", description: "Enter sale amount" },
    { title: "Step 2", description: "Enter commission rate" },
    { title: "Step 3", description: "See commission and net instantly" }
  ],
  engine: "calculator",
  privacyNote: "none",
}
