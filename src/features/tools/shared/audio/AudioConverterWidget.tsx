import { useCallback, useRef, useState, useEffect } from "react"
import { Upload, Music, Download, Play, Pause, RefreshCw, CheckCircle2, Shield } from "lucide-react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn, formatBytes } from "@/lib/utils"
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
  hintText = "Drag and drop your audio file or click to browse",
}: AudioConverterWidgetProps) {
  const [file, setFile] = useState<File | null>(null)
  const [bitrate, setBitrate] = useState<AudioBitrate>(128)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [output, setOutput] = useState<AudioConvertOutput | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const onFile = useCallback((f: File | undefined) => {
    if (!f) return
    setFile(f)
    setOutput(null)
    setError(null)
    setIsPlaying(false)
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }
  }, [audioUrl])

  const convert = useCallback(async () => {
    if (!file) return
    setRunning(true)
    setProgress(0.05)
    setError(null)
    setOutput(null)

    const job = runAudioConvert({
      file,
      format: targetFormat,
      bitrate,
    })

    job.onProgress((p) => {
      setProgress(Math.round(p * 100))
    })

    const result = await job.result
    setRunning(false)

    if (!result.success) {
      setError(result.error?.message || "Audio conversion failed.")
      return
    }

    const url = URL.createObjectURL(result.data.blob)
    setAudioUrl(url)
    setOutput(result.data)
  }, [file, targetFormat, bitrate])

  const download = useCallback(() => {
    if (!output || !audioUrl) return
    const a = document.createElement("a")
    a.href = audioUrl
    a.download = output.fileName
    a.click()
  }, [output, audioUrl])

  const togglePlayback = useCallback(() => {
    if (!audioPlayerRef.current) return
    if (isPlaying) {
      audioPlayerRef.current.pause()
      setIsPlaying(false)
    } else {
      audioPlayerRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    }
  }, [isPlaying])

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
          <div
            onClick={() => inputRef.current?.click()}
            className={cn(
              "group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/30 p-8 text-center transition-all hover:border-primary/60 hover:bg-muted/50",
              file && "border-primary/40 bg-primary/5",
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept={acceptedExtensions}
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
              {file ? <Music className="size-7" /> : <Upload className="size-7" />}
            </div>
            <p className="mt-4 font-semibold text-foreground text-base">
              {file ? file.name : "Choose an audio file"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {file ? `${formatBytes(file.size)} · Click to change file` : hintText}
            </p>
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
            disabled={!file || running}
            className="w-full text-base py-5 font-semibold"
          >
            {running ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="size-4 animate-spin" />
                Converting audio… ({progress}%)
              </span>
            ) : (
              `Convert to ${targetFormat.toUpperCase()}`
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
          {output && audioUrl && (
            <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="size-5" />
                <span>Conversion Complete!</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-lg bg-muted/40 p-3 text-xs">
                <div>
                  <span className="text-muted-foreground block">Format</span>
                  <span className="font-semibold text-foreground uppercase">{output.format}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Size</span>
                  <span className="font-semibold text-foreground">{formatBytes(output.bytes)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Duration</span>
                  <span className="font-semibold text-foreground">{formatDuration(output.duration)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Sample Rate</span>
                  <span className="font-semibold text-foreground">{output.sampleRate} Hz</span>
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
                    {output.fileName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isPlaying ? "Playing preview…" : "Listen to converted audio"}
                  </p>
                </div>
              </div>

              {/* Download Button */}
              <Button
                type="button"
                onClick={download}
                className="w-full text-base py-5 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                <Download className="size-5" />
                Download {output.fileName}
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
