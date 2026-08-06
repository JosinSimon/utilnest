import { useEffect } from "react"
import type { SeoData } from "./seo-data"

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute("content", content)
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement("link")
    el.setAttribute("rel", rel)
    document.head.appendChild(el)
  }
  el.setAttribute("href", href)
}

function removeJsonLd() {
  document.head
    .querySelectorAll('script[data-seo-jsonld="true"]')
    .forEach((s) => s.remove())
}

function setJsonLd(jsonLd?: SeoData["jsonLd"]) {
  removeJsonLd()
  if (!jsonLd) return
  const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd]
  for (const item of items) {
    if (!item) continue
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.dataset.seoJsonld = "true"
    script.textContent = JSON.stringify(item)
    document.head.appendChild(script)
  }
}

/** Applies SEO metadata to the document head on client-side navigation. */
export function Seo({ data }: { data: SeoData }) {
  useEffect(() => {
    document.title = data.title
    upsertMeta("name", "description", data.description)
    upsertMeta("name", "robots", data.robots ?? "index, follow")
    if (data.keywords?.length) {
      upsertMeta("name", "keywords", data.keywords.join(", "))
    }
    upsertLink("canonical", data.canonical)
    upsertMeta("property", "og:title", data.og.title)
    upsertMeta("property", "og:description", data.og.description)
    upsertMeta("property", "og:type", data.og.type)
    upsertMeta("property", "og:url", data.og.url)
    upsertMeta("property", "og:image", data.og.image)
    upsertMeta("property", "og:site_name", "ToolsOnway")
    upsertMeta("name", "twitter:card", "summary_large_image")
    upsertMeta("name", "twitter:title", data.og.title)
    upsertMeta("name", "twitter:description", data.og.description)
    upsertMeta("name", "twitter:image", data.og.image)
    setJsonLd(data.jsonLd)
  }, [data])

  return null
}