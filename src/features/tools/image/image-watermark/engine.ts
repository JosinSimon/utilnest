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

      // Text watermark
      if (input.text?.trim()) {
        const fontPx = Math.max(
          12,
          Math.round(Math.min(decoded.sourceWidth, decoded.sourceHeight) * input.size),
        )
        ctx.font = `600 ${fontPx}px system-ui, -apple-system, sans-serif`
        ctx.textBaseline = "top"
        const metrics = ctx.measureText(input.text.trim())
        const w = metrics.width
        const h = fontPx * 1.2
        ctx.globalAlpha = input.opacity
        ctx.fillStyle = "#ffffff"
        // Shadow for legibility
        ctx.shadowColor = "rgba(0,0,0,0.6)"
        ctx.shadowBlur = 6
        const pos = computeTextPosition(
          decoded.sourceWidth,
          decoded.sourceHeight,
          w,
          h,
          input.position,
          margin,
        )
        ctx.fillText(input.text.trim(), pos.x, pos.y)
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1
      }

      // Logo watermark
      if (input.logo) {
        const logoBitmap = await createImageBitmap(input.logo, { imageOrientation: "from-image" })
        const logoW = Math.round(decoded.sourceWidth * input.size)
        const logoH = Math.round(logoBitmap.height * (logoW / logoBitmap.width))
        const pos = computeTextPosition(
          decoded.sourceWidth,
          decoded.sourceHeight,
          logoW,
          logoH,
          input.position,
          margin,
        )
        ctx.globalAlpha = input.opacity
        ctx.drawImage(logoBitmap, pos.x, pos.y, logoW, logoH)
        ctx.globalAlpha = 1
        logoBitmap.close()
      }

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