import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "signature-resizer",
  name: "Signature Resizer",
  slug: "signature-resizer",
  category: "government",
  path: "government/signature-resizer",

  shortDescription:
    "Resize and compress your signature for IBPS, NEET UG, SSC CGL, PAN and other forms. Pixels, KB range and JPG set by preset and checked. Free, no upload.",
  longDescription:
    "Choose a signature preset, add a photo or scan of your signature, and this tool resizes it to the preset's size and compresses it into the required KB range as a JPG. Presets include IBPS PO/Clerk, NEET UG, SSC CGL and PAN, plus UPSC CSE, JEE Main, GATE and CUET UG placeholders that are marked as awaiting verification. The result is checked before you download it. Your signature is processed in your browser and never uploaded.",
  schemaType: "Utility",

  sections: [
    {
      heading: "Signature sizes in the presets",
      body: "IBPS PO/Clerk: 140 x 60 pixels, 10–20 KB, JPEG, black ink on white paper, from the 2026 notification. NEET UG: JPG, 10–100 KB, running hand on white paper; NTA does not set pixels, so the preset uses 3.5 x 1.5 cm, which is 413 x 177 pixels at 300 DPI. PAN: 4.5 x 2.0 cm, up to 50 KB, JPG. SSC CGL: 140 x 60 pixels, 10–20 KB is widely reported but not confirmed on ssc.gov.in. UPSC, JEE Main, GATE and CUET UG presets are placeholders: check your notification.",
    },
    {
      heading: "Pixels, cm and KB explained",
      body: "Pixels are the image's width and height on screen, such as 140 x 60. Centimetres describe a printed size and only become pixels once a DPI is chosen; this tool uses 300 DPI, so 4.5 x 2.0 cm becomes 531 x 236 pixels. KB is the file size on disk. A form can check all three, so a signature with the right pixels can still be rejected for being over the KB limit. The preset sets each value for you.",
    },
    {
      heading: "How to sign and scan",
      body: "Sign with a black ink pen on plain white, unlined paper. Sign a little larger than usual, in running hand, not block capitals, unless your form says otherwise. Photograph it straight on in daylight, with no shadow from your hand or phone. Crop close around the signature before resizing. The tool fits the whole image inside the preset and fills leftover space with white, so a loose crop leaves a tiny signature in a large white box.",
    },
    {
      heading: "Fixing a rejected signature",
      body: "Too large in KB: run it through the preset again and do not edit the file afterwards. Too small in KB: the image may be mostly blank, so crop closer so the ink fills more of the frame; the tool will not pad the file to reach a minimum. Wrong dimensions: check you picked the right exam, and that width and height are not swapped. Hard to read: sign again with a darker pen rather than enlarging a faint scan.",
    },
    {
      heading: "Private and free",
      body: "A signature can be misused, so it should not sit on someone else's server. This tool resizes, compresses and checks it in your browser. Nothing is uploaded to UtilNest, there is no sign-up, and no watermark is added.",
    },
  ],

  examples: [
    {
      title: "IBPS signature",
      input: "Phone photo of a signature, 3 MB JPG",
      output: "140 x 60 px JPG, 10–20 KB",
    },
    {
      title: "NEET UG signature",
      input: "Scanned signature, 1500 x 600 px PNG",
      output: "413 x 177 px JPG, 10–100 KB",
    },
    {
      title: "PAN signature",
      input: "Photo of a signature on white paper",
      output: "531 x 236 px JPG (4.5 x 2.0 cm at 300 DPI), up to 50 KB",
    },
  ],

  primaryKeyword: "signature resizer",
  keywords: [
    "signature resize online",
    "signature ssc size",
    "signature neet size",
    "signature compress kb",
    "exam signature photo size",
    "signature under 20 kb",
    "signature 140x60 pixels",
    "ibps signature size",
    "neet signature size 2026",
    "pan card signature size",
    "signature resize 10 to 20 kb",
    "signature size in cm",
  ],
  searchAliases: [
    "signature size",
    "resize signature",
    "signature for exam",
    "signature compressor",
    "reduce signature size in kb",
    "signature resizer for form",
  ],
  searchWeight: 76,

  relatedTools: [
    "resize-signature-140x60",
    "ssc-signature-resize",
    "exam-preset",
    "government-exam-photo",
    "image-cropper",
  ],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-11-11",

  icon: "pen-line",
  faq: [
    {
      question: "What size should an exam signature be?",
      answer:
        "It depends on the exam. IBPS PO/Clerk 2026 asks for 140 x 60 pixels, 10–20 KB, JPEG. NEET UG 2026 asks for a JPG of 10–100 KB with no pixel size set. Always check your own notification.",
    },
    {
      question: "What is the SSC CGL signature size?",
      answer:
        "140 x 60 pixels (about 4.0 x 2.0 cm), 10–20 KB, JPG is widely reported, but we have not confirmed it on ssc.gov.in. Check the current notification before uploading.",
    },
    {
      question: "How do I reduce my signature to under 20 KB?",
      answer:
        "Pick the IBPS or SSC CGL preset, add your signature and press Prepare for submission. The tool compresses it to 10–20 KB and shows the final size.",
    },
    {
      question: "Should I use black or blue ink?",
      answer:
        "IBPS and SSC CGL presets specify black ink on white paper. Black ink also stays clearer after compression. Use blue only if your notification asks for it.",
    },
    {
      question: "Why is my signature file too small?",
      answer:
        "A mostly white image compresses to very few KB. Crop closer so the signature fills the frame, then process it again. The tool does not pad files to reach a minimum.",
    },
    {
      question: "Is my signature uploaded anywhere?",
      answer: "No. It is resized and compressed in your browser and never leaves your device.",
    },
  ],
  howTo: [
    {
      title: "Sign and capture",
      description: "Sign in black ink on plain white paper, then photograph or scan it and crop close.",
    },
    {
      title: "Choose the signature preset",
      description: "Select your exam or document. The size, KB range, format and verification status are shown.",
    },
    {
      title: "Add the image and prepare",
      description: "Drop, browse or paste the JPG or PNG, then press Prepare for submission.",
    },
    {
      title: "Check and download",
      description: "Confirm the pixels, KB and any warnings, then download the JPG for your form.",
    },
  ],

  engine: "file",
  privacyNote: "client",
}
