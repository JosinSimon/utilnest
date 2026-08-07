import { useCallback, useRef, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { SegmentedControl } from "@/components/ui/segmented"
import { cn, formatBytes } from "@/lib/utils"
import { runImageCrop, type CropRect, type CropFormat } from "./engine"

const MIN_FRACTION = 0.05

const FORMATS: { value: CropFormat; label: string; sub: string }[] = [
  { value: "jpeg", label: "JPEG", sub: "small" },
  { value: "png", label: "PNG", sub: "lossless" },
]

const PRESET_ASPECTS: { label: string; ratio?: number }[] = [
  { label: "Free" },
  { label: "1:1", ratio: 1 },
  { label: "4:3", ratio: 4 / 3 },
  { label: "3:2", ratio: 3 / 2 },
  { label: "16:9", ratio: 16 / 9 },
]

/** Fit a box of a given aspect ratio inside [0,1]², anchored near the previous box centre. */
function fitAspect(ratio: number, prev: CropRect): CropRect {
  let nw = 1
  let nh = 1
  if (ratio >= 1) {
    nw = 1
    nh = 1 / ratio
  } else {
    nh = 1
    nw = ratio
  }
  const cx = Math.min(Math.max(prev.x + prev.width / 2, nw / 2), 1 - nw / 2)
  const cy = Math.min(Math.max(prev.y + prev.height / 2, nh / 2), 1 - nh / 2)
  return { x: cx - nw / 2, y: cy - nh / 2, width: nw, height: nh }
}

export default function ImageCropper({ tool }: { tool: ToolDefinition }) {
  const [file, setFile] = useState<File | null>(null)
  const [imgUrl, setImgUrl] = useState<string | null>(null)
  const [box, setBox] = useState<CropRect | null>(null)
  const [aspect, setAspect] = useState<number | null>(null)
  const [format, setFormat] = useState<CropFormat>("jpeg")
  const [running, setRunning] = useState(false)
  const [output, setOutput] = useState<{ blob: Blob; fileName: string; bytes: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<
    | { mode: "none" }
    | { mode: "move"; sx: number; sy: number; rect: CropRect }
    | { mode: "resize"; sx: number; sy: number; rect: CropRect }
  >({ mode: "none" })

  const onFile = useCallback((f: File | undefined) => {
    if (!f) return
    setFile(f)
    setOutput(null)
    setError(null)
    setBox(null)
    setAspect(null)
    const url = URL.createObjectURL(f)
    const image = new Image()
    image.onload = () => {
      setImgUrl(image.src)
      setBox({ x: 0, y: 0, width: 1, height: 1 })
    }
    image.src = url
  }, [])

  const selectAspect = useCallback(
    (next: number | null) => {
      setAspect(next)
      if (next != null && box) setBox(fitAspect(next, box))
    },
    [box],
  )

  /** Convert a pointer's client coords into a 0..1 fraction of the crop area. */
  const toFraction = useCallback((cx: number, cy: number) => {
    const el = wrapRef.current
    if (!el) return { fx: 0, fy: 0 }
    const r = el.getBoundingClientRect()
    return { fx: Math.min(1, Math.max(0, (cx - r.left) / r.width)), fy: Math.min(1, Math.max(0, (cy - r.top) / r.height)) }
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!box) return
      e.preventDefault()
      const { fx, fy } = toFraction(e.clientX, e.clientY)
      const hitEdgeX = Math.abs(fx - box.x) < 0.03 || Math.abs(fx - (box.x + box.width)) < 0.03
      const inX = fx >= box.x && fx <= box.x + box.width
      const inY = fy >= box.y && fy <= box.y + box.height
      const mode = inX && inY && hitEdgeX && e.shiftKey ? "resize" : inX && inY ? "move" : "none"
      dragRef.current = { mode, sx: e.clientX, sy: e.clientY, rect: { ...box } }
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    },
    [box, toFraction],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const d = dragRef.current
      if (d.mode === "none" || !box) return
      const el = wrapRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const dx = (e.clientX - d.sx) / r.width
      const dy = (e.clientY - d.sy) / r.height
      if (d.mode === "move") {
        setBox({
          x: Math.min(1 - d.rect.width, Math.max(0, d.rect.x + dx)),
          y: Math.min(1 - d.rect.height, Math.max(0, d.rect.y + dy)),
          width: d.rect.width,
          height: d.rect.height,
        })
      } else {
        setBox({
          x: d.rect.x,
          y: d.rect.y,
          width: Math.min(1 - d.rect.x, Math.max(MIN_FRACTION, d.rect.width + dx)),
          height: Math.min(1 - d.rect.y, Math.max(MIN_FRACTION, d.rect.height + dy)),
        })
      }
    },
    [box],
  )

  const onPointerUp = useCallback(() => {
    dragRef.current = { mode: "none" }
  }, [])

  const crop = useCallback(async () => {
    if (!file || !box) return
    setRunning(true)
    setError(null)
    setOutput(null)
    const job = runImageCrop({ file, crop: box, format })
    const result = await job.result
    setRunning(false)
    if (!result.success) {
      setError(result.error?.message ?? "Cropping failed.")
      return
    }
    setOutput(result.data)
  }, [file, box, format])

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
            Crop an image with a draggable, resizable box. All in-browser — nothing is uploaded.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
              id="crop-file"
            />
            <Button type="button" variant="outline" onClick={() => document.getElementById("crop-file")?.click()}>
              {file ? "Choose another image" : "Choose an image"}
            </Button>
            {file && (
              <p className="mt-2 text-xs text-muted-foreground">
                {file.name} · {formatBytes(file.size)}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESET_ASPECTS.map((a) => (
              <button
                key={a.label}
                type="button"
                onClick={() => selectAspect(a.ratio ?? null)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm transition-colors",
                  aspect === a.ratio
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-input bg-card hover:bg-accent",
                )}
              >
                {a.label}
              </button>
            ))}
          </div>

          {imgUrl && box && (
            <div
              ref={wrapRef}
              className="relative select-none overflow-hidden rounded-lg border"
              style={{ touchAction: "none" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            >
              <img src={imgUrl} alt="Crop source" className="block w-full" draggable={false} />
              <div
                className="absolute border-2 border-white shadow-[inset_0_0_0_9999px_rgba(0,0,0,0.35)]"
                style={{
                  left: `${box.x * 100}%`,
                  top: `${box.y * 100}%`,
                  width: `${box.width * 100}%`,
                  height: `${box.height * 100}%`,
                }}
              />
            </div>
          )}
          {!imgUrl && file && <p className="text-sm text-muted-foreground">Loading image…</p>}

          <div className="space-y-2">
            <Label>Output format</Label>
            <SegmentedControl<CropFormat>
              name="format"
              value={format}
              onChange={(f) => setFormat(f)}
              options={FORMATS}
            />
          </div>

          <Button type="button" onClick={crop} disabled={!file || !box || running} className="w-full">
            {running ? "Cropping…" : "Crop & save"}
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
                <span className="text-muted-foreground">Crop</span>
                <span>{box ? `${box.width * 100}% × ${box.height * 100}%` : "—"}</span>
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