import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent } from "@/components/ui/card"
import { cleanSpaces } from "./engine"
import { copyToClipboard } from "@/lib/utils"

export default function RemoveExtraSpaces({ tool }: { tool: ToolDefinition }) {
  const [text, setText] = useState("")
  const [trimLines, setTrimLines] = useState(true)
  const [collapseInternal, setCollapseInternal] = useState(true)
  const [removeBlankLines, setRemoveBlankLines] = useState(true)
  const [copied, setCopied] = useState(false)

  const output = useMemo(
    () =>
      cleanSpaces(text, {
        trimLines,
        collapseInternal,
        removeBlankLines,
      }),
    [text, trimLines, collapseInternal, removeBlankLines],
  )

  const onCopy = async () => {
    const ok = await copyToClipboard(output)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  const option = (label: string, value: boolean, setter: (v: boolean) => void) => (
    <label className="flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-2 text-xs font-medium">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => setter(e.target.checked)}
        className="accent-primary"
      />
      {label}
    </label>
  )

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
          placeholder="Paste text with extra spaces here…"
          aria-label="Text to clean"
          className="mt-4 min-h-40 w-full resize-y whitespace-pre rounded-xl border border-input bg-card p-4 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {option("Collapse multiple spaces", collapseInternal, setCollapseInternal)}
          {option("Trim each line", trimLines, setTrimLines)}
          {option("Remove blank lines", removeBlankLines, setRemoveBlankLines)}
        </div>

        <div className="mt-5 rounded-xl border bg-secondary/40 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Cleaned text</p>
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
            {output || <span className="text-muted-foreground">Cleaned text appears here.</span>}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}