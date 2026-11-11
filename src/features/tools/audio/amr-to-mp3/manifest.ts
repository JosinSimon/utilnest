import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "amr-to-mp3",
  name: "AMR to MP3 Converter",
  slug: "amr-to-mp3",
  category: "audio",
  path: "audio/amr-to-mp3",

  shortDescription:
    "Convert AMR call recordings and voice recordings to MP3 online, free. Works on Android and PC, plays the result before download, and never uploads your audio.",
  longDescription:
    "Convert .amr call recordings and voice recordings into MP3 files that play on any phone, computer, car stereo or messaging app. AMR is used by many Android call recorder apps, older Android phones and feature phones, but iPhones, Windows and most web apps can't open it. Choose your file, pick a quality and download the MP3. Conversion happens entirely on your device, so private calls are never uploaded.",

  sections: [
    {
      heading: "Convert AMR to MP3 on Android",
      body: "Open this page in Chrome on your phone, tap the upload area and choose the recording. Call recordings are usually in a folder such as Recordings, Call recordings or Sounds in your file manager. Convert, play the MP3 on the page to check it, then tap Download. The MP3 is saved to your Downloads folder, ready to share. No app install is needed.",
    },
    {
      heading: "Convert AMR to MP3 on Windows or Mac",
      body: "Copy the .amr file from your phone to your computer (USB cable, Google Drive or email), then drag it onto the converter. You can add several recordings at once; when there is more than one, they download together as a ZIP file.",
    },
    {
      heading: "Why convert AMR to MP3?",
      body: "AMR (Adaptive Multi-Rate) is a speech codec designed for phone calls. It makes very small files, but support outside Android is poor: iPhones, Windows Media Player, most browsers, video editors and many upload portals reject .amr files. MP3 plays everywhere, so converting is the simplest way to share a call recording with a lawyer, a colleague or customer support, or to keep it in a backup.",
    },
    {
      heading: "Which MP3 quality should I choose?",
      body: "AMR recordings are already low-bitrate speech (narrowband AMR is sampled at 8 kHz), so a higher MP3 bitrate can't add detail that isn't there. 64 kbps is plenty for call recordings and keeps files small; 128 kbps is a safe default for everything else. Higher bitrates only make the file bigger.",
    },
    {
      heading: "Private call recordings stay private",
      body: "Call recordings often contain personal, business or legal conversations. Most online converters upload your file to their server. UtilNest decodes the AMR and encodes the MP3 inside your browser, so the recording never leaves your device.",
    },
  ],

  examples: [
    {
      title: "Android call recording",
      input: "call_recording.amr (AMR-NB, 8 kHz)",
      output: "call_recording.mp3 (64 kbps, plays on iPhone and PC)",
    },
    {
      title: "Batch of voice recordings",
      input: "5 .amr files",
      output: "5 MP3 files downloaded together as a ZIP",
    },
  ],

  primaryKeyword: "amr to mp3 converter",
  keywords: [
    "amr to mp3",
    "convert amr to mp3",
    "convert amr to mp3 android",
    "call recording amr to mp3",
    "convert amr to mp3 online",
    "amr converter free",
    "amr file converter",
  ],
  searchAliases: [
    "amr to mp3 online",
    "amr audio to mp3",
    "call recording to mp3",
    "open amr file",
  ],
  searchWeight: 82,

  relatedTools: ["how-to-play-amr-files", "amr-to-m4a", "amr-to-wav", "m4a-to-mp3"],
  featured: false,
  trending: true,
  popular: false,
  addedAt: "2026-08-20",
  lastUpdated: "2026-11-11",

  schemaType: "Converter",
  icon: "music",
  faq: [
    {
      question: "How do I convert AMR to MP3 on Android?",
      answer:
        "Open this page in Chrome, tap the upload area, choose your .amr recording, then tap Convert to MP3 and Download. The MP3 is saved to your Downloads folder. No app is needed.",
    },
    {
      question: "Is my recording uploaded to a server?",
      answer:
        "No. The conversion runs inside your browser, so your call recordings never leave your device.",
    },
    {
      question: "Can I convert several AMR files at once?",
      answer:
        "Yes. Add multiple files and convert them together. When there is more than one file, they download as a single ZIP.",
    },
    {
      question: "Which MP3 bitrate is best for call recordings?",
      answer:
        "64 kbps is enough for call recordings, because AMR audio is already low-bitrate speech. Choose 128 kbps if you're unsure.",
    },
    {
      question: "Will the MP3 play on iPhone?",
      answer:
        "Yes. MP3 plays on iPhone, iPad, Mac, Windows, Android and in messaging apps. If you mainly use Apple devices, AMR to M4A is also a good option.",
    },
  ],
  howTo: [
    {
      title: "Choose your AMR file",
      description: "Tap or drag in one or more .amr recordings.",
    },
    {
      title: "Pick a quality",
      description: "64 kbps for calls, 128 kbps as a safe default.",
    },
    {
      title: "Convert and listen",
      description: "Press Convert to MP3 and play the result on the page to check it.",
    },
    {
      title: "Download",
      description: "Save the MP3, or a ZIP if you converted several files.",
    },
  ],

  engine: "file",
  privacyNote: "client",
}
