import type { FileJob } from "@/features/tools/engine"
import { decodeImage, makeRenderHandle, compressToTarget } from "@/features/tools/shared/image"
import type { TargetKbOptions } from "@/features/tools/shared/image"
import { toArrayBuffer } from "@/features/tools/engine"

export interface CompressToolInput {
  file: File
  target: TargetKbOptions
}

export interface CompressToolOutput {
  blob: Blob
  fileName: string
  width: number
  height: number
  bytes: number
  quality: number
  format: string
  message: string
  status: string
}

export function runCompress(input: CompressToolInput): FileJob<CompressToolOutput> {
  let cancelled = false
  let onProgress: (p: number) => void = () => {}
  const promise = (async () => {
    try {
      onProgress(0.05)
      const bytesIn = input.file.size
      const decoded = await decodeImage(input.file)
      onProgress(0.2)
      const { target } = input
      const width = target.width ?? decoded.sourceWidth
      const height = target.height ?? decoded.sourceHeight
      const handle = makeRenderHandle(decoded, width, height)
      const compressInput = handle.asCompressInput(width, height)
      if (cancelled) throw new Error("cancelled")
      const outcome = await compressToTarget(compressInput, target)
      onProgress(1)
      const blob = outcome.blob
      const base = input.file.name.replace(/\.[^/.]+$/, "")
      const name = `${base}-${width}x${height}.${outcome.format === "png" ? "png" : "jpg"}`
      return {
        success: true,
        data: {
          blob,
          fileName: name,
          width: outcome.width,
          height: outcome.height,
          bytes: outcome.bytes,
          quality: outcome.quality,
          format: outcome.format,
          message: outcome.message,
          status: outcome.status,
        },
        meta: { bytesIn, bytesOut: blob.size, durationMs: 0 },
      }
    } catch (err) {
      return {
        success: false,
        data: undefined as unknown as CompressToolOutput,
        meta: { bytesIn: 0, bytesOut: 0, durationMs: 0 },
        error: { code: "compress_error", message: (err as Error).message },
      }
    }
  })()
  return {
    result: promise,
    onProgress: (fn) => {
      onProgress = fn
    },
    cancel: () => {
      cancelled = true
    },
  }
}

export { toArrayBuffer }