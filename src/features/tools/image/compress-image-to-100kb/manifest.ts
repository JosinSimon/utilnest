import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "compress-image-to-100kb",
  name: "Compress Image to 100KB",
  slug: "compress-image-to-100kb",
  category: "image",
  path: "government/compress-image",

  shortDescription:
    "Compress a JPG, PNG or phone photo to under 100 KB in seconds. The final size is checked before download. Works on mobile, no upload, free.",
  longDescription:
    "Reduce any photo or image to 100 KB or less for job applications, exam and government forms, college admissions, visa portals and email. The 100 KB target is already set: choose your image, tap compress, and download a JPG that is verified to be under the limit. Compression runs inside your browser, so your photo never leaves your phone or computer.",
  schemaType: "Utility",
  sections: [
    {
      heading: "How to compress an image to 100 KB",
      body: "Choose your JPG, PNG or WebP image and press compress. The tool first lowers JPEG quality step by step until the file fits under 100 KB. If quality alone can't get there, which happens with very large phone photos, it gently reduces the pixel dimensions too (you can switch this off). It then reads the size of the real output file, so the number you see is the number the website will see.",
    },
    {
      heading: "Will my photo still look good?",
      body: "Yes, for most uses. 100 KB is enough for a sharp passport-size photo, a scanned signature or a clear document page. A large phone camera photo can get under 100 KB and still look clear on screen, because the tool also scales it down to a sensible size. If a portal also asks for exact dimensions (like 200 x 230 pixels), set the width and height first; a smaller image needs fewer KB and keeps more quality.",
    },
    {
      heading: "Common forms that ask for under 100 KB",
      body: "Many Indian application portals cap uploads at 50 KB, 100 KB or 200 KB: recruitment and exam forms, university and scholarship applications, passport and visa appointment sites, and job portals. Some ask for a minimum too, such as 20 KB to 100 KB. Always check the size range and dimensions in your notification, then compress to fit.",
    },
    {
      heading: "PNG, screenshots and documents",
      body: "PNG files are lossless and often much larger than JPG. For photos and scans, converting to JPG is the fastest way under 100 KB. For screenshots with lots of text, keep the dimensions reasonable so the text stays readable after compression.",
    },
    {
      heading: "No upload, no watermark",
      body: "Most online compressors upload your photo to their server. UtilNest compresses it on your own device, adds no watermark and needs no sign-up, so it's safe for ID photos, signatures and personal documents.",
    },
  ],
  examples: [
    { title: "Phone camera photo", input: "4 MB JPG from a phone camera", output: "Under 100 KB JPG, ready to upload" },
    { title: "Exam photo", input: "600 KB passport-size photo", output: "Under 100 KB, same dimensions" },
    { title: "Scanned document", input: "1.8 MB PNG scan", output: "Under 100 KB JPG, text still readable" },
  ],
  primaryKeyword: "compress image to 100kb",
  keywords: [
    "compress image to 100 kb",
    "image compressor to 100kb",
    "photo compressor to 100kb",
    "jpg compress to 100 kb",
    "compress image to 100kb online",
    "reduce image size to 100kb",
    "photo under 100kb",
    "image compressor in kb",
  ],
  searchAliases: ["100kb photo compressor", "make photo 100kb", "image size reducer 100kb", "compress to 100kb"],
  searchWeight: 94,
  relatedTools: ["compress-image-to-50kb", "image-compressor", "resize-photo-200x230", "resize-signature-140x60"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-12",
  lastUpdated: "2026-11-11",
  icon: "compress",
  faq: [
    {
      question: "How do I compress a photo to 100 KB?",
      answer:
        "Choose your photo on this page and press compress. The 100 KB target is already set. The tool lowers quality (and, if needed, dimensions) until the file is under 100 KB, then you download it.",
    },
    {
      question: "Can I compress a PNG to 100 KB?",
      answer:
        "Yes. PNG images are usually saved as JPG to reach 100 KB, because JPG is far smaller for photos and scans.",
    },
    {
      question: "How do I make sure the image is under 100 KB?",
      answer:
        "The tool checks the size of the actual output file before you download it, so the KB value shown is exactly what the upload portal will see.",
    },
    {
      question: "Does it work on Android and iPhone?",
      answer:
        "Yes. It works in Chrome, Safari and other modern mobile browsers. You don't need to install an app.",
    },
    {
      question: "What if the form needs between 20 KB and 100 KB?",
      answer:
        "A compressed photo usually lands just under 100 KB, which is inside that range. If you need a smaller file, use the 50 KB compressor.",
    },
    {
      question: "Is my photo uploaded?",
      answer: "No. Compression happens on your device and your photo never leaves it.",
    },
  ],
  howTo: [
    { title: "Choose your image", description: "Pick a JPG, PNG or WebP photo from your phone or computer." },
    { title: "Keep the 100 KB target", description: "The maximum size is already set to 100 KB." },
    { title: "Compress", description: "The tool reduces quality and, if needed, dimensions, then checks the real file size." },
    { title: "Download", description: "Save the image, now under 100 KB and ready to upload." },
  ],
  engine: "file",
  privacyNote: "client",
  preset: { targetKb: 100 },
}
