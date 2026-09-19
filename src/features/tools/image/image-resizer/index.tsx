import { useCallback, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SegmentedControl } from "@/components/ui/segmented"
import { FileDropzone } from "@/components/ui/file-dropzone"
import { formatBytes } from "@/lib/utils"
import { processFilesSequentially, uniqueFileName } from "@/features/tools/shared/batch"
import { zipBlobs } from "@/features/tools/shared/zip"
import { runImageResize, type ImageResizeOutput } from "./engine"

export default function ImageResizer({ tool }: { tool: ToolDefinition }) {
  const [files, setFiles] = useState<File[]>([])
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [format, setFormat] = useState<"jpeg" | "png">("jpeg")
  const [running, setRunning] = useState(false)
  const [outputs, setOutputs] = useState<ImageResizeOutput[]>([])
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const onFiles = useCallback((incoming: File[]) => {
    if (incoming.length === 0) return
    setFiles((previous) => [...previous, ...incoming])
    setOutputs([])
    setError(null)
    setPreview((previous) => {
      if (previous) URL.revokeObjectURL(previous)
      return URL.createObjectURL(incoming[0])
    })
  }, [])

  const resize = useCallback(async () => {
    if (files.length === 0) return
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
    setOutputs([])
    const results = await processFilesSequentially(
      files,
      async (file, onFileProgress) => {
        const job = runImageResize({ file, width: w, height: h, format })
        job.onProgress(onFileProgress)
        const result = await job.result
        if (!result.success) throw new Error(result.error?.message ?? "Resizing failed.")
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
  }, [files, format, height, width])

  const download = useCallback((output: ImageResizeOutput) => {
    const url = URL.createObjectURL(output.blob)
    const a = document.createElement("a")
    a.href = url
    a.download = output.fileName
    a.click()
    URL.revokeObjectURL(url)
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
            Resize an image to exact pixel dimensions in your browser. Aspect ratio is preserved
            automatically when you set only one side.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <FileDropzone
              files={files}
              multiple
              onFiles={onFiles}
              accept="image/*"
              enablePaste
              title={files.length > 0 ? "Drag & drop more images here, or browse" : "Drag & drop images here, or browse"}
              description="Supports JPG, PNG, WebP, AVIF · Paste with Ctrl+V / Cmd+V"
              onClear={() => {
                setFiles([])
                if (preview) URL.revokeObjectURL(preview)
                setPreview(null)
                setOutputs([])
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
                <span className="text-muted-foreground">Original</span>
                <span>
                  {outputs[0].sourceWidth} × {outputs[0].sourceHeight} px
                </span>
                <span className="text-muted-foreground">New size</span>
                <span>
                  {outputs[0].width} × {outputs[0].height} px
                </span>
                <span className="text-muted-foreground">File size</span>
                <span>{formatBytes(outputs[0].bytes)}</span>
                <span className="text-muted-foreground">Format</span>
                <span className="uppercase">{outputs[0].format}</span>
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