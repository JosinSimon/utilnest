import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "date-difference-calculator",
  name: "Date Difference Calculator",
  slug: "date-difference-calculator",
  category: "utilities",
  path: "utilities/date-difference-calculator",

  shortDescription:
    "Count the days, weeks, months and years between two dates, with an option to include the end date. Also add or subtract days, weeks, months or years.",
  longDescription:
    "Find out how many days are between two dates, or what the date will be after a number of days, weeks, months or years. Use it for notice periods, leave, rent agreements, project deadlines, due dates and countdowns. Results show years, months and days together with total months, weeks and days, and the add or subtract mode also tells you the weekday.",

  sections: [
    {
      heading: "Two modes",
      body: "Difference Between Dates takes a start date and an end date and shows the gap as years, months and days, plus total months, total weeks and total days. Add / Subtract Time takes a start date, adds or subtracts a quantity of days, weeks, months or years, and shows the resulting date with its weekday. If you enter an end date that is earlier than the start date, the calculator swaps them for you and shows a note, so you still get a positive result.",
    },
    {
      heading: "Inclusive vs exclusive counting",
      body: "By default, the count is exclusive: it measures the time from the start date to the end date, so 10 November to 14 November is 4 days. Tick Include end date to add one day and count both ends, which gives 5 days. Use inclusive counting for leave applications, event days and attendance, where both the first and the last day count. Use the default for hotel nights, interest periods and deadlines measured from a date. When in doubt, check how your office, bank or contract counts days.",
    },
    {
      heading: "Worked examples",
      body: "From 1 January 2026 to 11 November 2026 is 314 days, or 10 months and 10 days, which is 44 complete weeks. Counting both ends gives 315 days. A full Indian financial year, 1 April 2026 to 31 March 2027, is 364 days exclusive and 365 days, or exactly 1 year, when the end date is included. From 11 November 2026 to Republic Day on 26 January 2027 is 76 days, or 2 months and 15 days.",
    },
    {
      heading: "Adding and subtracting time",
      body: "Add days to find a deadline: 60 days after 11 November 2026 is Sunday, 10 January 2027, and 90 days after is Tuesday, 9 February 2027. Subtract days to find a start date: 45 days before 11 November 2026 is Sunday, 27 September 2026. Months and years follow the calendar, not a fixed number of days. If the target month is shorter, the result moves to its last day, so 31 January 2026 plus 1 month is 28 February 2026, not 3 March. An 11-month rent agreement starting 11 November 2026 ends on 11 October 2027.",
    },
    {
      heading: "What the calculator does not do",
      body: "It counts calendar days, so weekends and public holidays are included in every total. It does not work out business days or bank working days, which depend on your state's holiday list and your employer's calendar. If a deadline falls on a Sunday or a holiday, check the rules that apply, as many offices move it to the next working day. Times of day and time zones are not used. For a person's exact age, the Age Calculator gives the same result with extra birthday details.",
    },
  ],

  examples: [
    {
      title: "Days so far this year",
      input: "1 Jan 2026 to 11 Nov 2026",
      output: "10 months, 10 days · 314 days (315 with end date)",
    },
    {
      title: "Notice period end",
      input: "11 Nov 2026 + 90 days",
      output: "Tuesday, 9 February 2027",
    },
    {
      title: "Month-end clamping",
      input: "31 Jan 2026 + 1 month",
      output: "Saturday, 28 February 2026",
    },
  ],

  primaryKeyword: "date difference calculator",
  keywords: [
    "days between two dates",
    "date calculator",
    "how many days between dates",
    "day counter",
    "add days to date",
    "subtract days from date",
    "date duration calculator",
    "notice period calculator",
    "days until date calculator",
    "weeks between dates",
  ],
  searchAliases: [
    "days calculator",
    "date duration",
    "time between dates",
    "date counter",
    "date plus days",
    "days from today",
  ],
  searchWeight: 90,

  relatedTools: ["age-calculator", "time-zone-converter", "unit-converter"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-11-11",

  schemaType: "Calculator",
  icon: "calendar-days",
  faq: [
    {
      question: "How do I count the days between two dates?",
      answer:
        "Choose Difference Between Dates, enter the start and end dates, and read Total Days. Tick Include end date if both the first and last day should be counted.",
    },
    {
      question: "Should I include the end date?",
      answer:
        "Include it when every day in the range counts, such as leave from 10 to 14 November, which is 5 days. Leave it off when you measure time elapsed, which gives 4 days for the same dates.",
    },
    {
      question: "What date is 90 days from today?",
      answer:
        "Switch to Add / Subtract Time, keep today as the start date, choose Add, enter 90 and select Days. From 11 November 2026, the answer is Tuesday, 9 February 2027.",
    },
    {
      question: "What happens when I add a month to 31 January?",
      answer:
        "The result moves to the last day of February, because February has no 31st. 31 January 2026 plus 1 month is 28 February 2026.",
    },
    {
      question: "Does the calculator skip weekends and holidays?",
      answer:
        "No. It counts calendar days, including Saturdays, Sundays and public holidays. Business-day counting is not supported.",
    },
    {
      question: "How many weeks are between two dates?",
      answer:
        "Total Weeks shows complete weeks, rounded down. For 1 January to 11 November 2026, that is 44 weeks, since 314 days is 44 weeks and 6 days.",
    },
  ],
  howTo: [
    {
      title: "Pick a mode",
      description: "Choose Difference Between Dates or Add / Subtract Time at the top.",
    },
    {
      title: "Enter the dates",
      description: "Set the start and end dates, or a start date with a quantity and a unit of days, weeks, months or years.",
    },
    {
      title: "Choose inclusive or add/subtract",
      description: "Tick Include end date to count both ends, or pick Add or Subtract in the second mode.",
    },
    {
      title: "Read the result",
      description: "See years, months and days with total months, weeks and days, or the new date and its weekday.",
    },
  ],

  engine: "calculator",
  privacyNote: "client",
}

export default definition
