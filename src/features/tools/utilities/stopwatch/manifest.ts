import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "stopwatch",
  name: "Stopwatch",
  slug: "stopwatch",
  category: "utilities",
  path: "utilities/stopwatch",

  shortDescription:
    "Free online stopwatch with lap and split times to 1/100 second. Start, pause, record laps and copy them as text. Works in your browser with no sign-up.",
  longDescription:
    "Time a run, a workout, a speech or a mock test section with a simple online stopwatch. It shows minutes, seconds and hundredths, records as many laps as you need with both lap and split times, and lets you copy the lap list as plain text. It runs entirely in your browser and needs no sign-up.",

  sections: [
    {
      heading: "How the stopwatch keeps time",
      body: "When you press Start, the stopwatch notes a high-resolution timestamp from your browser (performance.now) and works out elapsed time by comparing each new reading with that start point. It does not count ticks, so a slow or busy page does not make it lose time. If you switch to another tab, the browser may stop redrawing the display, but the time is still correct when you come back. The display shows MM:SS.hh, where hh is hundredths of a second, and adds hours once you pass 60 minutes.",
    },
    {
      heading: "Lap time vs split time",
      body: "Press Lap while the stopwatch runs to record a lap. The table shows two numbers for each one. Lap Time is the time since the previous lap. Overall Split Time is the total time since you pressed Start. Example: if you press Lap at 01:05.20, 02:12.85 and 03:18.40, the lap times are 01:05.20, 01:07.65 and 01:05.55, and the splits are the three readings themselves. The newest lap appears at the top so you can see it without scrolling.",
    },
    {
      heading: "Pause, resume and reset",
      body: "Pause stops the clock and keeps the time on screen. Press Start again to carry on from the same point, and the paused time is not counted. This is useful for interval training, where you rest between sets, or for timing only the parts of a task you actually spend working. Reset clears the time and the full lap list, so copy your laps first if you need them. The Lap button only works while the stopwatch is running.",
    },
    {
      heading: "Copying laps to notes or a spreadsheet",
      body: "Click Copy Laps to put every lap on your clipboard as plain text, one lap per line, for example: Lap 2: 00:01:07.65 (Split: 00:02:12.85). Paste it into a notes app, WhatsApp, an email or a spreadsheet. Coaches use this to log track sessions, students use it to see how long each section of a practice paper took, and teams use it for simple time-and-motion checks on a repeated task.",
    },
    {
      heading: "Accuracy and practical limits",
      body: "The clock itself is very precise, but a hand-started stopwatch is only as accurate as the person pressing the button. Your reaction time adds a small delay at the start and stop of every reading, so treat hundredths as a guide for training, not an official result. The stopwatch keeps its time in the open page only. Refreshing or closing the tab clears it, so keep the page open until you have copied the results you need.",
    },
  ],

  examples: [
    {
      title: "Three laps on a track",
      input: "Lap pressed at 01:05.20, 02:12.85 and 03:18.40",
      output: "Lap times 01:05.20, 01:07.65, 01:05.55",
    },
    {
      title: "Timing past one hour",
      input: "Run for 1 hour, 2 minutes and 5.4 seconds",
      output: "Display shows 01:02:05.40",
    },
    {
      title: "Copied lap line",
      input: "Copy Laps after 2 laps",
      output: "Lap 2: 00:01:07.65 (Split: 00:02:12.85)",
    },
  ],

  primaryKeyword: "online stopwatch",
  keywords: [
    "stopwatch",
    "online stopwatch with laps",
    "stopwatch with milliseconds",
    "lap timer online",
    "split time calculator",
    "free stopwatch online",
    "stopwatch for running",
    "stopwatch online with hundredths",
    "stopwatch with copy laps",
  ],
  searchAliases: [
    "chronometer",
    "lap timer",
    "split timer",
    "stop watch",
    "timer with laps",
    "count up timer",
  ],
  searchWeight: 95,

  relatedTools: ["timer", "time-zone-converter", "date-difference-calculator"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-11-11",

  schemaType: "Utility",
  icon: "watch",
  faq: [
    {
      question: "Does the stopwatch keep running if I switch tabs?",
      answer:
        "Yes. Elapsed time is worked out from timestamps, not from counting ticks. The display may freeze while the tab is hidden, but it shows the correct time as soon as you return.",
    },
    {
      question: "What is the difference between lap time and split time?",
      answer:
        "Lap time is how long one lap took, measured from the previous lap press. Split time is the total time since Start. Laps at 01:05.20 and 02:12.85 give a second lap time of 01:07.65.",
    },
    {
      question: "How accurate is this online stopwatch?",
      answer:
        "It reads a high-resolution browser clock and displays time to 1/100 of a second. In practice, the delay in pressing Start, Lap or Stop by hand is larger than any error in the clock itself.",
    },
    {
      question: "Will my laps be saved if I refresh the page?",
      answer:
        "No. The time and laps live only in the open page and are not stored anywhere. Use Copy Laps before you refresh, close the tab or press Reset.",
    },
    {
      question: "Is there a limit on time or number of laps?",
      answer:
        "There is no set limit on laps. The display switches to HH:MM:SS.hh after one hour and keeps counting while the page stays open.",
    },
    {
      question: "Can I pause and continue later?",
      answer:
        "Yes. Pause stops the clock, and Start continues from the same time. The paused period is not added to the total.",
    },
  ],
  howTo: [
    {
      title: "Press Start",
      description: "The clock starts counting from 00:00.00 in minutes, seconds and hundredths.",
    },
    {
      title: "Record laps",
      description: "Press Lap at the end of each lap or section. The table shows lap time and overall split time.",
    },
    {
      title: "Pause or resume",
      description: "Press Pause to stop the clock during a break and Start to continue from the same point.",
    },
    {
      title: "Copy and reset",
      description: "Click Copy Laps to save the results as text, then press Reset to clear everything for the next session.",
    },
  ],

  engine: "calculator",
  privacyNote: "client",
}

export default definition
