import { useCallback, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileDropzone } from "@/components/ui/file-dropzone"
import { cn, formatBytes } from "@/lib/utils"
import { processFilesSequentially, uniqueFileName } from "@/features/tools/shared/batch"
import { zipBlobs } from "@/features/tools/shared/zip"
import { runImageCompress, type ImageCompressOutput } from "./engine"

const PRESETS = [20, 50, 100, 200, 500]

export default function ImageCompressor({ tool }: { tool: ToolDefinition }) {
  const [files, setFiles] = useState<File[]>([])
  const [kbMax, setKbMax] = useState(50)
  const [running, setRunning] = useState(false)
  const [outputs, setOutputs] = useState<ImageCompressOutput[]>([])
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

  const compress = useCallback(async () => {
    if (files.length === 0) return
    if (!(kbMax > 0)) {
      setError("Enter a valid target size in KB.")
      return
    }
    setRunning(true)
    setError(null)
    setOutputs([])
    const results = await processFilesSequentially(
      files,
      async (file, onFileProgress) => {
        const job = runImageCompress({ file, kbMax })
        job.onProgress(onFileProgress)
        const result = await job.result
        if (!result.success) throw new Error(result.error?.message ?? "Compression failed.")
        return result.data
      },
      () => {},
    )
    const successful = results.flatMap((result) => (result.data ? [result.data] : []))
    const failed = results.filter((result) => result.error)
    setOutputs(successful)
    setRunning(false)
    const warnings = successful.filter((result) => result.status !== "ok").length
    if (failed.length > 0 || warnings > 0) {
      setError(`${failed.length + warnings} file${failed.length + warnings === 1 ? "" : "s"} need attention.`)
    }
  }, [files, kbMax])

  const download = useCallback((output: ImageCompressOutput) => {
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
    a.download = `${tool.slug}-compressed.zip`
    a.click()
    URL.revokeObjectURL(url)
  }, [outputs, tool.slug])

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{tool.name}</CardTitle>
          <CardDescription>
            Shrink an image to fit a target file size (e.g. under 50 KB). All processing happens in
            your browser — the real encoded size is read after each step, never guessed.
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

          <div className="space-y-2">
            <Label>Target size (KB)</Label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setKbMax(p)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm transition-colors",
                    kbMax === p
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-input bg-card hover:bg-accent",
                  )}
                >
                  {p} KB
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="kbMax">Custom maximum (KB)</Label>
            <Input
              id="kbMax"
              type="number"
              min={1}
              value={kbMax}
              onChange={(e) => setKbMax(Number(e.target.value))}
            />
          </div>

          <Button type="button" onClick={compress} disabled={files.length === 0 || running} className="w-full">
            {running ? "Compressing…" : `Compress ${files.length > 1 ? `${files.length} images` : "image"}`}
          </Button>

          {error && (
            <p
              className={cn(
                "rounded-lg border px-3 py-2 text-sm",
                outputs[0]?.status !== "ok"
                  ? "border-amber-300 bg-amber-50 text-amber-900"
                  : "border-destructive bg-destructive/10 text-destructive",
              )}
            >
              {error}
            </p>
          )}

          {outputs.length > 0 && (
            <div className="space-y-3 rounded-lg border bg-card p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Size</span>
                <span>{formatBytes(outputs[0].bytes)}</span>
                <span className="text-muted-foreground">Dimensions</span>
                <span>
                  {outputs[0].width} × {outputs[0].height} px
                </span>
                <span className="text-muted-foreground">JPEG quality</span>
                <span>{Math.round(outputs[0].quality * 100)}%</span>
                <span className="text-muted-foreground">Original</span>
                <span>{files.length === 1 ? formatBytes(files[0].size) : `${files.length} originals`}</span>
              </div>
              <Button
                type="button"
                onClick={outputs.length === 1 ? () => download(outputs[0]) : downloadAll}
                variant={outputs[0].status === "ok" ? "default" : "outline"}
                className="w-full"
              >
                {outputs.length === 1 ? `Download${outputs[0].status !== "ok" ? " (did not reach target)" : ""}` : "Download all as ZIP"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}