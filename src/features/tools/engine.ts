import type { EngineFamily } from "@/data/types"

export type { EngineFamily } from "@/data/types"

export interface EngineMeta {
  bytesIn: number
  bytesOut: number
  durationMs: number
  warnings?: string[]
  [key: string]: unknown
}

export interface EngineError {
  code: string
  message: string
}

export interface EngineResult<T> {
  success: boolean
  data: T
  meta: EngineMeta
  error?: EngineError
}

export interface FileJob<T> {
  result: Promise<EngineResult<T>>
  onProgress: (fn: (p: number) => void) => void
  cancel: () => void
}

// ---- Per-family engine contracts ----

export type CalculatorEngine<I extends object = object, O = unknown> = (
  input: I,
) => O

export type TextEngine<I = object, O = unknown> = (
  input: I,
) => EngineResult<O>

export type FileEngine<I = unknown, T = unknown> = (input: I) => FileJob<T>

/** Standard wrapper every tool engine implements. */
export interface ToolEngine<I, O> {
  family: EngineFamily
  run: (input: I) => O | EngineResult<O> | FileJob<O>
}

/** Builds a conforming EngineResult for pure/text engines. */
export function ok<T>(data: T, meta: Partial<EngineMeta> = {}): EngineResult<T> {
  return { success: true, data, meta: { bytesIn: 0, bytesOut: 0, durationMs: 0, ...meta } }
}

export function fail<T>(
  code: string,
  message: string,
  meta: Partial<EngineMeta> = {},
): EngineResult<T> {
  return {
    success: false,
    data: undefined as unknown as T,
    meta: { bytesIn: 0, bytesOut: 0, durationMs: 0, ...meta },
    error: { code, message },
  }
}

/** Instrument an engine run: measures duration, records input/output sizes. */
export async function run<O>(
  runner: () => Promise<O>,
  inputBytes = 0,
): Promise<EngineResult<O>> {
  const start = performance.now()
  try {
    const data = await runner()
    const durationMs = performance.now() - start
    const bytesOut = blobSize(data)
    return { success: true, data, meta: { bytesIn: inputBytes, bytesOut, durationMs } }
  } catch (err) {
    const durationMs = performance.now() - start
    return {
      success: false,
      data: undefined as unknown as O,
      meta: { bytesIn: inputBytes, bytesOut: 0, durationMs },
      error: { code: "engine_error", message: messageOf(err) },
    }
  }
}

function blobSize(value: unknown): number {
  if (value instanceof Blob) return value.size
  if (value instanceof File) return value.size
  if (value instanceof ArrayBuffer) return value.byteLength
  return 0
}

function messageOf(err: unknown): string {
  if (err instanceof Error) return err.message
  return String(err)
}

/** Convert bytes/Blob/File to an ArrayBuffer for engine input. */
export function toArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return blob.arrayBuffer()
}