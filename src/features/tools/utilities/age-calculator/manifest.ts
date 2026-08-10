import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "age-calculator",
  name: "Age Calculator",
  slug: "age-calculator",
  category: "utilities",
  path: "utilities/age-calculator",

  shortDescription: "Calculate exact age in years, months, days, weeks, and total days between your birth date and any target date.",
  longDescription:
    "Free online calendar-aware Age Calculator. Determine exact age in years, months, and days, plus total months, weeks, days, and hours lived. Handles leap years, Feb 29 birthdays, and displays days remaining until your next birthday. 100% private and runs locally in your browser.",

  sections: [
    {
      heading: "Calendar-Aware Exact Age Calculation",
      body: "Unlike simplistic calculators that assume 365 days every year or 30 days every month, our engine calculates age using actual calendar month lengths and leap years. You get 100% precise results.",
    },
    {
      heading: "Next Birthday Countdown & Lifetime Totals",
      body: "In addition to your age in years/months/days, view total breakdown in months, weeks, days, hours, and the exact day of the week for your upcoming birthday.",
    },
  ],

  primaryKeyword: "age calculator",
  keywords: [
    "age calculator online",
    "calculate age by date of birth",
    "exact age calculator",
    "dob calculator",
    "how old am i",
    "days until next birthday",
  ],
  searchAliases: [
    "birth date calculator",
    "chronological age calculator",
    "birthday countdown",
  ],
  searchWeight: 95,

  relatedTools: ["date-difference-calculator", "time-zone-converter", "unit-converter"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-08-10",

  schemaType: "Calculator",
  icon: "calendar",
  faq: [
    {
      question: "How is exact age calculated with different month lengths?",
      answer: "The calculator steps back from the target date month-by-month using actual calendar days per month (28, 29, 30, or 31) and accounts for leap years.",
    },
    {
      question: "How does the calculator handle February 29 leap year birthdays?",
      answer: "In non-leap years, February 29 birthdays are calculated as turning a year older on February 28 or March 1, maintaining exact calendar accuracy.",
    },
  ],
  howTo: [
    { title: "Select Date of Birth", description: "Pick your birth date from the calendar picker." },
    { title: "Choose Target Date", description: "Keep today's date or select a custom date to calculate your age on." },
    { title: "View Age Breakdown", description: "Instantly see years, months, days, total weeks/days, and next birthday countdown." },
  ],

  engine: "calculator",
  privacyNote: "client",
}

export default definition
