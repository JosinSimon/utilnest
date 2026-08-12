import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "salary-hike-calculator",
  name: "Salary Hike Calculator",
  slug: "salary-hike-calculator",
  category: "business",
  path: "business/salary-hike-calculator",
  shortDescription: "Calculate your new monthly salary, annual CTC and total increment from any hike percentage.",
  longDescription: "Calculate your new monthly salary and annual CTC after an increment. Instantly see your monthly and annual increase.",
  sections: [
    {
      heading: "Understanding CTC and Hike",
      body: "CTC (Cost to Company) is your total annual package including PF, gratuity and perks. A percentage hike applies to your current base or CTC depending on your company's policy."
    }
  ],
  examples: [
    {
      title: "CTC ₹6,00,000 with 20% hike",
      input: "Current: ₹6,00,000 (Annual), Hike: 20%",
      output: "New CTC: ₹7,20,000, Monthly: ₹60,000"
    }
  ],
  primaryKeyword: "salary hike calculator",
  keywords: ["salary increment calculator", "salary increase calculator", "ctc hike calculator", "appraisal calculator india"],
  searchAliases: ["salary raise", "increment calculator"],
  searchWeight: 78,
  relatedTools: ["income-tax-calculator", "emi-calculator", "commission-calculator"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-08-10",
  schemaType: "Calculator",
  icon: "arrow-up-circle",
  faq: [
    { question: "CTC ₹6,00,000 with 20% hike — new CTC?", answer: "Increase ₹1,20,000. New CTC ₹7,20,000 = ₹60,000/month." },
    { question: "How is hike calculated?", answer: "New salary = current × (1 + hike% / 100)." },
    { question: "Monthly ₹50,000 with 15% hike — new salary?", answer: "Increase ₹7,500. New monthly ₹57,500. New annual ₹6,90,000." }
  ],
  howTo: [
    { title: "Step 1", description: "Choose monthly or annual" },
    { title: "Step 2", description: "Enter current salary" },
    { title: "Step 3", description: "Enter hike%" },
    { title: "Step 4", description: "See new salary" }
  ],
  engine: "calculator",
  privacyNote: "none",
}
