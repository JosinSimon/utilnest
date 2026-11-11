import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "age-calculator",
  name: "Age Calculator",
  slug: "age-calculator",
  category: "utilities",
  path: "utilities/age-calculator",

  shortDescription:
    "Calculate exact age in years, months and days from date of birth, as on today or any cut-off date. Also shows total days, weeks and your next birthday.",
  longDescription:
    "Find your exact age in years, months and days from your date of birth. Check age as on today or on any other date, such as the cut-off date in an exam or job notification. The calculator also shows your age in total months, weeks, days and hours, and counts the days to your next birthday.",

  sections: [
    {
      heading: "How age is calculated",
      body: "The calculator first counts full years from your date of birth, then full months after your last birthday, then the remaining days. This is the same way people count age by hand, so it matches what forms and offices expect. Example: someone born on 15 August 1990 is 36 years, 2 months and 27 days old on 11 November 2026. Their last birthday was 15 August 2026, two full months take them to 15 October, and 27 more days reach 11 November.",
    },
    {
      heading: "Age as on a cut-off date",
      body: "Government recruitment notices, entrance exams and school admissions often set an age limit as on a specific date, not as on the day you apply. Enter that date in the Calculate Age On box. Example: a candidate born on 2 March 2004 is 22 years, 4 months and 30 days old as on 1 August 2026. Compare this with the minimum and maximum age in the notice, and remember that relaxations for categories such as SC, ST, OBC or PwBD are set by each notice, so read the official rules.",
    },
    {
      heading: "Total days, weeks, months and hours",
      body: "Below the main result, the calculator shows the same age in other units. For the 15 August 1990 example on 11 November 2026, that is 434 total months, 1,891 complete weeks and 13,237 days. Total hours are the total days × 24, which gives 317,688 hours. Birth time is not entered, so hours are counted from midnight. These totals are handy for milestone days, such as your 10,000th day, or for forms that ask for age in months, like infant vaccination or child growth charts.",
    },
    {
      heading: "Next birthday countdown",
      body: "The tool shows the date and weekday of your next birthday and how many days remain. For the same example, the next birthday is Sunday, 15 August 2027, which is 277 days after 11 November 2026. If the Calculate Age On date is your birthday, the countdown shows 0 days. People born on 29 February are flagged with a leap-year note, since their actual birthday appears only in leap years.",
    },
    {
      heading: "Tips for accurate results",
      body: "Enter the date of birth exactly as it appears on your birth certificate, Class 10 marksheet, Aadhaar or passport, because those are the dates official checks use. The date box follows your device's date format, so on most Indian phones it reads DD/MM/YYYY. Watch for swapped day and month when copying a date from a US-style document. The Calculate Age On date must be the same as or after the date of birth, or the tool will show an error.",
    },
  ],

  examples: [
    {
      title: "Age today",
      input: "Born 15 Aug 1990 · Age on 11 Nov 2026",
      output: "36 years, 2 months, 27 days · next birthday in 277 days",
    },
    {
      title: "Exam cut-off date",
      input: "Born 2 Mar 2004 · Age on 1 Aug 2026",
      output: "22 years, 4 months, 30 days",
    },
    {
      title: "Turning 18",
      input: "Born 1 Jan 2008 · Age on 1 Jan 2026",
      output: "18 years, 0 months, 0 days · 6,575 total days",
    },
  ],

  primaryKeyword: "age calculator",
  keywords: [
    "age calculator by date of birth",
    "exact age calculator",
    "age calculator in years months and days",
    "age calculator as on date",
    "age calculator for government exam",
    "date of birth calculator",
    "how old am i",
    "age in days calculator",
    "next birthday calculator",
    "age calculator india",
  ],
  searchAliases: [
    "dob calculator",
    "birthday calculator",
    "calculate my age",
    "age finder",
    "age checker",
    "how old am i",
  ],
  searchWeight: 95,

  relatedTools: ["date-difference-calculator", "time-zone-converter", "unit-converter"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-11-11",

  schemaType: "Calculator",
  icon: "calendar",
  faq: [
    {
      question: "How do I calculate my exact age from my date of birth?",
      answer:
        "Enter your date of birth and leave Calculate Age On set to today. The tool counts full years, then full months, then the remaining days, and shows the result as years, months and days.",
    },
    {
      question: "How do I calculate age as on a specific date for an exam form?",
      answer:
        "Change Calculate Age On to the cut-off date given in the notification, for example 1 August 2026. The result is your age on that date, which you can compare with the age limits in the notice.",
    },
    {
      question: "How many days old am I?",
      answer:
        "Look at Total Days in the results. Someone born on 15 August 1990 is 13,237 days old on 11 November 2026. The tool also shows total weeks, months and hours.",
    },
    {
      question: "How does the calculator handle months with different lengths?",
      answer:
        "It counts calendar months, not fixed 30-day blocks. If a month is shorter than your birth date (for example, born on the 31st), it uses the last day of that month.",
    },
    {
      question: "What if I was born on 29 February?",
      answer:
        "The calculator recognises leap-day birthdays and shows a note. In years without 29 February it treats 1 March as your birthday, both for your age and for the next-birthday countdown, which is the rule many countries use for legal age.",
    },
    {
      question: "Is my date of birth stored?",
      answer:
        "No. The calculation runs in your browser and the dates you enter are not uploaded or saved.",
    },
  ],
  howTo: [
    {
      title: "Enter date of birth",
      description: "Pick your date of birth from the calendar or type it in your device's date format.",
    },
    {
      title: "Set the 'age on' date",
      description: "Leave it as today, or change it to a cut-off date from an exam, job or admission notice.",
    },
    {
      title: "Read your age",
      description: "See your exact age in years, months and days at the top of the results.",
    },
    {
      title: "Check the extras",
      description: "Review total months, weeks, days and hours, and the countdown to your next birthday.",
    },
  ],

  engine: "calculator",
  privacyNote: "client",
}

export default definition
