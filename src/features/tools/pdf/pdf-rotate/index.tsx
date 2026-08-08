import { useCallback, useRef, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { SegmentedControl } from "@/components/ui/segmented"
import { formatBytes } from "@/lib/utils"
import { useEngine } from "@/features/tools/useEngine"
import { runPdfRotate, type PdfRotateOutput } from "./engine"
import type { RotateDeg } from "@/features/tools/shared/pdf"

const ANGLES: { value: AngleValue; label: string; sub: string }[] = [
  { value: "90", label: "90°", sub: "clockwise" },
  { value: "180", label: "180°", sub: "upside down" },
  { value: "270", label: "270°", sub: "counter-clockwise" },
]

type AngleValue = "90" | "180" | "270"

export default function PdfRotate({ tool }: { tool: ToolDefinition }) {
  const [file, setFile] = useState<File | null>(null)
  const [angle, setAngle] = useState<AngleValue>("90")
  const [pages, setPages] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const { result, progress, isRunning, error, run, reset } = useEngine<PdfRotateOutput>(
    "file",
    tool.id,
  )

  const onFile = useCallback(
    (f: File | undefined) => {
      if (!f) return
      setFile(f)
      reset()
    },
    [reset],
  )

  const apply = useCallback(() => {
    if (!file) return
    const pageList = pages.trim() === "" ? null : parsePages(pages)
    run(() => runPdfRotate({ file, degrees: Number(angle) as RotateDeg, pages: pageList }))
  }, [file, angle, pages, run])

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
            Rotate all pages or specific ones in your browser. Nothing is uploaded.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                onFile(e.target.files?.[0])
                e.currentTarget.value = ""
              }}
            />
            <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
              {file ? "Choose another PDF" : "Choose a PDF"}
            </Button>
            {file && (
              <p className="mt-2 text-xs text-muted-foreground">
                {file.name} · {formatBytes(file.size)}
              </p>
            )}
          </div>

          {file && (
            <div className="space-y-2">
              <Label>Rotation</Label>
              <SegmentedControl<AngleValue>
                name="angle"
                value={angle}
                onChange={setAngle}
                options={ANGLES}
              />
            </div>
          )}

          {file && (
            <div className="space-y-1.5">
              <Label htmlFor="pages">Pages to rotate (optional)</Label>
              <input
                id="pages"
                type="text"
                value={pages}
                placeholder="2, 5, 9 — blank rotates every page"
                onChange={(e) => setPages(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
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
            disabled={!file || isRunning}
            className="w-full"
          >
            {isRunning
              ? progress > 0 ? `Rotating… ${Math.round(progress * 100)}%` : "Rotating…"
              : "Rotate PDF"}
          </Button>

          {result?.success && (
            <div className="space-y-3 rounded-lg border bg-card p-4">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <span className="text-muted-foreground">Pages in file</span>
                <span>{result.data.pageCount}</span>
                <span className="text-muted-foreground">Rotated</span>
                <span>{result.data.affected}</span>
                <span className="text-muted-foreground">File size</span>
                <span>{formatBytes(result.data.bytes)}</span>
              </dl>
              <Button type="button" onClick={download} className="w-full">
                Download rotated PDF
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function parsePages(text: string): number[] {
  const nums = text
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n) && n >= 1)
  return [...new Set(nums)].sort((a, b) => a - b)
}