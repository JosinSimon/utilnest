import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "qr-code-generator",
  name: "QR Code Generator",
  slug: "qr-code-generator",
  category: "utilities",
  path: "utilities/qr-code-generator",

  shortDescription: "Generate custom QR codes for URLs, text, Wi-Fi passwords, UPI payments, email, SMS, and contacts.",
  longDescription:
    "Free online QR Code Generator. Create high-resolution custom QR codes for website URLs, Wi-Fi credentials, UPI payment links, phone numbers, vCards, and SMS. Customize colors, size, and error correction level. Download in PNG or vector SVG format with 100% client-side privacy.",

  sections: [
    {
      heading: "Multi-Format QR Generation: Text, Wi-Fi, UPI & Contacts",
      body: "Easily generate custom QR codes tailored for any purpose: Wi-Fi auto-connect, UPI payment requests, digital vCard contacts, email templates, or standard URLs.",
    },
    {
      heading: "Vector SVG & High-Res PNG Exports",
      body: "Customize foreground and background colors, error correction levels (L, M, Q, H), and margin padding. Download vector SVG files for crisp print media or high-resolution PNGs for digital sharing.",
    },
  ],

  primaryKeyword: "qr code generator",
  keywords: [
    "free qr code generator",
    "upi qr code generator",
    "wifi qr code generator",
    "qr code maker",
    "create qr code online",
    "svg qr code generator",
  ],
  searchAliases: [
    "qr generator",
    "barcode generator",
    "upi qr maker",
  ],
  searchWeight: 98,

  relatedTools: ["uuid-generator", "password-generator", "unit-converter"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-08-10",

  schemaType: "Generator",
  icon: "qr-code",
  faq: [
    {
      question: "Are my QR code contents sent to a remote server?",
      answer: "No. All QR code encoding and image rendering happens 100% locally in your browser. Your Wi-Fi passwords and personal details remain completely private.",
    },
    {
      question: "How does a UPI QR Code work?",
      answer: "A UPI QR code encodes a standard `upi://pay` URI string containing your VPA (UPI ID) and optional payee name/amount. When scanned by Google Pay, PhonePe, or Paytm, it opens the payment screen automatically.",
    },
  ],
  howTo: [
    { title: "Select Content Type", description: "Choose URL, Text, Wi-Fi, UPI Payment, Phone, Email, or vCard." },
    { title: "Fill Details & Customize", description: "Enter required details and optionally customize size and colors." },
    { title: "Download or Print", description: "Click Download PNG or SVG to save your QR code instantly." },
  ],

  engine: "calculator",
  privacyNote: "client",
}

export default definition
