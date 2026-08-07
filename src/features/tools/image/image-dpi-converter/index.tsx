import { useCallback, useRef, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn, formatBytes } from "@/lib/utils"
import { runDpiConvert, readDpi, type DpiConvertOutput } from "./engine"

const PRESETS = [72, 96, 150, 200, 300, 600]

export default function DpiConverter({ tool }: { tool: ToolDefinition }) {
  const [file, setFile] = useState<File | null>(null)
  const [currentDpi, setCurrentDpi] = useState<number | null>(null)
  const [format, setFormat] = useState<string | null>(null)
  const [dpi, setDpi] = useState(300)
  const [running, setRunning] = useState(false)
  const [output, setOutput] = useState<DpiConvertOutput | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const onFile = useCallback(async (f: File | undefined) => {
    if (!f) return
    setFile(f)
    setOutput(null)
    setError(null)
    setCurrentDpi(null)
    setFormat(null)
    setPreview(URL.createObjectURL(f))
    try {
      const data = new Uint8Array(await f.arrayBuffer())
      const info = readDpi(data)
      if (info) {
        setCurrentDpi(info.dpi || null)
        setFormat(info.format.toUpperCase())
      }
    } catch {
      /* ignore parse errors on preview */
    }
  }, [])

  const convert = useCallback(async () => {
    if (!file) return
    if (!(dpi > 0)) {
      setError("Enter a valid DPI (e.g. 72, 96, 150, 300).")
      return
    }
    setRunning(true)
    setError(null)
    setOutput(null)
    const job = runDpiConvert({ file, dpi })
    const result = await job.result
    setRunning(false)
    if (!result.success) {
      setError(result.error?.message ?? "Conversion failed.")
      return
    }
    setOutput(result.data)
  }, [file, dpi])

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
            Change the DPI metadata of a JPG or PNG without resampling pixels. Useful when an upload
            portal insists on a specific DPI value.
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
                {format && (
                  <span className="ml-2">
                    · {format}
                    {currentDpi != null ? ` · ${currentDpi} DPI` : " · DPI not set"}
                  </span>
                )}
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
            <Label>Target DPI</Label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setDpi(p)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm transition-colors",
                    dpi === p
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-input bg-card hover:bg-accent",
                  )}
                >
                  {p} DPI
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dpi">Custom DPI</Label>
            <Input
              id="dpi"
              type="number"
              min={1}
              max={1200}
              value={dpi}
              onChange={(e) => setDpi(Number(e.target.value))}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            DPI is metadata — pixel dimensions stay exactly the same. This changes how the image is
            interpreted for print, not its resolution.
          </p>

          <Button type="button" onClick={convert} disabled={!file || running} className="w-full">
            {running ? "Converting…" : "Set DPI & download"}
          </Button>

          {error && (
            <p className="rounded-lg border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          {output && (
            <div className="space-y-3 rounded-lg border bg-card p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">New DPI</span>
                <span>{output.dpi} DPI</span>
                <span className="text-muted-foreground">Format</span>
                <span className="uppercase">{output.format}</span>
                <span className="text-muted-foreground">File size</span>
                <span>{formatBytes(output.bytes)}</span>
              </div>
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