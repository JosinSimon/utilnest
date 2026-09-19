import { useCallback, useRef, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SegmentedControl } from "@/components/ui/segmented"
import { FileDropzone } from "@/components/ui/file-dropzone"
import { cn, formatBytes } from "@/lib/utils"
import { runResize, type ResizeToolOutput } from "./engine"
import { processFilesSequentially, uniqueFileName } from "@/features/tools/shared/batch"
import { zipBlobs } from "@/features/tools/shared/zip"

type Format = "jpeg" | "png"

interface FormState {
  width: string
  height: string
  format: Format
}

export default function ResizeImage({ tool }: { tool: ToolDefinition }) {
  const [files, setFiles] = useState<File[]>([])
  const [form, setForm] = useState<FormState>({ width: "", height: "", format: "jpeg" })
  const [running, setRunning] = useState(false)
  const [outputs, setOutputs] = useState<ResizeToolOutput[]>([])
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [sourceDims, setSourceDims] = useState<{ width: number; height: number } | null>(null)
  const [keepAspect, setKeepAspect] = useState(true)
  const downloadUrlRef = useRef<string | null>(null)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const setDimension = (key: "width" | "height", value: string) => {
    setForm((f) => {
      const next = { ...f, [key]: value }
      if (keepAspect && sourceDims) {
        const n = Number(value)
        if (Number.isFinite(n) && n > 0) {
          if (key === "width") next.height = String(Math.max(1, Math.round(n * (sourceDims.height / sourceDims.width))))
          else next.width = String(Math.max(1, Math.round(n * (sourceDims.width / sourceDims.height))))
        }
      }
      return next
    })
  }

  const onFiles = useCallback(async (incoming: File[]) => {
    if (incoming.length === 0) return
    setFiles((previous) => [...previous, ...incoming])
    setOutputs([])
    setError(null)
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }
    setPreview((previous) => {
      if (previous) URL.revokeObjectURL(previous)
      return URL.createObjectURL(incoming[0])
    })
    const bitmap = await createImageBitmap(incoming[0])
    setSourceDims({ width: bitmap.width, height: bitmap.height })
    bitmap.close()
  }, [])

  const resize = useCallback(async () => {
    if (files.length === 0) return
    const width = Number(form.width)
    const height = Number(form.height)
    if (!(width > 0) || !(height > 0)) {
      setError("Enter both a valid width and height in pixels.")
      return
    }
    setRunning(true)
    setError(null)
    setOutputs([])
    const results = await processFilesSequentially(
      files,
      async (file, onFileProgress) => {
        const job = runResize({ file, width, height, format: form.format })
        job.onProgress(onFileProgress)
        const result = await job.result
        if (!result.success) throw new Error(result.error?.message ?? "Resize failed.")
        return result.data
      },
      () => {},
    )
    const successful = results.flatMap((result) => (result.data ? [result.data] : []))
    const failed = results.filter((result) => result.error)
    setOutputs(successful)
    setRunning(false)
    if (failed.length > 0) {
      setError(`${failed.length} file${failed.length === 1 ? "" : "s"} failed to resize.`)
    }
  }, [files, form])

  const download = useCallback((output: ResizeToolOutput) => {
    if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current)
    downloadUrlRef.current = URL.createObjectURL(output.blob)
    const a = document.createElement("a")
    a.href = downloadUrlRef.current
    a.download = output.fileName
    a.click()
  }, [])

  const downloadAll = useCallback(async () => {
    if (outputs.length === 0) return
    const usedNames = new Set<string>()
    const archive = await zipBlobs(
      outputs.map((output) => ({
        name: uniqueFileName(output.fileName, usedNames),
        blob: output.blob,
      })),
    )
    const url = URL.createObjectURL(archive)
    const a = document.createElement("a")
    a.href = url
    a.download = `${tool.slug}-resized.zip`
    a.click()
    URL.revokeObjectURL(url)
  }, [outputs, tool.slug])

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
            <FileDropzone
              files={files}
              multiple
              onFiles={onFiles}
              accept="image/jpeg,image/png"
              enablePaste
              title={files.length > 0 ? "Drag & drop more images here, or browse" : "Drag & drop images here, or browse"}
              description="Supports JPG and PNG · Paste with Ctrl+V / Cmd+V"
              onClear={() => {
                setFiles([])
                if (preview) URL.revokeObjectURL(preview)
                setOutputs([])
                setPreview(null)
                setSourceDims(null)
                setError(null)
              }}
            />
            {preview && (
              <div className="mt-3 flex justify-center rounded-xl border bg-muted/20 p-2">
                <img
                  src={preview}
                  alt="Upload preview"
                  className="max-h-48 rounded-lg object-contain"
                />
              </div>
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
                onChange={(e) => setDimension("width", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                min={1}
                value={form.height}
                onChange={(e) => setDimension("height", e.target.value)}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={keepAspect}
              onChange={(e) => setKeepAspect(e.target.checked)}
            />
            Keep aspect ratio when editing one dimension
          </label>

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

          <Button type="button" onClick={resize} disabled={files.length === 0 || running} className="w-full">
            {running ? "Resizing…" : `Resize ${files.length > 1 ? `${files.length} images` : "image"}`}
          </Button>

          {error && (
            <p className="rounded-lg border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          {outputs.length > 0 && (
            <div className="space-y-3 rounded-lg border bg-card p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Dimensions</span>
                <span>
                  {outputs[0].width} × {outputs[0].height} px
                </span>
                <span className="text-muted-foreground">Size</span>
                <span>{formatBytes(outputs[0].bytes)}</span>
                <span className="text-muted-foreground">Format</span>
                <span className={cn("uppercase")}>{outputs[0].format}</span>
              </div>
              <Button
                type="button"
                onClick={outputs.length === 1 ? () => download(outputs[0]) : downloadAll}
                className="w-full"
              >
                {outputs.length === 1 ? "Download" : "Download all as ZIP"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}