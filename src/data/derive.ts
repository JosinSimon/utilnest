import type { ToolDefinition } from "./types"
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

export function toolOgImage(tool: ToolDefinition): string {
  return `${site.url}/og/${tool.slug}.png`
}

export function categoryOgImage(category: string): string {
  return `${site.url}/og/category-${category}.png`
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

export function seoTitleFor(tool: ToolDefinition): string {
  const verb = tool.schemaType.toLowerCase()
  return `${tool.name} ${verb} - Free Online Tool | ${site.name}`
}

export function seoTitleForCategory(name: string): string {
  return `${name} Tools - Free Online ${name} Calculators & Tools | ${site.name}`
}

export function toISODate(date: string): string {
  return new Date(date + "T00:00:00Z").toISOString()
}