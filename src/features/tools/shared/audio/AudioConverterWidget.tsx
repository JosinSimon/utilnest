import { useCallback, useState, useEffect, useRef } from "react"
import { Download, Play, Pause, RefreshCw, CheckCircle2, Shield } from "lucide-react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { FileDropzone } from "@/components/ui/file-dropzone"
import { cn, formatBytes } from "@/lib/utils"
import { processFilesSequentially, uniqueFileName } from "../batch"
import { zipBlobs } from "../zip"
import { runAudioConvert } from "./driver"
import type { AudioBitrate, AudioOutputFormat, AudioConvertOutput } from "./types"

const BITRATES: { value: AudioBitrate; label: string; sub: string }[] = [
  { value: 64, label: "64 kbps", sub: "Light / Voice" },
  { value: 128, label: "128 kbps", sub: "Standard" },
  { value: 192, label: "192 kbps", sub: "High Quality" },
  { value: 256, label: "256 kbps", sub: "Very High" },
  { value: 320, label: "320 kbps", sub: "Studio Quality" },
]

export interface AudioConverterWidgetProps {
  tool: ToolDefinition
  targetFormat: AudioOutputFormat
  acceptedExtensions?: string
  hintText?: string
}

export function AudioConverterWidget({
  tool,
  targetFormat,
  acceptedExtensions = "audio/*,.amr,.m4a,.wav,.mp3,.aac,.ogg,.opus,.webm",
  hintText = "Supports MP3, WAV, M4A, AMR, AAC, OGG, Opus, WebM",
}: AudioConverterWidgetProps) {
  const [files, setFiles] = useState<File[]>([])
  const [bitrate, setBitrate] = useState<AudioBitrate>(128)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [outputs, setOutputs] = useState<AudioConvertOutput[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const clearResults = useCallback(() => {
    setOutputs([])
    setError(null)
    setIsPlaying(false)
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }
  }, [audioUrl])

  const onFiles = useCallback((incoming: File[]) => {
    if (incoming.length === 0) return
    setFiles((previous) => [...previous, ...incoming])
    clearResults()
  }, [clearResults])

  const convert = useCallback(async () => {
    if (files.length === 0) return
    setRunning(true)
    setProgress(0)
    clearResults()

    const results = await processFilesSequentially(
      files,
      async (file, onFileProgress) => {
        const job = runAudioConvert({
          file,
          format: targetFormat,
          bitrate,
        })
        job.onProgress(onFileProgress)
        const result = await job.result
        if (!result.success) {
          throw new Error(result.error?.message || "Audio conversion failed.")
        }
        return result.data
      },
      (p) => setProgress(Math.round(p * 100)),
    )

    const successful = results.flatMap((result) => (result.data ? [result.data] : []))
    const failed = results.filter((result) => result.error)
    setOutputs(successful)
    setRunning(false)

    if (successful.length > 0) {
      const url = URL.createObjectURL(successful[0].blob)
      setAudioUrl(url)
    }
    if (failed.length > 0) {
      setError(`${failed.length} file${failed.length === 1 ? "" : "s"} failed to convert.`)
    }
  }, [bitrate, clearResults, files, targetFormat])

  const download = useCallback((output: AudioConvertOutput) => {
    const url = URL.createObjectURL(output.blob)
    const a = document.createElement("a")
    a.href = url
    a.download = output.fileName
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const downloadAll = useCallback(async () => {
    if (outputs.length === 0) return
    const usedNames = new Set<string>()
    const archive = await zipBlobs(
      outputs.map((output) => ({
        name: uniqueFileName(output.fileName, usedNames),
        blob: output.blob,
      })),
    )
    const url = URL.createObjectURL(archive)
    const a = document.createElement("a")
    a.href = url
    a.download = `${tool.slug}-converted.zip`
    a.click()
    URL.revokeObjectURL(url)
  }, [outputs, tool.slug])

  const togglePlayback = () => {
    if (!audioPlayerRef.current || !audioUrl) return
    if (isPlaying) {
      audioPlayerRef.current.pause()
      setIsPlaying(false)
    } else {
      audioPlayerRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.error("Playback failed:", e))
    }
  }

  const formatDuration = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">{tool.name}</CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            {tool.shortDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Selector Dropzone */}
          <div>
            <FileDropzone
              files={files}
              multiple
              onFiles={onFiles}
              accept={acceptedExtensions}
              title={files.length > 0 ? "Drag & drop more audio files here, or browse" : "Drag & drop audio files here, or browse"}
              description={hintText}
              onClear={() => {
                setFiles([])
                clearResults()
              }}
            />
          </div>

          {/* Bitrate Selector for MP3 */}
          {targetFormat === "mp3" && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">MP3 Audio Quality / Bitrate</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {BITRATES.map((b) => {
                  const active = bitrate === b.value
                  return (
                    <button
                      key={b.value}
                      type="button"
                      onClick={() => setBitrate(b.value)}
                      className={cn(
                        "flex flex-col items-start rounded-lg border p-3 text-left transition-all",
                        active
                          ? "border-primary bg-primary/10 text-primary shadow-xs font-semibold"
                          : "border-border/60 bg-card hover:border-border text-foreground",
                      )}
                    >
                      <span className="text-sm font-medium">{b.label}</span>
                      <span className="text-xs text-muted-foreground mt-0.5">{b.sub}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Convert Action Button */}
          <Button
            type="button"
            onClick={convert}
            disabled={files.length === 0 || running}
            className="w-full text-base py-5 font-semibold"
          >
            {running ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="size-4 animate-spin" />
                Converting audio… ({progress}%)
              </span>
            ) : (
              `Convert ${files.length > 1 ? `${files.length} files` : "file"} to ${targetFormat.toUpperCase()}`
            )}
          </Button>

          {/* Progress Indicator */}
          {running && (
            <div className="space-y-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Processing audio on your device…
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              <p className="font-semibold">Conversion Error</p>
              <p className="mt-1 text-xs">{error}</p>
            </div>
          )}

          {/* Output Card with Audio Player */}
          {outputs.length > 0 && audioUrl && (
            <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="size-5" />
                <span>{outputs.length === 1 ? "Conversion Complete!" : `${outputs.length} conversions complete!`}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-lg bg-muted/40 p-3 text-xs">
                <div>
                  <span className="text-muted-foreground block">Format</span>
                  <span className="font-semibold text-foreground uppercase">{outputs[0].format}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Size</span>
                  <span className="font-semibold text-foreground">{formatBytes(outputs[0].bytes)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Duration</span>
                  <span className="font-semibold text-foreground">{formatDuration(outputs[0].duration)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Sample Rate</span>
                  <span className="font-semibold text-foreground">{outputs[0].sampleRate} Hz</span>
                </div>
              </div>

              {/* Audio Preview Player */}
              <div className="flex items-center gap-4 rounded-lg border border-border/80 bg-background p-3">
                <audio
                  ref={audioPlayerRef}
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={togglePlayback}
                  className="size-10 rounded-full p-0 shrink-0"
                  aria-label={isPlaying ? "Pause" : "Play converted audio"}
                >
                  {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 ml-0.5" />}
                </Button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {outputs[0].fileName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isPlaying ? "Playing preview…" : "Listen to converted audio"}
                  </p>
                </div>
              </div>

              {/* Download Button */}
              <Button
                type="button"
                onClick={outputs.length === 1 ? () => download(outputs[0]) : downloadAll}
                className="w-full text-base py-5 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                <Download className="size-5" />
                {outputs.length === 1 ? `Download ${outputs[0].fileName}` : "Download all as ZIP"}
              </Button>
            </div>
          )}

          {/* Privacy Footnote */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-2">
            <Shield className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>100% Private: Audio is converted entirely on your device</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
