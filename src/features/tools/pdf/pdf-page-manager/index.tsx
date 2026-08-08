import { useCallback, useRef, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowDown, ArrowUp, X } from "lucide-react"
import { cn, formatBytes } from "@/lib/utils"
import { useEngine } from "@/features/tools/useEngine"
import { runPageManager, type PageManagerOutput } from "./engine"
import { probePdf } from "@/features/tools/shared/pdf"

export default function PdfPageManager({ tool }: { tool: ToolDefinition }) {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [kept, setKept] = useState<number[]>([]) // ordered 1-based kept pages
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { result, progress, isRunning, error, run, reset } = useEngine<PageManagerOutput>(
    "file",
    tool.id,
  )

  const onFile = useCallback(
    async (f: File | undefined) => {
      if (!f) return
      setFile(f)
      reset()
      setLoading(true)
      try {
        const bytes = new Uint8Array(await f.arrayBuffer())
        const { pageCount: n } = await probePdf(bytes)
        setPageCount(n)
        setKept(Array.from({ length: n }, (_, i) => i + 1))
      } catch {
        setPageCount(0)
        setKept([])
      } finally {
        setLoading(false)
      }
    },
    [reset],
  )

  const toggle = useCallback((page: number) => {
    setKept((prev) => (prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page]))
  }, [])

  const move = useCallback((page: number, dir: -1 | 1) => {
    setKept((prev) => {
      const idx = prev.indexOf(page)
      const target = idx + dir
      if (idx < 0 || target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[idx], next[target]] = [next[target], next[idx]]
      return next
    })
  }, [])

  const apply = useCallback(() => {
    if (!file) return
    run(() => runPageManager({ file, keep: kept }))
  }, [file, kept, run])

  const download = useCallback(() => {
    if (!result?.success) return
    const data = result.data
    const url = URL.createObjectURL(data.blob)
    const a = document.createElement("a")
    a.href = url
    a.download = data.fileName
    a.click()
    URL.revokeObjectURL(url)
  }, [result])

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{tool.name}</CardTitle>
          <CardDescription>
            Reorder, delete and tidy PDF pages in your browser. Nothing is uploaded.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
              {file ? "Choose another PDF" : "Choose a PDF"}
            </Button>
            {file && (
              <p className="mt-2 text-xs text-muted-foreground">
                {file.name} · {formatBytes(file.size)}
                {loading ? " · reading…" : ` · ${pageCount} pages`}
              </p>
            )}
          </div>

          {file && pageCount > 0 && !loading && (
            <div className="space-y-2">
              <Label>Pages — tick to keep, arrows to reorder</Label>
              <div className="grid max-h-80 grid-cols-1 gap-1 overflow-y-auto rounded-lg border p-2 sm:grid-cols-2">
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => {
                  const isKept = kept.includes(page)
                  return (
                    <label
                      key={page}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors",
                        isKept
                          ? "border-transparent bg-card shadow-sm"
                          : "border-dashed text-muted-foreground opacity-60",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isKept}
                        onChange={() => toggle(page)}
                        aria-label={`Keep page ${page}`}
                        className="accent-primary"
                      />
                      <span className="flex-1">Page {page}</span>
                      <span className="flex items-center gap-0.5">
                        <button
                          type="button"
                          aria-label={`Move page ${page} up`}
                          disabled={!isKept}
                          onClick={(e) => {
                            e.preventDefault()
                            move(page, -1)
                          }}
                          className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Move page ${page} down`}
                          disabled={!isKept}
                          onClick={(e) => {
                            e.preventDefault()
                            move(page, 1)
                          }}
                          className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Remove page ${page}`}
                          onClick={(e) => {
                            e.preventDefault()
                            toggle(page)
                          }}
                          className="rounded p-0.5 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    </label>
                  )
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                Keeping {kept.length} of {pageCount} pages.
                {kept.length !== pageCount && ` · ${pageCount - kept.length} will be removed.`}
              </p>
            </div>
          )}

          {error && (
            <p className="rounded-lg border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error.message}
            </p>
          )}

          <Button
            type="button"
            onClick={apply}
            disabled={!file || isRunning || kept.length === 0}
            className="w-full"
          >
            {isRunning
              ? progress > 0 ? `Applying… ${Math.round(progress * 100)}%` : "Applying…"
              : "Apply changes"}
          </Button>

          {result?.success && (
            <div className="space-y-3 rounded-lg border bg-card p-4">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <span className="text-muted-foreground">Pages kept</span>
                <span>{result.data.pages}</span>
                <span className="text-muted-foreground">Pages removed</span>
                <span>{result.data.deleted}</span>
                <span className="text-muted-foreground">File size</span>
                <span>{formatBytes(result.data.bytes)}</span>
              </dl>
              <Button type="button" onClick={download} className="w-full">
                Download
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}