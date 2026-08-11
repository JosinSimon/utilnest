import type { FileJob } from "@/features/tools/engine"
import { decodeImage, makeRenderHandle } from "@/features/tools/shared/image"
import { toArrayBuffer } from "@/features/tools/engine"

export interface ImageResizeInput {
  file: File
  /** Target width in px. Leave undefined to auto-derive from height (aspect preserved). */
  width?: number
  /** Target height in px. Leave undefined to auto-derive from width (aspect preserved). */
  height?: number
  format: "jpeg" | "png"
}

export interface ImageResizeOutput {
  blob: Blob
  fileName: string
  width: number
  height: number
  sourceWidth: number
  sourceHeight: number
  bytes: number
  format: string
}

/** Resize preserving aspect ratio when only one dimension is provided. */
export function resolveDimensions(
  sourceWidth: number,
  sourceHeight: number,
  target?: { width?: number; height?: number },
): { width: number; height: number } {
  const normalize = (v: number | undefined): number | undefined =>
    v === undefined || !Number.isFinite(v) ? undefined : Math.max(1, Math.round(v))
  const w = normalize(target?.width)
  const h = normalize(target?.height)
  if (w !== undefined && h !== undefined) return { width: w, height: h }
  if (w !== undefined) return { width: w, height: Math.max(1, Math.round(w * (sourceHeight / sourceWidth))) }
  if (h !== undefined) return { width: Math.max(1, Math.round(h * (sourceWidth / sourceHeight))), height: h }
  return { width: sourceWidth, height: sourceHeight }
}

export function runImageResize(input: ImageResizeInput): FileJob<ImageResizeOutput> {
  let cancelled = false
  let onProgress: (p: number) => void = () => {}
  const promise = (async () => {
    try {
      onProgress(0.1)
      const bytesIn = input.file.size
      const decoded = await decodeImage(input.file)
      if (cancelled) throw new Error("cancelled")
      const dims = resolveDimensions(decoded.sourceWidth, decoded.sourceHeight, {
        width: input.width,
        height: input.height,
      })
      const handle = makeRenderHandle(decoded, dims.width, dims.height)
      const blob = await (input.format === "png" ? handle.encodePng() : handle.encodeJpeg(0.92))
      onProgress(1)
      if (cancelled) throw new Error("cancelled")
      const base = input.file.name.replace(/\.[^/.]+$/, "")
      const ext = input.format === "png" ? "png" : "jpg"
      return {
        success: true,
        data: {
          blob,
          fileName: `${base}.${dims.width}x${dims.height}.${ext}`,
          width: dims.width,
          height: dims.height,
          sourceWidth: decoded.sourceWidth,
          sourceHeight: decoded.sourceHeight,
          bytes: blob.size,
          format: input.format,
        },
        meta: { bytesIn, bytesOut: blob.size, durationMs: 0 },
      }
    } catch (err) {
      return {
        success: false,
        data: undefined as unknown as ImageResizeOutput,
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

export { toArrayBuffer }
