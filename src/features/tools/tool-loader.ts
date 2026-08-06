import type { ComponentType, LazyExoticComponent } from "react"
import { lazy } from "react"
import type { ToolDefinition } from "@/data/types"

export type ToolComponent = ComponentType<{ tool: ToolDefinition }>

/**
 * Resolves a tool's UI and engine by convention from its manifest `path`.
 * Each tool's component is its own lazy chunk — heavy dependencies only load
 * when that specific tool is opened.
 */
const toolUiModules = import.meta.glob<{ default: ToolComponent }>(
  "./*/*/index.tsx",
)

const toolEngineModules = import.meta.glob<{ default: unknown }>(
  "./*/*/engine.ts",
)

const uiCache = new Map<string, LazyExoticComponent<ToolComponent>>()

export function loadToolComponent(tool: ToolDefinition): LazyExoticComponent<ToolComponent> {
  const key = `./${tool.path}/index.tsx`
  const loader = toolUiModules[key]
  if (!loader) {
    throw new Error(`[loader] No component found for tool "${tool.id}" (${key})`)
  }
  let comp = uiCache.get(key)
  if (!comp) {
    comp = lazy(() => loader().then((m) => ({ default: m.default })))
    uiCache.set(key, comp)
  }
  return comp
}

export async function loadToolEngine(
  tool: ToolDefinition,
): Promise<{ run: unknown; family: string }> {
  const key = `./${tool.path}/engine.ts`
  const loader = toolEngineModules[key]
  if (!loader) {
    throw new Error(`[loader] No engine found for tool "${tool.id}" (${key})`)
  }
  const mod = await loader()
  return mod.default as { run: unknown; family: string }
}