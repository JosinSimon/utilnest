import { useCallback, useRef, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { SegmentedControl } from "@/components/ui/segmented"
import { formatBytes } from "@/lib/utils"
import { useEngine } from "@/features/tools/useEngine"
import { runImagesToPdf, type ImagesToPdfOutput } from "./engine"
import type { ImageRotation, PdfTargetSize } from "@/features/tools/shared/pdf"

const SIZES: { value: PdfTargetSize; label: string; sub: string }[] = [
  { value: "match", label: "Original", sub: "fit the upload" },
  { value: "A4", label: "A4", sub: "portrait paper" },
  { value: "Letter", label: "Letter", sub: "US paper" },
  { value: "A5", label: "A5", sub: "half A4" },
]

const Rotations: { value: RotationKey; label: string; sub: string }[] = [
  { value: "0", label: "0°", sub: "as-is" },
  { value: "90", label: "90°", sub: "clockwise" },
  { value: "180", label: "180°", sub: "flip" },
  { value: "270", label: "270°", sub: "ccw" },
]

type RotationKey = "0" | "90" | "180" | "270"

export default function ImagesToPdf({ tool }: { tool: ToolDefinition }) {
  const [files, setFiles] = useState<File[]>([])
  const [pageSize, setPageSize] = useState<PdfTargetSize>("match")
  const [rotation, setRotation] = useState<RotationKey>("0")
  const [margin, setMargin] = useState(8)
  const inputRef = useRef<HTMLInputElement>(null)

  const { result, progress, isRunning, error, run, reset } = useEngine<ImagesToPdfOutput>(
    "file",
    tool.id,
  )

  const onFiles = useCallback(
    (list: FileList | null) => {
      if (!list?.length) return
      const accepted = Array.from(list).filter((f) =>
        /image\/(jpeg|png)|\.webp$/i.test(f.type + f.name),
      )
      if (accepted.length > 0) {
        setFiles((prev) => [...prev, ...accepted])
        reset()
      }
    },
    [reset],
  )

  const apply = useCallback(() => {
    if (files.length === 0) return
    run(() =>
      runImagesToPdf({
        files,
        pageSize,
        rotation: Number(rotation) as ImageRotation,
        margin,
      }),
    )
  }, [files, pageSize, rotation, margin, run])

  const remove = useCallback(
    (i: number) => {
      setFiles((prev) => prev.filter((_, idx) => idx !== i))
      reset()
    },
    [reset],
  )

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
            Turn images into a single PDF in your browser. Nothing is uploaded.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              aria-label="Choose images"
              className="hidden"
              onChange={(e) => onFiles(e.target.files)}
            />
            <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
              {files.length > 0 ? "Add more images" : "Choose images"}
            </Button>
            {files.length > 0 && (
              <div className="mt-3 space-y-1">
                {files.map((f, i) => (
                  <div key={`${f.name}-${i}`} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="truncate">{f.name}</span>
                    <span>{formatBytes(f.size)}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${f.name}`}
                      onClick={() => remove(i)}
                      className="ml-auto text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Page size</Label>
            <SegmentedControl<PdfTargetSize>
              name="page-size"
              value={pageSize}
              onChange={setPageSize}
              options={SIZES}
            />
          </div>

          <div className="space-y-2">
            <Label>Rotate images</Label>
            <SegmentedControl<RotationKey>
              name="rotate-images"
              value={rotation}
              onChange={setRotation}
              options={Rotations}
            />
          </div>

          {pageSize !== "match" && (
            <div className="space-y-1.5">
              <Label htmlFor="margin">Margin: {margin} pt</Label>
              <input
                id="margin"
                type="range"
                min={0}
                max={40}
                step={1}
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          )}

          {error && (
            <p className="rounded-lg border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error.message}
            </p>
          )}

          <Button
            type="button"
            onClick={apply}
            disabled={files.length === 0 || isRunning}
            className="w-full"
          >
            {isRunning
              ? progress > 0 ? `Converting… ${Math.round(progress * 100)}%` : "Converting…"
              : "Make PDF"}
          </Button>

          {result?.success && (
            <div className="space-y-3 rounded-lg border bg-card p-4">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <span className="text-muted-foreground">Pages</span>
                <span>{result.data.pages}</span>
                <span className="text-muted-foreground">Images</span>
                <span>{result.data.imageCount}</span>
                <span className="text-muted-foreground">File size</span>
                <span>{formatBytes(result.data.bytes)}</span>
              </dl>
              <Button type="button" onClick={download} className="w-full">
                Download images.pdf
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}