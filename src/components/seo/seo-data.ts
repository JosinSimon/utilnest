import type { ToolDefinition, Category, FaqItem, HowToStep } from "@/data/types"
import { categoryBySlug } from "@/data/categories"
import {
  toolCanonicalUrl,
  seoTitleFor,
  toolOgImage,
  toISODate,
  categoryCanonicalUrl,
  seoTitleForCategory,
  categoryOgImage,
} from "@/data/derive"
import { site } from "@/data/site"

type JsonLd = Record<string, unknown>

export interface SeoData {
  title: string
  description: string
  canonical: string
  og: { type: string; title: string; description: string; image: string; url: string }
  keywords?: string[]
  robots?: "index, follow" | "noindex, nofollow" | "noindex, follow"
  jsonLd?: JsonLd | JsonLd[]
}

export function toolSeoData(tool: ToolDefinition): SeoData {
  const categoryName = categoryBySlug(tool.category)?.name ?? tool.category
  const breadcrumbs = [
    { label: "Home", url: site.url },
    { label: categoryName, url: `${site.url}/category/${tool.category}` },
    { label: tool.name, url: toolCanonicalUrl(tool) },
  ]

  const jsonLdList: JsonLd[] = [
    softwareJsonLd(tool),
    breadcrumbJsonLd(breadcrumbs),
  ]

  const faq = faqJsonLd(tool.faq)
  if (faq) jsonLdList.push(faq)

  const howTo = howToJsonLd(tool.howTo, tool.name)
  if (howTo) jsonLdList.push(howTo)

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
    jsonLd: jsonLdList,
  }
}

export function categorySeoData(category: Category, categoryFaqs?: FaqItem[]): SeoData {
  const breadcrumbs = [
    { label: "Home", url: site.url },
    { label: category.name, url: categoryCanonicalUrl(category.slug) },
  ]

  const jsonLdList: JsonLd[] = [
    breadcrumbJsonLd(breadcrumbs),
  ]

  if (categoryFaqs && categoryFaqs.length > 0) {
    const faq = faqJsonLd(categoryFaqs)
    if (faq) jsonLdList.push(faq)
  }

  return {
    title: seoTitleForCategory(category),
    description: category.description,
    canonical: categoryCanonicalUrl(category.slug),
    keywords: category.keywords,
    robots: site.noIndex ? "noindex, nofollow" : "index, follow",
    og: {
      type: "website",
      title: seoTitleForCategory(category),
      description: category.description,
      image: categoryOgImage(category.slug),
      url: categoryCanonicalUrl(category.slug),
    },
    jsonLd: jsonLdList,
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
    logo: site.defaultOgImage,
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
    operatingSystem: "Web Browser",
    browserRequirements: "Requires JavaScript",
    inLanguage: "en-IN",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    datePublished: toISODate(tool.addedAt),
    dateModified: toISODate(tool.lastUpdated),
  }
}

export function faqJsonLd(faq: FaqItem[]): JsonLd | null {
  if (!faq || !faq.length) return null
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

export function howToJsonLd(howTo: HowToStep[], name?: string): JsonLd | null {
  if (!howTo || !howTo.length) return null
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: name ? `How to use ${name}` : "How to use",
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