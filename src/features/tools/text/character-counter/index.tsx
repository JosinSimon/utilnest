import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent } from "@/components/ui/card"
import { countCharacters } from "./engine"
import { formatNumber } from "@/lib/utils"

export default function CharacterCounter({ tool }: { tool: ToolDefinition }) {
  const [text, setText] = useState("")

  const result = useMemo(() => countCharacters({ text }).data, [text])

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
          aria-label="Text to count characters"
          className="mt-4 min-h-40 w-full resize-y rounded-xl border border-input bg-card p-4 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <div className="rounded-xl border bg-primary p-4 text-primary-foreground">
            <dt className="text-xs opacity-80">Characters</dt>
            <dd className="mt-1 text-3xl font-bold tabular-nums">
              {formatNumber(result.characterCount, 0)}
            </dd>
            <dd className="text-[11px] opacity-80">incl. spaces</dd>
          </div>
          <div className="rounded-xl border bg-secondary/40 p-4">
            <dt className="text-xs text-muted-foreground">Without spaces</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {formatNumber(result.characterCountWithoutSpaces, 0)}
            </dd>
          </div>
          <div className="rounded-xl border bg-secondary/40 p-4">
            <dt className="text-xs text-muted-foreground">Letters</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {formatNumber(result.letterCount, 0)}
            </dd>
          </div>
          <div className="rounded-xl border bg-secondary/40 p-4">
            <dt className="text-xs text-muted-foreground">Digits</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {formatNumber(result.digitCount, 0)}
            </dd>
          </div>
          <div className="rounded-xl border bg-secondary/40 p-4">
            <dt className="text-xs text-muted-foreground">Punctuation & symbols</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {formatNumber(
                result.characterCount -
                  result.characterCountWithoutPunctuation,
                0,
              )}
            </dd>
          </div>
          <div className="rounded-xl border bg-secondary/40 p-4">
            <dt className="text-xs text-muted-foreground">Words</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {formatNumber(result.wordCount, 0)}
            </dd>
          </div>
          <div className="rounded-xl border bg-secondary/40 p-4">
            <dt className="text-xs text-muted-foreground">Lines</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {formatNumber(result.lineCount, 0)}
            </dd>
          </div>
          <div className="rounded-xl border bg-secondary/40 p-4">
            <dt className="text-xs text-muted-foreground">Unique characters</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {formatNumber(result.uniqueCharacterCount, 0)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}