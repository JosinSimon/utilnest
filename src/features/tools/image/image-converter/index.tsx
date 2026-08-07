import { useCallback, useRef, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { SegmentedControl } from "@/components/ui/segmented"
import { cn, formatBytes } from "@/lib/utils"
import { runImageConvert, type ImageConvertOutput, type ConvertFormat } from "./engine"

const FORMATS: { value: ConvertFormat; label: string; sub: string }[] = [
  { value: "jpeg", label: "JPG", sub: "small" },
  { value: "png", label: "PNG", sub: "lossless" },
  { value: "webp", label: "WebP", sub: "modern" },
]

export default function ImageConverter({ tool }: { tool: ToolDefinition }) {
  const [file, setFile] = useState<File | null>(null)
  const [format, setFormat] = useState<ConvertFormat>("jpeg")
  const [quality, setQuality] = useState(0.9)
  const [running, setRunning] = useState(false)
  const [output, setOutput] = useState<ImageConvertOutput | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const onFile = useCallback((f: File | undefined) => {
    if (!f) return
    setFile(f)
    setOutput(null)
    setError(null)
    setPreview(URL.createObjectURL(f))
  }, [])

  const convert = useCallback(async () => {
    if (!file) return
    setRunning(true)
    setError(null)
    setOutput(null)
    const job = runImageConvert({ file, format, quality })
    const result = await job.result
    setRunning(false)
    if (!result.success) {
      setError(result.error?.message ?? "Conversion failed.")
      return
    }
    setOutput(result.data)
  }, [file, format, quality])

  const download = useCallback(() => {
    if (!output) return
    const url = URL.createObjectURL(output.blob)
    const a = document.createElement("a")
    a.href = url
    a.download = output.fileName
    a.click()
    URL.revokeObjectURL(url)
  }, [output])

  const canAdjustQuality = format !== "png"

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{tool.name}</CardTitle>
          <CardDescription>
            Convert JPG ↔ PNG ↔ WebP in your browser. Files are decoded and re-encoded entirely on
            your device — nothing is uploaded.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
              {file ? "Choose another image" : "Choose an image"}
            </Button>
            {file && (
              <p className="mt-2 text-xs text-muted-foreground">
                {file.name} · {formatBytes(file.size)}
              </p>
            )}
            {preview && (
              <img
                src={preview}
                alt="Upload preview"
                className="mt-3 max-h-48 rounded-lg border object-contain"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label>Convert to</Label>
            <SegmentedControl<ConvertFormat>
              name="format"
              value={format}
              onChange={(f) => setFormat(f)}
              options={FORMATS}
            />
          </div>

          {canAdjustQuality && (
            <div className="space-y-1.5">
              <Label htmlFor="quality">Quality: {Math.round(quality * 100)}%</Label>
              <input
                id="quality"
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          )}

          <Button type="button" onClick={convert} disabled={!file || running} className="w-full">
            {running ? "Converting…" : `Convert to ${FORMATS.find((f) => f.value === format)?.label}`}
          </Button>

          {error && (
            <p className={cn("rounded-lg border px-3 py-2 text-sm text-destructive border-destructive bg-destructive/10")}>
              {error}
            </p>
          )}

          {output && (
            <div className="space-y-3 rounded-lg border bg-card p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">New size</span>
                <span>{formatBytes(output.bytes)}</span>
                <span className="text-muted-foreground">Original</span>
                <span>{file ? formatBytes(file.size) : "—"}</span>
                <span className="text-muted-foreground">Dimensions</span>
                <span>
                  {output.width} × {output.height} px
                </span>
                <span className="text-muted-foreground">Format</span>
                <span className="uppercase">{output.format}</span>
              </div>
              <Button type="button" onClick={download} className="w-full">
                Download {output.fileName}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}