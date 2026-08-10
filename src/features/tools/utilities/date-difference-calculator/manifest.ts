import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "date-difference-calculator",
  name: "Date Difference Calculator",
  slug: "date-difference-calculator",
  category: "utilities",
  path: "utilities/date-difference-calculator",

  shortDescription: "Calculate exact days, weeks, months and years between two dates, or add/subtract time from any date.",
  longDescription:
    "Free online Date Difference Calculator. Find the exact difference in years, months, days, weeks, and total days between two dates. Toggle inclusive or exclusive counting, and use the Add/Subtract mode to add days, weeks, or months to any starting date. 100% private, fast, and runs locally in your browser.",

  sections: [
    {
      heading: "Exact Date Difference with Inclusive / Exclusive Counting",
      body: "Our pure date engine accurately counts calendar difference between two dates. Toggle 'Include end date (+1 day)' for workdays, rental durations, or inclusive period calculations.",
    },
    {
      heading: "Add & Subtract Days, Weeks, Months, or Years",
      body: "Need to know what date is 45 days from today or 6 months ago? Use the built-in Add/Subtract mode for instant calendar arithmetic.",
    },
  ],

  primaryKeyword: "date difference calculator",
  keywords: [
    "days between dates",
    "date calculator",
    "calculate days between two dates",
    "add days to date",
    "subtract days from date",
    "date count calculator",
  ],
  searchAliases: [
    "days count",
    "calendar diff",
    "date math calculator",
  ],
  searchWeight: 90,

  relatedTools: ["age-calculator", "time-zone-converter", "unit-converter"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-08-10",

  schemaType: "Calculator",
  icon: "calendar-days",
  faq: [
    {
      question: "What is the difference between inclusive and exclusive date counting?",
      answer: "Exclusive counting calculates elapsed time from Start Date to End Date (e.g. Jan 1 to Jan 2 = 1 day). Inclusive counting includes both start and end days (e.g. Jan 1 to Jan 2 = 2 days).",
    },
    {
      question: "How are month-end dates handled when adding months?",
      answer: "When adding 1 month to Jan 31 in a non-leap year, the result lands on Feb 28 to prevent overflow into March.",
    },
  ],
  howTo: [
    { title: "Select Start & End Dates", description: "Choose two dates to calculate elapsed time." },
    { title: "Toggle Inclusive Counting", description: "Optionally include the end date for event or work counts." },
    { title: "Use Add/Subtract Mode", description: "Switch tabs to calculate a future or past date by adding days/months." },
  ],

  engine: "calculator",
  privacyNote: "client",
}

export default definition
