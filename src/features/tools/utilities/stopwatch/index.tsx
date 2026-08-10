import { useState, useEffect, useRef } from "react"
import { Watch, Play, Pause, RotateCcw, Flag, Copy, Check } from "lucide-react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatStopwatchMs, computeLapRecords } from "./engine"

export default function StopwatchWidget({ tool: _tool }: { tool: ToolDefinition }) {
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [lapsMs, setLapsMs] = useState<number[]>([])
  const [copied, setCopied] = useState(false)

  // Timestamp references for drift-free background tab accuracy
  const startTimeRef = useRef<number | null>(null)
  const accumulatedElapsedRef = useRef<number>(0)
  const animFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isRunning) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      return
    }

    startTimeRef.current = performance.now()

    const tick = () => {
      if (!startTimeRef.current) return
      const now = performance.now()
      const currentSessionElapsed = now - startTimeRef.current
      const total = accumulatedElapsedRef.current + currentSessionElapsed
      setElapsedMs(total)

      animFrameRef.current = requestAnimationFrame(tick)
    }

    animFrameRef.current = requestAnimationFrame(tick)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isRunning])

  const handleStart = () => {
    setIsRunning(true)
  }

  const handlePause = () => {
    if (startTimeRef.current) {
      const now = performance.now()
      accumulatedElapsedRef.current += now - startTimeRef.current
    }
    startTimeRef.current = null
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    startTimeRef.current = null
    accumulatedElapsedRef.current = 0
    setElapsedMs(0)
    setLapsMs([])
  }

  const handleLap = () => {
    if (elapsedMs <= 0) return
    setLapsMs((prev) => [...prev, elapsedMs])
  }

  const lapRecords = computeLapRecords(lapsMs)

  const handleCopyLaps = () => {
    if (lapRecords.length === 0) return
    const text = lapRecords
      .map((l) => `Lap ${l.lapIndex}: ${l.formattedLap} (Split: ${l.formattedSplit})`)
      .join("\n")
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formattedTime = formatStopwatchMs(elapsedMs)

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Stopwatch Hero Card */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 shadow-md">
        <CardContent className="p-8 flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Watch className="h-4 w-4 text-primary" /> Precision Stopwatch
          </div>

          <div className="text-6xl sm:text-8xl font-extrabold font-mono tracking-tight text-primary select-none py-2">
            {formattedTime.formatted}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 justify-center pt-2">
            {!isRunning ? (
              <Button onClick={handleStart} size="lg" className="px-8 font-bold">
                <Play className="h-5 w-5 mr-2" /> Start
              </Button>
            ) : (
              <Button onClick={handlePause} variant="outline" size="lg" className="px-8 font-bold">
                <Pause className="h-5 w-5 mr-2" /> Pause
              </Button>
            )}

            <Button onClick={handleLap} disabled={!isRunning} variant="outline" size="lg">
              <Flag className="h-4 w-4 mr-2" /> Lap
            </Button>

            <Button onClick={handleReset} variant="outline" size="lg">
              <RotateCcw className="h-4 w-4 mr-2" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lap Records Table */}
      {lapRecords.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Recorded Laps ({lapRecords.length})</CardTitle>
            <Button onClick={handleCopyLaps} variant="outline" size="sm">
              {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copied Laps!" : "Copy Laps"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted text-muted-foreground font-semibold">
                  <tr>
                    <th className="py-3 px-4">Lap #</th>
                    <th className="py-3 px-4">Lap Time</th>
                    <th className="py-3 px-4 text-right">Overall Split Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono">
                  {[...lapRecords].reverse().map((lap) => (
                    <tr key={lap.lapIndex} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 px-4 font-semibold">Lap {lap.lapIndex}</td>
                      <td className="py-3 px-4 text-primary font-bold">{lap.formattedLap}</td>
                      <td className="py-3 px-4 text-right text-muted-foreground">{lap.formattedSplit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
