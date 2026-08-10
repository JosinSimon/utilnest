import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "stopwatch",
  name: "Stopwatch",
  slug: "stopwatch",
  category: "utilities",
  path: "utilities/stopwatch",

  shortDescription: "High-precision online stopwatch with lap recording and drift-free timestamp performance.",
  longDescription:
    "Free online Stopwatch for timing sports, exercises, speeches, and tasks. Features lap tracking, split time comparisons, exportable lap logs, and high-precision millisecond timing powered by performance.now() timestamps. 100% private and runs locally in your browser.",

  sections: [
    {
      heading: "Timestamp-Based High Precision & Lap Splits",
      body: "Our Stopwatch uses `performance.now()` hardware timestamps rather than tick counters, ensuring millisecond accuracy even across background browser tabs. Track unlimited laps with instant split-time calculations.",
    },
    {
      heading: "Lap Time Export & Copying",
      body: "Export recorded lap splits directly to your clipboard for training logs, athletic records, or time studies.",
    },
  ],

  primaryKeyword: "online stopwatch",
  keywords: [
    "stopwatch timer",
    "online stopwatch with laps",
    "millisecond stopwatch",
    "lap timer",
    "stopwatch online free",
  ],
  searchAliases: [
    "stop watch",
    "lap counter",
    "split timer",
  ],
  searchWeight: 95,

  relatedTools: ["timer", "time-zone-converter", "date-difference-calculator"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-08-10",

  schemaType: "Utility",
  icon: "watch",
  faq: [
    {
      question: "Does the stopwatch continue accurately in background tabs?",
      answer: "Yes! Because elapsed time is computed directly from OS hardware timestamps (`performance.now()`), browser background tab throttling will not cause any timing drift.",
    },
    {
      question: "Can I copy my lap records?",
      answer: "Yes, click 'Copy Laps' to instantly copy all lap split times to your clipboard in tabular format.",
    },
  ],
  howTo: [
    { title: "Start / Pause", description: "Click Start to launch high-precision millisecond stopwatch." },
    { title: "Record Laps", description: "Click Lap while running to record intermediate split times." },
    { title: "Copy Laps or Reset", description: "Copy your lap history or reset to zero anytime." },
  ],

  engine: "calculator",
  privacyNote: "client",
}

export default definition
