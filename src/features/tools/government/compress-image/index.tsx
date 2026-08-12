import { useCallback, useRef, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SegmentedControl } from "@/components/ui/segmented"
import { cn, formatBytes } from "@/lib/utils"
import { runCompress, type CompressToolOutput } from "./engine"
import type { TargetKbOptions } from "@/features/tools/shared/image"

type Mode = "range" | "exact"

interface FormState {
  mode: Mode
  kbMin: string
  kbMax: string
  exactKb: string
  width: string
  height: string
  allowDownscale: boolean
}

function parseDimensions(w: string, h: string): { width?: number; height?: number } {
  const width = w.trim() ? Number(w) : undefined
  const height = h.trim() ? Number(h) : undefined
  return { width, height }
}

export default function CompressImage({ tool }: { tool: ToolDefinition }) {
  const [file, setFile] = useState<File | null>(null)
  const targetKb = tool.preset?.targetKb ?? 50
  const [form, setForm] = useState<FormState>({
    mode: "range",
    kbMin: "",
    kbMax: String(targetKb),
    exactKb: "",
    width: tool.preset?.width ? String(tool.preset.width) : "",
    height: tool.preset?.height ? String(tool.preset.height) : "",
    allowDownscale: true,
  })
  const [running, setRunning] = useState(false)
  const [output, setOutput] = useState<CompressToolOutput | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const jobRef = useRef<{ cancel: () => void } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const onFile = useCallback((f: File | undefined) => {
    if (!f) return
    setFile(f)
    setOutput(null)
    setError(null)
    setPreview(URL.createObjectURL(f))
  }, [])

  const buildTarget = useCallback((): TargetKbOptions | null => {
    const dims = parseDimensions(form.width, form.height)
    if (form.mode === "range") {
      const min = Number(form.kbMin)
      const max = Number(form.kbMax)
      if (!(max > 0)) return null
      return {
        mode: "range",
        kbMin: Number.isFinite(min) && min >= 0 ? min : 0,
        kbMax: max,
        ...dims,
        allowedFormats: ["jpeg"],
        allowDownscale: form.allowDownscale,
        minDimensionGuard: 1,
      }
    }
    const exact = Number(form.exactKb)
    if (!(exact > 0)) return null
    return {
      mode: "exact",
      kbMin: exact,
      kbMax: exact,
      ...dims,
      allowedFormats: ["jpeg"],
      allowDownscale: form.allowDownscale,
      minDimensionGuard: 1,
    }
  }, [form])

  const compress = useCallback(async () => {
    if (!file) return
    const target = buildTarget()
    if (!target) {
      setError("Enter a valid target size (in KB).")
      return
    }
    setRunning(true)
    setError(null)
    setOutput(null)
    const job = runCompress({ file, target })
    jobRef.current = job
    const result = await job.result
    setRunning(false)
    if (!result.success) {
      setError(result.error?.message ?? "Compression failed.")
      return
    }
    setOutput(result.data)
    if (result.data.status !== "ok") {
      setError(result.data.message)
    }
  }, [buildTarget, file])

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
            Resize and compress a photo to a specific file size. All processing happens in your
            browser.
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

          <div className="space-y-2">
            <Label>Mode</Label>
            <SegmentedControl<Mode>
              name="mode"
              value={form.mode}
              onChange={(mode) => set("mode", mode)}
              options={[
                { value: "range", label: "Within a range", sub: "e.g. 20–50 KB" },
                { value: "exact", label: "Exact size", sub: "e.g. 50 KB" },
              ]}
            />
          </div>

          {form.mode === "range" ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="kbMin">Minimum (KB)</Label>
                <Input
                  id="kbMin"
                  type="number"
                  min={0}
                  value={form.kbMin}
                  onChange={(e) => set("kbMin", e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kbMax">Maximum (KB)</Label>
                <Input
                  id="kbMax"
                  type="number"
                  min={1}
                  value={form.kbMax}
                  onChange={(e) => set("kbMax", e.target.value)}
                  placeholder="50"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="exactKb">Exact size (KB)</Label>
              <Input
                id="exactKb"
                type="number"
                min={1}
                value={form.exactKb}
                onChange={(e) => set("exactKb", e.target.value)}
                placeholder="50"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="width">Width (px, optional)</Label>
              <Input
                id="width"
                type="number"
                min={1}
                value={form.width}
                onChange={(e) => set("width", e.target.value)}
                placeholder="Auto"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="height">Height (px, optional)</Label>
              <Input
                id="height"
                type="number"
                min={1}
                value={form.height}
                onChange={(e) => set("height", e.target.value)}
                placeholder="Auto"
              />
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-lg border bg-secondary/40 p-3 text-sm">
            <input
              type="checkbox"
              checked={form.allowDownscale}
              onChange={(e) => set("allowDownscale", e.target.checked)}
              className="mt-1"
            />
            <span>
              <span className="block font-medium">Allow downscaling if needed</span>
              <span className="text-xs text-muted-foreground">
                Helps large photos reach strict KB limits. Turn off when an official form mandates exact pixel dimensions.
              </span>
            </span>
          </label>

          <Button type="button" onClick={compress} disabled={!file || running} className="w-full">
            {running ? "Compressing…" : "Compress image"}
          </Button>

          {error && (
            <p
              className={cn(
                "rounded-lg border px-3 py-2 text-sm",
                output && output.status !== "ok"
                  ? "border-amber-300 bg-amber-50 text-amber-900"
                  : "border-destructive bg-destructive/10 text-destructive",
              )}
            >
              {error}
            </p>
          )}

          {output && (
            <div className="space-y-3 rounded-lg border bg-card p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Size</span>
                <span>{formatBytes(output.bytes)}</span>
                <span className="text-muted-foreground">Dimensions</span>
                <span>
                  {output.width} × {output.height} px
                </span>
                <span className="text-muted-foreground">Format</span>
                <span className="uppercase">{output.format}</span>
                <span className="text-muted-foreground">JPEG quality</span>
                <span>{Math.round(output.quality * 100)}%</span>
              </div>
              <Button
                type="button"
                onClick={download}
                variant={output.status === "ok" ? "default" : "outline"}
                className="w-full"
              >
                Download{output.status !== "ok" ? " (not spec-compliant)" : ""}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}