import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent } from "@/components/ui/card"
import { generateRandomText, type RandomKind } from "./engine"
import { copyToClipboard, cn } from "@/lib/utils"

const KINDS: { kind: RandomKind; label: string }[] = [
  { kind: "word", label: "Words" },
  { kind: "sentence", label: "Sentences" },
  { kind: "paragraph", label: "Paragraphs" },
]

export default function RandomTextGenerator({ tool }: { tool: ToolDefinition }) {
  const [kind, setKind] = useState<RandomKind>("sentence")
  const [count, setCount] = useState(3)
  const [seed, setSeed] = useState(1)
  const [copied, setCopied] = useState(false)

  const output = useMemo(
    () => generateRandomText({ count, kind, seed }),
    [kind, count, seed],
  )

  const regenerate = () => setSeed((s) => s + 1)

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
            Instant · 100% private
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {KINDS.map((k) => (
              <button
                key={k.kind}
                type="button"
                onClick={() => setKind(k.kind)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                  kind === k.kind
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-card hover:bg-accent",
                )}
              >
                {k.label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            Count
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-20 rounded-lg border border-input bg-card px-3 py-1.5 text-sm tabular-nums"
            />
          </label>
          <button
            type="button"
            onClick={regenerate}
            className="rounded-lg border border-input bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
          >
            Regenerate
          </button>
        </div>

        <div className="mt-5 rounded-xl border bg-secondary/40 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Generated text</p>
            <button
              type="button"
              onClick={onCopy}
              disabled={output.length === 0}
              className="rounded-lg border border-input bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent disabled:opacity-50"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap break-words font-sans text-sm">
            {output}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}