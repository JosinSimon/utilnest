import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "amr-to-m4a",
  name: "AMR to M4A Converter",
  slug: "amr-to-m4a",
  category: "audio",
  path: "audio/amr-to-m4a",

  shortDescription:
    "Convert AMR call recordings to M4A (AAC) online, free. M4A plays natively on iPhone, iPad and Mac. Converted in your browser, nothing uploaded.",
  longDescription:
    "Turn .amr call recordings and voice recordings into M4A files that open straight away in the iPhone Files app, Apple Music, QuickTime and most modern players. M4A uses AAC audio, which sounds better than MP3 at the same small file size. Choose your recording, pick a quality and download. Conversion runs entirely in your browser, so private recordings never leave your device.",

  sections: [
    {
      heading: "Why convert AMR to M4A?",
      body: "AMR is a phone-call speech format that iPhones, iPads, Macs and most browsers can't play. M4A is Apple's default audio format (it's what iPhone Voice Memos uses), and it also plays on Android, Windows and in messaging apps. Choose M4A if the recording is going to an Apple device; choose MP3 if you need the widest compatibility with older players and car stereos.",
    },
    {
      heading: "M4A vs MP3 for call recordings",
      body: "Both are compressed formats. M4A (AAC) generally sounds cleaner than MP3 at low bitrates, which suits speech recordings, and the files stay small. MP3 is older and supported by almost every device ever made. For a recording you want to listen to on an iPhone or keep in Apple's apps, M4A is the better fit.",
    },
    {
      heading: "How the conversion works",
      body: "The tool decodes your AMR audio, resamples it to 44.1 kHz (the rate AAC encoders handle best) and encodes it to AAC inside an MP4 audio (.m4a) container. It uses your browser's built-in AAC encoder when one is available and a bundled encoder when not, so it works in Chrome, Edge, Safari and Firefox.",
    },
    {
      heading: "Which quality should I choose?",
      body: "AMR recordings are low-bitrate speech, so higher settings can't add detail. 64 kbps is plenty for call recordings and keeps files small; 128 kbps is a safe default. Higher bitrates mostly just make the file bigger.",
    },
    {
      heading: "Private by design",
      body: "Your recording is converted on your own device. It is never uploaded to UtilNest or any other server, and you don't need to sign up.",
    },
  ],

  examples: [
    {
      title: "Call recording for iPhone",
      input: "call_recording.amr (AMR-NB, 8 kHz)",
      output: "call_recording.m4a (AAC, 64 kbps, opens in iPhone Files)",
    },
    {
      title: "Several voice recordings",
      input: "3 .amr files",
      output: "3 M4A files downloaded together as a ZIP",
    },
  ],

  primaryKeyword: "amr to m4a converter",
  keywords: [
    "amr to m4a",
    "convert amr to m4a",
    "amr to m4a online",
    "amr to aac",
    "amr to m4a converter free",
    "play amr on iphone",
  ],
  searchAliases: ["amr to m4a online", "amr to aac converter", "amr for iphone", "convert amr for mac"],
  searchWeight: 70,

  relatedTools: ["amr-to-mp3", "how-to-play-amr-files", "amr-to-wav", "m4a-to-mp3"],
  featured: false,
  trending: false,
  popular: false,
  addedAt: "2026-11-11",
  lastUpdated: "2026-11-11",

  schemaType: "Converter",
  icon: "music",
  faq: [
    {
      question: "How do I convert AMR to M4A?",
      answer:
        "Choose your .amr file on this page, pick a quality and press Convert to M4A. Play the result to check it, then download the .m4a file.",
    },
    {
      question: "Will the M4A file play on iPhone?",
      answer:
        "Yes. M4A is Apple's standard audio format and plays in the iPhone Files app, Apple Music, QuickTime and on Mac, as well as on Android and Windows.",
    },
    {
      question: "Is M4A better than MP3?",
      answer:
        "At the same small bitrate, M4A (AAC) usually sounds a little cleaner than MP3. MP3 is supported by more old devices. For Apple devices, M4A is a great choice.",
    },
    {
      question: "Is my recording uploaded?",
      answer: "No. The conversion runs in your browser and your file never leaves your device.",
    },
    {
      question: "Does it work in Firefox?",
      answer:
        "Yes. If the browser has no built-in AAC encoder, the tool loads its own encoder automatically. The first conversion may take a moment longer.",
    },
  ],
  howTo: [
    { title: "Choose your AMR file", description: "Tap or drag in one or more .amr recordings." },
    { title: "Pick a quality", description: "64 kbps for calls, 128 kbps as a safe default." },
    { title: "Convert and listen", description: "Press Convert to M4A and play the result on the page." },
    { title: "Download", description: "Save the .m4a file, or a ZIP for several files." },
  ],

  engine: "file",
  privacyNote: "client",
}
