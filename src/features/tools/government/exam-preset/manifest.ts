import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "exam-preset",
  name: "Exam Preset Resizer",
  slug: "exam-preset",
  category: "government",
  path: "government/exam-preset",

  shortDescription:
    "Ready presets for NEET UG, IBPS PO/Clerk and SSC CGL photos and signatures. Size, KB range and JPG format are set and checked for you. Free, no upload.",
  longDescription:
    "Pick an exam and a document type, add your photo or signature, and this tool resizes and compresses it to that preset's size, KB range and JPG format. It has six presets: photo and signature for NEET UG, IBPS PO/Clerk and SSC CGL. Presets checked against an official notification show their source; the others are clearly marked as awaiting verification. Your file is processed in your browser and checked against the preset before you download it.",
  schemaType: "Utility",

  sections: [
    {
      heading: "Which presets are included?",
      body: "NEET UG photo: 3.5 x 4.5 cm reference, 10–200 KB, JPG, white background. NEET UG signature: 3.5 x 1.5 cm reference, 10–100 KB, JPG. IBPS PO/Clerk photo: 20–50 KB, JPG, light or white background. IBPS PO/Clerk signature: 140 x 60 pixels, 10–20 KB, JPG. The NEET and IBPS presets are checked against the 2026 notifications. The SSC CGL presets are not: the 140 x 60 pixel, 10–20 KB signature is widely reported but not yet confirmed on ssc.gov.in.",
    },
    {
      heading: "SSC CGL 2026 photo: read this first",
      body: "For the 2026 cycle, SSC CGL is reported to capture the photo live, with a webcam or phone, during One-Time Registration instead of accepting an uploaded photo. If that applies to you, the SSC CGL photo preset is not needed, and you should follow the capture steps on ssc.gov.in. The SSC CGL signature preset is still useful, but confirm its size in your notification.",
    },
    {
      heading: "How your image is fitted",
      body: "The tool scales your image to fit inside the preset size. It does not crop or stretch. If the shape of your image differs from the preset, the leftover space is filled with white. For the best result, crop first so your face or signature fills the frame. Phone photos are turned upright automatically. Sizes given in cm are converted at 300 DPI, so 3.5 x 4.5 cm becomes 413 x 531 pixels and 3.5 x 1.5 cm becomes 413 x 177 pixels.",
    },
    {
      heading: "What the final check tells you",
      body: "The tool checks the finished file against the preset: JPG format, exact pixels where the preset sets them, and the KB range. If the image cannot reach the minimum KB even at full quality, it says so instead of padding the file. It also warns when the background looks darker than white. If a check fails, fix the source image and try again.",
    },
    {
      heading: "Common reasons for rejection",
      body: "Photo and signature uploaded in each other's boxes. A signature in blue ink, on lined paper, or in block capitals where running hand is asked for. A dark or shadowed background. A face too small in the frame: NEET asks for about 80% face, including ears, with no mask. Saving the file again in another app, which can push it over the KB limit.",
    },
    {
      heading: "Private and free",
      body: "Exam photos and signatures are personal documents. This tool resizes, compresses and checks them in your browser. Nothing is uploaded to UtilNest, there is no sign-up, and no watermark is added to the file.",
    },
  ],

  examples: [
    {
      title: "NEET UG photo from a phone",
      input: "4 MB JPG phone photo against a white wall",
      output: "413 x 531 px JPG between 10 and 200 KB",
    },
    {
      title: "IBPS signature from a scan",
      input: "PNG scan of a signature, 1200 x 500 px",
      output: "140 x 60 px JPG between 10 and 20 KB",
    },
  ],

  primaryKeyword: "exam photo preset",
  keywords: [
    "exam photo size preset",
    "preset photo resizer",
    "ssc neet ibps photo size",
    "one click exam photo",
    "neet ug photo size 2026",
    "neet signature size",
    "ibps po photo size",
    "ibps clerk signature size",
    "ssc cgl signature size",
    "exam photo and signature resizer",
  ],
  searchAliases: [
    "exam preset",
    "photo preset",
    "neet photo resize",
    "ibps photo signature resize",
    "ssc cgl signature resize",
    "exam form photo size",
  ],
  searchWeight: 58,

  relatedTools: [
    "government-exam-photo",
    "signature-resizer",
    "neet-photo-size-2026",
    "ibps-photo-signature-resize",
    "resize-photo-200x230",
  ],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-11-11",

  icon: "list-checks",
  faq: [
    {
      question: "Which exams does this preset tool cover?",
      answer:
        "NEET UG, IBPS PO/Clerk and SSC CGL, with one photo and one signature preset each. Signature presets for PAN, UPSC, JEE Main, GATE and CUET UG are in the Signature Resizer, where unverified ones are marked.",
    },
    {
      question: "What is the NEET UG photo size?",
      answer:
        "The NEET (UG) 2026 bulletin asks for a recent passport-size photo in JPG, 10–200 KB, with about 80% of the frame showing the face including ears, no mask, on a white background. NTA does not set pixel dimensions. This preset uses 3.5 x 4.5 cm at 300 DPI, which is 413 x 531 pixels.",
    },
    {
      question: "What is the IBPS PO and Clerk signature size?",
      answer:
        "The IBPS PO/Clerk 2026 notification lists the signature as 140 x 60 pixels, 10–20 KB, JPEG, in black ink on white paper. The photo is a separate upload of 20–50 KB.",
    },
    {
      question: "Can I use this for the SSC CGL 2026 photo?",
      answer:
        "Probably not. For 2026, SSC CGL is reported to capture the photo live during One-Time Registration rather than accept an upload. Check the current notification on ssc.gov.in before you prepare a photo.",
    },
    {
      question: "Why does my output have white bars at the sides?",
      answer:
        "Your image has a different shape from the preset, so it was fitted inside without cropping or stretching. Crop the image to the right shape first, then run it through the preset again.",
    },
    {
      question: "What does \"awaiting verification\" mean?",
      answer:
        "We could not yet confirm that preset against an official notification. Treat its numbers as a guide and check the size, KB range and format in your own notification before uploading.",
    },
  ],
  howTo: [
    {
      title: "Pick the exam and document",
      description: "Choose the preset, such as NEET UG photo or IBPS signature. Its size, KB range, format and source are shown.",
    },
    {
      title: "Add your photo or signature",
      description: "Drop, browse or paste a JPG or PNG. Crop it close to your face or signature first for the best fit.",
    },
    {
      title: "Prepare for submission",
      description: "The tool resizes, compresses to the KB range and checks the result against the preset.",
    },
    {
      title: "Check and download",
      description: "Read the final size, pixels and any warnings, then download the JPG for your form.",
    },
  ],

  engine: "file",
  privacyNote: "client",
}
