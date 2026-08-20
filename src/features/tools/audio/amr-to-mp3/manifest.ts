import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "amr-to-mp3",
  name: "AMR to MP3 Converter",
  slug: "amr-to-mp3",
  category: "audio",
  path: "audio/amr-to-mp3",

  shortDescription:
    "Convert AMR call recordings and voice notes to MP3 format online for free. 100% private in-browser audio conversion without server uploads.",
  longDescription:
    "Convert AMR and AMR-WB audio files from Android call recorders (Xiaomi, Samsung, Realme, Oppo, Vivo) and WhatsApp voice notes into high-quality MP3 format. All audio processing happens securely on your device with no file uploads.",

  sections: [
    {
      heading: "Convert Phone Call Recordings to MP3",
      body: "Adaptive Multi-Rate (AMR) is the default audio compression standard used by Android phone call recording apps and legacy feature phones. However, many media players, iPhones, video editors, and legal portals cannot play .amr files natively. Our free online AMR to MP3 converter decodes your call recordings and voice memos into universal MP3 audio files with crystal-clear clarity.",
    },
    {
      heading: "100% Private & Confidential Voice Conversion",
      body: "Phone call recordings and voice notes often contain private personal, business, or legal discussions. Unlike other online converters that upload your audio to third-party cloud servers, UtilNest processes and converts your audio 100% locally inside your web browser using WebAssembly. Your audio recordings never leave your phone or computer.",
    },
    {
      heading: "Custom MP3 Quality & Bitrate Settings",
      body: "Choose from multiple MP3 bitrates to suit your needs: 64 kbps for compact voice notes, 128 kbps for standard call recordings, or 192 kbps to 320 kbps for maximum fidelity. You can also listen to a live preview before downloading.",
    },
  ],

  examples: [
    {
      title: "Android Call Recording to MP3",
      input: "call_recording_2026.amr (AMR-NB 8 kHz)",
      output: "call_recording_2026.mp3 (128 kbps MP3)",
    },
    {
      title: "WhatsApp Voice Note Conversion",
      input: "voice_note.amr (1.2 MB)",
      output: "voice_note.mp3 (Playable anywhere)",
    },
  ],

  primaryKeyword: "amr to mp3 converter",
  keywords: [
    "amr to mp3",
    "amr to mp3 converter",
    "call recording amr to mp3",
    "convert amr to mp3 online",
    "amr converter free",
    "samsung call recording to mp3",
    "redmi call recording converter",
  ],
  searchAliases: [
    "convert amr to mp3",
    "amr to mp3 online",
    "amr audio to mp3",
    "call recording to mp3",
  ],
  searchWeight: 80,

  relatedTools: ["amr-to-wav", "m4a-to-mp3", "mp3-to-wav", "wav-to-mp3"],
  featured: false,
  trending: false,
  popular: false,
  addedAt: "2026-08-20",
  lastUpdated: "2026-08-20",

  schemaType: "Converter",
  icon: "music",
  faq: [
    {
      question: "How do I convert an AMR call recording to MP3?",
      answer:
        "Click 'Choose an audio file' or drag your .amr file into the converter, select your preferred MP3 bitrate (e.g. 128 kbps), and click 'Convert to MP3'. Your file is converted instantly on your device and ready to download.",
    },
    {
      question: "Is my audio uploaded to any server?",
      answer:
        "No. UtilNest converts your audio entirely inside your web browser using client-side WebAssembly and JavaScript. Your private call recordings never leave your device.",
    },
    {
      question: "Which phones save recordings in AMR format?",
      answer:
        "Most Android devices (including Xiaomi/Redmi, Samsung, Oppo, Vivo, OnePlus, Realme) and feature phones use AMR or AMR-WB for built-in call recording and voice memos.",
    },
    {
      question: "Can I play the converted MP3 on iPhone and Mac?",
      answer:
        "Yes! MP3 is a universally supported audio standard that plays natively on all iPhones, iPads, Macs, Windows PCs, Android devices, and WhatsApp.",
    },
  ],
  howTo: [
    {
      title: "Select your AMR file",
      description: "Click to upload or drag and drop your .amr audio recording.",
    },
    {
      title: "Choose MP3 bitrate",
      description: "Select your desired audio quality from 64 kbps up to 320 kbps.",
    },
    {
      title: "Convert and Download",
      description: "Click Convert to MP3, listen to the preview, and download your file.",
    },
  ],

  engine: "file",
  privacyNote: "client",
}
