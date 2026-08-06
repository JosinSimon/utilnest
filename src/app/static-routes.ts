import { categories } from "@/data/categories"
import { allTools } from "@/data/registry"
import { toolPath, categoryPath } from "@/data/derive"

type Kind = "home" | "tools" | "search" | "category" | "tool" | "legal"

export interface StaticRoute {
  path: string
  kind: Kind
  toolSlug?: string
  categorySlug?: string
}

export const legalPaths: { path: string; kind: Kind }[] = [
  { path: "/about", kind: "legal" },
  { path: "/privacy", kind: "legal" },
  { path: "/terms", kind: "legal" },
  { path: "/contact", kind: "legal" },
]

/** Every URL that is pre-rendered to static HTML at build time. */
export const staticRoutes: StaticRoute[] = [
  { path: "/", kind: "home" },
  { path: "/tools", kind: "tools" },
  { path: "/search", kind: "search" },
  ...categories.map((c) => ({
    path: categoryPath(c.slug),
    kind: "category" as Kind,
    categorySlug: c.slug,
  })),
  ...allTools.map((t) => ({
    path: toolPath(t.category, t.slug),
    kind: "tool" as Kind,
    toolSlug: t.slug,
  })),
  ...legalPaths,
]

/** Paths that should be referenced in sitemap.xml (canonical, indexable). */
export const sitemapRoutes: StaticRoute[] = staticRoutes.filter(
  (r) => r.kind !== "search",
)

export function findCategorySlug(r: StaticRoute): string | undefined {
  return r.kind === "category" ? r.categorySlug : undefined
}

export function findToolSlug(r: StaticRoute): string | undefined {
  return r.kind === "tool" ? r.toolSlug : undefined
}