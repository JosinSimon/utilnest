import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "wav-to-mp3",
  name: "WAV to MP3 Converter",
  slug: "wav-to-mp3",
  category: "audio",
  path: "audio/wav-to-mp3",

  shortDescription:
    "Convert large uncompressed WAV audio files to compact high quality MP3 format online for free. 100% private in browser.",
  longDescription:
    "Compress and convert heavy WAV audio tracks into lightweight, high-fidelity MP3 files. Save up to 90% in file size while retaining excellent audio clarity for sharing, streaming, or web playback.",

  sections: [
    {
      heading: "Compress Heavy WAV Files by up to 90%",
      body: "Uncompressed WAV audio files consume roughly 10 MB per minute of recording, making them difficult to email, upload to portals, or share via messaging apps. Our online WAV to MP3 converter shrinks file sizes drastically while maintaining full, rich sound.",
    },
    {
      heading: "Configurable Audio Quality",
      body: "Select your preferred MP3 bitrate from 64 kbps (ultra-light voice) to 320 kbps (studio master audio). You can preview the converted audio directly in your browser before saving.",
    },
    {
      heading: "Fast & Secure Client-Side Conversion",
      body: "Conversion happens instantly on your device without uploading files to any third-party servers. Your audio files stay 100% private.",
    },
  ],

  examples: [
    {
      title: "Audio Track Compression",
      input: "studio_recording.wav (50 MB WAV)",
      output: "studio_recording.mp3 (4.5 MB MP3 @ 192 kbps)",
    },
  ],

  primaryKeyword: "wav to mp3 converter",
  keywords: [
    "wav to mp3",
    "wav to mp3 converter",
    "convert wav to mp3 online",
    "compress wav to mp3",
    "wav to mp3 free",
  ],
  searchAliases: [
    "convert wav to mp3",
    "wav to mp3 online",
    "wav audio to mp3",
  ],
  searchWeight: 74,

  relatedTools: ["mp3-to-wav", "amr-to-mp3", "amr-to-wav", "m4a-to-mp3"],
  featured: false,
  trending: false,
  popular: false,
  addedAt: "2026-08-20",
  lastUpdated: "2026-08-20",

  schemaType: "Converter",
  icon: "music",
  faq: [
    {
      question: "How much file size do I save by converting WAV to MP3?",
      answer:
        "Converting a standard 16-bit 44.1 kHz WAV file to a 128 kbps MP3 reduces the file size by approximately 90% without noticeable loss of speech or music clarity.",
    },
    {
      question: "Which bitrate is recommended for WAV to MP3?",
      answer:
        "For voice recordings, 128 kbps is standard. For music and studio tracks, 192 kbps or 320 kbps offers the best balance of fidelity and size.",
    },
  ],
  howTo: [
    {
      title: "Select your WAV file",
      description: "Click to upload or drag your .wav audio file into the tool.",
    },
    {
      title: "Choose MP3 bitrate",
      description: "Pick your preferred audio bitrate (128k, 192k, or 320k).",
    },
    {
      title: "Convert and Download",
      description: "Click Convert to MP3, listen to the preview, and download your compressed MP3.",
    },
  ],

  engine: "file",
  privacyNote: "client",
}
