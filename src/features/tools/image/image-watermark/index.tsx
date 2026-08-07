import { useCallback, useRef, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SegmentedControl } from "@/components/ui/segmented"
import { cn, formatBytes } from "@/lib/utils"
import {
  runWatermark,
  POSITIONS,
  type WatermarkFormat,
  type WatermarkPosition,
} from "./engine"

const FORMATS: { value: WatermarkFormat; label: string; sub: string }[] = [
  { value: "jpeg", label: "JPEG", sub: "small" },
  { value: "png", label: "PNG", sub: "lossless" },
]

const POSITION_LABELS: Record<WatermarkPosition, string> = {
  "top-left": "Top left",
  "top-right": "Top right",
  "bottom-left": "Bottom left",
  "bottom-right": "Bottom right",
  center: "Center",
}

export default function ImageWatermark({ tool }: { tool: ToolDefinition }) {
  const [file, setFile] = useState<File | null>(null)
  const [logo, setLogo] = useState<File | null>(null)
  const [text, setText] = useState("")
  const [position, setPosition] = useState<WatermarkPosition>("bottom-right")
  const [opacity, setOpacity] = useState(0.7)
  const [size, setSize] = useState(0.06)
  const [format, setFormat] = useState<WatermarkFormat>("jpeg")
  const [running, setRunning] = useState(false)
  const [output, setOutput] = useState<{ blob: Blob; fileName: string; bytes: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const logoRef = useRef<HTMLInputElement>(null)

  const onFile = useCallback((f: File | undefined) => {
    if (!f) return
    setFile(f)
    setOutput(null)
    setError(null)
    setPreview(URL.createObjectURL(f))
  }, [])

  const onLogo = useCallback((f: File | undefined) => {
    if (!f) return
    setLogo(f)
    setOutput(null)
    setError(null)
  }, [])

  const apply = useCallback(async () => {
    if (!file) return
    setRunning(true)
    setError(null)
    setOutput(null)
    const job = runWatermark({ file, text, logo: logo ?? undefined, position, opacity, size, format })
    const result = await job.result
    setRunning(false)
    if (!result.success) {
      setError(result.error?.message ?? "Watermarking failed.")
      return
    }
    setOutput(result.data)
  }, [file, text, logo, position, opacity, size, format])

  const download = useCallback(() => {
    if (!output) return
    const url = URL.createObjectURL(output.blob)
    const a = document.createElement("a")
    a.href = url
    a.download = output.fileName
    a.click()
    URL.revokeObjectURL(url)
  }, [output])

  const hasMark = text.trim().length > 0 || Boolean(logo)

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{tool.name}</CardTitle>
          <CardDescription>
            Add a text or logo watermark to an image in your browser. Choose position, size and
            transparency, then download.
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

          <div className="space-y-1.5">
            <Label htmlFor="wm-text">Watermark text</Label>
            <Input
              id="wm-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. © 2026 Your Name"
            />
          </div>

          <div>
            <input
              ref={logoRef}
              type="file"
              accept="image/png,image/svg+xml,image/jpeg"
              className="hidden"
              onChange={(e) => onLogo(e.target.files?.[0])}
            />
            <Button type="button" variant="outline" onClick={() => logoRef.current?.click()}>
              {logo ? "Change logo" : "Or upload a logo image"}
            </Button>
            {logo && <p className="mt-1 text-xs text-muted-foreground">{logo.name}</p>}
          </div>

          <div className="space-y-2">
            <Label>Position</Label>
            <div className="flex flex-wrap gap-2">
              {POSITIONS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPosition(p)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm transition-colors",
                    position === p
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-input bg-card hover:bg-accent",
                  )}
                >
                  {POSITION_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wm-opacity">Opacity: {Math.round(opacity * 100)}%</Label>
            <input
              id="wm-opacity"
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wm-size">Watermark size: {Math.round(size * 100)}%</Label>
            <input
              id="wm-size"
              type="range"
              min={0.02}
              max={0.3}
              step={0.01}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="space-y-2">
            <Label>Output format</Label>
            <SegmentedControl<WatermarkFormat>
              name="format"
              value={format}
              onChange={(f) => setFormat(f)}
              options={FORMATS}
            />
          </div>

          <Button type="button" onClick={apply} disabled={!file || !hasMark || running} className="w-full">
            {running ? "Watermarking…" : "Apply watermark"}
          </Button>

          {error && (
            <p className="rounded-lg border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          {output && (
            <div className="space-y-3 rounded-lg border bg-card p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">File size</span>
                <span>{formatBytes(output.bytes)}</span>
              </div>
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