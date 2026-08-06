import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import type { ToolDefinition } from "@/data/types"
import { getIcon } from "@/components/icons"
import { toolPath } from "@/data/derive"
import { Card, CardContent } from "@/components/ui/card"

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  const Icon = getIcon(tool.icon)
  return (
    <Link to={toolPath(tool.category, tool.slug)} className="group">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="flex flex-col p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </div>
            <h3 className="font-medium leading-tight">{tool.name}</h3>
          </div>
          <p className="mt-3 line-clamp-2 flex-1 text-sm text-muted-foreground">
            {tool.shortDescription}
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
            Use tool
            <ArrowRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </CardContent>
      </Card>
    </Link>
  )
}