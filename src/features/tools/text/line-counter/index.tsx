import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent } from "@/components/ui/card"
import { countLines } from "./engine"
import { formatNumber } from "@/lib/utils"

export default function LineCounter({ tool }: { tool: ToolDefinition }) {
  const [text, setText] = useState("")

  const result = useMemo(() => countLines({ text }).data, [text])

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{tool.name}</p>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Live · 100% private
          </span>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here…"
          aria-label="Text to count lines"
          className="mt-4 min-h-44 w-full resize-y whitespace-pre rounded-xl border border-input bg-card p-4 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border bg-primary p-4 text-primary-foreground">
            <dt className="text-xs opacity-80">Lines</dt>
            <dd className="mt-1 text-3xl font-bold tabular-nums">
              {formatNumber(result.lineCount, 0)}
            </dd>
          </div>
          <div className="rounded-xl border bg-secondary/40 p-4">
            <dt className="text-xs text-muted-foreground">Non-empty</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {formatNumber(result.nonEmptyLineCount, 0)}
            </dd>
          </div>
          <div className="rounded-xl border bg-secondary/40 p-4">
            <dt className="text-xs text-muted-foreground">Blank</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {formatNumber(result.blankLineCount, 0)}
            </dd>
          </div>
          <div className="rounded-xl border bg-secondary/40 p-4">
            <dt className="text-xs text-muted-foreground">Characters</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {formatNumber(result.characterCount, 0)}
            </dd>
          </div>
          <div className="rounded-xl border bg-secondary/40 p-4">
            <dt className="text-xs text-muted-foreground">Longest line</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {formatNumber(result.longestLineLength, 0)} chars
            </dd>
          </div>
          <div className="rounded-xl border bg-secondary/40 p-4">
            <dt className="text-xs text-muted-foreground">Avg line</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {formatNumber(result.averageLineLength, 1)} chars
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}