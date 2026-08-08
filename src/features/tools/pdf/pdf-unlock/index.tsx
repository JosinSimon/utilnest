import { useCallback, useRef, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { formatBytes } from "@/lib/utils"
import { useEngine } from "@/features/tools/useEngine"
import { runPdfUnlock, type PdfUnlockOutput } from "./engine"

export default function PdfUnlock({ tool }: { tool: ToolDefinition }) {
  const [file, setFile] = useState<File | null>(null)
  const [pw, setPw] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const { result, progress, isRunning, error, run, reset } = useEngine<PdfUnlockOutput>(
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
    if (!file || pw.length === 0) return
    run(() => runPdfUnlock({ file, password: pw }))
  }, [file, pw, run])

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
            Remove password protection locally. Your file and password never leave the browser.
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

          <div className="space-y-1.5">
            <Label htmlFor="unlock-pw">Password</Label>
            <input
              id="unlock-pw"
              type="password"
              value={pw}
              placeholder="Password that opens the PDF"
              autoComplete="current-password"
              onChange={(e) => setPw(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error.message}
            </p>
          )}

          <Button
            type="button"
            onClick={apply}
            disabled={!file || pw.length === 0 || isRunning}
            className="w-full"
          >
            {isRunning
              ? progress > 0 ? `Unlocking… ${Math.round(progress * 100)}%` : "Unlocking…"
              : "Unlock PDF"}
          </Button>

          {result?.success && (
            <div className="space-y-3 rounded-lg border bg-card p-4">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <span className="text-muted-foreground">Pages</span>
                <span>{result.data.pageCount}</span>
                <span className="text-muted-foreground">File size</span>
                <span>{formatBytes(result.data.bytes)}</span>
              </dl>
              <Button type="button" onClick={download} className="w-full">
                Download unlocked PDF
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}