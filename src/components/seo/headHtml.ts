import type { SeoData } from "./seo-data"
import { site } from "@/data/site"

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function escapeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026")
}

/** Builds the full <head> inner HTML for a route during static prerender. */
export function headHtml(data: SeoData, extraJsonLd: unknown[] = []): string {
  const jsonLdItems = Array.isArray(data.jsonLd)
    ? data.jsonLd
    : data.jsonLd
      ? [data.jsonLd]
      : []
  const allJsonLd = [...jsonLdItems, ...extraJsonLd].filter(
    (item): item is Record<string, unknown> => Boolean(item),
  )

  const jsonLdScripts = allJsonLd
    .map(
      (item) =>
        `<script type="application/ld+json" data-seo-jsonld="true">${escapeJsonLd(item)}</script>`,
    )
    .join("\n    ")

  return `
    <title>${escapeHtml(data.title)}</title>
    <meta name="description" content="${escapeHtml(data.description)}" />
    <meta name="robots" content="${escapeHtml(data.robots ?? "index, follow")}" />
    <meta name="author" content="${escapeHtml(site.name)}" />
    ${data.keywords?.length ? `<meta name="keywords" content="${escapeHtml(data.keywords.join(", "))}" />` : ""}
    <link rel="canonical" href="${escapeHtml(data.canonical)}" />
    <link rel="alternate" hreflang="en-IN" href="${escapeHtml(data.canonical)}" />
    <link rel="alternate" hreflang="x-default" href="${escapeHtml(data.canonical)}" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:site_name" content="${escapeHtml(site.name)}" />
    <meta property="og:type" content="${escapeHtml(data.og.type)}" />
    <meta property="og:title" content="${escapeHtml(data.og.title)}" />
    <meta property="og:description" content="${escapeHtml(data.og.description)}" />
    <meta property="og:url" content="${escapeHtml(data.og.url)}" />
    <meta property="og:image" content="${escapeHtml(data.og.image)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(data.og.title)}" />
    <meta name="twitter:description" content="${escapeHtml(data.og.description)}" />
    <meta name="twitter:image" content="${escapeHtml(data.og.image)}" />
    <meta name="theme-color" content="#fafafa" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
    ${jsonLdScripts}
  `
}