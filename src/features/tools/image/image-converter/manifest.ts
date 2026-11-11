import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "image-converter",
  name: "Image Converter (JPG / PNG / WebP)",
  slug: "image-converter",
  category: "image",
  path: "image/image-converter",

  shortDescription:
    "Convert images to JPG, PNG or WebP in your browser. Convert several at once, set quality, and download as a ZIP. Free and nothing is uploaded.",
  longDescription:
    "Change an image's format to JPG, PNG or WebP without installing software. Add one image or a batch, pick the output format, adjust quality for JPG and WebP, and download a single file or a ZIP of all of them. Conversion happens on your device, so your images are never uploaded.",
  schemaType: "Utility",

  sections: [
    {
      heading: "Which format should you choose?",
      body: "JPG is the safest choice for photos. It gives small files and almost every website, form and app accepts it. PNG is lossless and keeps transparent backgrounds, so it suits logos, screenshots, diagrams and anything with sharp text, but photo files are usually much larger. WebP is a newer format made for websites. It often gives smaller files than JPG at similar quality and also supports transparency, but some older software and some upload forms do not accept it yet.",
    },
    {
      heading: "Using the quality slider",
      body: "The slider appears for JPG and WebP and runs from 10% to 100%, starting at 90%. Higher quality means a sharper image and a bigger file. For photos you will share or upload, 75% to 90% usually looks the same as the original on a phone screen. Go lower only when you need a much smaller file and can accept some blur around edges. PNG has no slider because it is always lossless. If you need a file under a set size, such as 100 KB, use a compressor instead.",
    },
    {
      heading: "Common conversions and what to expect",
      body: "PNG to JPG: the file usually gets much smaller, and any transparent area becomes white, because JPG cannot store transparency. JPG to PNG: the file usually gets bigger, and it will not regain detail that JPG compression already removed. WebP to JPG: useful when a form or older app rejects WebP files you saved from a website. JPG or PNG to WebP: useful for web pages where smaller images load faster. GIF, BMP and AVIF files can also be opened; an animated GIF is converted from its first frame only.",
    },
    {
      heading: "Convert many images at once",
      body: "Add as many images as you need, by browsing, dragging, or pasting with Ctrl+V or Cmd+V. You can keep adding files before you convert. All files are converted to the same format and quality, one after another. When there is one file you get a direct download; when there are several, you get a single ZIP. The width and height of every image stay the same as the original. If a file cannot be read, the tool tells you how many failed and still gives you the rest.",
    },
    {
      heading: "Private by design",
      body: "Every image is decoded and re-encoded inside your browser, so nothing is sent to a server. That makes it safe for ID scans, certificates and personal photos. The new file is drawn fresh from the image pixels, so camera details stored in the original, such as location data, are not carried over. There are no watermarks and no sign-up.",
    },
  ],

  examples: [
    {
      title: "Logo with transparent background",
      input: "PNG logo, convert to JPG",
      output: "JPG with a white background in place of the transparent area",
    },
    {
      title: "Image saved from a website",
      input: "WebP image a form will not accept",
      output: "JPG with the same width and height, ready to upload",
    },
    {
      title: "Batch of product photos",
      input: "10 JPG photos, convert to WebP at 80% quality",
      output: "10 WebP files in one ZIP download",
    },
  ],

  primaryKeyword: "jpg to png converter",
  keywords: [
    "jpg to png",
    "png to jpg",
    "webp to jpg",
    "webp to png",
    "jpg to webp",
    "png to webp",
    "image format converter",
    "convert image online free",
    "image converter online",
    "convert multiple images to jpg",
    "bmp to jpg",
    "gif to png",
  ],
  searchAliases: [
    "convert jpg to webp",
    "png to jpg converter",
    "webp to jpeg",
    "change image format",
    "photo format converter",
    "convert picture to jpg",
  ],
  searchWeight: 82,

  relatedTools: ["image-resizer", "image-compressor", "png-to-jpg", "webp-to-jpg"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-11-11",

  icon: "refresh-cw",
  faq: [
    {
      question: "How do I convert an image to JPG?",
      answer:
        "Add your image, choose JPG under Convert to, set the quality if you want, and press Convert. Then download the new JPG file.",
    },
    {
      question: "Why did my transparent PNG get a white background?",
      answer:
        "JPG cannot store transparency, so transparent areas are filled with white. Choose PNG or WebP if you need to keep the transparent background.",
    },
    {
      question: "Will converting JPG to PNG improve quality?",
      answer:
        "No. PNG keeps what is already in the image, but it cannot restore detail that JPG compression removed. The file will usually be larger.",
    },
    {
      question: "Can I convert many images at once?",
      answer:
        "Yes. Add several images, pick one output format and press Convert. When more than one image is converted, you download them together as a ZIP file.",
    },
    {
      question: "Does conversion change the image size in pixels?",
      answer:
        "No. The width and height stay the same. Only the format and file size change. Use the Image Resizer if you also need new dimensions.",
    },
    {
      question: "Are my images uploaded?",
      answer: "No. All conversion happens in your browser and your images never leave your device.",
    },
  ],
  howTo: [
    {
      title: "Add your images",
      description: "Drag one or more images onto the box, browse for them, or paste a copied image.",
    },
    {
      title: "Choose the output format",
      description: "Pick JPG for photos, PNG for transparency or sharp graphics, or WebP for websites.",
    },
    {
      title: "Set the quality",
      description: "For JPG and WebP, move the quality slider. 75% to 90% suits most photos.",
    },
    {
      title: "Convert and download",
      description: "Press Convert, then download the file, or the ZIP if you converted several images.",
    },
  ],

  engine: "file",
  privacyNote: "client",
}
