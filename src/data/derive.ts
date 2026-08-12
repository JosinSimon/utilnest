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

export function toolBreadcrumbs(tool: ToolDefinition): Breadcrumb[] {
  return [
    { label: "Home", href: "/" },
    { label: "Tools", href: "/tools" },
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
  "pdf-compress": "PDF Compressor Online Free - Compress PDF in Browser",
  "image-converter": "JPG PNG WebP Converter Online Free",
  "image-compressor": "Image Compressor Online - Compress to 50KB, 100KB, 200KB",
  "image-resizer": "Image Resizer Online - Resize Photos to Exact Pixels",
  "gst-calculator": "GST Calculator India - Add or Remove GST Online",
  "income-tax-calculator": "Income Tax Calculator India FY 2026-27",
  "sip-calculator": "SIP Calculator India - Mutual Fund Returns Calculator",
  "fd-calculator": "FD Calculator India - Fixed Deposit Maturity Calculator",
  "ppf-calculator": "PPF Calculator India - Maturity & Interest Calculator",
}

const categoryTitles: Record<string, string> = {
  finance: "Free Finance Calculators India - EMI, GST, SIP, FD & Tax",
  pdf: "Free PDF Tools Online - Compress, Merge, Split & Convert",
  image: "Free Image Tools Online - Resize, Compress, Convert JPG/PNG",
  government: "Government Form Photo & Signature Tools India",
  text: "Free Text Tools Online - Word Counter, Case Converter & More",
  business: "Free Business Tools India - Invoices, Quotes & Calculators",
  utilities: "Free Utility Tools Online - QR, Password, Timer & More",
}

function titleCase(value: string): string {
  return value
    .split(/\s+/)
    .map((word) => {
      const upper = word.toUpperCase()
      if (["PDF", "JPG", "PNG", "WEBP", "GST", "EMI", "SIP", "FD", "RD", "PPF", "HRA", "QR", "UUID", "UPI"].includes(upper)) return upper
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(" ")
}

export function seoTitleFor(tool: ToolDefinition): string {
  const title = exactToolTitles[tool.slug] ?? `${titleCase(tool.primaryKeyword)} Online Free`
  return `${title} | ${site.name}`
}

export function seoTitleForCategory(category: Category): string {
  const title = categoryTitles[category.slug] ?? `Free ${category.name} Tools Online`
  return `${title} | ${site.name}`
}

export function toISODate(date: string): string {
  return new Date(date + "T00:00:00Z").toISOString()
}