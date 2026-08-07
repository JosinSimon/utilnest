import { useCallback, useMemo, useRef, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { SegmentedControl } from "@/components/ui/segmented"
import { formatBytes } from "@/lib/utils"
import { createPdf, type ScanOutput } from "./engine"

type PageSize = "A4" | "auto"
type RotationStr = "0" | "90" | "180" | "270"
const ROTATION: Record<RotationStr, 0 | 90 | 180 | 270> = {
  "0": 0,
  "90": 90,
  "180": 180,
  "270": 270,
}

export default function DocumentScanner({ tool }: { tool: ToolDefinition }) {
  const [files, setFiles] = useState<File[]>([])
  const [pageSize, setPageSize] = useState<PageSize>("A4")
  const [rotationKey, setRotationKey] = useState<RotationStr>("0")
  const rotation = ROTATION[rotationKey]
  const [running, setRunning] = useState(false)
  const [output, setOutput] = useState<ScanOutput | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const totalBytes = useMemo(() => files.reduce((sum, f) => sum + f.size, 0), [files])

  const onFiles = useCallback((list: FileList | null) => {
    if (!list || list.length === 0) return
    const next = Array.from(list)
    setFiles((prev) => [...prev, ...next])
    setOutput(null)
    setError(null)
    setPreviews((prev) => [
      ...prev,
      ...next.map((f) => URL.createObjectURL(f)),
    ])
  }, [])

  const removeAt = useCallback(
    (idx: number) => {
      setFiles((prev) => prev.filter((_, i) => i !== idx))
      setPreviews((prev) => {
        URL.revokeObjectURL(prev[idx])
        return prev.filter((_, i) => i !== idx)
      })
      setOutput(null)
    },
    [],
  )

  const scan = useCallback(async () => {
    if (files.length === 0) return
    setRunning(true)
    setError(null)
    setOutput(null)
    try {
      const result = await createPdf({ files, pageSize, rotation })
      setOutput(result)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setRunning(false)
    }
  }, [files, pageSize, rotation])

  const download = useCallback(() => {
    if (!output) return
    const url = URL.createObjectURL(output.pdf)
    const a = document.createElement("a")
    a.href = url
    a.download = output.fileName
    a.click()
    URL.revokeObjectURL(url)
  }, [output])

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{tool.name}</CardTitle>
          <CardDescription>
            Combine photos of documents into a single PDF — entirely in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png"
              multiple
              className="hidden"
              onChange={(e) => onFiles(e.target.files)}
            />
            <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
              Add pages
            </Button>
            {files.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                {files.length} page{files.length > 1 ? "s" : ""} · {formatBytes(totalBytes)}
              </p>
            )}
            {previews.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {previews.map((src, i) => (
                  <div key={src} className="relative">
                    <img src={src} alt={`Page ${i + 1}`} className="h-24 rounded-lg border object-cover" />
                    <button
                      type="button"
                      onClick={() => removeAt(i)}
                      aria-label={`Remove page ${i + 1}`}
                      className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Page size</Label>
            <SegmentedControl<PageSize>
              name="pageSize"
              value={pageSize}
              onChange={setPageSize}
              options={[
                { value: "A4", label: "A4", sub: "letterboxed" },
                { value: "auto", label: "Original", sub: "fit page" },
              ]}
            />
          </div>

          <div className="space-y-2">
            <Label>Rotate pages</Label>
            <SegmentedControl<RotationStr>
              name="rotation"
              value={rotationKey}
              onChange={setRotationKey}
              options={[
                { value: "0", label: "0°" },
                { value: "90", label: "90°" },
                { value: "180", label: "180°" },
                { value: "270", label: "270°" },
              ]}
            />
          </div>

          <Button
            type="button"
            onClick={scan}
            disabled={files.length === 0 || running}
            className="w-full"
          >
            {running ? "Building PDF…" : "Create PDF"}
          </Button>

          {error && (
            <p className="rounded-lg border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          {output && (
            <div className="space-y-3 rounded-lg border bg-card p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Pages</span>
                <span>{output.pages}</span>
                <span className="text-muted-foreground">PDF size</span>
                <span>{formatBytes(output.bytes)}</span>
              </div>
              <Button type="button" onClick={download} className="w-full">
                Download PDF
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}