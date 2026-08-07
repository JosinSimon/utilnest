import { useCallback, useRef, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn, formatBytes } from "@/lib/utils"
import { runImageCompress, type ImageCompressOutput } from "./engine"

const PRESETS = [20, 50, 100, 200, 500]

export default function ImageCompressor({ tool }: { tool: ToolDefinition }) {  const [file, setFile] = useState<File | null>(null)
  const [kbMax, setKbMax] = useState(50)
  const [running, setRunning] = useState(false)
  const [output, setOutput] = useState<ImageCompressOutput | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const onFile = useCallback((f: File | undefined) => {
    if (!f) return
    setFile(f)
    setOutput(null)
    setError(null)
    setPreview(URL.createObjectURL(f))
  }, [])

  const compress = useCallback(async () => {
    if (!file) return
    if (!(kbMax > 0)) {
      setError("Enter a valid target size in KB.")
      return
    }
    setRunning(true)
    setError(null)
    setOutput(null)
    const job = runImageCompress({ file, kbMax })
    const result = await job.result
    setRunning(false)
    if (!result.success) {
      setError(result.error?.message ?? "Compression failed.")
      return
    }
    setOutput(result.data)
    if (result.data.status !== "ok") setError(result.data.message)
  }, [file, kbMax])

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
            Shrink an image to fit a target file size (e.g. under 50 KB). All processing happens in
            your browser — the real encoded size is read after each step, never guessed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
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
            <Label>Target size (KB)</Label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setKbMax(p)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm transition-colors",
                    kbMax === p
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-input bg-card hover:bg-accent",
                  )}
                >
                  {p} KB
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="kbMax">Custom maximum (KB)</Label>
            <Input
              id="kbMax"
              type="number"
              min={1}
              value={kbMax}
              onChange={(e) => setKbMax(Number(e.target.value))}
            />
          </div>

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
                <span className="text-muted-foreground">JPEG quality</span>
                <span>{Math.round(output.quality * 100)}%</span>
                <span className="text-muted-foreground">Original</span>
                <span>{file ? formatBytes(file.size) : "—"}</span>
              </div>
              <Button
                type="button"
                onClick={download}
                variant={output.status === "ok" ? "default" : "outline"}
                className="w-full"
              >
                Download{output.status !== "ok" ? " (did not reach target)" : ""}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}