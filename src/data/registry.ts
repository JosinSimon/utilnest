import type { CategorySlug, ToolDefinition } from "./types"

// Each tool ships its own manifest; Vite statically collects them all.
// Adding a tool = adding one folder under features/tools/{category}/{slug}.
const manifestModules = import.meta.glob<{
  definition: ToolDefinition
}>("../features/tools/*/*/manifest.ts", { eager: true })

function collect(): ToolDefinition[] {
  const tools: ToolDefinition[] = []
  for (const mod of Object.values(manifestModules)) {
    if (mod?.definition) tools.push(mod.definition)
  }
  return tools
}

export const allTools: ToolDefinition[] = collect()

// ---- Build-time integrity checks (fail fast on bad data) ----

const seenSlugs = new Map<string, string>()

for (const tool of allTools) {
  if (seenSlugs.has(tool.slug)) {
    throw new Error(
      `[registry] Duplicate tool slug "${tool.slug}" in ${seenSlugs.get(tool.slug)} and ${tool.path}`,
    )
  }
  seenSlugs.set(tool.slug, tool.path)
}

for (const tool of allTools) {
  for (const relatedId of tool.relatedTools) {
    if (!allTools.find((t) => t.id === relatedId)) {
      throw new Error(
        `[registry] Tool "${tool.id}" references missing related tool "${relatedId}"`,
      )
    }
  }
}

// ---- Query API (the single source consumed by every page) ----

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return allTools.find((t) => t.slug === slug)
}

export function getToolById(id: string): ToolDefinition | undefined {
  return allTools.find((t) => t.id === id)
}

export function getToolsByCategory(category: CategorySlug): ToolDefinition[] {
  return allTools.filter((t) => t.category === category)
}

export function getRelatedTools(tool: ToolDefinition): ToolDefinition[] {
  return tool.relatedTools
    .map((id) => getToolById(id))
    .filter((t): t is ToolDefinition => Boolean(t))
}

export function getPopularTools(limit = 8): ToolDefinition[] {
  return allTools
    .filter((t) => t.popular)
    .sort((a, b) => b.searchWeight - a.searchWeight)
    .slice(0, limit)
}

export function getTrendingTools(limit = 8): ToolDefinition[] {
  return allTools
    .filter((t) => t.trending)
    .sort((a, b) => b.searchWeight - a.searchWeight)
    .slice(0, limit)
}

export function getFeaturedTools(limit = 6): ToolDefinition[] {
  return allTools
    .filter((t) => t.featured)
    .sort((a, b) => b.searchWeight - a.searchWeight)
    .slice(0, limit)
}

export function getRecentlyAddedTools(limit = 8): ToolDefinition[] {
  return [...allTools]
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    .slice(0, limit)
}

export function getPopularSearches(limit = 6): string[] {
  return [...allTools]
    .sort((a, b) => b.searchWeight - a.searchWeight)
    .slice(0, limit)
    .map((t) => t.primaryKeyword)
}

export function getToolsByCategorySlug(slug: string): ToolDefinition[] {
  return allTools.filter((t) => t.category === slug)
}

export const totalToolCount = allTools.length