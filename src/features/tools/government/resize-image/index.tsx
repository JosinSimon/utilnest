import { useCallback, useRef, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SegmentedControl } from "@/components/ui/segmented"
import { cn, formatBytes } from "@/lib/utils"
import { runResize, type ResizeToolOutput } from "./engine"

type Format = "jpeg" | "png"

interface FormState {
  width: string
  height: string
  format: Format
}

export default function ResizeImage({ tool }: { tool: ToolDefinition }) {
  const [file, setFile] = useState<File | null>(null)
  const [form, setForm] = useState<FormState>({ width: "", height: "", format: "jpeg" })
  const [running, setRunning] = useState(false)
  const [output, setOutput] = useState<ResizeToolOutput | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const downloadUrlRef = useRef<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const onFile = useCallback((f: File | undefined) => {
    if (!f) return
    setFile(f)
    setOutput(null)
    setError(null)
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }
    setPreview(URL.createObjectURL(f))
  }, [])

  const resize = useCallback(async () => {
    if (!file) return
    const width = Number(form.width)
    const height = Number(form.height)
    if (!(width > 0) || !(height > 0)) {
      setError("Enter both a valid width and height in pixels.")
      return
    }
    setRunning(true)
    setError(null)
    setOutput(null)
    const job = runResize({ file, width, height, format: form.format })
    const result = await job.result
    setRunning(false)
    if (!result.success) {
      setError(result.error?.message ?? "Resize failed.")
      return
    }
    setOutput(result.data)
  }, [file, form])

  const download = useCallback(() => {
    if (!output) return
    if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current)
    downloadUrlRef.current = URL.createObjectURL(output.blob)
    const a = document.createElement("a")
    a.href = downloadUrlRef.current
    a.download = output.fileName
    a.click()
  }, [output])

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{tool.name}</CardTitle>
          <CardDescription>
            Resize a photo to exact pixel dimensions in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png"
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
              <Label htmlFor="width">Width (px)</Label>
              <Input
                id="width"
                type="number"
                min={1}
                value={form.width}
                onChange={(e) => set("width", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                min={1}
                value={form.height}
                onChange={(e) => set("height", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Output format</Label>
            <SegmentedControl<Format>
              name="format"
              value={form.format}
              onChange={(format) => set("format", format)}
              options={[
                { value: "jpeg", label: "JPEG", sub: "smaller files" },
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
                <span className="text-muted-foreground">Dimensions</span>
                <span>
                  {output.width} × {output.height} px
                </span>
                <span className="text-muted-foreground">Size</span>
                <span>{formatBytes(output.bytes)}</span>
                <span className="text-muted-foreground">Format</span>
                <span className={cn("uppercase")}>{output.format}</span>
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