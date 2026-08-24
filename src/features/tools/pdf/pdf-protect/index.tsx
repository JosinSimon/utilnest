import { useCallback, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { FileDropzone } from "@/components/ui/file-dropzone"
import { formatBytes } from "@/lib/utils"
import { useEngine } from "@/features/tools/useEngine"
import { runPdfProtect, type PdfProtectOutput } from "./engine"

export default function PdfProtect({ tool }: { tool: ToolDefinition }) {
  const [file, setFile] = useState<File | null>(null)
  const [pw, setPw] = useState("")
  const [pw2, setPw2] = useState("")
  const [ownerPw, setOwnerPw] = useState("")

  const { result, progress, isRunning, error, run, reset } = useEngine<PdfProtectOutput>(
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

  const mismatch = pw.length > 0 && pw !== pw2
  const canRun = file !== null && pw.length >= 4 && !mismatch && !isRunning

  const apply = useCallback(() => {
    if (!file || pw.length === 0) return
    run(() =>
      runPdfProtect({
        file,
        password: pw,
        ownerPassword: ownerPw.trim() === "" ? undefined : ownerPw,
      }),
    )
  }, [file, pw, ownerPw, run])

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
            Add password protection with local AES-256. Your file stays in the browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <FileDropzone
              file={file}
              onFile={onFile}
              accept="application/pdf"
              title="Drag & drop your PDF here, or browse"
              description="Encrypt PDF with a password entirely in your browser"
              onClear={() => {
                setFile(null)
                reset()
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pw">Password</Label>
            <input
              id="pw"
              type="password"
              value={pw}
              placeholder="Secret that opens the file"
              autoComplete="new-password"
              onChange={(e) => setPw(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pw2">Confirm password</Label>
            <input
              id="pw2"
              type="password"
              value={pw2}
              placeholder="Repeat the password"
              autoComplete="new-password"
              onChange={(e) => setPw2(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
            {mismatch && (
              <p className="text-xs text-destructive">Passwords do not match.</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="owner-pw">
              Owner password <span className="text-muted-foreground">(optional)</span>
            </Label>
            <input
              id="owner-pw"
              type="password"
              value={ownerPw}
              placeholder="Permission-level password"
              autoComplete="new-password"
              onChange={(e) => setOwnerPw(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error.message}
            </p>
          )}

          <Button type="button" onClick={apply} disabled={!canRun} className="w-full">
            {isRunning
              ? progress > 0 ? `Encrypting… ${Math.round(progress * 100)}%` : "Encrypting…"
              : "Protect PDF"}
          </Button>

          {result?.success && (
            <div className="space-y-3 rounded-lg border bg-card p-4">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <span className="text-muted-foreground">Encrypted</span>
                <span>✓ AES-256</span>
                <span className="text-muted-foreground">Pages</span>
                <span>{result.data.pageCount}</span>
                <span className="text-muted-foreground">File size</span>
                <span>{formatBytes(result.data.bytes)}</span>
              </dl>
              <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
                Save the password somewhere safe — if you lose it, the file cannot be recovered.
              </p>
              <Button type="button" onClick={download} className="w-full">
                Download protected PDF
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}