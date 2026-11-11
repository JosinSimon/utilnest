import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "time-zone-converter",
  name: "Time Zone Converter",
  slug: "time-zone-converter",
  category: "utilities",
  path: "utilities/time-zone-converter",

  shortDescription:
    "Convert IST to EST, PST, GMT, CET, GST, SGT, AEST and more for any date. Daylight saving is applied automatically, and date changes are shown.",
  longDescription:
    "Convert a date and time between India Standard Time and major time zones in the US, UK, Europe, the Gulf, Asia and Australia. Pick a date, a time and two zones, and the tool shows the converted time with the weekday and UTC offset for both sides. Daylight saving changes are handled for the exact date you choose, so the answer is right in summer and in winter.",

  sections: [
    {
      heading: "Time zones included",
      body: "The converter covers 14 zones: India (IST, Asia/Kolkata), US Eastern (New York), Central (Chicago), Mountain (Denver) and Pacific (Los Angeles), London, Central Europe (Paris and Berlin), Dubai, Singapore, Tokyo, Sydney, Kathmandu, Auckland and UTC. All of India uses one zone, IST, which is UTC+5:30 all year with no daylight saving. Choose a From and To zone, enter the date and a 24-hour time, and use the swap button to reverse the direction.",
    },
    {
      heading: "Daylight saving and the India gap",
      body: "Because India has no daylight saving, the gap to countries that do changes during the year. In 2026, US clocks move forward on 8 March and back on 1 November, so New York is 9 hours 30 minutes behind IST in summer and 10 hours 30 minutes behind in winter. The UK and EU change on 29 March and 25 October, so London is 4 hours 30 minutes behind IST in summer and 5 hours 30 minutes in winter. Sydney runs the other way, moving forward in October. The tool uses your browser's time zone data for the exact date, so you do not need to work this out yourself.",
    },
    {
      heading: "When the date changes",
      body: "Large time differences often move a time into the previous or next day. The result shows the weekday and date, so you can see this at a glance. For example, 8:00 PM on Wednesday 11 November 2026 in Los Angeles is 9:30 AM on Thursday 12 November in India. Going the other way, 9:00 AM IST on 11 November is 7:30 PM on 10 November in Los Angeles. Always check the date line in the result before sending an invite or booking a call.",
    },
    {
      heading: "Planning calls between India and abroad",
      body: "Teams in India working with US East Coast clients usually overlap in the Indian evening. In winter, 7:30 PM to 10:30 PM IST is 9:00 AM to 12:00 noon in New York. In summer, the same New York morning starts at 6:30 PM IST. For London, a 3:30 PM IST call is 10:00 AM in winter and 11:00 AM in summer. Write both times in your invite, for example 7:30 PM IST / 9:00 AM EST, so nobody has to convert it again.",
    },
    {
      heading: "Half-hour and 45-minute offsets",
      body: "Not every zone is a whole number of hours from UTC. IST is UTC+5:30 and Nepal is UTC+5:45, so Kathmandu is just 15 minutes ahead of India. Dubai (UTC+4) is 1 hour 30 minutes behind IST, Singapore (UTC+8) is 2 hours 30 minutes ahead, and Tokyo (UTC+9) is 3 hours 30 minutes ahead. These odd gaps are where mental maths most often goes wrong, so it is worth checking with the converter.",
    },
  ],

  examples: [
    {
      title: "India to New York (winter)",
      input: "Wed 11 Nov 2026, 21:00 IST → Eastern Time",
      output: "Wed 11 Nov 2026, 10:30 AM EST",
    },
    {
      title: "India to London (summer)",
      input: "Wed 15 Jul 2026, 10:00 IST → London",
      output: "Wed 15 Jul 2026, 5:30 AM BST",
    },
    {
      title: "Los Angeles to India (next day)",
      input: "Wed 11 Nov 2026, 20:00 Pacific Time → IST",
      output: "Thu 12 Nov 2026, 9:30 AM IST",
    },
  ],

  primaryKeyword: "time zone converter",
  keywords: [
    "ist to est converter",
    "ist to pst",
    "ist to gmt",
    "ist to cet",
    "india time to usa time",
    "time difference between india and usa",
    "time difference between india and uk",
    "world time converter",
    "meeting time zone converter",
    "utc to ist converter",
  ],
  searchAliases: [
    "timezone converter",
    "time converter",
    "ist converter",
    "world clock converter",
    "time difference calculator",
    "est to ist",
  ],
  searchWeight: 95,

  relatedTools: ["date-difference-calculator", "age-calculator", "timer"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-11-11",

  schemaType: "Converter",
  icon: "globe",
  faq: [
    {
      question: "What is IST in UTC?",
      answer:
        "India Standard Time is UTC+5:30. It is the same across the whole country and does not change during the year, because India does not use daylight saving time.",
    },
    {
      question: "What is the time difference between India and the USA?",
      answer:
        "It depends on the US zone and the season. New York is 10 hours 30 minutes behind IST in winter and 9 hours 30 minutes behind in summer. Los Angeles is 13 hours 30 minutes behind in winter and 12 hours 30 minutes behind in summer.",
    },
    {
      question: "What is the time difference between India and the UK?",
      answer:
        "London is 5 hours 30 minutes behind IST while the UK is on GMT (late October to late March) and 4 hours 30 minutes behind while it is on BST in summer.",
    },
    {
      question: "Does the converter handle daylight saving time?",
      answer:
        "Yes. It uses the time zone rules built into your browser for the exact date you enter, so EST/EDT, GMT/BST, CET/CEST, AEST/AEDT and NZST/NZDT are applied automatically.",
    },
    {
      question: "How do I convert 9 PM IST to EST?",
      answer:
        "Set From to India Standard Time, To to Eastern Time, enter 21:00 and pick the date. On 11 November 2026 the result is 10:30 AM EST the same day. In July it would be 11:30 AM EDT.",
    },
    {
      question: "Can I add a time zone that is not in the list?",
      answer:
        "Not at the moment. The tool covers 14 common zones, including UTC. For other places, convert to UTC first and then apply that country's UTC offset.",
    },
  ],
  howTo: [
    {
      title: "Enter the date and time",
      description: "Pick the date and type the time in 24-hour format, for example 21:00 for 9 PM.",
    },
    {
      title: "Choose the From zone",
      description: "Select the time zone where that time applies, such as India Standard Time (IST).",
    },
    {
      title: "Choose the To zone",
      description: "Select the zone you want to convert to. Use the swap button to reverse the direction.",
    },
    {
      title: "Read the result",
      description: "Check the converted time, weekday and UTC offset, and note any change of date.",
    },
  ],

  engine: "calculator",
  privacyNote: "client",
}

export default definition
