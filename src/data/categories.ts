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
    keywords: ["word counter", "character counter", "case converter", "remove duplicate lines"],
  },
  {
    slug: "developer",
    name: "Developer",
    tagline: "JSON, Base64, UUID, hashing tools",
    description:
      "Free developer utilities: JSON formatter and validator, Base64 encoder/decoder, UUID generator, JWT decoder, hash generator and regex tester.",
    icon: "code-2",
    order: 6,
    keywords: ["json formatter", "base64 encoder", "uuid generator", "jwt decoder"],
  },
  {
    slug: "business",
    name: "Business",
    tagline: "Invoices, quotes, receipts & margin tools",
    description:
      "Generate professional invoices, quotations and receipts. Calculate profit margins and discounts instantly with free business calculators.",
    icon: "briefcase",
    order: 7,
    keywords: ["invoice generator", "quotation generator", "profit margin calculator", "discount calculator"],
  },
  {
    slug: "converters",
    name: "Converters",
    tagline: "Unit conversion made instant",
    description:
      "Convert length, weight, temperature, area, volume, data storage, speed and time units. Simple, accurate and completely free.",
    icon: "arrow-left-right",
    order: 8,
    keywords: ["length converter", "weight converter", "temperature converter", "unit converter"],
  },
  {
    slug: "utilities",
    name: "Utilities",
    tagline: "QR codes, passwords, dates & timers",
    description:
      "Free everyday utilities: QR code generator, password generator, age calculator, random number generator, date difference and timers.",
    icon: "wand-2",
    order: 9,
    keywords: ["qr code generator", "password generator", "age calculator", "random number generator"],
  },
  {
    slug: "ai",
    name: "AI",
    tagline: "AI-powered tools, coming soon",
    description:
      "AI tools are on the way. When they arrive, everything will continue to run fast, privately and without unnecessary complexity.",
    icon: "sparkles",
    order: 10,
    keywords: ["ai tools", "ai utilities"],
  },
]

export function getCategory(slug: CategorySlug): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

export function categoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}