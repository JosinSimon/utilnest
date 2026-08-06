import type { ToolDefinition, Category, FaqItem, HowToStep } from "@/data/types"
import {
  toolCanonicalUrl,
  seoTitleFor,
  toolOgImage,
  toISODate,
  categoryCanonicalUrl,
  seoTitleForCategory,
} from "@/data/derive"
import { site } from "@/data/site"

type JsonLd = Record<string, unknown>

export interface SeoData {
  title: string
  description: string
  canonical: string
  og: { type: string; title: string; description: string; image: string; url: string }
  keywords?: string[]
  robots?: "index, follow" | "noindex, nofollow"
  jsonLd?: JsonLd | JsonLd[]
}

export function toolSeoData(tool: ToolDefinition): SeoData {
  return {
    title: seoTitleFor(tool),
    description: tool.shortDescription,
    canonical: toolCanonicalUrl(tool),
    keywords: tool.keywords,
    robots: site.noIndex ? "noindex, nofollow" : "index, follow",
    og: {
      type: "website",
      title: seoTitleFor(tool),
      description: tool.shortDescription,
      image: toolOgImage(tool),
      url: toolCanonicalUrl(tool),
    },
  }
}

export function categorySeoData(category: Category): SeoData {
  return {
    title: seoTitleForCategory(category.name),
    description: category.description,
    canonical: categoryCanonicalUrl(category.slug),
    keywords: category.keywords,
    robots: site.noIndex ? "noindex, nofollow" : "index, follow",
    og: {
      type: "website",
      title: seoTitleForCategory(category.name),
      description: category.description,
      image: `${site.url}/og/category-${category.slug}.png`,
      url: categoryCanonicalUrl(category.slug),
    },
  }
}

// ---- JSON-LD builders ----

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }
}

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/og/logo.png`,
  }
}

export function breadcrumbJsonLd(
  items: { label: string; url: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: item.url,
    })),
  }
}

export function softwareJsonLd(tool: ToolDefinition): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    url: toolCanonicalUrl(tool),
    description: tool.shortDescription,
    applicationCategory: toolCategory(tool.schemaType),
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript",
    inLanguage: "en-IN",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    dateModified: toISODate(tool.lastUpdated),
  }
}

export function faqJsonLd(faq: FaqItem[]): JsonLd | null {
  if (!faq.length) return null
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  }
}

export function howToJsonLd(howTo: HowToStep[]): JsonLd | null {
  if (!howTo.length) return null
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to use",
    step: howTo.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.description,
    })),
  }
}

function toolCategory(type: ToolDefinition["schemaType"]): string {
  switch (type) {
    case "Calculator":
      return "FinanceApplication"
    case "Converter":
      return "MultimediaApplication"
    case "Generator":
      return "DesignApplication"
    default:
      return "UtilityApplication"
  }
}