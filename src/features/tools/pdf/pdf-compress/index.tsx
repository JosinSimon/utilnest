import { useCallback, useRef, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { SegmentedControl } from "@/components/ui/segmented"
import { formatBytes } from "@/lib/utils"
import { useEngine } from "@/features/tools/useEngine"
import { runPdfCompress, type PdfCompressOutput } from "./engine"

type LevelKey = "1" | "2" | "3"

const LEVELS: { value: LevelKey; label: string; sub: string }[] = [
  { value: "1", label: "Strong", sub: "smallest" },
  { value: "2", label: "Balanced", sub: "recommended" },
  { value: "3", label: "Light", sub: "best quality" },
]

export default function PdfCompress({ tool }: { tool: ToolDefinition }) {
  const [file, setFile] = useState<File | null>(null)
  const [level, setLevel] = useState<LevelKey>("2")
  const [quality, setQuality] = useState(75)
  const inputRef = useRef<HTMLInputElement>(null)

  const { result, progress, isRunning, error, run, reset } = useEngine<PdfCompressOutput>(
    "file",
    tool.id,
  )

  const onFile = useCallback(
    (f: File | undefined) => {
      if (!f) return
      setFile(f)
      reset()
    },
    [reset],
  )

  const apply = useCallback(() => {
    if (!file) return
    run(() =>
      runPdfCompress({ file, level: Number(level) as 1 | 2 | 3, quality: quality / 100 }),
    )
  }, [file, level, quality, run])

  const download = useCallback(() => {
    if (!result?.success) return
    const url = URL.createObjectURL(result.data.blob)
    const a = document.createElement("a")
    a.href = url
    a.download = result.data.fileName
    a.click()
    URL.revokeObjectURL(url)
  }, [result])

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{tool.name}</CardTitle>
          <CardDescription>
            Shrink PDF file size in your browser. Nothing is uploaded.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                onFile(e.target.files?.[0])
                e.currentTarget.value = ""
              }}
            />
            <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
              {file ? "Choose another PDF" : "Choose a PDF"}
            </Button>
            {file && (
              <p className="mt-2 text-xs text-muted-foreground">
                {file.name} · {formatBytes(file.size)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Compression</Label>
            <SegmentedControl<LevelKey>
              name="compress-level"
              value={level}
              onChange={setLevel}
              options={LEVELS}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="compress-quality">Image quality: {quality}%</Label>
            <input
              id="compress-quality"
              type="range"
              min={40}
              max={95}
              step={1}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <p className="text-xs text-muted-foreground">
              Lower quality shrinks the file most. Start at 75% for most documents.
            </p>
          </div>

          {error && (
            <p className="rounded-lg border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error.message}
            </p>
          )}

          <Button
            type="button"
            onClick={apply}
            disabled={!file || isRunning || file.size > 60 * 1024 * 1024}
            className="w-full"
          >
            {isRunning
              ? progress > 0 ? `Compressing… ${Math.round(progress * 100)}%` : "Compressing…"
              : "Compress PDF"}
          </Button>
          {file && file.size > 60 * 1024 * 1024 && (
            <p className="text-xs text-muted-foreground">
              Files over 60 MB are disabled to keep the compression instant and reliable in-browser.
            </p>
          )}

          {result?.success && (
            <div className="space-y-3 rounded-lg border bg-card p-4">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <span className="text-muted-foreground">Before</span>
                <span>{formatBytes(file?.size ?? 0)}</span>
                <span className="text-muted-foreground">After</span>
                <span>{formatBytes(result.data.bytes)}</span>
                <span className="text-muted-foreground">Saved</span>
                <span className="font-medium text-emerald-600">
                  {result.data.savedPercent}%
                </span>
              </dl>
              <Button type="button" onClick={download} className="w-full">
                Download compressed PDF
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}