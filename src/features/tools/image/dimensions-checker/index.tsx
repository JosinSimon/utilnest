import { useCallback, useRef, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatBytes } from "@/lib/utils"
import { readImageDimensions, type DimensionsInfo } from "./engine"

export default function DimensionsChecker({ tool }: { tool: ToolDefinition }) {
  const [file, setFile] = useState<File | null>(null)
  const [info, setInfo] = useState<DimensionsInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const onFile = useCallback(async (f: File | undefined) => {
    if (!f) return
    setFile(f)
    setError(null)
    setPreview(URL.createObjectURL(f))
    const data = new Uint8Array(await f.arrayBuffer())
    const res = readImageDimensions(data)
    if (!res.success) {
      setError(res.error?.message ?? "Could not read the image.")
      setInfo(null)
      return
    }
    setInfo(res.data)
  }, [])

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{tool.name}</CardTitle>
          <CardDescription>
            Instantly read the pixel dimensions, aspect ratio, file size, format and DPI of any JPG
            or PNG image.
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

          {error && (
            <p className="rounded-lg border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          {info && (
            <div className="space-y-3 rounded-lg border bg-card p-4">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <span className="text-muted-foreground">Dimensions</span>
                <span>
                  {info.width} × {info.height} px
                </span>
                <span className="text-muted-foreground">Aspect ratio</span>
                <span>{info.aspect}</span>
                <span className="text-muted-foreground">Megapixels</span>
                <span>{info.megapixels} MP</span>
                <span className="text-muted-foreground">Format</span>
                <span className="uppercase">{info.format}</span>
                <span className="text-muted-foreground">File size</span>
                <span>{formatBytes(info.bytes)}</span>
                <span className="text-muted-foreground">DPI</span>
                <span>{info.dpi > 0 ? `${info.dpi} DPI` : "Not set"}</span>
              </dl>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}