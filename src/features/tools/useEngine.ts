import { useCallback, useRef, useState } from "react"
import type {
  EngineError,
  EngineFamily,
  EngineResult,
  FileJob,
} from "./engine"
import { track } from "@/features/analytics/events"
interface UseEngineState<T> {
  result: EngineResult<T> | null
  progress: number
  isRunning: boolean
  error: EngineError | null
}

interface UseEngineOptions {
  eventName?: string
}

/** Shared async runner for text and file engines with progress + cancel. */
export function useEngine<T>(
  family: Exclude<EngineFamily, "calculator">,
  toolId: string,
  options: UseEngineOptions = {},
) {
  const [state, setState] = useState<UseEngineState<T>>({
    result: null,
    progress: 0,
    isRunning: false,
    error: null,
  })
  const onProgressRef = useRef<(p: number) => void>(() => {})
  const cancelRef = useRef<(() => void) | null>(null)

  const reset = useCallback(() => {
    cancelRef.current?.()
    setState({ result: null, progress: 0, isRunning: false, error: null })
  }, [])

  const run = useCallback(
    async (runFn: (emitProgress: (p: number) => void) => FileJob<T>) => {
      const job = runFn((p: number) => {
        onProgressRef.current?.(p)
        setState((s) => ({ ...s, progress: p }))
      })
      cancelRef.current = job.cancel
      setState((s) => ({ ...s, isRunning: true, progress: 0, error: null, result: null }))
      track({
        name: options.eventName ?? "tool_used",
        props: { toolId, family },
      })

      try {
        const result = await job.result
        if (!result.success) {
          setState((s) => ({
            ...s,
            isRunning: false,
            progress: 1,
            result,
            error: result.error ?? null,
          }))
          return result
        }
        setState((s) => ({
          ...s,
          isRunning: false,
          progress: 1,
          result,
          error: null,
        }))
        track({
          name: options.eventName ?? "tool_used",
          props: {
            toolId,
            family,
            status: "success",
            durationMs: result.meta.durationMs,
          },
        })
        return result
      } catch (err) {
        const error: EngineError = {
          code: "engine_error",
          message: err instanceof Error ? err.message : String(err),
        }
        setState((s) => ({ ...s, isRunning: false, error }))
        return { success: false, data: null as unknown as T, meta: { bytesIn: 0, bytesOut: 0, durationMs: 0 }, error }
      } finally {
        cancelRef.current = null
      }
    },
    [options.eventName, toolId, family],
  )

  return { ...state, run, reset }
}