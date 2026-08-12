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
}
