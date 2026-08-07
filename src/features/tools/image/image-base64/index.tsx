import { useCallback, useEffect, useRef, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SegmentedControl } from "@/components/ui/segmented"
import { Label } from "@/components/ui/label"
import { formatBytes } from "@/lib/utils"
import { encodeImage, decodeBase64, MAX_ENCODE_BYTES } from "./engine"
import type { Base64Mode } from "./engine"

export default function ImageBase64({ tool }: { tool: ToolDefinition }) {
  const [mode, setMode] = useState<Base64Mode>("encode")
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState("")
  const [output, setOutput] = useState<string>("")
  const [decoded, setDecoded] = useState<{ url: string; bytes: number; mime: string; fileName: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const decodedUrlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (decodedUrlRef.current) URL.revokeObjectURL(decodedUrlRef.current)
    }
  }, [])

  const onFile = useCallback((f: File | undefined) => {
    if (!f) return
    setFile(f)
    setError(null)
    setOutput("")
    setDecoded(null)
  }, [])

  const doEncode = useCallback(async () => {
    if (!file) return
    setError(null)
    setOutput("")
    try {
      const bytes = new Uint8Array(await file.arrayBuffer())
      if (bytes.length > MAX_ENCODE_BYTES) {
        setError(
          `Image is ${(bytes.length / (1024 * 1024)).toFixed(1)} MB — over the 2 MB limit. Base64 output runs about a third larger than the file, so huge images can freeze your browser. Compress the image first.`,
        )
        return
      }
      const res = encodeImage(bytes, file.type || "image/jpeg")
      setOutput(res.dataUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Encoding failed.")
    }
  }, [file])

  const doDecode = useCallback(() => {
    setError(null)
    if (decodedUrlRef.current) URL.revokeObjectURL(decodedUrlRef.current)
    setDecoded(null)
    try {
      const res = decodeBase64(text)
      const url = URL.createObjectURL(res.blob)
      decodedUrlRef.current = url
      setDecoded({ url, bytes: res.bytes, mime: res.mime, fileName: res.fileName })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Decoding failed.")
    }
  }, [text])

  const copy = useCallback(() => {
    if (output) void navigator.clipboard?.writeText(output)
  }, [output])

  const downloadDecoded = useCallback(() => {
    if (!decoded) return
    const a = document.createElement("a")
    a.href = decoded.url
    a.download = decoded.fileName
    a.click()
  }, [decoded])

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{tool.name}</CardTitle>
          <CardDescription>
            Convert an image to a Base64 data URL, or turn a Base64 string back into a downloadable
            image. Everything runs in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <SegmentedControl<Base64Mode>
            name="mode"
            value={mode}
            onChange={(m) => {
              setMode(m)
              setError(null)
              setOutput("")
              setDecoded(null)
            }}
            options={[
              { value: "encode", label: "Image → Base64", sub: "to text" },
              { value: "decode", label: "Base64 → Image", sub: "to file" },
            ]}
          />

          {mode === "encode" ? (
            <>
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
                    {file.name} · {formatBytes(file.size)} ·{" "}
                    {file.size > MAX_ENCODE_BYTES ? (
                      <span className="text-amber-700">over the 2 MB limit</span>
                    ) : (
                      "OK to encode"
                    )}
                  </p>
                )}
              </div>
              <Button
                type="button"
                onClick={doEncode}
                disabled={!file || file.size > MAX_ENCODE_BYTES}
                className="w-full"
              >
                Encode to Base64
              </Button>
              {output && (
                <div className="space-y-3 rounded-lg border bg-card p-4">
                  <Label>Base64 data URL</Label>
                  <textarea
                    readOnly
                    value={output}
                    rows={6}
                    className="w-full rounded-lg border border-input bg-card p-3 font-mono text-xs shadow-sm"
                  />
                  <Button type="button" onClick={copy} variant="outline" className="w-full">
                    Copy Base64
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="b64">Base64 string or data URL</Label>
                <textarea
                  id="b64"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={6}
                  placeholder="Paste a Base64 string or data:image/... URL"
                  className="w-full rounded-lg border border-input bg-card p-3 font-mono text-xs shadow-sm"
                />
              </div>
              <Button type="button" onClick={doDecode} disabled={!text.trim()} className="w-full">
                Decode to image
              </Button>
              {decoded && (
                <div className="space-y-3 rounded-lg border bg-card p-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <span>{decoded.mime}</span>
                    <span className="text-muted-foreground">Size</span>
                    <span>{formatBytes(decoded.bytes)}</span>
                  </div>
                  <img
                    src={decoded.url}
                    alt="Decoded preview"
                    className="max-h-48 rounded-lg border object-contain"
                  />
                  <Button type="button" onClick={downloadDecoded} className="w-full">
                    Download {decoded.fileName}
                  </Button>
                </div>
              )}
            </>
          )}

          {error && (
            <p className="rounded-lg border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}