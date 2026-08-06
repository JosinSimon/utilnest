import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent } from "@/components/ui/card"
import { countWords, readingTimeLabel } from "./engine"
import { formatNumber } from "@/lib/utils"

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
          aria-label="Text to count"
          className="mt-4 min-h-48 w-full resize-y rounded-xl border border-input bg-card p-4 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 rounded-xl border bg-primary p-4 text-primary-foreground sm:col-span-1">
            <dt className="text-xs opacity-80">Words</dt>
            <dd className="mt-1 text-3xl font-bold tabular-nums">
              {formatNumber(result.wordCount, 0)}
            </dd>
            <dd className="text-[11px] opacity-80">only actual words count</dd>
          </div>
          <div className="rounded-xl border bg-secondary/40 p-4">
            <dt className="text-xs text-muted-foreground">Characters</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {formatNumber(result.characterCount, 0)}
            </dd>
            <dd className="text-[11px] text-muted-foreground">with spaces</dd>
          </div>
          <div className="rounded-xl border bg-secondary/40 p-4">
            <dt className="text-xs text-muted-foreground">Without spaces</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {formatNumber(result.characterCountWithoutSpaces, 0)}
            </dd>
            <dd className="text-[11px] text-muted-foreground">excluding spaces</dd>
          </div>
          <div className="rounded-xl border bg-secondary/40 p-4">
            <dt className="text-xs text-muted-foreground">Sentences</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {formatNumber(result.sentenceCount, 0)}
            </dd>
            <dd className="text-[11px] text-muted-foreground">split on . ! ?</dd>
          </div>
          <div className="rounded-xl border bg-secondary/40 p-4">
            <dt className="text-xs text-muted-foreground">Paragraphs</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {formatNumber(result.paragraphCount, 0)}
            </dd>
            <dd className="text-[11px] text-muted-foreground">blank-line separated</dd>
          </div>
          <div className="rounded-xl border bg-secondary/40 p-4">
            <dt className="text-xs text-muted-foreground">Read time</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {readingTimeLabel(result.readingTimeSeconds)}
            </dd>
            <dd className="text-[11px] text-muted-foreground">~200 wpm</dd>
          </div>
        </dl>

        {result.wordCount === 0 && text.trim() !== "" ? (
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
            Symbols, dashes and emojis are not counted as words.
          </p>
        ) : null}

        {result.topKeywords.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-medium">Top keywords</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {result.topKeywords.map((d) => (
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