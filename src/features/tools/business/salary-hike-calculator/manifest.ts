import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "salary-hike-calculator",
  name: "Salary Hike Calculator",
  slug: "salary-hike-calculator",
  category: "business",
  path: "business/salary-hike-calculator",
  shortDescription:
    "Calculate your new monthly salary, annual CTC and total increment from any hike percentage, with a rough take-home pay estimate.",
  longDescription:
    "Enter your current annual CTC or monthly salary and the hike percentage to see your new salary, the increase per month and per year, and your new annual package. The tool also gives a rough monthly take-home figure after employee PF and professional tax, so you can judge an appraisal letter or a job offer quickly.",
  sections: [
    {
      heading: "Salary hike formula",
      body: "Increase = Current salary × Hike % ÷ 100. New salary = Current salary + Increase, which is the same as Current salary × (1 + Hike % ÷ 100). Example: a ₹6,00,000 CTC with a 20% hike rises by ₹1,20,000 to ₹7,20,000 a year. That is ₹60,000 a month, or ₹10,000 more each month than before. You can enter either an annual CTC or a monthly salary, and the tool shows both the monthly and yearly figures.",
    },
    {
      heading: "How to find the hike percentage from two salaries",
      body: "If you have an offer letter with a new figure and want to know the hike, use Hike % = (New salary − Old salary) ÷ Old salary × 100. Example: moving from ₹45,000 to ₹52,000 a month is a ₹7,000 increase, which is a 15.56% hike. Compare like with like: CTC against CTC, or fixed pay against fixed pay. If the new CTC includes a variable bonus, joining bonus or stock that your old one did not, the headline hike will look bigger than the change in your monthly pay.",
    },
    {
      heading: "CTC, gross salary and in-hand pay",
      body: "CTC (cost to company) is everything your employer spends on you in a year. It can include employer PF, gratuity, insurance and variable pay as well as your salary. Gross salary is what you earn before deductions. In-hand pay is what reaches your bank account after employee PF, professional tax and income tax (TDS). So a 20% hike on CTC does not always mean 20% more in your account each month. Check your payslip or offer breakup to see which parts actually changed.",
    },
    {
      heading: "How the take-home estimate works",
      body: "The estimate is a rough guide, not a payslip. It treats one-twelfth of the new annual figure as gross monthly pay and assumes basic pay is half of it. It then deducts employee PF at 12% of basic, capped at ₹1,800 a month, and ₹200 of professional tax when monthly pay is above ₹15,000. For ₹7,20,000 that gives ₹60,000 − ₹1,800 − ₹200 = ₹58,000 a month. Income tax is not deducted, because it depends on your regime and deductions. Professional tax varies by state and some states do not charge it. If your CTC includes employer PF or variable pay, your real in-hand will be lower.",
    },
    {
      heading: "Hikes over several years and inflation",
      body: "Hikes compound, because each year's percentage applies to the new, higher salary. Three 10% hikes take ₹6,00,000 to ₹6,60,000, then ₹7,26,000, then ₹7,98,600, a 33.1% rise in total, not 30%. To model this, run the calculator once per year using the previous result. Also compare your hike with price rises: an 8% hike in a year when prices rose 5% is a real increase of about 2.86%, because (1.08 ÷ 1.05) − 1 ≈ 0.0286.",
    },
  ],
  examples: [
    {
      title: "Annual CTC with a 20% hike",
      input: "Current ₹6,00,000 a year · Hike 20%",
      output: "New CTC ₹7,20,000 · ₹60,000 a month · +₹10,000 a month",
    },
    {
      title: "Monthly salary with a 15% hike",
      input: "Current ₹50,000 a month · Hike 15%",
      output: "New ₹57,500 a month · ₹6,90,000 a year · Est. take-home ₹55,500",
    },
    {
      title: "Higher CTC, smaller hike",
      input: "Current ₹12,00,000 a year · Hike 8%",
      output: "New CTC ₹12,96,000 · ₹1,08,000 a month · +₹96,000 a year",
    },
  ],
  primaryKeyword: "salary hike calculator",
  keywords: [
    "salary increment calculator",
    "salary increase calculator",
    "ctc hike calculator",
    "appraisal calculator india",
    "hike percentage calculator",
    "how to calculate salary hike percentage",
    "new salary after hike",
    "salary hike calculator in hand",
    "increment percentage calculator",
  ],
  searchAliases: ["salary raise", "increment calculator", "appraisal hike", "pay rise", "ctc increase", "hike percentage"],
  searchWeight: 78,
  relatedTools: ["income-tax-calculator", "hra-calculator", "gratuity-calculator", "emi-calculator", "commission-calculator"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-11-11",
  schemaType: "Calculator",
  icon: "arrow-up-circle",
  faq: [
    {
      question: "How is a salary hike calculated?",
      answer:
        "Multiply your current salary by the hike percentage and divide by 100 to get the increase, then add it to your current salary. New salary = Current × (1 + Hike % ÷ 100).",
    },
    {
      question: "What is the new CTC for ₹6,00,000 with a 20% hike?",
      answer:
        "The increase is ₹1,20,000, so the new CTC is ₹7,20,000 a year, or ₹60,000 a month.",
    },
    {
      question: "How do I calculate the hike percentage between my old and new salary?",
      answer:
        "Subtract the old salary from the new one, divide by the old salary and multiply by 100. ₹45,000 to ₹52,000 is a 15.56% hike.",
    },
    {
      question: "What is ₹50,000 a month with a 15% hike?",
      answer:
        "The increase is ₹7,500, so the new salary is ₹57,500 a month or ₹6,90,000 a year. The tool estimates take-home at about ₹55,500 a month before income tax.",
    },
    {
      question: "Why is my in-hand salary increase smaller than my hike?",
      answer:
        "Your CTC may include employer PF, gratuity, insurance or variable pay that you do not receive monthly, and income tax rises as your salary rises. Only part of a CTC hike shows up as extra monthly pay.",
    },
    {
      question: "Does the take-home estimate include income tax?",
      answer:
        "No. It only deducts employee PF and professional tax. Income tax depends on the old or new regime and your deductions, so use the Income Tax Calculator for that.",
    },
  ],
  howTo: [
    {
      title: "Choose annual or monthly",
      description: "Pick Annual CTC if you know your yearly package, or Monthly Salary if you know your monthly pay.",
    },
    {
      title: "Enter your current salary",
      description: "Type the current amount in rupees, for example 600000 for ₹6 lakh a year.",
    },
    {
      title: "Enter the hike percentage",
      description: "Type the appraisal or offer hike, such as 10 or 20.",
    },
    {
      title: "Review the results",
      description: "See the new monthly salary, new annual CTC, extra per month and per year, and the rough take-home estimate.",
    },
  ],
  engine: "calculator",
  privacyNote: "none",
}
