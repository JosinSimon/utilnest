import type { Category, ToolDefinition } from "./types"
import { site } from "./site"

export interface Breadcrumb {
  label: string
  href: string
}

export function toolPath(category: string, slug: string): string {
  return `/category/${category}/${slug}`
}

export function categoryPath(category: string): string {
  return `/category/${category}`
}

export function toolCanonicalUrl(tool: ToolDefinition): string {
  return `${site.url}${toolPath(tool.category, tool.slug)}`
}

export function categoryCanonicalUrl(category: string): string {
  return `${site.url}${categoryPath(category)}`
}

export function toolOgImage(_tool: ToolDefinition): string {
  return site.defaultOgImage
}

export function categoryOgImage(_category: string): string {
  return site.defaultOgImage
}

export function toolBreadcrumbs(tool: ToolDefinition, categoryName?: string): Breadcrumb[] {
  return [
    { label: "Home", href: "/" },
    { label: categoryName ?? tool.category, href: categoryPath(tool.category) },
    { label: tool.name, href: toolPath(tool.category, tool.slug) },
  ]
}

export function categoryBreadcrumbs(categoryName: string): Breadcrumb[] {
  return [
    { label: "Home", href: "/" },
    { label: "Tools", href: "/tools" },
    { label: categoryName, href: "/tools" },
  ]
}

const exactToolTitles: Record<string, string> = {
  "emi-calculator": "EMI Calculator India - Home, Car & Personal Loan EMI",
  "home-loan-emi-calculator": "Home Loan EMI Calculator India - Calculate Housing Loan EMI",
  "home-loan-prepayment-calculator": "Home Loan Prepayment Calculator - Reduce EMI or Tenure",
  "home-loan-eligibility-calculator": "Home Loan Eligibility Calculator India - Based on Salary",
  "car-loan-emi-calculator": "Car EMI Calculator India 2026 - New Car Loan EMI & Interest",
  "used-car-loan-emi-calculator": "Used Car Loan EMI Calculator India - Second-Hand Car EMI",
  "commission-calculator": "Commission Calculator - Sales, Agent & Slab Commission with GST",
  "personal-loan-emi-calculator": "Personal Loan EMI Calculator India - Monthly EMI & Interest",
  "reverse-gst-calculator": "Reverse GST Calculator India - Remove GST from Total Amount",
  "pdf-compress": "PDF Compressor Online Free - Compress PDF in Browser",
  "image-converter": "JPG PNG WebP Converter Online Free",
  "image-compressor": "Image Compressor Online - Compress to 50KB, 100KB, 200KB",
  "image-resizer": "Image Resizer Online - Resize Photos to Exact Pixels",
  "gst-calculator": "GST Calculator India - Add or Remove GST Online",
  "income-tax-calculator": "Income Tax Calculator FY 2026-27 India - Old vs New Regime",
  "sip-calculator": "SIP Calculator India - Mutual Fund Returns Calculator",
  "fd-calculator": "FD Calculator India - Fixed Deposit Maturity Calculator",
  "ppf-calculator": "PPF Calculator India - Maturity & Interest Calculator",
  "compress-image": "Compress Image to KB for Govt Forms - 20KB, 50KB, 100KB",
  "compress-image-to-50kb": "Compress Image to 50KB Online Free",
  "compress-image-to-100kb": "Compress Image to 100KB Online - JPG & Photo Under 100 KB",
  "resize-signature-140x60": "Resize Signature to 140x60 Pixels (10-20KB) - IBPS, SSC",
  "resize-photo-200x230": "Resize Photo to 200x230 Pixels Online",
  "neet-photo-size-2026": "NEET Photo Size 2026 - Resize Photo & Signature",
  "ibps-photo-signature-resize": "IBPS Photo and Signature Resize Online",
  "ssc-signature-resize": "SSC Signature Resize Online - 140x60 Signature",
  "jpg-to-png": "JPG to PNG Converter Online Free",
  "png-to-jpg": "PNG to JPG Converter Online Free",
  "webp-to-png": "WebP to PNG Converter Online Free",
  "jpg-to-webp": "JPG to WebP Converter Online Free",
  "png-to-webp": "PNG to WebP Converter Online Free",
  "webp-to-jpg": "WebP to JPG Converter Online Free",
  "compress-pdf-below-100kb": "Compress PDF Below 100KB Online Free",
  "compress-pdf-below-200kb": "Compress PDF Below 200KB Online Free",
  "compress-pdf-below-500kb": "Compress PDF Below 500KB Online Free",
  "amr-to-mp3": "AMR to MP3 Converter Online - Android Call Recording to MP3",
  "amr-to-m4a": "AMR to M4A Converter Online Free - Play AMR on iPhone",
  "how-to-play-amr-files": "How to Play AMR Files on Android, iPhone, Windows & Mac",
  "amr-to-wav": "AMR to WAV Converter Online Free - Lossless Audio",
  "m4a-to-mp3": "M4A to MP3 Converter Online Free - Voice Memo to MP3",
  "mp3-to-wav": "MP3 to WAV Converter Online Free - Convert MP3 to WAV",
  "wav-to-mp3": "WAV to MP3 Converter Online Free - Convert WAV to MP3",
}

