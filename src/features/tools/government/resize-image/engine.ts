import type { FileJob } from "@/features/tools/engine"
import { decodeImage, makeRenderHandle, canvasToBlob } from "@/features/tools/shared/image"
import { toArrayBuffer } from "@/features/tools/engine"

export interface ResizeToolInput {
  file: File
  width: number
  height: number
  format: "jpeg" | "png"
}

export interface ResizeToolOutput {
  blob: Blob
  fileName: string
  width: number
  height: number
  bytes: number
  format: string
}

export function runResize(input: ResizeToolInput): FileJob<ResizeToolOutput> {
  let cancelled = false
  let onProgress: (p: number) => void = () => {}
  const promise = (async () => {
    try {
      onProgress(0.1)
      const bytesIn = input.file.size
      const decoded = await decodeImage(input.file)
      if (cancelled) throw new Error("cancelled")
      const handle = makeRenderHandle(decoded, input.width, input.height)
      const blob = await (input.format === "png"
        ? handle.encodePng()
        : handle.encodeJpeg(0.92))
      onProgress(1)
      if (cancelled) throw new Error("cancelled")
      const base = input.file.name.replace(/\.[^/.]+$/, "")
      return {
        success: true,
        data: {
          blob,
          fileName: `${base}.${input.width}x${input.height}.${input.format === "png" ? "png" : "jpg"}`,
          width: input.width,
          height: input.height,
          bytes: blob.size,
          format: input.format,
        },
        meta: { bytesIn, bytesOut: blob.size, durationMs: 0 },
      }
    } catch (err) {
      return {
        success: false,
        data: undefined as unknown as ResizeToolOutput,
        meta: { bytesIn: 0, bytesOut: 0, durationMs: 0 },
        error: { code: "resize_error", message: (err as Error).message },
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

export { toArrayBuffer, canvasToBlob }