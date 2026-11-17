import { useCallback, useMemo, useState } from "react"
import { AlertTriangle, CheckCircle2, Download, FileArchive, Files, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn, formatBytes } from "@/lib/utils"
import type { BatchItem } from "./batch"
import { uniqueFileName } from "./batch"
import { downloadBlob, downloadBlobsSequentially } from "./download"
import { zipBlobs } from "./zip"

export interface BatchOutputFile {
  fileName: string
  blob: Blob
}

export interface BatchRowInfo {
  /** Short facts shown under the file name, e.g. "800 × 600 px", "WEBP". */
  details?: string[]
  /** Shown in amber when the file was produced but needs attention. */
  warning?: string
}

export interface BatchResultsProps<T extends BatchOutputFile> {
  results: BatchItem<T>[]
  zipName: string
  describe?: (output: T) => BatchRowInfo
  className?: string
}

/** Per-file results list for batch tools: download one, all separately, or all as a ZIP. */
export function BatchResults<T extends BatchOutputFile>({
  results,
  zipName,
  describe,
  className,
}: BatchResultsProps<T>) {
  const [saving, setSaving] = useState<{ saved: number; total: number } | null>(null)
  const [zipping, setZipping] = useState(false)

  const outputs = useMemo(() => results.flatMap((result) => (result.data ? [result.data] : [])), [results])
  const failedCount = results.length - outputs.length
  const totalBytes = outputs.reduce((sum, output) => sum + output.blob.size, 0)

  const namedOutputs = useMemo(() => {
    const used = new Set<string>()
    return outputs.map((output) => ({ name: uniqueFileName(output.fileName, used), blob: output.blob }))
  }, [outputs])

  const downloadSeparately = useCallback(async () => {
    if (namedOutputs.length === 0) return
    setSaving({ saved: 0, total: namedOutputs.length })
    try {
      await downloadBlobsSequentially(namedOutputs, (saved, total) => setSaving({ saved, total }))
    } finally {
      setSaving(null)
    }
  }, [namedOutputs])

  const downloadZip = useCallback(async () => {
    if (namedOutputs.length === 0) return
    setZipping(true)
    try {
      downloadBlob(await zipBlobs(namedOutputs), zipName)
    } finally {
      setZipping(false)
    }
  }, [namedOutputs, zipName])

  const busy = saving !== null || zipping

  return (
    <div className={cn("space-y-3 rounded-lg border bg-card p-4", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-sm font-semibold">
          {outputs.length} of {results.length} file{results.length === 1 ? "" : "s"} ready
          {failedCount > 0 && <span className="font-normal text-destructive"> · {failedCount} failed</span>}
        </p>
        {outputs.length > 0 && <p className="text-xs text-muted-foreground">{formatBytes(totalBytes)} total</p>}
      </div>

      {outputs.length > 0 && (
        <div className="space-y-1.5">
          <div className="grid gap-2 sm:grid-cols-2">
            <Button type="button" onClick={downloadSeparately} disabled={busy}>
              <Files />
              {saving ? `Saving ${saving.saved} of ${saving.total}…` : "Download all (separate files)"}
            </Button>
            <Button type="button" variant="outline" onClick={downloadZip} disabled={busy}>
              <FileArchive />
              {zipping ? "Building ZIP…" : "Download all as ZIP"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Your browser may ask once to allow multiple downloads from this site.
          </p>
        </div>
      )}

      <ul className="max-h-96 divide-y overflow-y-auto rounded-md border" aria-label="Converted files">
        {results.map((result, index) => {
          const output = result.data
          const info = output && describe ? describe(output) : {}
          const sizeLine = output ? `${formatBytes(result.input.size)} → ${formatBytes(output.blob.size)}` : null
          const details = [sizeLine, ...(info.details ?? [])].filter(Boolean).join(" · ")

          return (
            <li key={`${result.input.name}-${index}`} className="flex items-center gap-3 px-3 py-2.5">
              {!output ? (
                <XCircle className="size-4 shrink-0 text-destructive" aria-hidden />
              ) : info.warning ? (
                <AlertTriangle className="size-4 shrink-0 text-amber-600" aria-hidden />
              ) : (
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600" aria-hidden />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium" title={output?.fileName ?? result.input.name}>
                  {output?.fileName ?? result.input.name}
                </p>
                {output ? (
                  <p className="text-xs text-muted-foreground">{details}</p>
                ) : (
                  <p className="text-xs text-destructive">{result.error ?? "Failed"}</p>
                )}
                {info.warning && <p className="text-xs text-amber-700">{info.warning}</p>}
              </div>
              {output && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => downloadBlob(output.blob, output.fileName)}
                  aria-label={`Download ${output.fileName}`}
                  className="shrink-0"
                >
                  <Download />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
