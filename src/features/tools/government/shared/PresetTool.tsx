import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { cn, formatBytes } from "@/lib/utils"
import {
  PRESET_REGISTRY,
  getPresetById,
  presetVerificationText,
  type OfficialSpecPreset,
} from "@/features/tools/shared/image"
import { runPresetPipeline } from "@/features/tools/shared/image"
import { presetPixels } from "@/features/tools/shared/image"

/**
 * Shared presentational + orchestration component for all preset-driven
 * government tools. Tools render this with a `scope` that selects which
 * presets appear in the picker (photos only, signatures only, or specific ids).
 *
 * It has NO image-processing logic — it calls the shared engine's
 * `runPresetPipeline` and shows the returned report + validation.
 */

export type PresetScope =
  | { kind: "all" }
  | { kind: "documentTypes"; documentTypes: ("photo" | "signature")[] }
  | { kind: "ids"; ids: string[] }

interface PresetToolProps {
  tool: ToolDefinition
  scope?: PresetScope
  /** Default DPI to resolve cm/in dimension presets. */
  defaultDpi?: number
}

function presetsInScope(scope: PresetScope | undefined): OfficialSpecPreset[] {
  if (!scope || scope.kind === "all") return PRESET_REGISTRY
  if (scope.kind === "documentTypes") {
    return PRESET_REGISTRY.filter((p) =>
      (scope.documentTypes as OfficialSpecPreset["documentType"][]).includes(p.documentType),
    )
  }
  return scope.ids
    .map((id) => getPresetById(id))
    .filter((p): p is OfficialSpecPreset => Boolean(p))
}

export function PresetTool({ tool, scope, defaultDpi = 300 }: PresetToolProps) {
  const presets = useMemo(() => presetsInScope(scope), [scope])
  const [selectedId, setSelectedId] = useState<string>(presets[0]?.id ?? "")
  const [file, setFile] = useState<File | null>(null)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<Awaited<ReturnType<typeof runPresetPipeline>> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dpi, setDpi] = useState(defaultDpi)
  const previewRef = useRef<string | null>(null)

  const preset = getPresetById(selectedId) ?? presets[0]

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    }
  }, [])

  const onFile = useCallback((f: File | undefined) => {
    if (!f) return
    setFile(f)
    setError(null)
    setResult(null)
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    const url = URL.createObjectURL(f)
    previewRef.current = url
    setPreview(url)
  }, [])

  const process = useCallback(async () => {
    if (!file || !preset) return
    setRunning(true)
    setError(null)
    setResult(null)
    try {
      const res = await runPresetPipeline({ file, preset, dpi })
      setResult(res)
      if (!res.compliant) {
        setError("The output does not satisfy the selected specification.")
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setRunning(false)
    }
  }, [file, preset, dpi])

  const download = useCallback(() => {
    if (!result) return
    const url = URL.createObjectURL(result.output.blob)
    const ext = result.output.format === "png" ? "png" : "jpg"
    const a = document.createElement("a")
    a.href = url
    a.download = `${preset?.exam.toLowerCase().replace(/\s+/g, "-")}-${preset?.documentType}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }, [result, preset])

  const needsDpi = preset?.dimensions.unit !== "px"

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{tool.name}</CardTitle>
          <CardDescription>{tool.longDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {presets.length > 0 && (
            <div className="space-y-2">
              <Label>Choose specification</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {presets.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(p.id)
                      setResult(null)
                      setError(null)
                    }}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                      selectedId === p.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-input bg-card hover:bg-accent",
                    )}
                  >
                    <span className="block font-medium leading-tight">{p.exam}</span>
                    <span className="mt-0.5 block text-xs capitalize text-muted-foreground">
                      {p.documentType.replace("-", " ")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {preset && (
            <div className="space-y-3 rounded-lg border bg-card p-4 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {preset.organization}
                </span>
                {preset.verified && <Badge>Verified</Badge>}
              </div>
              <dl className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Dimensions</span>
                <span>
                  {needsDpi
                    ? `${preset.dimensions.width}×${preset.dimensions.height} ${preset.dimensions.unit}`
                    : `${preset.dimensions.width}×${preset.dimensions.height} px`}
                </span>
                <span className="text-muted-foreground">File size</span>
                <span>
                  {preset.kbMin}-{preset.kbMax} KB
                </span>
                <span className="text-muted-foreground">Format</span>
                <span className="uppercase">{preset.preferredFormat}</span>
                <span className="text-muted-foreground">Background</span>
                <span className="capitalize">{preset.backgroundColor ?? "any"}</span>
              </dl>
              <p className="text-xs text-muted-foreground">{presetVerificationText(preset)}</p>
              {preset.notes && <p className="text-xs italic text-muted-foreground">{preset.notes}</p>}
            </div>
          )}

          {needsDpi && (
            <div className="space-y-1.5">
              <Label htmlFor="dpi">DPI (for cm/mm dimensions)</Label>
              <input
                id="dpi"
                className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm shadow-sm"
                type="number"
                min={96}
                max={1200}
                value={dpi}
                onChange={(e) => setDpi(Number(e.target.value))}
              />
              {preset && (
                <p className="text-xs text-muted-foreground">
                  Renders to ≈ {presetPixels(preset, dpi).width}×{presetPixels(preset, dpi).height} px
                </p>
              )}
            </div>
          )}

          <div>
            <input
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
              id="preset-file"
            />
            <Button type="button" variant="outline" onClick={() => document.getElementById("preset-file")?.click()}>
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

          <Button
            type="button"
            onClick={process}
            disabled={!file || !preset || running}
            className="w-full"
          >
            {running ? "Processing…" : "Prepare for submission"}
          </Button>

          {error && (
            <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {error}
            </p>
          )}

          {result && (
            <div className="space-y-3 rounded-lg border bg-card p-4">
              <div className={cn("text-sm", result.compliant ? "text-emerald-600" : "text-amber-700")}>
                {result.compliant
                  ? "Output satisfies the selected dimensions and file-size specification."
                  : "Output does not satisfy all hard requirements."}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Final size</span>
                <span>{formatBytes(result.output.bytes)}</span>
                <span className="text-muted-foreground">Dimensions</span>
                <span>
                  {result.output.width} × {result.output.height} px
                </span>
                <span className="text-muted-foreground">Format</span>
                <span className="uppercase">{result.output.format}</span>
                <span className="text-muted-foreground">JPEG quality</span>
                <span>{Math.round(result.output.quality * 100)}%</span>
              </div>
              {result.issues.some((i) => i.severity !== "error") && (
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {result.issues
                    .filter((i) => i.severity !== "error")
                    .map((i, idx) => (
                      <li key={idx}>• {i.message}</li>
                    ))}
                </ul>
              )}
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