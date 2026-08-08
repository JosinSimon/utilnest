import { useCallback, useRef, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { formatBytes } from "@/lib/utils"
import { useEngine } from "@/features/tools/useEngine"
import { runPdfWatermark, type PdfWatermarkOutput } from "./engine"

export default function PdfWatermark({ tool }: { tool: ToolDefinition }) {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState("CONFIDENTIAL")
  const [opacity, setOpacity] = useState(18)
  const [tiles, setTiles] = useState(4)
  const inputRef = useRef<HTMLInputElement>(null)

  const { result, progress, isRunning, error, run, reset } = useEngine<PdfWatermarkOutput>(
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
    if (!file || text.trim().length === 0) return
    run(() =>
      runPdfWatermark({
        file,
        text,
        opacity: opacity / 100,
        tiles,
      }),
    )
  }, [file, text, opacity, tiles, run])

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
            Stamp a diagonal text watermark across every page. Nothing is uploaded.
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

          <div className="space-y-1.5">
            <Label htmlFor="wm-text">Watermark text</Label>
            <input
              id="wm-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wm-opacity">Opacity: {opacity}%</Label>
            <input
              id="wm-opacity"
              type="range"
              min={5}
              max={80}
              step={1}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wm-tiles">Density: {tiles}</Label>
            <input
              id="wm-tiles"
              type="range"
              min={1}
              max={10}
              step={1}
              value={tiles}
              onChange={(e) => setTiles(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <p className="text-xs text-muted-foreground">
              How many watermark stamps run across the page diagonally.
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
            disabled={!file || text.trim().length === 0 || isRunning}
            className="w-full"
          >
            {isRunning
              ? progress > 0 ? `Watermarking… ${Math.round(progress * 100)}%` : "Watermarking…"
              : "Add watermark"}
          </Button>

          {result?.success && (
            <div className="space-y-3 rounded-lg border bg-card p-4">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <span className="text-muted-foreground">Pages</span>
                <span>{result.data.pageCount}</span>
                <span className="text-muted-foreground">File size</span>
                <span>{formatBytes(result.data.bytes)}</span>
              </dl>
              <Button type="button" onClick={download} className="w-full">
                Download watermarked PDF
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}