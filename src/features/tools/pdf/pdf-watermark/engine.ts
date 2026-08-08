import type { FileJob } from "@/features/tools/engine"
import { fileToUint8, probePdf, watermarkPdf } from "@/features/tools/shared/pdf"

export interface PdfWatermarkInput {
  file: File
  text: string
  color?: string
  /** Font size relative to page's short side. */
  scale?: number
  /** Approximate number of stamps along the diagonal. */
  tiles?: number
  opacity?: number
}

export interface PdfWatermarkOutput {
  blob: Blob
  fileName: string
  bytes: number
  pageCount: number
}

export function runPdfWatermark(input: PdfWatermarkInput): FileJob<PdfWatermarkOutput> {
  let cancelled = false
  let onProgress: (p: number) => void = () => {}

  const promise = (async () => {
    try {
      onProgress(0.1)
      const bytes = await fileToUint8(input.file)
      if (cancelled) throw new Error("cancelled")
      const { pageCount } = await probePdf(bytes)
      onProgress(0.4)

      const out = await watermarkPdf(bytes, {
        text: input.text,
        color: "#9ca3af",
        scale: input.scale ?? 0.045,
        tiles: input.tiles ?? 4,
        opacity: input.opacity ?? 0.18,
      })
      if (cancelled) throw new Error("cancelled")

      const blob = new Blob([out as unknown as BlobPart], { type: "application/pdf" })
      onProgress(1)
      return {
        success: true,
        data: {
          blob,
          fileName: `${baseName(input.file.name)}-watermarked.pdf`,
          bytes: blob.size,
          pageCount,
        },
        meta: { bytesIn: input.file.size, bytesOut: blob.size, durationMs: 0 },
      }
    } catch (err) {
      return {
        success: false,
        data: undefined as unknown as PdfWatermarkOutput,
        error: { code: "pdf_watermark_error", message: (err as Error).message },
        meta: { bytesIn: 0, bytesOut: 0, durationMs: 0 },
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

function baseName(name: string): string {
  const dot = name.lastIndexOf(".")
  return dot > 0 ? name.slice(0, dot) : name
}