import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "dimensions-checker",
  name: "Image Dimensions Checker",
  slug: "dimensions-checker",
  category: "image",
  path: "image/dimensions-checker",

  shortDescription:
    "Check the pixel width and height, aspect ratio, megapixels, file size, format and DPI of a JPG or PNG. Free, instant, no upload.",
  longDescription:
    "Choose a JPG or PNG and see its width and height in pixels, aspect ratio, megapixels, file size, format and stored DPI. Use it before you upload a photo or signature to a form that asks for exact dimensions, or before you resize or crop. The file is read inside your browser and is never uploaded.",
  schemaType: "Utility",

  sections: [
    {
      heading: "What each number means",
      body: "Dimensions are the width and height in pixels, for example 3024 × 4032 px. Aspect ratio is the shape of the image written as the smallest whole numbers, so 1920 × 1080 shows as 16:9. Megapixels is width times height divided by one million, rounded to two decimals. File size is how much space the file takes, which is what most upload portals limit in KB. Format is JPEG or PNG, read from the file itself, not from the file name. DPI is the print resolution stored in the file, if there is one.",
    },
    {
      heading: "Checking a photo before an online form",
      body: "Many application forms ask for a photo or signature with exact pixel dimensions and a size range in KB. Check your file here first. If the width and height already match and the size is inside the range, you can upload it as it is. If the pixels are wrong, use the Image Resizer. If only the KB is too high, compress the image instead. Checking first saves you from a rejected upload after you have filled in the rest of the form.",
    },
    {
      heading: "Why DPI sometimes shows \"Not set\"",
      body: "DPI is only a label stored inside the file. It does not change the number of pixels or how the image looks on screen. The tool reads DPI from the JFIF header of a JPG and the pHYs block of a PNG. Many screenshots and edited images have no DPI stored there, so the tool shows \"Not set\". That is normal. If a print shop or form asks for a specific DPI, the Image DPI Converter can write a new value without changing the pixels.",
    },
    {
      heading: "Reading the aspect ratio",
      body: "The ratio is reduced to the smallest whole numbers. A 1080 × 1350 image shows 4:5, a 4000 × 3000 photo shows 4:3, and a 413 × 531 photo shows 7:9. Some sizes do not reduce to familiar numbers: a 1366 × 768 image shows 683:384, which is very close to 16:9 but not exact. If a website asks for a fixed ratio such as 1:1 or 16:9, compare the numbers here, then crop or resize until they match.",
    },
    {
      heading: "Private: nothing is uploaded",
      body: "The tool reads the file's header on your device to find the width, height and DPI. Nothing is sent to a server, so it is safe for ID photos, signatures and scanned documents. It accepts JPG and PNG. If you have a WebP, HEIC or other format, convert it to JPG first with the Image Converter, then check it here.",
    },
  ],

  examples: [
    {
      title: "Phone camera photo",
      input: "JPG, 3024 × 4032 pixels",
      output: "Aspect ratio 3:4, 12.19 MP",
    },
    {
      title: "Laptop screenshot",
      input: "PNG, 1920 × 1080 pixels",
      output: "Aspect ratio 16:9, 2.07 MP",
    },
    {
      title: "Instagram portrait post",
      input: "JPG, 1080 × 1350 pixels",
      output: "Aspect ratio 4:5, 1.46 MP",
    },
  ],

  primaryKeyword: "check image dimensions",
  keywords: [
    "image dimensions checker",
    "check image size in pixels",
    "image pixel size checker",
    "what size is my image",
    "check photo width and height",
    "aspect ratio of image",
    "image resolution checker online",
    "jpeg dimensions online",
    "png dimensions checker",
    "image megapixels checker",
    "check image dpi online",
    "photo size checker for online form",
  ],
  searchAliases: [
    "image width height tool",
    "check photo resolution",
    "image dpi checker",
    "photo pixel checker",
    "image size checker",
    "find image dimensions",
  ],
  searchWeight: 68,

  relatedTools: ["image-dpi-converter", "image-resizer", "image-cropper", "compress-image"],
  featured: false,
  trending: false,
  popular: false,
  addedAt: "2026-08-07",
  lastUpdated: "2026-11-11",

  icon: "ruler",
  faq: [
    {
      question: "How do I check the pixel size of a photo?",
      answer:
        "Choose the photo on this page or paste it with Ctrl+V. The width and height in pixels appear right away, along with the aspect ratio, megapixels, file size, format and DPI.",
    },
    {
      question: "Which formats are supported?",
      answer:
        "JPG and PNG. For WebP, HEIC or other formats, convert the file to JPG first and then check it.",
    },
    {
      question: "Why does DPI show \"Not set\"?",
      answer:
        "The file has no DPI value in the place the tool reads it. This is common for screenshots and edited images. DPI does not affect the pixels, so the image is still fine for online forms.",
    },
    {
      question: "Is pixel size the same as file size?",
      answer:
        "No. Pixel size is the width and height of the image. File size is how many KB or MB the file takes. Two images with the same pixels can have very different file sizes depending on format and compression.",
    },
    {
      question: "How do I change the dimensions after checking?",
      answer:
        "Use the Image Resizer to set an exact width and height, or the Image Cropper to cut the image to a new shape. Then check the new file here again.",
    },
    {
      question: "Is my image uploaded?",
      answer: "No. The file is read on your own device and never leaves it.",
    },
  ],
  howTo: [
    {
      title: "Choose an image",
      description: "Drag a JPG or PNG onto the box, browse for it, or paste a copied image with Ctrl+V or Cmd+V.",
    },
    {
      title: "Read the dimensions",
      description: "Width and height in pixels, aspect ratio and megapixels appear under the preview.",
    },
    {
      title: "Check size, format and DPI",
      description: "Compare the file size and DPI with what your form or print shop asks for.",
    },
    {
      title: "Fix anything that does not match",
      description: "Resize, crop or compress the image with the related tools, then check the new file again.",
    },
  ],

  engine: "text",
  privacyNote: "client",
}
