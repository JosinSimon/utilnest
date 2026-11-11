import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "timer",
  name: "Timer",
  slug: "timer",
  category: "utilities",
  path: "utilities/timer",

  shortDescription:
    "Free online countdown timer with 1 to 60 minute presets, a 25-minute Pomodoro, custom hours, minutes and seconds, and a chime when time is up.",
  longDescription:
    "Set a countdown for study, cooking, workouts, meetings or a Pomodoro session. Pick a one-click preset or type any duration up to 23 hours 59 minutes 59 seconds, then start, pause and reset as you need. A progress bar shows how much time has passed, and a short two-tone chime plays when the countdown reaches zero.",

  sections: [
    {
      heading: "Presets and custom durations",
      body: "The quick presets cover the times people set most often: 1, 5, 10, 15 and 30 minutes, a 25-minute Pomodoro and 1 hour. Click one and the timer is ready to start. For anything else, type hours (0 to 23), minutes (0 to 59) and seconds (0 to 59) in the Custom Duration boxes. Changing the duration stops the current countdown and loads the new time, so set it before you press Start. The default is 5 minutes.",
    },
    {
      heading: "How the countdown stays accurate",
      body: "The timer records a high-resolution timestamp when you press Start and works out the remaining time from the real time that has passed. It does not rely on counting one-second ticks, which can drift on a busy page. The display shows MM:SS, or HH:MM:SS for durations of an hour or more, and rounds up to the next whole second, so 00:01 means one second or less is left. Pause keeps the remaining time, and Start continues from there.",
    },
    {
      heading: "Hearing the alarm",
      body: "When the countdown ends, the card turns green, the heading changes to Timer Complete and a short chime plays once. The sound is generated in your browser, so nothing is downloaded. Press the bell button before you start to test the chime and check your volume, as some browsers block sound until you interact with the page. Keep this tab open and in front: browsers pause screen updates in hidden tabs, so the chime may only play when you switch back. Press Reset to run the same duration again.",
    },
    {
      heading: "Using the Pomodoro preset",
      body: "The Pomodoro method splits work into focused blocks with short breaks. A common pattern is 25 minutes of work, then a 5-minute break, and a longer break of 15 to 30 minutes after four rounds. Click 25 min Pomodoro to start a work block, then click 5 min when the chime plays. Students preparing for board exams or competitive tests often use this to keep study sessions short and regular. Adjust the times if longer blocks suit you better.",
    },
    {
      heading: "Everyday uses",
      body: "Time a mock test section, a presentation rehearsal or a stand-up meeting. In the kitchen, use it for boiling eggs, resting dough or a slow simmer when you do not want to watch the clock. For workouts, set 30 seconds or 1 minute for planks and rest intervals. Parents use short timers for screen time or turn-taking. For counting up rather than down, or recording laps, use the Stopwatch instead.",
    },
  ],

  examples: [
    {
      title: "Pomodoro work block",
      input: "Click 25 min Pomodoro, then Start",
      output: "Counts down from 25:00 and chimes at 00:00",
    },
    {
      title: "Custom exam section",
      input: "1 hour 30 minutes 0 seconds",
      output: "Display starts at 01:30:00",
    },
    {
      title: "Plank interval",
      input: "0 hours, 0 minutes, 45 seconds",
      output: "Display starts at 00:45",
    },
  ],

  primaryKeyword: "online timer",
  keywords: [
    "countdown timer",
    "online countdown timer",
    "timer with alarm",
    "5 minute timer",
    "10 minute timer",
    "25 minute pomodoro timer",
    "1 hour timer",
    "study timer online",
    "kitchen timer online",
    "set a timer for 30 minutes",
  ],
  searchAliases: [
    "countdown",
    "alarm timer",
    "pomodoro timer",
    "focus timer",
    "egg timer",
    "set timer",
  ],
  searchWeight: 95,

  relatedTools: ["stopwatch", "time-zone-converter", "age-calculator"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-11-11",

  schemaType: "Utility",
  icon: "timer",
  faq: [
    {
      question: "How do I set a timer for a custom time?",
      answer:
        "Type the hours, minutes and seconds in the Custom Duration Setup boxes, then press Start. For example, 0 hours, 45 minutes and 0 seconds sets a 45:00 countdown.",
    },
    {
      question: "Will the timer ring if I switch to another tab?",
      answer:
        "The remaining time stays correct, but browsers pause updates in hidden tabs, so the chime may only play when you return. For alarms you cannot miss, keep this tab visible.",
    },
    {
      question: "Why can't I hear the alarm?",
      answer:
        "Check that your device is not muted and press the bell button to test the chime. Some browsers block sound on a page until you have clicked something on it, so press the bell once before you start.",
    },
    {
      question: "What is the longest timer I can set?",
      answer:
        "Up to 23 hours, 59 minutes and 59 seconds. Longer countdowns are better handled by a calendar reminder or your phone's alarm.",
    },
    {
      question: "How do I restart the timer after it finishes?",
      answer:
        "Press Reset to load the same duration again, then Start. You can also click a preset or type a new time.",
    },
    {
      question: "Does the timer work on mobile?",
      answer:
        "Yes. It works in mobile browsers. Keep the screen on and the page open, because a locked phone or a background tab may delay the chime.",
    },
  ],
  howTo: [
    {
      title: "Choose a duration",
      description: "Click a preset such as 5 min or 25 min Pomodoro, or type hours, minutes and seconds.",
    },
    {
      title: "Test the sound",
      description: "Press the bell button once to hear the chime and set your volume.",
    },
    {
      title: "Start the countdown",
      description: "Press Start. Use Pause for a break and Start again to continue from the same time.",
    },
    {
      title: "Stop at the chime",
      description: "When the chime plays and the card turns green, press Reset to repeat or pick a new time.",
    },
  ],

  engine: "calculator",
  privacyNote: "client",
}

export default definition
