import type { Category, CategorySlug } from "./types"

export const categories: Category[] = [
  {
    slug: "finance",
    name: "Finance",
    tagline: "Calculators for every money decision",
    description:
      "Free online finance calculators for GST, EMI, SIP, FD, RD, PPF, income tax, compound interest and more. Instant, accurate, 100% in your browser.",
    icon: "indian-rupee",
    order: 1,
    color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    previewTags: ["GST", "EMI", "SIP", "Income Tax"],
    keywords: ["gst calculator", "emi calculator", "sip calculator", "loan calculator india"],
  },
  {
    slug: "pdf",
    name: "PDF",
    tagline: "Merge, split, compress & convert PDFs",
    description:
      "Free online PDF tools that run entirely in your browser. Merge, split, compress, rotate and convert PDFs without uploading your files.",
    icon: "file-text",
    order: 2,
    color: "from-rose-500/10 to-pink-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    previewTags: ["Merge", "Split", "Compress", "Watermark"],
    keywords: ["merge pdf", "split pdf", "compress pdf", "pdf converter"],
  },
  {
    slug: "image",
    name: "Images",
    tagline: "Compress, resize & convert images",
    description:
      "Compress images under 50KB, resize, crop and convert between JPG, PNG and WebP. All image processing happens on your device.",
    icon: "image",
    order: 3,
    color: "from-sky-500/10 to-blue-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    previewTags: ["Compress", "Resize", "Cropper", "Base64"],
    keywords: ["compress image", "resize image", "image converter", "photo resizer"],
  },
  {
    slug: "government",
    name: "Government Forms",
    tagline: "Exam & official document photo tools",
    description:
      "SSC, UPSC, NEET, JEE, IBPS and Railway form photo resizers. Resize passport and signature images to exact government specifications for free.",
    icon: "landmark",
    order: 4,
    color: "from-purple-500/10 to-indigo-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    previewTags: ["SSC / UPSC", "Passport Photo", "Signature"],
    keywords: ["photo under 50kb", "passport photo resizer", "signature resizer", "ssc photo resize"],
  },
  {
    slug: "text",
    name: "Text",
    tagline: "Word counters, case converters & editors",
    description:
      "Count words and characters, convert text case, remove duplicates and extra spaces, sort lines and more. Fast, free and private.",
    icon: "type",
    order: 5,
    color: "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    previewTags: ["Word Counter", "Case Converter", "Duplicates"],
    keywords: ["word counter", "character counter", "case converter", "remove duplicate lines"],
  },
  {
    slug: "business",
    name: "Business",
    tagline: "Invoices, quotes, receipts & margin tools",
    description:
      "Free business tools for Indian businesses, freelancers, agencies and sellers. Create professional invoices, quotations and receipts, and calculate profit margins, discounts, markups and more.",
    icon: "briefcase",
    order: 6,
    color: "from-cyan-500/10 to-blue-600/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    previewTags: ["Invoice Generator", "Quotations", "Profit Margin"],
    keywords: ["invoice generator", "quotation generator", "profit margin calculator", "discount calculator"],
  },
  {
    slug: "utilities",
    name: "Utilities",
    tagline: "QR codes, passwords, dates & timers",
    description:
      "Free everyday utilities for quick calculations, conversions, generators, timers and more. Everything runs privately in your browser with no sign-up required.",
    icon: "wand-2",
    order: 7,
    color: "from-violet-500/10 to-fuchsia-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    previewTags: ["QR Generator", "Password", "Age Calc", "Timer"],
    keywords: ["qr code generator", "password generator", "age calculator", "random number generator"],
  },
  {
    slug: "audio",
    name: "Audio",
    tagline: "Convert, trim & compress audio files",
    description:
      "Free online audio converters for AMR, M4A, MP3, and WAV files. Convert call recordings and voice notes privately in your browser without file uploads.",
    icon: "music",
    order: 8,
    color: "from-amber-500/10 to-rose-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    previewTags: ["AMR to MP3", "M4A to MP3", "AMR to WAV", "MP3 to WAV"],
    keywords: ["amr to mp3", "audio converter", "m4a to mp3", "call recording converter", "amr to wav"],
  },
]

export function getCategory(slug: CategorySlug): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

export function categoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === (slug as CategorySlug))
}