import type { CalculatorEngine } from "@/features/tools/engine"

export interface TimerStateInput {
  totalDurationMs: number
  elapsedMs: number
}

export interface FormattedTime {
  hours: number
  minutes: number
  seconds: number
  formatted: string // HH:MM:SS or MM:SS
}

export function calculateRemainingMs(totalDurationMs: number, elapsedMs: number): number {
  return Math.max(0, totalDurationMs - elapsedMs)
}

export function formatTimeComponents(ms: number): FormattedTime {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const hh = String(hours).padStart(2, "0")
  const mm = String(minutes).padStart(2, "0")
  const ss = String(seconds).padStart(2, "0")

  const formatted = hours > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`

  return { hours, minutes, seconds, formatted }
}

/** Synthesize a pleasant dual-tone chime using Web Audio API (100% offline, zero assets) */
export function playChimeSound(): void {
  if (typeof window === "undefined") return
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return

    const ctx = new AudioCtx()
    const now = ctx.currentTime

    // Tone 1: 523.25 Hz (C5)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = "sine"
    osc1.frequency.setValueAtTime(523.25, now)
    gain1.gain.setValueAtTime(0.3, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)

    // Tone 2: 659.25 Hz (E5)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = "sine"
    osc2.frequency.setValueAtTime(659.25, now + 0.15)
    gain2.gain.setValueAtTime(0.3, now + 0.15)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.0)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)

    osc1.start(now)
    osc1.stop(now + 0.8)
    osc2.start(now + 0.15)
    osc2.stop(now + 1.0)
  } catch {
    // Ignore audio context errors if blocked by browser policy
  }
}

export const timerEngine: CalculatorEngine<TimerStateInput, FormattedTime> = (input) => {
  const rem = calculateRemainingMs(input.totalDurationMs, input.elapsedMs)
  return formatTimeComponents(rem)
}

export default { family: "calculator" as const, run: timerEngine }
