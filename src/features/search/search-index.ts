import Fuse from "fuse.js"
import type { ToolDefinition } from "@/data/types"
import { allTools, getPopularSearches } from "@/data/registry"

const fuse = new Fuse<ToolDefinition>(allTools, {
  keys: [
    { name: "name", weight: 0.5 },
    { name: "primaryKeyword", weight: 0.3 },
    { name: "keywords", weight: 0.2 },
    { name: "searchAliases", weight: 0.15 },
    { name: "category", weight: 0.05 },
    { name: "shortDescription", weight: 0.1 },
  ],
  threshold: 0.35,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
})

export interface SearchHit {
  tool: ToolDefinition
  score: number
}

export function searchTools(query: string, limit = 12): SearchHit[] {
  const q = query.trim()
  if (!q) return []

  // exact/prefix matches on alias/name outrank fuzzy hits
  const exact = allTools.filter(
    (t) =>
      t.name.toLowerCase().startsWith(q.toLowerCase()) ||
      t.searchAliases.some((a) => a.toLowerCase().startsWith(q.toLowerCase())),
  )
  const exactIds = new Set(exact.map((t) => t.id))

  const hits = fuse.search(q).slice(0, limit)

  const ranked: SearchHit[] = [
    ...exact.map((t) => ({ tool: t, score: 0 })),
    ...hits
      .filter((h) => !exactIds.has(h.item.id))
      .map((h) => ({ tool: h.item, score: h.score ?? 1 })),
  ]

  return ranked
    .sort((a, b) => a.score - b.score || b.tool.searchWeight - a.tool.searchWeight)
    .slice(0, limit)
}

export { getPopularSearches }