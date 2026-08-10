import { useState, useEffect, useRef } from "react"
import { Timer as TimerIcon, Play, Pause, RotateCcw, Bell } from "lucide-react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatTimeComponents, playChimeSound } from "./engine"

export default function TimerWidget({ tool: _tool }: { tool: ToolDefinition }) {
  const [hoursInput, setHoursInput] = useState<number>(0)
  const [minutesInput, setMinutesInput] = useState<number>(5)
  const [secondsInput, setSecondsInput] = useState<number>(0)

  // Timer state
  const [isRunning, setIsRunning] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  // Duration & Elapsed in ms
  const [totalDurationMs, setTotalDurationMs] = useState(300000) // Default 5 mins
  const [remainingMs, setRemainingMs] = useState(300000)

  // Timestamp references for drift-free background tab performance
  const startTimeRef = useRef<number | null>(null)
  const accumulatedElapsedRef = useRef<number>(0)
  const animFrameRef = useRef<number | null>(null)

  // Set duration from inputs
  const updateDurationFromInputs = (h: number, m: number, s: number) => {
    const totalMs = (h * 3600 + m * 60 + s) * 1000
    setTotalDurationMs(totalMs)
    setRemainingMs(totalMs)
    accumulatedElapsedRef.current = 0
    setIsRunning(false)
    setIsCompleted(false)
  }

  // Handle Preset Click
  const handlePreset = (mins: number) => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    setHoursInput(h)
    setMinutesInput(m)
    setSecondsInput(0)
    updateDurationFromInputs(h, m, 0)
  }

  // Timestamp-based drift-free tick loop
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
      const totalElapsed = accumulatedElapsedRef.current + currentSessionElapsed

      const remaining = Math.max(0, totalDurationMs - totalElapsed)
      setRemainingMs(remaining)

      if (remaining <= 0) {
        setIsRunning(false)
        setIsCompleted(true)
        playChimeSound()
        accumulatedElapsedRef.current = totalDurationMs
        return
      }

      animFrameRef.current = requestAnimationFrame(tick)
    }

    animFrameRef.current = requestAnimationFrame(tick)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isRunning, totalDurationMs])

  const handleStart = () => {
    if (remainingMs <= 0) return
    setIsCompleted(false)
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
    setIsCompleted(false)
    startTimeRef.current = null
    accumulatedElapsedRef.current = 0
    setRemainingMs(totalDurationMs)
  }

  const formatted = formatTimeComponents(remainingMs)
  const progressPct = totalDurationMs > 0 ? Math.min(100, Math.max(0, ((totalDurationMs - remainingMs) / totalDurationMs) * 100)) : 0

  const presets = [
    { label: "1 min", mins: 1 },
    { label: "5 min", mins: 5 },
    { label: "10 min", mins: 10 },
    { label: "15 min", mins: 15 },
    { label: "25 min Pomodoro", mins: 25 },
    { label: "30 min", mins: 30 },
    { label: "1 hour", mins: 60 },
  ]

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Timer Display Hero Card */}
      <Card className={`transition-all ${isCompleted ? "border-emerald-500 bg-emerald-500/10 shadow-lg" : "bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20"}`}>
        <CardContent className="p-8 flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <TimerIcon className="h-4 w-4 text-primary" /> {isCompleted ? "Timer Complete!" : isRunning ? "Countdown Running" : "Countdown Timer"}
          </div>

          <div className="text-6xl sm:text-8xl font-extrabold font-mono tracking-tight text-primary select-none py-2">
            {formatted.formatted}
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md bg-muted h-3 rounded-full overflow-hidden border shadow-inner">
            <div
              className={`h-full transition-all duration-300 ${isCompleted ? "bg-emerald-500" : "bg-primary"}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 justify-center pt-2">
            {!isRunning ? (
              <Button onClick={handleStart} disabled={remainingMs <= 0} size="lg" className="px-8 font-bold">
                <Play className="h-5 w-5 mr-2" /> Start
              </Button>
            ) : (
              <Button onClick={handlePause} variant="outline" size="lg" className="px-8 font-bold">
                <Pause className="h-5 w-5 mr-2" /> Pause
              </Button>
            )}

            <Button onClick={handleReset} variant="outline" size="lg">
              <RotateCcw className="h-4 w-4 mr-2" /> Reset
            </Button>

            <Button onClick={playChimeSound} variant="ghost" size="lg" title="Test Chime Sound">
              <Bell className="h-4 w-4 mr-1 text-muted-foreground" /> Test Alarm
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preset Quick Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Quick Timer Presets
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <Button key={p.mins} onClick={() => handlePreset(p.mins)} variant="outline" size="sm">
              {p.label}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Custom Duration Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Custom Duration Setup</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Hours</Label>
            <Input
              type="number"
              min="0"
              max="23"
              value={hoursInput}
              disabled={isRunning}
              onChange={(e) => {
                const val = Math.max(0, parseInt(e.target.value) || 0)
                setHoursInput(val)
                updateDurationFromInputs(val, minutesInput, secondsInput)
              }}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label>Minutes</Label>
            <Input
              type="number"
              min="0"
              max="59"
              value={minutesInput}
              disabled={isRunning}
              onChange={(e) => {
                const val = Math.max(0, parseInt(e.target.value) || 0)
                setMinutesInput(val)
                updateDurationFromInputs(hoursInput, val, secondsInput)
              }}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label>Seconds</Label>
            <Input
              type="number"
              min="0"
              max="59"
              value={secondsInput}
              disabled={isRunning}
              onChange={(e) => {
                const val = Math.max(0, parseInt(e.target.value) || 0)
                setSecondsInput(val)
                updateDurationFromInputs(hoursInput, minutesInput, val)
              }}
              className="font-mono"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
