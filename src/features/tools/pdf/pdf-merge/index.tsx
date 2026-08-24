import { useCallback, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowDown, ArrowUp, X } from "lucide-react"
import { FileDropzone } from "@/components/ui/file-dropzone"
import { formatBytes } from "@/lib/utils"
import { useEngine } from "@/features/tools/useEngine"
import { runPdfMerge, type PdfMergeOutput } from "./engine"

export default function PdfMerge({ tool }: { tool: ToolDefinition }) {
  const [files, setFiles] = useState<File[]>([])
  const [warning, setWarning] = useState<string | null>(null)

  const { result, progress, isRunning, error, run, reset } = useEngine<PdfMergeOutput>(
    "file",
    tool.id,
  )

  const onFiles = useCallback(
    (list: FileList | File[] | null) => {
      if (!list) return
      const incoming = Array.isArray(list) ? list : Array.from(list)
      if (!incoming.length) return
      setWarning(null)
      const accepted: File[] = []
      let skipped = 0
      for (const f of incoming) {
        if (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")) {
          accepted.push(f)
        } else {
          skipped++
        }
      }
      if (skipped > 0) setWarning(`Skipped ${skipped} non-PDF file(s).`)
      if (accepted.length > 0) {
        reset()
        setFiles((prev) => [...prev, ...accepted])
      }
    },
    [reset],
  )
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{tool.name}</CardTitle>
          <CardDescription>
            Combine PDF files into one document in your browser. Nothing is uploaded.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <FileDropzone
              files={files}
              multiple
              onFiles={onFiles}
              accept="application/pdf"
              title={files.length > 0 ? "Drag & drop more PDFs here, or browse" : "Drag & drop PDF files here, or browse"}
              description="Select multiple PDFs to merge in order"
              onClear={() => {
                setFiles([])
                reset()
                setWarning(null)
              }}
            />
            {warning && <p className="mt-2 text-xs text-amber-600">{warning}</p>}
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <Label>Order — merge happens top to bottom</Label>
              {files.map((f, i) => (
                <div
                  key={`${f.name}-${i}`}
                  className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2"
                >
                  <span className="w-6 text-sm font-medium text-muted-foreground">{i + 1}.</span>
                  <span className="flex-1 truncate text-sm">{f.name}</span>
                  <div className="flex items-center gap-0.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={i === 0}
                      aria-label={`Move ${f.name} up`}
                      onClick={() => swap(files, setFiles, i, i - 1)}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={i === files.length - 1}
                      aria-label={`Move ${f.name} down`}
                      onClick={() => swap(files, setFiles, i, i + 1)}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${f.name}`}
                      onClick={() => {
                        setFiles((prev) => prev.filter((_, idx) => idx !== i))
                        reset()
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className="rounded-lg border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error.message}
            </p>
          )}

          <Button
            type="button"
            onClick={() => run(() => runPdfMerge({ files }))}
            disabled={files.length < 2 || isRunning}
            className="w-full"
          >
            {isRunning
              ? progress > 0 ? `Merging… ${Math.round(progress * 100)}%` : "Merging…"
              : "Merge PDFs"}
          </Button>

          {result?.success && (
            <div className="space-y-3 rounded-lg border bg-card p-4">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <span className="text-muted-foreground">Output</span>
                <span>{formatBytes(result.data.bytes)}</span>
                <span className="text-muted-foreground">Pages</span>
                <span>{result.data.pages}</span>
                <span className="text-muted-foreground">Sources</span>
                <span>{result.data.sourceCount}</span>
              </dl>
              <Button
                type="button"
                onClick={() => downloadPdf(result.data)}
                className="w-full"
              >
                Download {result.data.fileName}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function swap(list: File[], set: React.Dispatch<React.SetStateAction<File[]>>, a: number, b: number) {
  const next = [...list]
  ;[next[a], next[b]] = [next[b], next[a]]
  set(next)
}

function downloadPdf(data: PdfMergeOutput) {
  const url = URL.createObjectURL(data.blob)
  const el = document.createElement("a")
  el.href = url
  el.download = data.fileName
  el.click()
  URL.revokeObjectURL(url)
}