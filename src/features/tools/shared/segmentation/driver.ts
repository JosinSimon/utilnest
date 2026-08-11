import type { RgbaBuffer, Size } from "./types"
import { decodeImage, canvasToBlob } from "@/features/tools/shared/image"

/**
 * Browser transport for the segmentation engine. Everything here touches real
 * canvas/ImageBitmap; the pure segmentation modules stay node-testable. Mirror
 * the shared/image driver conventions (impure layer kept behind `decodeImage`)
 * so tools only talk to this file's functions.
 */

export interface LoadedImageRgba {
  rgba: RgbaBuffer
  size: Size
  /** Original intrinsic dimensions (before any downscale for AI). */
  sourceSize: Size
}

/**
 * Decode a File/Blob and return its RGBA pixels. Optionally downscale to a
 * maximum edge length so huge photos don't blow up memory before AI runs.
 */
export async function loadImageRgba(
  source: File | Blob,
  maxWidth = 4096,
): Promise<LoadedImageRgba> {
  const decoded = await decodeImage(source)
  const { sourceWidth, sourceHeight } = decoded

  let targetWidth = sourceWidth
  let targetHeight = sourceHeight
  if (Math.max(sourceWidth, sourceHeight) > maxWidth) {
    const scale = maxWidth / Math.max(sourceWidth, sourceHeight)
    targetWidth = Math.max(1, Math.round(sourceWidth * scale))
    targetHeight = Math.max(1, Math.round(sourceHeight * scale))
  }

  const canvas = document.createElement("canvas")
  canvas.width = targetWidth
  canvas.height = targetHeight
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Could not acquire a 2D canvas context.")
  ctx.drawImage(decoded.bitmapCarrier as CanvasImageSource, 0, 0, targetWidth, targetHeight)
  const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight)

  return {
    rgba: imageData.data,
    size: { width: targetWidth, height: targetHeight },
    sourceSize: { width: sourceWidth, height: sourceHeight },
  }
}

export type OutputFormat = "png" | "jpeg"

/** Encode an RGBA buffer to a downloadable Blob. */
export async function rgbaToBlob(
  rgba: RgbaBuffer,
  size: Size,
  format: OutputFormat,
  quality = 0.92,
): Promise<Blob> {
  const canvas = document.createElement("canvas")
  canvas.width = size.width
  canvas.height = size.height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Could not acquire a 2D canvas context.")
  const buf = ctx.createImageData(size.width, size.height)
  buf.data.set(rgba)
  ctx.putImageData(buf, 0, 0)
  const type = format === "png" ? "image/png" : "image/jpeg"
  if (format === "jpeg") {
    const flattened = document.createElement("canvas")
    flattened.width = size.width
    flattened.height = size.height
    const flatCtx = flattened.getContext("2d")
    if (!flatCtx) throw new Error("Could not acquire a 2D canvas context.")
    flatCtx.fillStyle = "#ffffff"
    flatCtx.fillRect(0, 0, size.width, size.height)
    flatCtx.drawImage(canvas, 0, 0)
    return canvasToBlob(flattened, type, quality)
  }
  return canvasToBlob(canvas, type)
}

/** Encode the result in a file-friendly name. */
export function backgroundRemovedFileName(original: File, format: OutputFormat): string {
  const base = original.name.replace(/\.[^/.]+$/, "")
  return `${base}-nobg.${format === "png" ? "png" : "jpg"}`
}