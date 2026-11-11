import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "aadhaar-pan",
  name: "Aadhaar / PAN Resizer",
  slug: "aadhaar-pan",
  category: "government",
  path: "government/aadhaar-pan",

  shortDescription:
    "Resize and compress a photo for Aadhaar or PAN forms: 3.5 x 4.5 cm for Aadhaar, 3.5 x 2.5 cm under 50 KB for PAN. JPG output, free, no upload.",
  longDescription:
    "Choose the Aadhaar or PAN photo preset, add your photo, and this tool resizes it to that preset's size in centimetres and compresses it into the allowed KB range as a JPG. Centimetres are converted to pixels at 300 DPI. The result is checked against the preset before you download, and you are warned if the background looks too dark. Everything runs in your browser, so your photo never leaves your device.",
  schemaType: "Utility",

  sections: [
    {
      heading: "Aadhaar and PAN photo presets",
      body: "Aadhaar photo: passport size, 3.5 x 4.5 cm, plain light or white background, JPG, 10–300 KB. At 300 DPI this is 413 x 531 pixels. PAN photo: 3.5 x 2.5 cm, white background, JPG, up to 50 KB, as listed for online PAN applications. The PAN signature (4.5 x 2.0 cm, up to 50 KB) is a separate upload; prepare it with the Signature Resizer. Rules can differ between portals and service centres, so check the instructions on the page you are filling in.",
    },
    {
      heading: "When you need to upload a photo",
      body: "Online PAN applications can ask you to upload a scanned photo and signature, depending on how you choose to apply. For Aadhaar enrolment and updates, the photo is usually taken at the centre, so you may not need to upload one at all. Use the Aadhaar preset when a form or office asks for a passport-size photo file. If the instructions you have give a different size or KB limit, follow those instead.",
    },
    {
      heading: "How to take a photo that passes",
      body: "Stand in front of a plain white or light wall, facing the camera, in daylight or even indoor light. Keep your face and shoulders in the frame and avoid shadows behind your head. Remove sunglasses and caps. Hold the phone at eye level, not from below. Crop the photo close to the right shape before resizing, because the tool fits the whole image inside the preset and fills any leftover space with white.",
    },
    {
      heading: "Why uploads get rejected, and fixes",
      body: "File too large: run it through the preset again and download the new file without editing it afterwards. Dark or busy background: retake the photo against a plain light wall; the tool warns you but does not replace the background. Face too small or off-centre: crop closer before resizing. Wrong document: a PAN photo uploaded where the signature goes, or the other way round. Blurry image: take the photo in better light rather than enlarging a small one.",
    },
    {
      heading: "Your documents stay on your device",
      body: "Identity documents need care. This tool resizes and compresses your photo inside your browser. It is not sent to UtilNest or any server, there is no sign-up, and no watermark is added.",
    },
  ],

  examples: [
    {
      title: "Aadhaar passport-size photo",
      input: "3 MB phone photo against a white wall",
      output: "413 x 531 px JPG (3.5 x 4.5 cm at 300 DPI), 10–300 KB",
    },
    {
      title: "PAN application photo",
      input: "1.5 MB JPG photo",
      output: "JPG at 3.5 x 2.5 cm (300 DPI), under 50 KB",
    },
  ],

  primaryKeyword: "aadhaar photo resizer",
  keywords: [
    "aadhaar photo size",
    "pan photo resize",
    "pan card photo size",
    "aadhaar photo compress",
    "uidai photo resizer",
    "passport size photo for aadhaar",
    "pan card photo size in kb",
    "pan photo under 50 kb",
    "pan card photo 3.5 x 2.5 cm",
    "aadhaar photo size in cm",
    "resize photo for pan card online",
  ],
  searchAliases: [
    "aadhaar photo",
    "pan photo",
    "uidai photo resize",
    "pan card photo resize",
    "aadhar photo resize",
    "pan photo 50kb",
  ],
  searchWeight: 64,

  relatedTools: ["passport-photo-maker", "signature-resizer", "image-cropper", "resize-image", "document-scanner"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-11-11",

  icon: "fingerprint",
  faq: [
    {
      question: "What is the PAN card photo size?",
      answer:
        "The PAN preset uses 3.5 x 2.5 cm on a white background, JPG, up to 50 KB, as listed for online PAN applications. Check the instructions on the portal you are using, as they can be updated.",
    },
    {
      question: "What size photo is used for Aadhaar?",
      answer:
        "The Aadhaar preset uses a standard passport-size photo, 3.5 x 4.5 cm, on a plain light or white background, JPG, 10–300 KB. At 300 DPI that is 413 x 531 pixels.",
    },
    {
      question: "How do I reduce a PAN photo to under 50 KB?",
      answer:
        "Choose the PAN preset, add your photo and press Prepare for submission. The tool compresses it into the allowed range and shows the final KB before you download.",
    },
    {
      question: "Can this tool resize my PAN signature?",
      answer:
        "Not on this page. Use the Signature Resizer and choose the PAN signature preset (4.5 x 2.0 cm, up to 50 KB).",
    },
    {
      question: "Does the tool make the background white?",
      answer:
        "No. It warns you if the background looks darker than white, but it does not remove or replace it. Retake the photo against a plain light wall for the best result.",
    },
    {
      question: "Is my Aadhaar or PAN photo uploaded?",
      answer: "No. The photo is processed in your browser and never leaves your device.",
    },
  ],
  howTo: [
    {
      title: "Choose Aadhaar or PAN",
      description: "Select the photo preset. Its size, KB range, format and background are shown.",
    },
    {
      title: "Add your photo",
      description: "Drop, browse or paste a JPG or PNG taken against a plain light background.",
    },
    {
      title: "Prepare for submission",
      description: "The tool resizes to the preset at 300 DPI, compresses to the KB range and checks the result.",
    },
    {
      title: "Download the JPG",
      description: "Check the final KB and any warnings, then save the file for your application.",
    },
  ],

  engine: "file",
  privacyNote: "client",
}
