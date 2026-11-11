import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "how-to-play-amr-files",
  name: "How to Play AMR Files",
  slug: "how-to-play-amr-files",
  category: "audio",
  path: "audio/amr-to-mp3",

  shortDescription:
    "Can't open an .amr file? Play it right here in your browser, or convert it to MP3. Plus how to play AMR on Android, iPhone, Windows and Mac.",
  longDescription:
    "AMR files are voice and call recordings made by many Android phones, call recorder apps and older feature phones. Plenty of devices can't open them: iPhones, most web browsers and many Windows and Mac apps show an error or stay silent. The quickest fix is the player above: choose your .amr file, press Convert, and it plays right on this page as an MP3 you can also download. Below is how to play AMR on each kind of device.",

  sections: [
    {
      heading: "Play an AMR file in your browser (any device)",
      body: "Use the player at the top of this page. Choose the .amr file, press Convert to MP3, then press Play. It works in Chrome, Safari, Edge and Firefox on phones and computers. The file is decoded on your device, never uploaded, and you can download the MP3 to play it anywhere later.",
    },
    {
      heading: "How to play AMR files on Android",
      body: "Android supports AMR audio itself, so most phones play .amr files in the built-in Files, Music or Recorder app: open the file manager, find the recording (often in a Recordings or Call recordings folder) and tap it. If your phone shows 'unsupported file', install VLC for Android, or convert the file to MP3 on this page.",
    },
    {
      heading: "How to play AMR files on iPhone and iPad",
      body: "The built-in iPhone apps generally can't play .amr files. You have two options: open the file in VLC for iOS (free on the App Store), or convert it to M4A or MP3 on this page in Safari. M4A is Apple's own audio format, so it opens straight away in the Files app and Apple Music.",
    },
    {
      heading: "How to play AMR files on Windows",
      body: "Windows' built-in media apps often won't play .amr files without extra codecs. The free VLC media player plays AMR out of the box: install it, right-click the file, choose Open with and pick VLC. Or convert the file to MP3 here and it will play in any Windows player.",
    },
    {
      heading: "How to play AMR files on Mac",
      body: "Apple's built-in apps may not open .amr files. VLC for Mac plays them, or you can convert the recording to M4A here, which opens in QuickTime Player and Music.",
    },
    {
      heading: "What is an AMR file?",
      body: "AMR (Adaptive Multi-Rate) is an audio codec designed for voice calls. AMR-NB (narrowband) records at 8 kHz and AMR-WB (wideband, sometimes called HD Voice) at 16 kHz. Both make very small files, which is why phones and call recorders use them, but music players and browsers rarely support them. Converting to MP3 or M4A keeps the speech sounding the same, and the new file plays everywhere.",
    },
  ],

  examples: [
    {
      title: "Recording won't play on iPhone",
      input: "call_recording.amr sent from an Android phone",
      output: "Converted to M4A or MP3 and played on the page",
    },
    {
      title: "Old phone voice recordings",
      input: "Folder of .amr files from a feature phone",
      output: "MP3 files that play on any computer (ZIP download)",
    },
  ],

  primaryKeyword: "how to play amr files",
  keywords: [
    "how to play amr files",
    "how to play .amr files",
    "amr player online",
    "open amr file",
    "play amr file on iphone",
    "play amr file on windows",
    "amr file not playing",
    "what is amr file",
  ],
  searchAliases: ["amr player", "open amr", "play amr", "amr file opener"],
  searchWeight: 72,

  relatedTools: ["amr-to-mp3", "amr-to-m4a", "amr-to-wav", "m4a-to-mp3"],
  featured: false,
  trending: false,
  popular: false,
  addedAt: "2026-11-11",
  lastUpdated: "2026-11-11",

  schemaType: "Utility",
  icon: "music",
  faq: [
    {
      question: "How do I open an AMR file?",
      answer:
        "Choose the file in the player on this page and press Convert to MP3, then Play. On Android, the built-in Files or Music app usually opens it directly. On iPhone, Windows and Mac, use VLC or convert the file to MP3 or M4A.",
    },
    {
      question: "Why won't my AMR file play?",
      answer:
        "AMR is a phone-call voice format, and many devices, browsers and apps don't include an AMR decoder. Converting it to MP3 or M4A fixes this on every device.",
    },
    {
      question: "Can I play AMR files on iPhone?",
      answer:
        "Not in the built-in apps, generally. Use VLC for iOS, or convert the file to M4A on this page in Safari. The M4A then opens in the Files app.",
    },
    {
      question: "Which free player plays AMR files?",
      answer:
        "VLC media player plays AMR on Windows, Mac, Linux, Android and iPhone. You can also play AMR files on this page without installing anything.",
    },
    {
      question: "Is my recording uploaded when I play it here?",
      answer: "No. The file is decoded and played on your device. Nothing is sent to a server.",
    },
  ],
  howTo: [
    { title: "Choose the AMR file", description: "Tap or drag your .amr recording into the player above." },
    { title: "Press Convert", description: "The recording is converted to MP3 on your device." },
    { title: "Press Play", description: "Listen to the recording right on the page." },
    { title: "Download if needed", description: "Save the MP3 to play it in any app later." },
  ],

  engine: "file",
  privacyNote: "client",
}
