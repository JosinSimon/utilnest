import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "mp3-to-wav",
  name: "MP3 to WAV Converter",
  slug: "mp3-to-wav",
  category: "audio",
  path: "audio/mp3-to-wav",

  shortDescription:
    "Convert MP3 audio files to uncompressed 16-bit WAV format online for free. Fast, private in-browser conversion.",
  longDescription:
    "Convert compressed MP3 audio tracks into uncompressed 16-bit PCM WAV audio files. Ideal for audio editing software, DJ setups, game engines, and speech recognition engines.",

  sections: [
    {
      heading: "Decompress MP3 into 16-bit PCM WAV",
      body: "While MP3 is the most common audio format for listening, production tools and digital audio workstations (DAWs) perform best with uncompressed WAV audio. Our converter decodes your MP3 frames into clean, full-frequency 16-bit PCM WAV streams.",
    },
    {
      heading: "Private In-Browser Processing",
      body: "Convert your music, podcasts, and recordings privately. No files are uploaded to third-party servers; everything happens locally in your web browser.",
    },
  ],

  examples: [
    {
      title: "Podcast Track to WAV",
      input: "episode_1.mp3 (128 kbps)",
      output: "episode_1.wav (16-bit 44.1 kHz WAV)",
    },
  ],

  primaryKeyword: "mp3 to wav converter",
  keywords: [
    "mp3 to wav",
    "mp3 to wav converter",
    "convert mp3 to wav online",
    "mp3 to wav free",
  ],
  searchAliases: [
    "convert mp3 to wav",
    "mp3 to wav online",
    "mp3 audio to wav",
  ],
  searchWeight: 72,

  relatedTools: ["wav-to-mp3", "amr-to-mp3", "amr-to-wav", "m4a-to-mp3"],
  featured: false,
  trending: false,
  popular: false,
  addedAt: "2026-08-20",
  lastUpdated: "2026-08-20",

  schemaType: "Converter",
  icon: "music",
  faq: [
    {
      question: "Will converting MP3 to WAV improve the sound quality?",
      answer:
        "Converting MP3 to WAV decompresses the audio into raw PCM format, making it compatible with audio editors and DAWs, but cannot restore data lost during the original MP3 compression.",
    },
    {
      question: "Are there any file size or duration limits?",
      answer:
        "No, you can convert audio files of any length directly inside your web browser.",
    },
  ],
  howTo: [
    {
      title: "Select your MP3 file",
      description: "Choose or drag and drop your .mp3 audio file.",
    },
    {
      title: "Convert to WAV",
      description: "Click Convert to WAV to decode the audio into uncompressed PCM.",
    },
    {
      title: "Download your WAV",
      description: "Save the resulting .wav file to your device.",
    },
  ],

  engine: "file",
  privacyNote: "client",
}
