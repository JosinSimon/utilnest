import type { FileJob } from "@/features/tools/engine"
import { decodeImage, canvasToBlob } from "@/features/tools/shared/image"
import { toArrayBuffer } from "@/features/tools/engine"

export type CropFormat = "jpeg" | "png"

export interface CropRect {
  /** Normalized 0..1 coordinates within the source image. */
  x: number
  y: number
  width: number
  height: number
}

export interface ImageCropInput {
  file: File
  crop: CropRect
  /** Output dimensions; defaults to the crop's source-pixel size when absent. */
  outputWidth?: number
  outputHeight?: number
  format: CropFormat
  quality?: number
}

export interface ImageCropOutput {
  blob: Blob
  fileName: string
  width: number
  height: number
  bytes: number
  format: CropFormat
}

/** Convert a normalized crop into exact source pixels, clamped to the image. */
export function toSourceRect(
  crop: CropRect,
  sourceWidth: number,
  sourceHeight: number,
): { sx: number; sy: number; sWidth: number; sHeight: number } {
  const width = Math.max(1, sourceWidth)
  const height = Math.max(1, sourceHeight)
  const rawW = Math.max(1, Math.round(Math.abs(crop.width) * width))
  const rawH = Math.max(1, Math.round(Math.abs(crop.height) * height))
  const sWidth = Math.min(width, rawW)
  const sHeight = Math.min(height, rawH)
  const sx = Math.min(Math.max(0, Math.round(crop.x * width)), width - sWidth)
  const sy = Math.min(Math.max(0, Math.round(crop.y * height)), height - sHeight)
  return { sx, sy, sWidth, sHeight }
}

export function runImageCrop(input: ImageCropInput): FileJob<ImageCropOutput> {
  let cancelled = false
  let onProgress: (p: number) => void = () => {}
  const promise = (async () => {
    try {
      onProgress(0.1)
      const bytesIn = input.file.size
      const decoded = await decodeImage(input.file)
      if (cancelled) throw new Error("cancelled")
      const src = toSourceRect(input.crop, decoded.sourceWidth, decoded.sourceHeight)
      const source = decoded.bitmapCarrier as CanvasImageSource
      const outW = input.outputWidth && input.outputWidth > 0 ? Math.round(input.outputWidth) : src.sWidth
      const outH = input.outputHeight && input.outputHeight > 0 ? Math.round(input.outputHeight) : src.sHeight
      const canvas = document.createElement("canvas")
      canvas.width = outW
      canvas.height = outH
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Could not acquire 2D context.")
      ctx.drawImage(source, src.sx, src.sy, src.sWidth, src.sHeight, 0, 0, outW, outH)
      const mime = input.format === "png" ? "image/png" : "image/jpeg"
      const blob = await canvasToBlob(canvas, mime, input.quality ?? 0.92)
      onProgress(1)
      if (cancelled) throw new Error("cancelled")
      const base = input.file.name.replace(/\.[^/.]+$/, "")
      const ext = input.format === "png" ? "png" : "jpg"
      return {
        success: true,
        data: {
          blob,
          fileName: `${base}-crop.${outW}x${outH}.${ext}`,
          width: outW,
          height: outH,
          bytes: blob.size,
          format: input.format,
        },
        meta: { bytesIn, bytesOut: blob.size, durationMs: 0 },
      }
    } catch (err) {
      return {
        success: false,
        data: undefined as unknown as ImageCropOutput,
        meta: { bytesIn: 0, bytesOut: 0, durationMs: 0 },
        error: { code: "crop_error", message: (err as Error).message },
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