import type { FileJob } from "@/features/tools/engine"
import { decodeImage, canvasToBlob } from "@/features/tools/shared/image"
import { toArrayBuffer } from "@/features/tools/engine"

export type WatermarkFormat = "jpeg" | "png"
export type WatermarkPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center"

export interface WatermarkInput {
  file: File
  text?: string
  logo?: File
  position: WatermarkPosition
  opacity: number // 0..1
  /** Scale of the watermark relative to the smaller image dimension (text) or width (logo). */
  size: number
  format: WatermarkFormat
}

export interface WatermarkOutput {
  blob: Blob
  fileName: string
  width: number
  height: number
  bytes: number
  format: WatermarkFormat
}

export const POSITIONS: WatermarkPosition[] = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
  "center",
]

export function computeTextPosition(
  imgW: number,
  imgH: number,
  textW: number,
  textH: number,
  position: WatermarkPosition,
  margin: number,
): { x: number; y: number } {
  const m = margin
  switch (position) {
    case "top-left":
      return { x: m, y: m }
    case "top-right":
      return { x: imgW - textW - m, y: m }
    case "bottom-left":
      return { x: m, y: imgH - textH - m }
    case "bottom-right":
      return { x: imgW - textW - m, y: imgH - textH - m }
    case "center":
      return { x: (imgW - textW) / 2, y: (imgH - textH) / 2 }
  }
}

export interface Box {
  width: number
  height: number
}

export interface WatermarkLayout {
  logo?: { x: number; y: number }
  text?: { x: number; y: number }
}

/**
 * Places the logo and text as one block (logo on top, text below) in the
 * chosen corner, so using both never makes them overlap. Inside the block,
 * items line up with the image edge they sit next to (left, right or centre).
 */
export function layoutWatermark(
  imgW: number,
  imgH: number,
  logo: Box | null,
  text: Box | null,
  position: WatermarkPosition,
  margin: number,
): WatermarkLayout {
  const gap = logo && text ? Math.round(text.height * 0.25) : 0
  const blockW = Math.max(logo?.width ?? 0, text?.width ?? 0)
  const blockH = (logo?.height ?? 0) + gap + (text?.height ?? 0)
  const block = computeTextPosition(imgW, imgH, blockW, blockH, position, margin)
  const alignX = (w: number): number => {
    if (position.endsWith("left")) return block.x
    if (position.endsWith("right")) return block.x + blockW - w
    return block.x + (blockW - w) / 2
  }
  const out: WatermarkLayout = {}
  if (logo) out.logo = { x: alignX(logo.width), y: block.y }
  if (text) out.text = { x: alignX(text.width), y: block.y + (logo ? logo.height + gap : 0) }
  return out
}

/** Loads a logo (PNG, JPG, WebP or SVG) into something the canvas can draw. */
async function loadLogo(file: File): Promise<{ source: CanvasImageSource; width: number; height: number; release: () => void }> {
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    // SVGs without width/height attributes can report 0; fall back to a square.
    const width = img.naturalWidth || 512
    const height = img.naturalHeight || 512
    return { source: img, width, height, release: () => URL.revokeObjectURL(url) }
  } catch {
    URL.revokeObjectURL(url)
    throw new Error("Could not read the logo image. Try a PNG, JPG or SVG file.")
  }
}

export function runWatermark(input: WatermarkInput): FileJob<WatermarkOutput> {
  let cancelled = false
  let onProgress: (p: number) => void = () => {}
  const promise = (async () => {
    try {
      if (!input.text?.trim() && !input.logo) {
        throw new Error("Add some watermark text or upload a logo image first.")
      }
      onProgress(0.1)
      const bytesIn = input.file.size
      const decoded = await decodeImage(input.file)
      if (cancelled) throw new Error("cancelled")
      const canvas = document.createElement("canvas")
      canvas.width = decoded.sourceWidth
      canvas.height = decoded.sourceHeight
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Could not acquire 2D context.")
      ctx.drawImage(
        decoded.bitmapCarrier as CanvasImageSource,
        0,
        0,
        decoded.sourceWidth,
        decoded.sourceHeight,
      )

      const base = input.file.name.replace(/\.[^/.]+$/, "")
      const margin = Math.round(Math.min(decoded.sourceWidth, decoded.sourceHeight) * 0.03)

      const shortSide = Math.min(decoded.sourceWidth, decoded.sourceHeight)
      const text = input.text?.trim() ?? ""
      let textBox: Box | null = null
      const fontPx = Math.max(12, Math.round(shortSide * input.size))
      if (text) {
        ctx.font = `600 ${fontPx}px system-ui, -apple-system, sans-serif`
        ctx.textBaseline = "top"
        textBox = { width: ctx.measureText(text).width, height: fontPx * 1.2 }
      }

      const logo = input.logo ? await loadLogo(input.logo) : null
      let logoBox: Box | null = null
      if (logo) {
        const logoW = Math.round(decoded.sourceWidth * input.size)
        logoBox = { width: logoW, height: Math.round(logo.height * (logoW / logo.width)) }
      }

      const layout = layoutWatermark(
        decoded.sourceWidth,
        decoded.sourceHeight,
        logoBox,
        textBox,
        input.position,
        margin,
      )

      ctx.globalAlpha = input.opacity
      if (logo && logoBox && layout.logo) {
        ctx.drawImage(logo.source, layout.logo.x, layout.logo.y, logoBox.width, logoBox.height)
        logo.release()
      }
      if (text && layout.text) {
        ctx.fillStyle = "#ffffff"
        // Shadow for legibility
        ctx.shadowColor = "rgba(0,0,0,0.6)"
        ctx.shadowBlur = 6
        ctx.fillText(text, layout.text.x, layout.text.y)
        ctx.shadowBlur = 0
      }
      ctx.globalAlpha = 1

      onProgress(0.8)
      const mime = input.format === "png" ? "image/png" : "image/jpeg"
      const blob = await canvasToBlob(canvas, mime, 0.92)
      onProgress(1)
      if (cancelled) throw new Error("cancelled")
      const ext = input.format === "png" ? "png" : "jpg"
      return {
        success: true,
        data: {
          blob,
          fileName: `${base}-watermarked.${ext}`,
          width: decoded.sourceWidth,
          height: decoded.sourceHeight,
          bytes: blob.size,
          format: input.format,
        },
        meta: { bytesIn, bytesOut: blob.size, durationMs: 0 },
      }
    } catch (err) {
      return {
        success: false,
        data: undefined as unknown as WatermarkOutput,
        meta: { bytesIn: 0, bytesOut: 0, durationMs: 0 },
        error: { code: "watermark_error", message: (err as Error).message },
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