import { useCallback, useRef, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SegmentedControl } from "@/components/ui/segmented"
import { formatBytes } from "@/lib/utils"
import { runImageResize, type ImageResizeOutput } from "./engine"

export default function ImageResizer({ tool }: { tool: ToolDefinition }) {
  const [file, setFile] = useState<File | null>(null)
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [format, setFormat] = useState<"jpeg" | "png">("jpeg")
  const [running, setRunning] = useState(false)
  const [output, setOutput] = useState<ImageResizeOutput | null>(null)
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

  const resize = useCallback(async () => {
    if (!file) return
    const w = width.trim() ? Number(width) : undefined
    const h = height.trim() ? Number(height) : undefined
    if (w === undefined && h === undefined) {
      setError("Enter a width or a height.")
      return
    }
    if ((w !== undefined && (!Number.isFinite(w) || w <= 0)) || (h !== undefined && (!Number.isFinite(h) || h <= 0))) {
      setError("Enter valid positive dimensions.")
      return
    }
    setRunning(true)
    setError(null)
    setOutput(null)
    const job = runImageResize({ file, width: w, height: h, format })
    const result = await job.result
    setRunning(false)
    if (!result.success) {
      setError(result.error?.message ?? "Resizing failed.")
      return
    }
    setOutput(result.data)
  }, [file, width, height, format])

  const download = useCallback(() => {
    if (!output) return
    const url = URL.createObjectURL(output.blob)
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
            Resize an image to exact pixel dimensions in your browser. Aspect ratio is preserved
            automatically when you set only one side.
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

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rw">Width (px)</Label>
              <Input
                id="rw"
                type="number"
                min={1}
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="e.g. 800"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rh">Height (px)</Label>
              <Input
                id="rh"
                type="number"
                min={1}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 600"
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Leave one side blank to keep the original proportions automatically.
          </p>

          <div className="space-y-2">
            <Label>Output format</Label>
            <SegmentedControl<"jpeg" | "png">
              name="format"
              value={format}
              onChange={(f) => setFormat(f)}
              options={[
                { value: "jpeg", label: "JPEG", sub: "smaller" },
                { value: "png", label: "PNG", sub: "lossless" },
              ]}
            />
          </div>

          <Button type="button" onClick={resize} disabled={!file || running} className="w-full">
            {running ? "Resizing…" : "Resize image"}
          </Button>

          {error && (
            <p className="rounded-lg border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          {output && (
            <div className="space-y-3 rounded-lg border bg-card p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Original</span>
                <span>
                  {output.sourceWidth} × {output.sourceHeight} px
                </span>
                <span className="text-muted-foreground">New size</span>
                <span>
                  {output.width} × {output.height} px
                </span>
                <span className="text-muted-foreground">File size</span>
                <span>{formatBytes(output.bytes)}</span>
                <span className="text-muted-foreground">Format</span>
                <span className="uppercase">{output.format}</span>
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