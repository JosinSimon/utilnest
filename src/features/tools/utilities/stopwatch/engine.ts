import type { CalculatorEngine } from "@/features/tools/engine"

export interface StopwatchStateInput {
  elapsedMs: number
}

export interface FormattedStopwatchTime {
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
  formatted: string // HH:MM:SS.cs or MM:SS.cs
  fullFormatted: string // HH:MM:SS.cs
}

export interface LapRecord {
  lapIndex: number
  splitTimeMs: number
  lapTimeMs: number
  formattedSplit: string
  formattedLap: string
}

export function formatStopwatchMs(ms: number): FormattedStopwatchTime {
  const totalMs = Math.max(0, Math.floor(ms))
  const hours = Math.floor(totalMs / 3600000)
  const minutes = Math.floor((totalMs % 3600000) / 60000)
  const seconds = Math.floor((totalMs % 60000) / 1000)
  const cs = Math.floor((totalMs % 1000) / 10) // Centiseconds (00-99)

  const hh = String(hours).padStart(2, "0")
  const mm = String(minutes).padStart(2, "0")
  const ss = String(seconds).padStart(2, "0")
  const ccs = String(cs).padStart(2, "0")

  const fullFormatted = `${hh}:${mm}:${ss}.${ccs}`
  const formatted = hours > 0 ? `${hh}:${mm}:${ss}.${ccs}` : `${mm}:${ss}.${ccs}`

  return { hours, minutes, seconds, milliseconds: cs, formatted, fullFormatted }
}

export function computeLapRecords(lapsMs: number[]): LapRecord[] {
  return lapsMs.map((splitMs, idx) => {
    const prevSplitMs = idx > 0 ? lapsMs[idx - 1] : 0
    const lapMs = splitMs - prevSplitMs

    return {
      lapIndex: idx + 1,
      splitTimeMs: splitMs,
      lapTimeMs: lapMs,
      formattedSplit: formatStopwatchMs(splitMs).fullFormatted,
      formattedLap: formatStopwatchMs(lapMs).fullFormatted,
    }
  })
}

export const stopwatchEngine: CalculatorEngine<StopwatchStateInput, FormattedStopwatchTime> = (
  input,
) => {
  return formatStopwatchMs(input.elapsedMs)
}

export default { family: "calculator" as const, run: stopwatchEngine }
