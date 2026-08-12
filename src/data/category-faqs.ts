import type { Category, FaqItem } from "./types"

export function categoryFaqs(category: Category): FaqItem[] {
  const label = category.slug === "image" ? "image" : category.name.toLowerCase()
  return [
    {
      question: `Are all ${label} tools on UtilNest 100% free?`,
      answer: `Yes, every ${label} tool on UtilNest is completely free to use with zero registration, subscription fees, or hidden limits.`,
    },
    {
      question: `Does UtilNest store my data when using ${label} tools?`,
      answer: `No. All ${label} processing happens locally inside your web browser. Your inputs and files never leave your device.`,
    },
    {
      question: `Can I use ${label} tools on mobile phones?`,
      answer: `Yes. All ${label} tools are touch-optimized and fully responsive across smartphones, tablets, and desktop computers.`,
    },
  ]
}
