import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "timer",
  name: "Timer",
  slug: "timer",
  category: "utilities",
  path: "utilities/timer",

  shortDescription: "Online countdown timer with presets, audio chime, and drift-free performance.now() accuracy.",
  longDescription:
    "Free online Countdown Timer for productivity, cooking, studying, and workouts. Features quick 1m, 5m, 10m, 25m Pomodoro, and 1h presets, Web Audio chime alerts, and background tab drift protection powered by high-precision performance.now() timestamps. 100% private and runs locally in your browser.",

  sections: [
    {
      heading: "Drift-Free Timestamp Engine",
      body: "Standard timers slow down when you switch browser tabs due to background throttling. Our timer uses `performance.now()` elapsed timestamp calculations to ensure 100% timing accuracy even when working in other windows.",
    },
    {
      heading: "Pomodoro & Quick Presets",
      body: "Boost your productivity with built-in presets: 1 minute, 5 minute break, 25 minute Pomodoro focus session, or custom hours, minutes, and seconds.",
    },
  ],

  primaryKeyword: "online timer",
  keywords: [
    "countdown timer",
    "5 minute timer",
    "25 minute pomodoro timer",
    "online timer with sound",
    "study timer",
    "kitchen timer online",
  ],
  searchAliases: [
    "timer online",
    "alarm timer",
    "pomodoro timer",
  ],
  searchWeight: 95,

  relatedTools: ["stopwatch", "time-zone-converter", "age-calculator"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-08-10",

  schemaType: "Utility",
  icon: "timer",
  faq: [
    {
      question: "Will the timer slow down if I switch to another tab?",
      answer: "No! The timer uses hardware `performance.now()` timestamp comparisons so it never loses time or drifts when running in background tabs.",
    },
    {
      question: "How does the audio alarm work?",
      answer: "The chime uses the browser's native Web Audio API synthesizer. No external audio files are downloaded, making it instantaneous and privacy-friendly.",
    },
  ],
  howTo: [
    { title: "Set Time or Select Preset", description: "Choose hours, minutes, seconds or click a quick preset like 25 min Pomodoro." },
    { title: "Start Timer", description: "Click Start to begin countdown with visual progress bar." },
    { title: "Pause / Resume", description: "Pause anytime or listen for the Web Audio chime when the countdown finishes." },
  ],

  engine: "calculator",
  privacyNote: "client",
}

export default definition
