import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "m4a-to-mp3",
  name: "M4A to MP3 Converter",
  slug: "m4a-to-mp3",
  category: "audio",
  path: "audio/m4a-to-mp3",

  shortDescription:
    "Convert M4A and AAC voice memos or audio recordings to MP3 format online for free. Fast, high quality in-browser conversion.",
  longDescription:
    "Convert Apple Voice Memos, iPhone recordings, Android screen recorder audio, and iTunes AAC/M4A audio tracks to universally compatible MP3 format. 100% private in-browser conversion without file uploads.",

  sections: [
    {
      heading: "Convert iPhone Voice Memos to MP3",
      body: "By default, Apple's Voice Memos app on iPhone, iPad, and Mac saves audio files in MPEG-4 Audio (.m4a) format encoded with AAC. While high quality, many websites, older media players, and Android devices struggle with M4A files. Our free converter transforms your M4A voice memos into universal MP3 files in seconds.",
    },
    {
      heading: "Preserve Clear Audio Quality",
      body: "Choose your preferred MP3 bitrate from 64 kbps (compact voice notes) to 320 kbps (studio-grade quality). The audio engine decodes your audio with precision and re-encodes it cleanly without introducing distortion.",
    },
    {
      heading: "Private, Secure & In-Browser",
      body: "UtilNest never uploads your recordings to any remote server. Everything is decoded and encoded strictly within your web browser using modern Web Audio APIs and client-side LAME encoder.",
    },
  ],

  examples: [
    {
      title: "iPhone Voice Memo to MP3",
      input: "interview_recording.m4a (M4A AAC)",
      output: "interview_recording.mp3 (192 kbps MP3)",
    },
    {
      title: "Screen Recorder Audio to MP3",
      input: "screen_record.m4a (3.5 MB)",
      output: "screen_record.mp3 (Compatible everywhere)",
    },
  ],

  primaryKeyword: "m4a to mp3 converter",
  keywords: [
    "m4a to mp3",
    "m4a to mp3 converter",
    "convert m4a to mp3",
    "iphone voice memo to mp3",
    "m4a converter free",
    "aac to mp3",
  ],
  searchAliases: [
    "convert m4a to mp3",
    "m4a to mp3 online",
    "voice memo to mp3",
    "aac to mp3 converter",
  ],
  searchWeight: 78,

  relatedTools: ["amr-to-mp3", "amr-to-wav", "mp3-to-wav", "wav-to-mp3"],
  featured: false,
  trending: false,
  popular: false,
  addedAt: "2026-08-20",
  lastUpdated: "2026-08-20",

  schemaType: "Converter",
  icon: "music",
  faq: [
    {
      question: "How do I convert an iPhone voice memo (.m4a) to MP3?",
      answer:
        "Share or save the voice memo to your device files, select or drag the .m4a file into this tool, choose your bitrate, and click 'Convert to MP3'.",
    },
    {
      question: "Is there any file size limit for M4A conversion?",
      answer:
        "Because conversion happens on your device using your browser's processing power, there are no strict artificial file size caps or daily conversion limits.",
    },
    {
      question: "Does it support AAC audio files?",
      answer:
        "Yes, AAC audio streams inside .m4a, .aac, and .mp4 containers are fully supported.",
    },
  ],
  howTo: [
    {
      title: "Choose your M4A or AAC file",
      description: "Click to upload or drag and drop your .m4a voice memo or audio file.",
    },
    {
      title: "Select MP3 quality",
      description: "Pick your desired bitrate (128 kbps recommended for voice, 192+ kbps for music).",
    },
    {
      title: "Convert and Download",
      description: "Click Convert to MP3 and download your converted file immediately.",
    },
  ],

  engine: "file",
  privacyNote: "client",
}
