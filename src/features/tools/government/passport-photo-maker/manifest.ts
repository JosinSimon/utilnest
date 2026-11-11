import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "passport-photo-maker",
  name: "Passport Photo Maker",
  slug: "passport-photo-maker",
  category: "government",
  path: "government/passport-photo-maker",

  shortDescription:
    "Resize a photo to Indian passport size, 3.5 x 4.5 cm (413 x 531 px at 300 DPI), as a 10–300 KB JPG. Checked before download. Free, no upload.",
  longDescription:
    "Add a front-facing photo and this tool resizes it to the Indian passport photo size, 3.5 x 4.5 cm, which is 413 x 531 pixels at 300 DPI. It saves a JPG between 10 KB and 300 KB and checks the result before you download. It does not crop to your face or replace the background, so start with a well-framed photo against a plain white wall. Your photo is processed in your browser and never uploaded.",
  schemaType: "Utility",

  sections: [
    {
      heading: "Indian passport photo size",
      body: "The standard Indian passport photo is 3.5 cm wide and 4.5 cm tall (35 x 45 mm), on a plain white background, with the face filling about 70–80% of the frame. Photo sizes are set in centimetres, not pixels. This tool converts them at 300 DPI, a common print resolution, giving 413 x 531 pixels. The JPG is kept between 10 KB and 300 KB. If a portal asks for a different pixel size or KB limit, follow the portal.",
    },
    {
      heading: "Do you need to upload a passport photo?",
      body: "Depending on how and where you apply, your photo may be taken in person at your appointment rather than uploaded. Check the instructions for your application before you prepare a file. Many other forms ask for a \"passport-size photo\" too, such as exam, college and job applications, and a 3.5 x 4.5 cm photo often fits those. Still, check each form's own size and KB limit.",
    },
    {
      heading: "How to take a passport-style photo at home",
      body: "Stand about half a metre in front of a plain white wall, with a window or soft light in front of you, not behind. Ask someone else to take the photo at eye level. Look straight at the camera with a neutral face and eyes open. Remove sunglasses and caps, and keep hair off your face. Leave space above your head and include the top of your shoulders, then crop to a 3.5:4.5 shape.",
    },
    {
      heading: "Common photo problems and fixes",
      body: "Background not white, or shadows behind the head: retake against a plain wall with light from the front; this tool warns about dark backgrounds but does not change them. Face too small or off-centre: crop closer before resizing, because the tool fits the whole image and fills leftover space with white. Blurry or grainy: shoot in daylight. Filters or heavy edits: use a natural, unedited photo.",
    },
    {
      heading: "Printing at the right size",
      body: "The 413 x 531 pixel file prints at 3.5 x 4.5 cm when printed at 300 DPI. In a print shop or photo app, set the print size to 3.5 x 4.5 cm rather than \"fit to page\". Printing at a different DPI changes the physical size, so check the first print with a ruler before printing several copies.",
    },
    {
      heading: "Private and free",
      body: "Your photo is resized, compressed and checked in your browser. It is not sent to UtilNest or any server, there is no sign-up, and no watermark is added.",
    },
  ],

  examples: [
    {
      title: "Phone photo against a white wall",
      input: "4 MB portrait JPG, 3024 x 4032 px",
      output: "413 x 531 px JPG, 10–300 KB",
    },
    {
      title: "Old scanned photo",
      input: "PNG scan of a printed passport photo",
      output: "413 x 531 px JPG at 3.5 x 4.5 cm (300 DPI)",
    },
  ],

  primaryKeyword: "passport photo maker",
  keywords: [
    "passport photo 3.5x4.5 cm",
    "indian passport photo size",
    "passport photo resizer",
    "passport photo white background",
    "passport photo pixel size",
    "passport photo 300 dpi",
    "passport size photo in pixels",
    "passport photo 413 x 531",
    "35 x 45 mm photo",
    "passport size photo online",
    "passport photo size in kb",
  ],
  searchAliases: [
    "passport photo",
    "passport size photo",
    "passport photo resize",
    "passport size photo maker",
    "make passport photo online",
    "3.5 x 4.5 photo",
  ],
  searchWeight: 85,

  relatedTools: ["aadhaar-pan", "government-exam-photo", "background-remover", "image-cropper", "signature-resizer"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-11-11",

  icon: "book-user",
  faq: [
    {
      question: "What size is an Indian passport photo?",
      answer: "3.5 cm x 4.5 cm (35 x 45 mm) on a plain white background, with the face filling about 70–80% of the frame.",
    },
    {
      question: "What is passport size in pixels?",
      answer:
        "It depends on the DPI. At 300 DPI, 3.5 x 4.5 cm is 413 x 531 pixels, which is what this tool produces. If a portal names a pixel size, use that instead.",
    },
    {
      question: "What file size should a passport photo be?",
      answer:
        "This tool keeps the JPG between 10 KB and 300 KB. Some forms set their own KB limit, so check the form you are uploading to.",
    },
    {
      question: "Does the tool make the background white?",
      answer:
        "No. It warns you if the background looks darker than white, but it does not remove or replace it. Take the photo against a plain white wall.",
    },
    {
      question: "Why does my photo have white bars at the sides?",
      answer:
        "Your photo was not in the 3.5:4.5 shape, so it was fitted inside without cropping or stretching. Crop it to that shape first, then resize again.",
    },
    {
      question: "Is my photo uploaded?",
      answer: "No. It is processed in your browser and never leaves your device.",
    },
  ],
  howTo: [
    {
      title: "Take or choose a photo",
      description: "Use a front-facing photo against a plain white wall, cropped to head and shoulders.",
    },
    {
      title: "Add it to the tool",
      description: "Drop, browse or paste the JPG or PNG. The 3.5 x 4.5 cm preset is already selected.",
    },
    {
      title: "Prepare for submission",
      description: "The tool resizes to 413 x 531 px, compresses to 10–300 KB and checks the result.",
    },
    {
      title: "Download and use",
      description: "Check the size and any warnings, then upload the JPG or print it at 3.5 x 4.5 cm.",
    },
  ],

  engine: "file",
  privacyNote: "client",
}
