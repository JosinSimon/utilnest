import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "document-scanner",
  name: "Document Scanner",
  slug: "document-scanner",
  category: "government",
  path: "government/document-scanner",

  shortDescription:
    "Turn photos of documents into one PDF in your browser. Add pages, rotate them, choose A4 or original size and download. Free, no upload, no sign-up.",
  longDescription:
    "Add one or more photos or scans of a document, such as a form, certificate, mark sheet or letter, and this tool combines them into a single PDF. You can remove pages, rotate them and choose A4 or original page size. It does not detect edges, correct perspective or read text, so crop and straighten your photos first if needed. Everything happens in your browser, and your documents never leave your device.",
  schemaType: "Utility",

  sections: [
    {
      heading: "What the scanner does",
      body: "It takes JPG or PNG images and places each one on its own PDF page, in the order you added them. A4 puts each image in the centre of an A4 page with white margins, which suits printing and most upload portals. Original makes each page the same shape as its image, with no margins. Rotation turns every page by the same 0, 90, 180 or 270 degrees, so add sideways pages in a separate PDF if only some need turning.",
    },
    {
      heading: "How to photograph a document well",
      body: "Lay the page flat on a dark, plain surface so its edges stand out. Use daylight or a bright room, and switch off the flash to avoid glare on glossy paper. Hold the phone directly above the page, parallel to it, so the text is not slanted. Make sure all four corners are in the shot, then crop away the table around the page. Check that small print is sharp before you add the photo.",
    },
    {
      heading: "Getting the PDF under a size limit",
      body: "Each page is saved as a good-quality JPG at its original resolution, so a PDF made from large phone photos can run to several MB. Upload portals often set a file-size limit, so check the one on your form before you submit. If the PDF is too big, compress it with a PDF compressor, or resize the photos to a smaller pixel size before adding them here.",
    },
    {
      heading: "Common problems and fixes",
      body: "Pages in the wrong order: remove them and add them again in the right order. One page sideways: make a separate PDF for it with the right rotation, then merge the PDFs. Unreadable text: retake the photo closer and in better light rather than zooming in later. Dark shadows from your hand or phone: move the light source or shoot from a little higher. Upload rejected as too large: compress the PDF before submitting it.",
    },
    {
      heading: "Private by design",
      body: "Certificates, ID proofs and bank letters are sensitive. The images are decoded and the PDF is built inside your browser. Nothing is uploaded to UtilNest or any server, and no watermark is added.",
    },
  ],

  examples: [
    {
      title: "Two-page certificate",
      input: "Two phone photos (JPG) of the front and back",
      output: "Two-page A4 PDF, pages in the order added",
    },
    {
      title: "Sideways form scan",
      input: "Three landscape photos of a portrait form",
      output: "Three-page PDF rotated 90 degrees",
    },
    {
      title: "Receipt kept at its own shape",
      input: "One long PNG screenshot of a receipt",
      output: "One-page PDF at the original size, no margins",
    },
  ],

  primaryKeyword: "document scanner",
  keywords: [
    "photo to pdf",
    "scan document to pdf online",
    "combine images into pdf",
    "document photo to pdf",
    "certificate scan to pdf",
    "form pages to pdf",
    "mobile photo to pdf",
    "jpg to pdf for upload",
    "scan certificate to pdf for govt form",
    "multiple photos to one pdf",
    "a4 pdf from photos",
  ],
  searchAliases: [
    "scan to pdf",
    "photo to pdf",
    "images to pdf",
    "document to pdf",
    "online document scanner",
    "convert photo of document to pdf",
  ],
  searchWeight: 60,

  relatedTools: ["compress-pdf-below-200kb", "pdf-compress", "pdf-merge", "images-to-pdf", "image-cropper", "compress-image"],
  featured: false,
  trending: false,
  popular: true,
  addedAt: "2026-08-07",
  lastUpdated: "2026-11-11",

  icon: "scanner",
  faq: [
    {
      question: "How do I convert photos of a document into one PDF?",
      answer:
        "Add the photos in page order, choose A4 or original size and a rotation if needed, then press Create PDF and download the file.",
    },
    {
      question: "Is my document uploaded to a server?",
      answer:
        "No. All PDF creation happens in your browser using pdf-lib; nothing is uploaded.",
    },
    {
      question: "Can I combine multiple pages?",
      answer: "Yes. Select several images and they are merged into a single PDF in the order you added them. You can remove a page before creating the PDF.",
    },
    {
      question: "Does it straighten or crop the page automatically?",
      answer:
        "No. There is no edge detection or perspective correction. Crop the photo and shoot it straight on before adding it, or use an image cropper first.",
    },
    {
      question: "Why is my PDF so large?",
      answer:
        "Pages keep the full resolution of your photos. Compress the finished PDF, or resize the photos to a smaller pixel size before adding them.",
    },
    {
      question: "Can I rotate just one page?",
      answer:
        "Rotation applies to every page in the PDF. Make a separate PDF for the page that needs turning, then merge the two.",
    },
  ],
  howTo: [
    {
      title: "Add your pages",
      description: "Drop, browse or paste JPG or PNG photos in the order they should appear. Remove any page with the cross.",
    },
    {
      title: "Choose page size",
      description: "Pick A4 for a standard page with margins, or Original to match each image's shape.",
    },
    {
      title: "Set rotation",
      description: "Choose 0, 90, 180 or 270 degrees if the pages are sideways or upside down.",
    },
    {
      title: "Create and download",
      description: "Press Create PDF, check the page count and file size, then download the PDF.",
    },
  ],

  engine: "file",
  privacyNote: "client",
}
