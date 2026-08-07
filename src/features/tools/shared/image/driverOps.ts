/**
 * Low-level canvas helpers used by driver.ts. These operate on raw canvas /
 * CanvasImageSource and are the only actual DOM-manipulation code in the
 * shared engine (kept apart from pure geometry in geometry.ts).
 *
 * PURE LOGIC (math) lives in geometry.ts; this file only applies the math to
 * real canvas elements.
 */

import type { Rotation } from "./geometry"

/** Draw an HTMLImageElement/ImageBitmap and return as a resized canvas. */
export function imageElementToCanvas(
  source: CanvasImageSource,
  targetWidth: number,
  targetHeight: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = targetWidth
  canvas.height = targetHeight
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Could not acquire 2D context.")
  // white fill so transparent PNG converted to JPEG gets a proper background
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, targetWidth, targetHeight)
  ctx.drawImage(source, 0, 0, targetWidth, targetHeight)
  return canvas
}

/** Resize a source to (width,height) preserving nothing but the box (cover/squeeze by caller). */
export function resizeCanvas(
  source: CanvasImageSource,
  _srcWidth: number,
  _srcHeight: number,
  targetWidth: number,
  targetHeight: number,
): HTMLCanvasElement {
  return imageElementToCanvas(source, targetWidth, targetHeight)
}

export interface CropSpec {
  sx: number
  sy: number
  sWidth: number
  sHeight: number
}

export function cropCanvas(
  source: CanvasImageSource,
  _srcWidth: number,
  _srcHeight: number,
  crop: CropSpec,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(crop.sWidth)
  canvas.height = Math.round(crop.sHeight)
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Could not acquire 2D context.")
  ctx.drawImage(
    source,
    crop.sx,
    crop.sy,
    crop.sWidth,
    crop.sHeight,
    0,
    0,
    crop.sWidth,
    crop.sHeight,
  )
  return canvas
}

export function rotateCanvas(
  source: CanvasImageSource,
  width: number,
  height: number,
  rotation: Rotation,
): HTMLCanvasElement {
  const swaps = rotation === 90 || rotation === 270
  const outW = swaps ? height : width
  const outH = swaps ? width : height
  const canvas = document.createElement("canvas")
  canvas.width = outW
  canvas.height = outH
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Could not acquire 2D context.")
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, outW, outH)
  ctx.save()
  ctx.translate(outW / 2, outH / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.drawImage(source, -width / 2, -height / 2, width, height)
  ctx.restore()
  return canvas
}

/** Approximate sample brightness (0..1) of a canvas (used as an informational background hint). */
export function sampleBackgroundBrightness(canvas: HTMLCanvasElement): number {
  try {
    const ctx = canvas.getContext("2d")
    if (!ctx) return 0.9
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const px = data.data
    let sum = 0
    let count = 0
    const stride = Math.max(1, Math.floor(px.length / 4000))
    for (let i = 0; i < px.length; i += stride * 4) {
      sum += px[i] * 0.2126 + px[i + 1] * 0.7152 + px[i + 2] * 0.0722
      count++
    }
    return count ? sum / count / 255 : 0.9
  } catch {
    return 0.9
  }
}