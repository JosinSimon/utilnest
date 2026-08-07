import type { FileJob } from "@/features/tools/engine"
import { decodeImage, makeRenderHandle, compressToTarget } from "@/features/tools/shared/image"
import type { TargetKbOptions } from "@/features/tools/shared/image"
import { toArrayBuffer } from "@/features/tools/engine"

export interface ImageCompressInput {
  file: File
  kbMax: number
  /** Optional target dimensions; blank preserves original size. */
  width?: number
  height?: number
}

export interface ImageCompressOutput {
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

/** Compress to "under kbMax KB" using the shared binary-search compressor. */
export function runImageCompress(input: ImageCompressInput): FileJob<ImageCompressOutput> {
  let cancelled = false
  let onProgress: (p: number) => void = () => {}
  const promise = (async () => {
    try {
      onProgress(0.05)
      const bytesIn = input.file.size
      const decoded = await decodeImage(input.file)
      onProgress(0.2)
      const width = input.width ?? decoded.sourceWidth
      const height = input.height ?? decoded.sourceHeight
      const handle = makeRenderHandle(decoded, width, height)
      const compressInput = handle.asCompressInput(width, height)
      if (cancelled) throw new Error("cancelled")
      const target: TargetKbOptions = {
        mode: "range",
        kbMin: 0,
        kbMax: input.kbMax,
        width,
        height,
        allowedFormats: ["jpeg"],
        allowDownscale: false,
        minDimensionGuard: 1,
      }
      const outcome = await compressToTarget(compressInput, target)
      onProgress(1)
      if (cancelled) throw new Error("cancelled")
      const base = input.file.name.replace(/\.[^/.]+$/, "")
      return {
        success: true,
        data: {
          blob: outcome.blob,
          fileName: `${base}-${input.kbMax}kb.${outcome.format === "png" ? "png" : "jpg"}`,
          width: outcome.width,
          height: outcome.height,
          bytes: outcome.bytes,
          quality: outcome.quality,
          format: outcome.format,
          message: outcome.message,
          status: outcome.status,
        },
        meta: { bytesIn, bytesOut: outcome.blob.size, durationMs: 0 },
      }
    } catch (err) {
      return {
        success: false,
        data: undefined as unknown as ImageCompressOutput,
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