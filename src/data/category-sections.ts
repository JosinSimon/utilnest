import type { CategorySlug } from "./types"

export interface CategorySection {
  id: string
  title: string
  description: string
  badge?: string
  layout?: "featured" | "compact"
  toolIds: string[]
}

export const categorySections: Partial<Record<CategorySlug, CategorySection[]>> = {
  image: [
    {
      id: "popular",
      title: "Popular Image Tools",
      description: "The most-used image tools for resizing, compressing, converting and editing photos.",
      layout: "featured",
      toolIds: [
        "image-compressor",
        "image-resizer",
        "image-converter",
        "background-remover",
      ],
    },
    {
      id: "compress-exact-size",
      title: "Compress Images to Exact Size",
      description: "Quickly reduce photos to common upload limits for online forms, exam portals and email.",
      badge: "High intent",
      layout: "compact",
      toolIds: [
        "compress-image-to-50kb",
        "compress-image-to-100kb",
      ],
    },
    {
      id: "convert",
      title: "Convert Image Formats",
      description: "Convert images between JPG, PNG, WebP and Base64 formats in your browser.",
      layout: "compact",
      toolIds: [
        "jpg-to-png",
        "png-to-jpg",
        "webp-to-png",
        "jpg-to-webp",
        "png-to-webp",
        "webp-to-jpg",
        "image-converter",
        "image-base64",
        "image-dpi-converter",
      ],
    },
    {
      id: "edit",
      title: "Edit & Enhance Images",
      description: "Crop, watermark, inspect and prepare images without uploading them.",
      layout: "compact",
      toolIds: [
        "image-cropper",
        "image-watermark",
        "dimensions-checker",
      ],
    },
  ],
  government: [
    {
      id: "popular",
      title: "Popular Government Form Tools",
      description: "Resize and compress photos, signatures and documents for Indian forms and exams.",
      badge: "Popular in India",
      layout: "featured",
      toolIds: [
        "government-exam-photo",
        "signature-resizer",
        "compress-image",
        "resize-image",
      ],
    },
    {
      id: "exam-photo-signature",
      title: "Exam Photo & Signature Presets",
      description: "Focused India exam pages for signature, photo and recruitment form image requirements.",
      badge: "Popular in India",
      layout: "compact",
      toolIds: [
        "resize-signature-140x60",
        "resize-photo-200x230",
        "neet-photo-size-2026",
        "ibps-photo-signature-resize",
        "ssc-signature-resize",
      ],
    },
    {
      id: "exam-presets",
      title: "All Government Preset Tools",
      description: "Use ready-made tools for document scans, passport photos, Aadhaar/PAN images and other official uploads.",
      layout: "compact",
      toolIds: [
        "exam-preset",
        "passport-photo-maker",
        "aadhaar-pan",
        "document-scanner",
      ],
    },
  ],
  pdf: [
    {
      id: "popular",
      title: "Popular PDF Tools",
      description: "The core PDF utilities for compressing, converting, merging and protecting files.",
      layout: "featured",
      toolIds: ["pdf-compress", "images-to-pdf", "pdf-to-jpg", "pdf-merge"],
    },
    {
      id: "upload-limit",
      title: "PDF Upload Limit Compressors",
      description: "Focused PDF compression pages for common form, email and portal size limits.",
      badge: "High intent",
      layout: "compact",
      toolIds: [
        "compress-pdf-below-100kb",
        "compress-pdf-below-200kb",
        "compress-pdf-below-500kb",
      ],
    },
    {
      id: "convert",
      title: "Convert PDFs and Images",
      description: "Turn PDFs into JPG pages or combine images into a single PDF without uploading.",
      layout: "compact",
      toolIds: ["pdf-to-jpg", "images-to-pdf", "pdf-page-manager", "pdf-split"],
    },
    {
      id: "organize-secure",
      title: "Organize and Secure PDFs",
      description: "Merge, split, rotate, watermark, lock and unlock PDFs in your browser.",
      layout: "compact",
      toolIds: [
        "pdf-merge",
        "pdf-split",
        "pdf-rotate",
        "pdf-page-manager",
        "pdf-watermark",
        "pdf-protect",
        "pdf-unlock",
      ],
    },
  ],
  finance: [
    {
      id: "popular",
      title: "Popular Finance Calculators",
      description: "The most-used calculators for loans, taxes, GST and investments in India.",
      layout: "featured",
      toolIds: [
        "emi-calculator",
        "income-tax-calculator",
        "gst-calculator",
        "sip-calculator",
      ],
    },
    {
      id: "loan-emi",
      title: "Loan EMI Calculators",
      description: "Compute monthly EMI, total interest and schedules for home, car and personal loans.",
      badge: "High intent",
      layout: "compact",
      toolIds: [
        "home-loan-emi-calculator",
        "car-loan-emi-calculator",
        "personal-loan-emi-calculator",
        "emi-calculator",
        "interest-calculator",
      ],
    },
    {
      id: "tax-gst",
      title: "Tax & GST Calculators",
      description: "Estimate income tax, add or remove GST, and plan HRA and gratuity for FY 2026-27.",
      layout: "compact",
      toolIds: [
        "income-tax-calculator",
        "gst-calculator",
        "reverse-gst-calculator",
        "hra-calculator",
        "gratuity-calculator",
      ],
    },
    {
      id: "savings-investment",
      title: "Savings & Investment Calculators",
      description: "Project maturity values and returns for SIP, FD, RD and PPF in your browser.",
      layout: "compact",
      toolIds: [
        "sip-calculator",
        "fd-calculator",
        "rd-calculator",
        "ppf-calculator",
      ],
    },
  ],
}
