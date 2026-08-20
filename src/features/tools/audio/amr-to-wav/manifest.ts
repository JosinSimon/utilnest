import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "amr-to-wav",
  name: "AMR to WAV Converter",
  slug: "amr-to-wav",
  category: "audio",
  path: "audio/amr-to-wav",

  shortDescription:
    "Convert AMR voice recordings and call records to uncompressed WAV audio format online for free. 100% private in-browser conversion.",
  longDescription:
    "Convert AMR and AMR-WB audio files into uncompressed, 16-bit PCM WAV format. Perfect for audio editing software, speech-to-text transcription engines, and legal or official court submissions.",

  sections: [
    {
      heading: "Uncompressed Lossless WAV Audio Extraction",
      body: "WAV (Waveform Audio File Format) is the gold standard for audio editing, forensic speech analysis, and transcription tools. When converting AMR voice recordings, our converter extracts raw 16-bit linear PCM audio into a standard RIFF WAVE file without lossy recompression artifacts.",
    },
    {
      heading: "Ideal for Transcription & Official Evidence",
      body: "Many automatic speech recognition (ASR) tools, AI transcription software, and government submission portals require standard WAV audio files. Convert your Android call recordings, voice notes, and interviews to WAV effortlessly.",
    },
    {
      heading: "100% Client-Side Privacy",
      body: "Your sensitive call records and voice conversations are decoded right inside your browser using WebAssembly. No audio bytes are ever sent to external cloud servers.",
    },
  ],

  examples: [
    {
      title: "Call Recording to WAV",
      input: "call_sample.amr (AMR 8 kHz)",
      output: "call_sample.wav (16-bit PCM WAV)",
    },
  ],

  primaryKeyword: "amr to wav converter",
  keywords: [
    "amr to wav",
    "amr to wav converter",
    "convert amr to wav online",
    "call recording to wav",
    "amr to wav free",
  ],
  searchAliases: [
    "convert amr to wav",
    "amr to wav online",
    "amr audio to wav",
  ],
  searchWeight: 75,

  relatedTools: ["amr-to-mp3", "m4a-to-mp3", "mp3-to-wav", "wav-to-mp3"],
  featured: false,
  trending: false,
  popular: false,
  addedAt: "2026-08-20",
  lastUpdated: "2026-08-20",

  schemaType: "Converter",
  icon: "music",
  faq: [
    {
      question: "Why should I convert AMR to WAV instead of MP3?",
      answer:
        "WAV is an uncompressed, lossless format preferred by audio transcription software, audio editing workstations, and official evidentiary submissions.",
    },
    {
      question: "Are my audio files uploaded anywhere?",
      answer:
        "No. All decoding and WAV header creation is performed locally in your browser with zero server uploads.",
    },
  ],
  howTo: [
    {
      title: "Upload your AMR file",
      description: "Select or drag your .amr file into the tool.",
    },
    {
      title: "Click Convert to WAV",
      description: "Our browser engine will unpack the AMR frames into clean 16-bit PCM WAV audio.",
    },
    {
      title: "Download WAV file",
      description: "Download your uncompressed WAV file instantly.",
    },
  ],

  engine: "file",
  privacyNote: "client",
}
