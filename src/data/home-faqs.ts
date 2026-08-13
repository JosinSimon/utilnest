import type { FaqItem } from "./types"

export interface HomeFaq {
  q: string
  a: string
}

export const HOME_FAQS: HomeFaq[] = [
  {
    q: "Are all tools on UtilNest really 100% free?",
    a: "Yes! Every single tool on UtilNest is completely free with no registration, no subscription, and no hidden usage limits.",
  },
  {
    q: "Do you store my uploaded images, PDFs, or financial data?",
    a: "Never. All calculations, PDF conversions, image compression, and QR code generations happen locally inside your browser memory using client-side JavaScript. Your data never touches any server.",
  },
  {
    q: "Can I use UtilNest tools on mobile?",
    a: "Yes! UtilNest is fully mobile-responsive and works smoothly on smartphones, tablets, and desktops. Most tools run directly in your browser after the page loads.",
  },
]

export const HOME_FAQ_SCHEMA: FaqItem[] = HOME_FAQS.map((faq) => ({
  question: faq.q,
  answer: faq.a,
}))
