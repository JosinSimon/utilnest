import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent } from "@/components/ui/card"
import { sortLines, type SortMode } from "./engine"
import { copyToClipboard, cn } from "@/lib/utils"

const MODES: { mode: SortMode; label: string }[] = [
  { mode: "alpha-asc", label: "A → Z" },
  { mode: "alpha-desc", label: "Z → A" },
  { mode: "numeric-asc", label: "1 → 9" },
  { mode: "numeric-desc", label: "9 → 1" },
  { mode: "length-asc", label: "Short → Long" },
  { mode: "length-desc", label: "Long → Short" },
]

export default function TextSorter({ tool }: { tool: ToolDefinition }) {
  const [text, setText] = useState("")
  const [mode, setMode] = useState<SortMode>("alpha-asc")
  const [copied, setCopied] = useState(false)

  const output = useMemo(() => sortLines(text, mode), [text, mode])

  const onCopy = async () => {
    const ok = await copyToClipboard(output)
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
          placeholder="Paste lines to sort here…"
          aria-label="Text to sort"
          className="mt-4 min-h-44 w-full resize-y whitespace-pre rounded-xl border border-input bg-card p-4 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m.mode}
              type="button"
              onClick={() => setMode(m.mode)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                mode === m.mode
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-card hover:bg-accent",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-xl border bg-secondary/40 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Sorted text</p>
            <button
              type="button"
              onClick={onCopy}
              disabled={output.length === 0}
              className="rounded-lg border border-input bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent disabled:opacity-50"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-words font-sans text-sm">
            {output || <span className="text-muted-foreground">Sorted text appears here.</span>}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}