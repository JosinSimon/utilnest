import { useCallback, useRef, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { SegmentedControl } from "@/components/ui/segmented"
import { formatBytes } from "@/lib/utils"
import { useEngine } from "@/features/tools/useEngine"
import { runPdfToJpg, type PdfToJpgOutput } from "./engine"

type DpiKey = "1" | "2" | "3"

const DPIS: { value: DpiKey; label: string; sub: string }[] = [
  { value: "1", label: "Screen", sub: "small, fast" },
  { value: "2", label: "High", sub: "great for web" },
  { value: "3", label: "Print", sub: "best quality" },
]

export default function PdfToJpg({ tool }: { tool: ToolDefinition }) {
  const [file, setFile] = useState<File | null>(null)
  const [dpi, setDpi] = useState<DpiKey>("2")
  const [quality, setQuality] = useState(88)
  const inputRef = useRef<HTMLInputElement>(null)

  const { result, progress, isRunning, error, run, reset } = useEngine<PdfToJpgOutput>(
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
    run(() => runPdfToJpg({ file, dpi: Number(dpi) as 1 | 2 | 3, quality: quality / 100 }))
  }, [file, dpi, quality, run])

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
            Render PDF pages as JPGs in your browser. Nothing is uploaded.
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
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Resolution</Label>
            <SegmentedControl<DpiKey>
              name="pdf-to-jpg-dpi"
              value={dpi}
              onChange={setDpi}
              options={DPIS}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="jpg-quality">JPEG quality: {quality}%</Label>
            <input
              id="jpg-quality"
              type="range"
              min={50}
              max={100}
              step={1}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <p className="text-xs text-muted-foreground">
              Higher quality means larger images; 85–90% is a good compromise.
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
            disabled={!file || isRunning}
            className="w-full"
          >
            {isRunning
              ? progress > 0 ? `Rendering… ${Math.round(progress * 100)}%` : "Rendering…"
              : "Convert to JPG"}
          </Button>

          {result?.success && (
            <div className="space-y-3 rounded-lg border bg-card p-4">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <span className="text-muted-foreground">Pages</span>
                <span>{result.data.pages}</span>
                <span className="text-muted-foreground">Images</span>
                <span>{result.data.imageCount}</span>
                <span className="text-muted-foreground">Archive size</span>
                <span>{formatBytes(result.data.bytes)}</span>
              </dl>
              <Button type="button" onClick={download} className="w-full">
                Download JPGs
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}