const categoryTitles: Record<string, string> = {
  finance: "Free Finance Calculators India - EMI, GST, SIP, FD & Tax",
  pdf: "Free PDF Tools Online - Compress, Merge, Split & Convert",
  image: "Free Image Tools Online - Resize, Compress, Convert JPG/PNG",
  government: "Government Form Photo & Signature Tools India",
  text: "Free Text Tools Online - Word Counter, Case Converter & More",
  business: "Free Business Tools India - Invoices, Quotes & Calculators",
  utilities: "Free Utility Tools Online - QR, Password, Timer & More",
  audio: "Free Audio Tools Online - AMR to MP3, M4A & WAV Converter",
}

const UPPERCASE_WORDS = new Set([
  "PDF", "JPG", "PNG", "GST", "EMI", "SIP", "FD", "RD", "PPF", "HRA", "QR", "UUID", "UPI",
  "AMR", "MP3", "WAV", "M4A", "AAC", "OGG", "DPI", "FY", "SSC", "IBPS", "NEET", "PAN", "SBI", "RRB", "UPSC",
])
const SPECIAL_WORDS: Record<string, string> = { webp: "WebP", base64: "Base64" }
const SMALL_WORDS = new Set(["a", "an", "and", "as", "at", "by", "for", "from", "in", "of", "on", "or", "the", "to", "vs", "with"])

/** Title-cases a keyword for search titles: "change image dpi" → "Change Image DPI". */
export function titleCase(value: string): string {
  return value
    .split(/\s+/)
    .map((word, index) => {
      const lower = word.toLowerCase()
      if (UPPERCASE_WORDS.has(word.toUpperCase())) return word.toUpperCase()
      if (SPECIAL_WORDS[lower]) return SPECIAL_WORDS[lower]
      if (/^\d+(kb|mb)$/i.test(word)) return word.toUpperCase()
      if (index > 0 && SMALL_WORDS.has(lower)) return lower
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(" ")
}

export function seoTitleFor(tool: ToolDefinition): string {
  const keyword = titleCase(tool.primaryKeyword)
  const suffix = /\bonline\b/i.test(keyword) ? "Free" : "Online Free"
  const title = exactToolTitles[tool.slug] ?? `${keyword} ${suffix}`
  return `${title} | ${site.name}`
}

export function seoTitleForCategory(category: Category): string {
  const title = categoryTitles[category.slug] ?? `Free ${category.name} Tools Online`
  return `${title} | ${site.name}`
}

export function toISODate(date: string): string {
  return new Date(date + "T00:00:00Z").toISOString()
}