import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent } from "@/components/ui/card"
import { dedupeLines } from "./engine"
import { copyToClipboard, formatNumber } from "@/lib/utils"

export default function RemoveDuplicateLines({ tool }: { tool: ToolDefinition }) {
  const [text, setText] = useState("")
  const [caseInsensitive, setCaseInsensitive] = useState(false)
  const [trim, setTrim] = useState(true)
  const [copied, setCopied] = useState(false)

  const result = useMemo(
    () => dedupeLines(text, { caseInsensitive, trim }),
    [text, caseInsensitive, trim],
  )

  const onCopy = async () => {
    const ok = await copyToClipboard(result.output)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

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
          placeholder="Paste lines with duplicates here…"
          aria-label="Text with duplicate lines"
          className="mt-4 min-h-44 w-full resize-y whitespace-pre rounded-xl border border-input bg-card p-4 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <label className="flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-2 text-xs font-medium">
            <input
              type="checkbox"
              checked={caseInsensitive}
              onChange={(e) => setCaseInsensitive(e.target.checked)}
              className="accent-primary"
            />
            Ignore capitalization
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-2 text-xs font-medium">
            <input
              type="checkbox"
              checked={trim}
              onChange={(e) => setTrim(e.target.checked)}
              className="accent-primary"
            />
            Trim lines before comparing
          </label>
        </div>

        {text.trim() !== "" && (
          <p className="mt-3 text-xs text-muted-foreground">
            Removed {formatNumber(result.removedCount, 0)} duplicate{" "}
            {result.removedCount === 1 ? "line" : "lines"}.
          </p>
        )}

        <div className="mt-4 rounded-xl border bg-secondary/40 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Unique lines</p>
            <button
              type="button"
              onClick={onCopy}
              disabled={result.output.length === 0}
              className="rounded-lg border border-input bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent disabled:opacity-50"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-words font-sans text-sm">
            {result.output || (
              <span className="text-muted-foreground">Your unique lines appear here.</span>
            )}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}