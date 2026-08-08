import { useCallback, useMemo, useRef, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { SegmentedControl } from "@/components/ui/segmented"
import { cn, formatBytes } from "@/lib/utils"
import { useEngine } from "@/features/tools/useEngine"
import {
  runBackgroundRemoval,
  recommend,
  type BgRemoveMode,
  type BgOutputKind,
} from "./engine"
import type { SolidAnalysis } from "@/features/tools/shared/segmentation"
import { loadImageRgba, type LoadedImageRgba } from "@/features/tools/shared/segmentation"

interface ModeOption {
  value: BgRemoveMode
  label: string
  sub: string
}

const MODES: ModeOption[] = [
  { value: "solid", label: "Solid", sub: "instant · offline" },
  { value: "ai", label: "AI", sub: "complex bg · local" },
]

interface OutputOption {
  value: BgOutputKind
  label: string
  sub: string
}

const OUTPUTS: OutputOption[] = [
  { value: "transparent", label: "Transparent", sub: "PNG" },
  { value: "replace", label: "Replace", sub: "solid color" },
  { value: "blur", label: "Blur", sub: "portrait" },
]

interface RecommendState {
  analysis: SolidAnalysis
  loaded: LoadedImageRgba
}

export default function BackgroundRemover({ tool }: { tool: ToolDefinition }) {
  const [file, setFile] = useState<File | null>(null)
  const [mode, setMode] = useState<BgRemoveMode>("solid")
  const [output, setOutput] = useState<BgOutputKind>("transparent")
  const [replaceColor, setReplaceColor] = useState("#ffffff")
  const [tolerance, setTolerance] = useState(48)
  const [feather, setFeather] = useState(1)
  const [preview, setPreview] = useState<string | null>(null)
  const [recommendState, setRecommendState] = useState<RecommendState | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { result, progress, isRunning, error, run, reset } = useEngine<unknown>("file", tool.id)

  const onFile = useCallback(
    async (f: File | undefined) => {
      if (!f) return
      setFile(f)
      setPreview(URL.createObjectURL(f))
      reset()
      // Analyze the border cheaply to power the mode recommendation.
      try {
        const loaded = await loadImageRgba(f)
        const analysis = recommend(loaded.rgba, loaded.size)
        setRecommendState({ analysis, loaded })
        setMode(analysis.recommendedMode)
      } catch {
        setRecommendState(null)
      }
    },
    [reset],
  )

  const apply = useCallback(async () => {
    if (!file) return
    await run((_emit) =>
      runBackgroundRemoval(
        {
          file,
          mode,
          output,
          replaceColor: replaceColor
            .replace(/^#/, "")
            .match(/.{2}/g)
            ?.map((h) => parseInt(h, 16)) as [number, number, number],
          solid: { tolerance, featherRadius: feather, fillHoles: true },
          format: output === "transparent" ? "png" : "jpeg",
        },
        // Reuse the already-decoded pixels when we analysed the file — avoids a
        // second full decode and keeps the solid path fully deterministic.
        {
          loadRgba: recommendState ? async () => recommendState.loaded : undefined,
        },
      ),
    )
  }, [file, mode, output, replaceColor, tolerance, feather, recommendState, run])

  const download = useCallback(() => {
    if (!result?.success) return
    const data = result.data as { blob: Blob; fileName: string; bytes: number }
    const url = URL.createObjectURL(data.blob)
    const a = document.createElement("a")
    a.href = url
    a.download = data.fileName
    a.click()
    URL.revokeObjectURL(url)
  }, [result])

  const modeRecommendation = useMemo(() => {
    if (!recommendState) return null
    const r = recommendState.analysis.recommendedMode
    if (r === "ai") {
      return {
        text: "Complex background detected — AI mode is recommended for a clean cutout.",
        tone: "warning" as const,
      }
    }
    return {
      text: "Solid background detected — instant Solid mode will work great.",
      tone: "ok" as const,
    }
  }, [recommendState])

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{tool.name}</CardTitle>
          <CardDescription>
            Remove, replace or blur the background of an image in your browser. Nothing is
            uploaded — the AI model is downloaded once, then runs on your device.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
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
          </div>

          {preview && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">Original</p>
                <img
                  src={preview}
                  alt="Original preview"
                  className="max-h-48 w-full rounded-lg border object-contain"
                />
              </div>
              {result?.success && (
                <div>
                  <p className="mb-1 text-xs font-medium text-muted-foreground">Result</p>
                  <div
                    className="max-h-48 w-full rounded-lg border bg-[repeating-conic-gradient(#ccc_0%_25%,#fff_0%_50%)] bg-[length:16px_16px]"
                    style={{ overflow: "hidden" }}
                  >
                    <img
                      src={URL.createObjectURL((result.data as { blob: Blob }).blob)}
                      alt="Result preview"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {modeRecommendation && (
            <p
              className={cn(
                "rounded-lg border px-3 py-2 text-sm",
                modeRecommendation.tone === "ok"
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : "border-amber-300 bg-amber-50 text-amber-800",
              )}
            >
              {modeRecommendation.text}
            </p>
          )}

          <div className="space-y-2">
            <Label>Mode</Label>
            <SegmentedControl<BgRemoveMode> name="mode" value={mode} onChange={setMode} options={MODES} />
          </div>

          {mode === "solid" && (
            <div className="space-y-4 rounded-lg border p-4">
              <div className="space-y-1.5">
                <Label htmlFor="tolerance">Edge tolerance: {tolerance}</Label>
                <input
                  id="tolerance"
                  type="range"
                  min={5}
                  max={100}
                  step={1}
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <p className="text-xs text-muted-foreground">
                  Higher removes more of a similar-coloured halo; lower keeps fine detail.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="feather">Edge smoothing: {feather}px</Label>
                <input
                  id="feather"
                  type="range"
                  min={0}
                  max={4}
                  step={1}
                  value={feather}
                  onChange={(e) => setFeather(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Output</Label>
            <SegmentedControl<BgOutputKind> name="output" value={output} onChange={setOutput} options={OUTPUTS} />
          </div>

          {output === "replace" && (
            <div className="space-y-1.5">
              <Label htmlFor="replace-color">Replacement color</Label>
              <div className="flex items-center gap-3">
                <input
                  id="replace-color"
                  type="color"
                  value={replaceColor}
                  onChange={(e) => setReplaceColor(e.target.value)}
                  className="h-9 w-14 rounded border"
                />
                <span className="text-sm text-muted-foreground">{replaceColor}</span>
              </div>
            </div>
          )}

          {error && (
            <p className="rounded-lg border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error.message}
            </p>
          )}

          <Button type="button" onClick={apply} disabled={!file || isRunning} className="w-full">
            {isRunning
              ? progress > 0.6
                ? "Rendering…"
                : "Removing background…"
              : "Remove background"}
          </Button>

          {result?.success && (
            <div className="space-y-3 rounded-lg border bg-card p-4">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <span className="text-muted-foreground">File size</span>
                <span>{formatBytes((result.data as { bytes: number }).bytes)}</span>
                <span className="text-muted-foreground">Dimensions</span>
                <span>
                  {(result.data as { width: number }).width} ×{" "}
                  {(result.data as { height: number }).height} px
                </span>
              </dl>
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