import { Link } from "react-router-dom"
import { ArrowRight, ShieldCheck } from "lucide-react"
import type { ToolDefinition } from "@/data/types"
import { getIcon } from "@/components/icons"
import { toolPath } from "@/data/derive"
import { Card, CardContent } from "@/components/ui/card"

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  const Icon = getIcon(tool.icon)
  return (
    <Link to={toolPath(tool.category, tool.slug)} className="group block h-full">
      <Card className="h-full border-border/60 bg-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md active:scale-[0.99]">
        <CardContent className="flex flex-col h-full p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Icon className="size-5" aria-hidden="true" />
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="font-semibold text-base leading-tight truncate text-foreground group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
              <span className="text-[11px] text-muted-foreground capitalize flex items-center gap-1 mt-0.5">
                <ShieldCheck className="size-3 text-emerald-500" /> Client-Side
              </span>
            </div>
          </div>

          <p className="mt-3 line-clamp-2 flex-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {tool.shortDescription}
          </p>

          <div className="mt-4 flex items-center justify-between pt-2 border-t border-border/40">
            <span className="text-xs font-semibold text-primary inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Open Tool <ArrowRight className="size-3.5" aria-hidden="true" />
            </span>
            <span className="text-[10px] uppercase font-semibold text-muted-foreground/70 bg-muted px-2 py-0.5 rounded">
              {tool.category}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}