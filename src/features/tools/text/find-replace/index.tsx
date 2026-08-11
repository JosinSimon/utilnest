import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent } from "@/components/ui/card"
import { findReplace, matchSegments } from "./engine"
import { copyToClipboard, cn } from "@/lib/utils"

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="group flex cursor-pointer items-center gap-2"
    >
      <span
        className={cn(
          "relative h-5 w-9 rounded-full border transition-colors",
          checked ? "border-primary bg-primary" : "border-input bg-secondary",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-4 rounded-full bg-card shadow-sm transition-transform",
            checked && "translate-x-4",
          )}
        />
      </span>
      <span
        className={cn(
          "text-xs font-semibold",
          checked ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
          checked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
        )}
      >
        {checked ? "On" : "Off"}
      </span>
    </button>
  )
}

export default function FindReplace({ tool }: { tool: ToolDefinition }) {
  const [text, setText] = useState("")
  const [find, setFind] = useState("")
  const [replace, setReplace] = useState("")
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [wholeWord, setWholeWord] = useState(false)
  const [isRegex, setIsRegex] = useState(false)
  const [copied, setCopied] = useState(false)

  const { output, matches } = useMemo(
    () => findReplace({ text, find, replace, caseSensitive, wholeWord, isRegex }),
    [text, find, replace, caseSensitive, wholeWord, isRegex],
  )

  const segments = useMemo(
    () => matchSegments(text, find, caseSensitive, wholeWord, isRegex),
    [text, find, caseSensitive, wholeWord, isRegex],
  )

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
          placeholder="Paste the text you want to edit here…"
          aria-label="Text to edit"
          className="mt-4 min-h-28 w-full resize-y rounded-xl border border-input bg-card p-4 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Find</span>
            <input
              value={find}
              onChange={(e) => setFind(e.target.value)}
              placeholder="Text to find…"
              className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">
              Replace with
            </span>
            <input
              value={replace}
              onChange={(e) => setReplace(e.target.value)}
              placeholder="Replacement (blank deletes)…"
              className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <Toggle
            checked={caseSensitive}
            onChange={() => setCaseSensitive((v) => !v)}
            label="Case sensitive"
          />
          <Toggle
            checked={wholeWord}
            onChange={() => setWholeWord((v) => !v)}
            label="Whole word only"
          />
          <Toggle
            checked={isRegex}
            onChange={() => setIsRegex((v) => !v)}
            label="Regex mode"
          />
        </div>

        {find && text && (
          <div className="mt-5 rounded-xl border p-4">
            <p className="text-sm font-medium text-muted-foreground">
              What will be replaced
            </p>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">
              {segments.map((seg, i) =>
                seg.matched ? (
                  <mark key={i} className="rounded bg-yellow-200 px-0.5 text-foreground">
                    {seg.text}
                  </mark>
                ) : (
                  <span key={i}>{seg.text}</span>
                ),
              )}
              {matches === 0 && (
                <span className="text-muted-foreground">No matches with the current settings.</span>
              )}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Highlights show exactly which words match now.{" "}
              {caseSensitive
                ? "Case sensitive is ON — only exact-case matches are highlighted."
                : "Case sensitive is OFF — all case variants match."}{" "}
              {wholeWord ? "Whole word only is ON." : "Whole word only is OFF."}{" "}
              {isRegex ? "Regex mode is ON — invalid patterns safely match nothing." : "Regex mode is OFF — special characters match literally."}
            </p>
          </div>
        )}

        <div className="mt-5 rounded-xl border bg-secondary/40 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Result
              {find && (
                <span
                  className="ml-2 rounded bg-primary/10 px-2 py-0.5 text-xs font-bold tabular-nums text-primary"
                  aria-live="polite"
                >
                  {matches} {matches === 1 ? "match" : "matches"}
                </span>
              )}
            </p>
            <button
              type="button"
              onClick={onCopy}
              disabled={output.length === 0}
              className="rounded-lg border border-input bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent disabled:opacity-50"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <pre className="mt-3 min-h-24 max-h-64 overflow-auto whitespace-pre-wrap break-words font-sans text-sm">
            {output || (
              <span className="text-muted-foreground">
                Paste text above and set what to find to see the result here.
              </span>
            )}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}