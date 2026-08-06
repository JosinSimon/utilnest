import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent } from "@/components/ui/card"
import { countWords } from "./engine"
import { formatNumber } from "@/lib/utils"

function timeLabel(seconds: number): string {
  if (seconds < 60) return `${Math.max(1, Math.round(seconds))} sec`
  const mins = seconds / 60
  if (mins < 60) return `${mins.toFixed(1)} min`
  return `${(mins / 60).toFixed(1)} hr`
}

const stats = [
  { key: "words", label: "Words", hint: "total words" },
  { key: "characters", label: "Characters", hint: "with spaces" },
  { key: "charactersNoSpaces", label: "No spaces", hint: "without spaces" },
  { key: "sentences", label: "Sentences", hint: "count" },
  { key: "paragraphs", label: "Paragraphs", hint: "count" },
] as const

export default function WordCounter({ tool }: { tool: ToolDefinition }) {
  const [text, setText] = useState("")

  const result = useMemo(() => countWords({ text }).data, [text])

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            {tool.name}
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Live · 100% private
          </span>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here…"
          aria-label="Text input"
          className="mt-4 min-h-48 w-full resize-y rounded-xl border border-input bg-card p-4 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s) => (
            <div key={s.key} className="rounded-xl border bg-secondary/40 p-4">
              <dt className="text-xs text-muted-foreground">{s.label}</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums">
                {formatNumber(result[s.key], 0)}
              </dd>
              <dd className="text-[11px] text-muted-foreground">{s.hint}</dd>
            </div>
          ))}
          <div className="rounded-xl border bg-secondary/40 p-4">
            <dt className="text-xs text-muted-foreground">Read time</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {timeLabel(result.readingTime)}
            </dd>
            <dd className="text-[11px] text-muted-foreground">200 wpm</dd>
          </div>
        </dl>

        {result.density.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-medium">Top keywords</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {result.density.map((d) => (
                <span
                  key={d.word}
                  className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium"
                >
                  {d.word}
                  <span className="text-muted-foreground">{d.count}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}