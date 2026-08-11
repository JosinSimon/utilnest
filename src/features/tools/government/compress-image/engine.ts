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
      let outWidth = width
      let outHeight = height
      let compressInput = handle.asCompressInput(outWidth, outHeight)
      if (cancelled) throw new Error("cancelled")
      let outcome = await compressToTarget(compressInput, target)
      let attempts = 0
      while (target.allowDownscale && outcome.status === "cannotHitTarget" && attempts < 12) {
        const ratio = Math.sqrt((target.kbMax * 1024) / Math.max(1, outcome.bytes)) * 0.92
        const nextWidth = Math.max(target.minDimensionGuard, Math.floor(outWidth * Math.min(0.9, ratio)))
        const nextHeight = Math.max(target.minDimensionGuard, Math.floor(outHeight * Math.min(0.9, ratio)))
        if (nextWidth >= outWidth && nextHeight >= outHeight) break
        outWidth = nextWidth
        outHeight = nextHeight
        compressInput = handle.asCompressInput(outWidth, outHeight)
        outcome = await compressToTarget(compressInput, { ...target, width: outWidth, height: outHeight })
        attempts += 1
      }
      onProgress(1)
      const blob = outcome.blob
      const base = input.file.name.replace(/\.[^/.]+$/, "")
      const name = `${base}-${outcome.width}x${outcome.height}.${outcome.format === "png" ? "png" : "jpg"}`
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