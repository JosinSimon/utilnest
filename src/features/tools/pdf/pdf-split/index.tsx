import { useCallback, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { SegmentedControl } from "@/components/ui/segmented"
import { FileDropzone } from "@/components/ui/file-dropzone"
import { formatBytes } from "@/lib/utils"
import { useEngine } from "@/features/tools/useEngine"
import { runPdfSplit, type PdfSplitOutput } from "./engine"

type SplitMode = "single" | "ranges"

export default function PdfSplit({ tool }: { tool: ToolDefinition }) {
  const [file, setFile] = useState<File | null>(null)
  const [mode, setMode] = useState<SplitMode>("single")
  const [cutText, setCutText] = useState("")

  const { result, progress, isRunning, error, run, reset } = useEngine<PdfSplitOutput>(
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
    const atPages = mode === "single" ? undefined : parseCuts(cutText)
    run(() =>
      runPdfSplit({
        file,
        atPages,
        singlePages: mode === "single",
      }),
    )
  }, [file, mode, cutText, run])

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
            Divide a PDF into separate files in your browser. All parts download as a zip.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <FileDropzone
              file={file}
              onFile={onFile}
              accept="application/pdf"
              title="Drag & drop your PDF file here, or browse"
              description="Separate PDF pages or extract custom ranges"
              onClear={() => {
                setFile(null)
                reset()
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Split style</Label>
            <SegmentedControl<SplitMode>
              name="split-style"
              value={mode}
              onChange={setMode}
              options={[
                { value: "single", label: "Each page", sub: "one PDF per page" },
                { value: "ranges", label: "At boundaries", sub: "custom cuts" },
              ]}
            />
          </div>

          {mode === "ranges" && (
            <div className="space-y-1.5">
              <Label htmlFor="cuts">
                Split after page… (comma-separated, e.g. 3, 9)
              </Label>
              <input
                id="cuts"
                type="text"
                value={cutText}
                placeholder="3, 7, 12"
                onChange={(e) => setCutText(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Each boundary starts a new part. "3, 7" → parts with pages 1-3, 4-7, 8-end.
              </p>
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
            disabled={
              !file || isRunning || (mode === "ranges" && cutText.trim() === "")
            }
            className="w-full"
          >
            {isRunning
              ? progress > 0 ? `Splitting… ${Math.round(progress * 100)}%` : "Splitting…"
              : "Split PDF"}
          </Button>

          {result?.success && (
            <div className="space-y-3 rounded-lg border bg-card p-4">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <span className="text-muted-foreground">Parts</span>
                <span>{result.data.partCount}</span>
                <span className="text-muted-foreground">Archive size</span>
                <span>{formatBytes(result.data.bytes)}</span>
              </dl>
              <p className="text-xs text-muted-foreground">
                {result.data.fileName} contains {result.data.partCount} PDF files.
              </p>
              <Button type="button" onClick={download} className="w-full">
                Download zip
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/** Parse "3, 7, 12" (spaces/commas) into sorted unique numbers. */
function parseCuts(text: string): number[] {
  return text
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n) && n >= 1)
    .sort((a, b) => a - b)
}