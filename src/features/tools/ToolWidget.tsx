import type { ToolDefinition } from "@/data/types"
import { ClientOnly } from "@/components/tool/ClientOnly"
import { loadToolComponent } from "@/features/tools/tool-loader"

/**
 * Statically imports the tool's own UI component (its own lazy chunk).
 * The component itself defines the form + calls its engine. Content around
 * it (how-to, FAQ, benefits) is always rendered by ToolLayout.
 */
export function ToolWidget({ tool }: { tool: ToolDefinition }) {
  const Component = loadToolComponent(tool)
  return (
    <ClientOnly
      fallback={
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <Component tool={tool} />
    </ClientOnly>
  )
}