import type { FileJob } from "@/features/tools/engine"
import { decodeImage, canvasToBlob } from "@/features/tools/shared/image"
import { toArrayBuffer } from "@/features/tools/engine"

export type ConvertFormat = "jpeg" | "png" | "webp"

export interface ImageConvertInput {
  file: File
  format: ConvertFormat
  /** JPEG/WebP quality 0..1; ignored for PNG. */
  quality?: number
}

export interface ImageConvertOutput {
  blob: Blob
  fileName: string
  width: number
  height: number
  bytes: number
  format: ConvertFormat
}

const MIME: Record<ConvertFormat, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
}

/** Canvas needs a 2D context; render helper for a given decoded image. */
function renderToCanvas(
  bitmapCarrier: CanvasImageSource,
  width: number,
  height: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Could not acquire 2D context.")
  ctx.drawImage(bitmapCarrier, 0, 0, width, height)
  return canvas
}

export function runImageConvert(input: ImageConvertInput): FileJob<ImageConvertOutput> {
  let cancelled = false
  let onProgress: (p: number) => void = () => {}
  const promise = (async () => {
    try {
      onProgress(0.1)
      const bytesIn = input.file.size
      const decoded = await decodeImage(input.file)
      if (cancelled) throw new Error("cancelled")
      const canvas = renderToCanvas(
        decoded.bitmapCarrier,
        decoded.sourceWidth,
        decoded.sourceHeight,
      )
      const blob = await canvasToBlob(canvas, MIME[input.format], input.quality ?? 0.92)
      onProgress(1)
      if (cancelled) throw new Error("cancelled")
      const base = input.file.name.replace(/\.[^/.]+$/, "")
      const ext = input.format === "jpeg" ? "jpg" : input.format
      return {
        success: true,
        data: {
          blob,
          fileName: `${base}.${ext}`,
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
        data: undefined as unknown as ImageConvertOutput,
        meta: { bytesIn: 0, bytesOut: 0, durationMs: 0 },
        error: { code: "convert_error", message: (err as Error).message },
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
