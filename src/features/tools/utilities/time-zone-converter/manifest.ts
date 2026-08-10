import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "time-zone-converter",
  name: "Time Zone Converter",
  slug: "time-zone-converter",
  category: "utilities",
  path: "utilities/time-zone-converter",

  shortDescription: "Convert date and time between global time zones with DST accuracy and IANA city lookup.",
  longDescription:
    "Free online Time Zone Converter. Convert date and time between any world time zones (IST, EST, PST, GMT, CET, JST) using browser-native IANA timezone databases. Accurately handles Daylight Saving Time (DST) transitions and fractional hour offsets. 100% private, fast, and runs locally in your browser.",

  sections: [
    {
      heading: "Native IANA Timezone Database & DST Accuracy",
      body: "Our engine uses the browser's built-in `Intl.DateTimeFormat` API and official IANA timezone identifiers (e.g. Asia/Kolkata, America/New_York). Daylight Saving Time changes and fractional hour offsets (like +5:30 or +5:45) are automatically respected.",
    },
    {
      heading: "Instant World City Lookup",
      body: "Convert time across major global business hubs including London, New York, Tokyo, Sydney, Dubai, Singapore, and Mumbai in real time.",
    },
  ],

  primaryKeyword: "time zone converter",
  keywords: [
    "time zone converter online",
    "timezone converter",
    "ist to est converter",
    "india time to us time",
    "utc offset converter",
    "dst timezone converter",
  ],
  searchAliases: [
    "world clock converter",
    "time difference between cities",
  ],
  searchWeight: 95,

  relatedTools: ["date-difference-calculator", "age-calculator", "timer"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-08-10",

  schemaType: "Converter",
  icon: "globe",
  faq: [
    {
      question: "How does the converter account for Daylight Saving Time (DST)?",
      answer: "By using native IANA timezone strings, the browser automatically applies historical and active DST rules for the specific date selected.",
    },
    {
      question: "Does it support fractional time zones like India (+5:30) or Nepal (+5:45)?",
      answer: "Yes! All non-integer UTC offsets are fully supported with exact minute precision.",
    },
  ],
  howTo: [
    { title: "Select Source Time Zone", description: "Choose origin city or timezone (e.g. Asia/Kolkata IST)." },
    { title: "Select Destination Time Zone", description: "Choose target city or timezone (e.g. America/New_York EST)." },
    { title: "Pick Date & Time", description: "Enter date and time to see instant converted local time and UTC offset." },
  ],

  engine: "calculator",
  privacyNote: "client",
}

export default definition
