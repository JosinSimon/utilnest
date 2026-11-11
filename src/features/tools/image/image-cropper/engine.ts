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
// ---- Crop box geometry (normalised 0..1 coordinates) ----

export type Corner = "nw" | "ne" | "sw" | "se"

/**
 * A pixel aspect ratio (e.g. 16/9) expressed in normalised box units for an
 * image of the given size: w/h in 0..1 space that gives `ratio` in pixels.
 */
export function normalisedAspect(ratio: number, imageWidth: number, imageHeight: number): number {
  return (ratio * imageHeight) / imageWidth
}

/** Largest box with a true pixel `ratio`, centred near the previous box. */
export function fitAspectBox(ratio: number, imageWidth: number, imageHeight: number, prev: CropRect): CropRect {
  const a = normalisedAspect(ratio, imageWidth, imageHeight)
  const w = a >= 1 ? 1 : a
  const h = a >= 1 ? 1 / a : 1
  const cx = Math.min(Math.max(prev.x + prev.width / 2, w / 2), 1 - w / 2)
  const cy = Math.min(Math.max(prev.y + prev.height / 2, h / 2), 1 - h / 2)
  return { x: cx - w / 2, y: cy - h / 2, width: w, height: h }
}

/**
 * Resizes a box by dragging one corner to (fx, fy); the opposite corner stays
 * fixed. With `aspect` (normalised units) the box keeps its shape.
 */
export function resizeFromCorner(
  rect: CropRect,
  corner: Corner,
  fx: number,
  fy: number,
  minSize: number,
  aspect: number | null,
): CropRect {
  const east = corner === "ne" || corner === "se"
  const south = corner === "sw" || corner === "se"
  const ax = east ? rect.x : rect.x + rect.width
  const ay = south ? rect.y : rect.y + rect.height
  const maxW = east ? 1 - ax : ax
  const maxH = south ? 1 - ay : ay
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

  let w = clamp(east ? fx - ax : ax - fx, minSize, maxW)
  let h = clamp(south ? fy - ay : ay - fy, minSize, maxH)
  if (aspect) {
    // Follow whichever direction the pointer moved further, then fit the bounds.
    w = Math.max(w, h * aspect)
    h = w / aspect
    if (w > maxW) {
      w = maxW
      h = w / aspect
    }
    if (h > maxH) {
      h = maxH
      w = h * aspect
    }
  }
  return { x: east ? ax : ax - w, y: south ? ay : ay - h, width: w, height: h }
}
