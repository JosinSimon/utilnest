import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "image-cropper",
  name: "Image Cropper",
  slug: "image-cropper",
  category: "image",
  path: "image/image-cropper",

  shortDescription:
    "Crop a photo in your browser: drag the crop box, use a ratio button, and save as JPG or PNG. Free, no sign-up, nothing is uploaded.",
  longDescription:
    "Cut away the parts of a photo you do not need, such as extra background, a cluttered edge or a status bar in a screenshot. Drag the crop box into place, use the ratio buttons to change its shape, and save the result as JPG or PNG. The crop runs in your browser, so your photo stays on your device.",
  schemaType: "Utility",

  sections: [
    {
      heading: "How the crop box works",
      body: "When you add an image, the crop box covers the whole picture. Press a ratio button (1:1, 4:3, 3:2 or 16:9) to give the box a new shape, then drag it to frame the part you want to keep. On a computer you can also hold Shift and drag near the left or right edge of the box to change its size. Press Crop & save to create the new image, then download it.",
    },
    {
      heading: "No quality loss from scaling",
      body: "The cropped area is saved at its original pixels. The tool does not stretch or shrink what you keep, so a crop from a 12 MP phone photo stays sharp. The saved file name includes the final width and height, for example photo-crop.1080x1080.jpg, so you can confirm the size at a glance. If a website needs an exact size such as 200 × 230 pixels, crop first to remove what you do not want, then use the Image Resizer to set the exact numbers.",
    },
    {
      heading: "JPG or PNG: which to save",
      body: "Choose JPG for photos. The file is much smaller and it is accepted almost everywhere, including job portals and chat apps. Choose PNG for screenshots, diagrams and images with text or a transparent background, because PNG is lossless and keeps sharp edges. A PNG crop of a large photo can be several times bigger than the same crop as JPG, so switch to JPG if an upload limit is tight.",
    },
    {
      heading: "Common reasons to crop",
      body: "Cropping a group photo down to one face for a profile picture. Removing the status bar and keyboard from a phone screenshot before sharing it. Cutting a scanned page so only the signature or document is left, with no table or floor around it. Trimming a product photo so the item fills the frame for an online listing. Making a wide photo fit a banner or a slide. In each case, frame tightly but leave a little space around the subject so it does not feel cramped.",
    },
    {
      heading: "Private by design",
      body: "Your image is decoded and cropped in your browser. It is not uploaded, stored or shared, so it is safe for ID cards, certificates and personal photos. The saved file is a new image drawn from the pixels you kept, so camera details stored in the original, such as location data, are not copied into the cropped file. You can paste an image with Ctrl+V or Cmd+V, and the tool works on phones as well as computers.",
    },
  ],

  examples: [
    {
      title: "Profile photo from a group picture",
      input: "4000 × 3000 phone photo, box moved over one face",
      output: "Smaller JPG of just that person, at the original sharpness",
    },
    {
      title: "Clean phone screenshot",
      input: "Screenshot with status bar and keyboard",
      output: "PNG with only the message or page you want to share",
    },
    {
      title: "Signature from a scan",
      input: "Full A4 scan with a signature near the bottom",
      output: "Cropped JPG of the signature, ready to resize for a form",
    },
  ],

  primaryKeyword: "crop image",
  keywords: [
    "image cropper",
    "crop image online",
    "crop photo online free",
    "crop image to square",
    "crop picture aspect ratio",
    "crop image 16:9",
    "crop photo for profile picture",
    "crop screenshot",
    "crop jpg",
    "crop png image",
    "cut image online",
    "crop photo without app",
  ],
  searchAliases: [
    "cut part of image",
    "crop photo to 16:9",
    "square crop image",
    "trim photo",
    "photo cropper",
    "crop picture",
  ],
  searchWeight: 80,

  relatedTools: ["image-resizer", "image-converter", "dimensions-checker", "passport-photo-maker"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-11-11",

  icon: "crop",
  faq: [
    {
      question: "How do I crop a photo online?",
      answer:
        "Add the photo, choose a ratio button to set the box shape, drag the box over the part you want to keep, then press Crop & save and download the new file.",
    },
    {
      question: "Does cropping reduce image quality?",
      answer:
        "No. The part you keep is saved at its original pixels with no scaling. JPG output uses high quality compression; choose PNG if you need a lossless file.",
    },
    {
      question: "How do I crop to an exact pixel size like 200 × 230?",
      answer:
        "Crop first to frame the subject, then open the Image Resizer and enter the exact width and height. The resizer is built for exact pixel sizes.",
    },
    {
      question: "Can I crop on my phone?",
      answer:
        "Yes. On a phone, use the ratio buttons to set the box size and drag the box with your finger. Resizing the box by its edge needs a keyboard Shift key, so it works on computers only.",
    },
    {
      question: "Which formats can I crop?",
      answer:
        "JPG, PNG, WebP and AVIF images open in most modern browsers. The cropped image is saved as JPG or PNG.",
    },
    {
      question: "Is my image uploaded?",
      answer: "No. Cropping happens on your device and the image never leaves it.",
    },
  ],
  howTo: [
    {
      title: "Add your image",
      description: "Drag a photo onto the box, browse for it, or paste a copied image with Ctrl+V or Cmd+V.",
    },
    {
      title: "Set the box shape",
      description: "Press 1:1, 4:3, 3:2 or 16:9 to change the crop box, or leave it on Free to start from the whole image.",
    },
    {
      title: "Drag to frame",
      description: "Move the box over the part you want to keep. On a computer, Shift-drag an edge to resize it.",
    },
    {
      title: "Crop and download",
      description: "Pick JPG or PNG, press Crop & save, then download the cropped image.",
    },
  ],

  engine: "file",
  privacyNote: "client",
}
