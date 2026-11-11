import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "resize-image",
  name: "Resize Image to Exact Pixels",
  slug: "resize-image",
  category: "government",
  path: "government/resize-image",

  shortDescription:
    "Resize any photo to an exact pixel size (e.g. 453 x 453) in your browser. Resize one image or a batch, save as JPG or PNG. Free and fully private.",
  longDescription:
    "Enter the width and height in pixels that your form or website asks for, and this tool resizes your photo to exactly that size. Keep the aspect ratio on and it fills in the other side for you. You can resize several images at once and download them as a ZIP, as JPG or PNG. It sets pixels only, not file size, so use a KB compressor afterwards if your form also has a KB limit.",
  schemaType: "Utility",

  sections: [
    {
      heading: "Exact pixel output",
      body: "The resized image is rendered to precisely the width and height you enter. What you download matches the pixels you asked for, and the result panel shows the final dimensions and file size. The file name includes the new size, such as photo.453x453.jpg, so it is easy to find later. Phone photos are turned upright before resizing, so a portrait shot does not come out sideways.",
    },
    {
      heading: "Keep the aspect ratio, or crop first",
      body: "With \"Keep aspect ratio\" ticked, typing the width fills in the matching height from your first image, and the other way round. If you enter a width and height with a different shape from the original, the image is stretched or squashed to fit. That is fine for small changes, but faces look wrong when the shapes differ a lot. For a square size such as 453 x 453, crop the photo to a square first, then resize it.",
    },
    {
      heading: "JPG or PNG?",
      body: "Choose JPG for photos. It gives much smaller files and is the format most forms accept. Choose PNG for screenshots, logos or images with sharp text, where you want no compression marks. Transparent areas are filled with white in both formats. If a form gives a size in KB as well as pixels, resize here first, then use the Compress Image to Target KB tool to bring the file under the limit.",
    },
    {
      heading: "Common reasons a resized image is rejected",
      body: "The pixel size is right but the file is over the KB limit: compress it after resizing. Width and height were entered the wrong way round: many forms list width first. The image was stretched because the aspect ratio did not match: crop first. The source photo was small, so enlarging it made it blurry: start from the original photo, not a WhatsApp copy or a screenshot. The form wants a size in cm: ask for the pixel size, or convert using the DPI the form states.",
    },
    {
      heading: "Private by design",
      body: "Your images are decoded, resized and saved entirely in your browser. Nothing is uploaded to UtilNest or any server, there is no sign-up and no watermark.",
    },
  ],

  examples: [
    {
      title: "Square profile photo",
      input: "3000 x 3000 px JPG",
      output: "453 x 453 px JPG",
    },
    {
      title: "Keep the ratio",
      input: "4000 x 3000 px photo, width set to 1200",
      output: "1200 x 900 px JPG (height filled in)",
    },
    {
      title: "Batch of product photos",
      input: "10 JPG photos, 800 x 800 px each",
      output: "ZIP of 10 images at 800 x 800 px",
    },
  ],

  primaryKeyword: "resize image to exact pixels",
  keywords: [
    "resize image to 453x453",
    "photo exact pixel size",
    "resize jpg to specific dimensions",
    "image dimensions resizer",
    "resize png online",
    "resize image in pixels online",
    "change image size in pixels",
    "resize photo width and height",
    "resize image without changing aspect ratio",
    "bulk image resizer",
  ],
  searchAliases: [
    "resize photo pixels",
    "exact image size",
    "set image pixel size",
    "resize image to specific size",
    "photo pixel resizer",
    "change photo dimensions",
  ],
  searchWeight: 72,

  relatedTools: ["compress-image", "image-cropper", "dimensions-checker", "image-dpi-converter", "image-resizer"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-11-11",

  icon: "maximize",
  faq: [
    {
      question: "How do I resize an image to exact pixels?",
      answer:
        "Add your image, enter the width and height in pixels, pick JPG or PNG and press Resize. The download is exactly that size.",
    },
    {
      question: "Can I keep the aspect ratio?",
      answer: "Yes. With Keep aspect ratio ticked, enter one side and the other is filled in from the original ratio.",
    },
    {
      question: "Will my photo be stretched?",
      answer:
        "Only if the width and height you enter have a different shape from the original. Crop the photo to the target shape first to avoid stretching.",
    },
    {
      question: "Does this reduce the file size in KB?",
      answer:
        "It sets pixels, not KB. A smaller pixel size usually means a smaller file, but to hit an exact KB limit use the Compress Image to Target KB tool after resizing.",
    },
    {
      question: "What formats can I output?",
      answer: "JPG or PNG. Choose JPG for photos and PNG for screenshots or images with sharp text. Transparent areas become white.",
    },
    {
      question: "Does it keep my files private?",
      answer: "Yes. All decoding, resizing and encoding happen in your browser; nothing is uploaded.",
    },
  ],
  howTo: [
    {
      title: "Add your images",
      description: "Drop, browse or paste one or more JPG or PNG files from your device.",
    },
    {
      title: "Set the pixel size",
      description: "Enter the width and height. With Keep aspect ratio ticked, typing one side fills in the other.",
    },
    {
      title: "Choose the format",
      description: "Pick JPG for photos and smaller files, or PNG for screenshots and sharp text.",
    },
    {
      title: "Resize and download",
      description: "Press Resize, check the dimensions and size shown, then download the file or the ZIP.",
    },
  ],

  engine: "file",
  privacyNote: "client",
}
