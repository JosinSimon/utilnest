import { useCallback, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { SegmentedControl } from "@/components/ui/segmented"
import { FileDropzone } from "@/components/ui/file-dropzone"
import { cn, formatBytes } from "@/lib/utils"
import { processFilesSequentially, type BatchItem } from "@/features/tools/shared/batch"
import { downloadBlob } from "@/features/tools/shared/download"
import { BatchResults } from "@/features/tools/shared/BatchResults"
import { runImageConvert, type ImageConvertOutput, type ConvertFormat } from "./engine"

const FORMATS: { value: ConvertFormat; label: string; sub: string }[] = [
  { value: "jpeg", label: "JPG", sub: "small" },
  { value: "png", label: "PNG", sub: "lossless" },
  { value: "webp", label: "WebP", sub: "modern" },
]

export default function ImageConverter({ tool }: { tool: ToolDefinition }) {
  const [files, setFiles] = useState<File[]>([])
  const [format, setFormat] = useState<ConvertFormat>(tool.preset?.outputFormat ?? "jpeg")
  const [quality, setQuality] = useState(0.9)
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<BatchItem<ImageConvertOutput>[]>([])
  const outputs = results.flatMap((result) => (result.data ? [result.data] : []))
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const onFiles = useCallback((incoming: File[]) => {
    if (incoming.length === 0) return
    setFiles((previous) => [...previous, ...incoming])
    setResults([])
    setError(null)
    setPreview((previous) => {
      if (previous) URL.revokeObjectURL(previous)
      return URL.createObjectURL(incoming[0])
    })
  }, [])

  const convert = useCallback(async () => {
    if (files.length === 0) return
    setRunning(true)
    setError(null)
    setResults([])
    const results = await processFilesSequentially(
      files,
      async (file, onFileProgress) => {
        const job = runImageConvert({ file, format, quality })
        job.onProgress(onFileProgress)
        const result = await job.result
        if (!result.success) throw new Error(result.error?.message ?? "Conversion failed.")
        return result.data
      },
      () => {},
    )
    const failed = results.filter((result) => result.error)
    setResults(results)
    setRunning(false)
    if (failed.length > 0) {
      setError(`${failed.length} file${failed.length === 1 ? "" : "s"} failed to convert.`)
    }
  }, [files, format, quality])

  const download = useCallback((output: ImageConvertOutput) => downloadBlob(output.blob, output.fileName), [])


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
            <FileDropzone
              files={files}
              multiple
              onFiles={onFiles}
              accept="image/*"
              enablePaste
              title={files.length > 0 ? "Drag & drop more images here, or browse" : "Drag & drop images here, or browse"}
              description="Supports JPG, PNG, WebP, AVIF, BMP, GIF · Paste with Ctrl+V / Cmd+V"
              onClear={() => {
                setFiles([])
                if (preview) URL.revokeObjectURL(preview)
                setPreview(null)
                setResults([])
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

          <Button type="button" onClick={convert} disabled={files.length === 0 || running} className="w-full">
            {running ? "Converting…" : `Convert ${files.length > 1 ? `${files.length} images` : "image"} to ${FORMATS.find((f) => f.value === format)?.label}`}
          </Button>

          {error && (
            <p className={cn("rounded-lg border px-3 py-2 text-sm text-destructive border-destructive bg-destructive/10")}>
              {error}
            </p>
          )}

          {results.length > 1 && (
            <BatchResults
              results={results}
              zipName={`${tool.slug}-converted.zip`}
              describe={(output) => ({
                details: [`${output.width} × ${output.height} px`, output.format === "jpeg" ? "JPG" : output.format.toUpperCase()],
              })}
            />
          )}

          {results.length === 1 && outputs.length > 0 && (
            <div className="space-y-3 rounded-lg border bg-card p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">New size</span>
                <span>{formatBytes(outputs[0].bytes)}</span>
                <span className="text-muted-foreground">Original</span>
                <span>{formatBytes(results[0].input.size)}</span>
                <span className="text-muted-foreground">Dimensions</span>
                <span>
                  {outputs[0].width} × {outputs[0].height} px
                </span>
                <span className="text-muted-foreground">Format</span>
                <span className="uppercase">{outputs[0].format}</span>
              </div>
              <Button
                type="button"
                onClick={() => download(outputs[0])}
                className="w-full"
              >
                {`Download ${outputs[0].fileName}`}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}