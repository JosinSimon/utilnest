import type { FileJob } from "@/features/tools/engine"
import {
  fileToUint8,
  renderPdfToJpgs,
  zipArchive,
} from "@/features/tools/shared/pdf"

export interface PdfToJpgInput {
  file: File
  /** 1, 2 or 3 — quality/dpi multiplier for the rendered pages. */
  dpi: 1 | 2 | 3
  quality: number
}

export interface PdfToJpgOutput {
  blob: Blob
  fileName: string
  bytes: number
  pages: number
  imageCount: number
}

export function runPdfToJpg(input: PdfToJpgInput): FileJob<PdfToJpgOutput> {
  let cancelled = false
  let onProgress: (p: number) => void = () => {}

  const promise = (async () => {
    try {
      onProgress(0.1)
      const bytes = await fileToUint8(input.file)
      if (cancelled) throw new Error("cancelled")

      // pdf.js viewport scale 1.0 ≈ 72dpi; ~2.08x ≈ 150dpi. Multiply by the
      // user's dpi pick (1 / 1.75 / 2.5) for a sensible range.
      const factor = [1, 1.75, 2.5][input.dpi - 1] ?? 1
      const pages = await renderPdfToJpgs(bytes, {
        scale: 2.08 * factor,
        quality: input.quality,
        onProgress: (done, total) =>
          onProgress(0.15 + 0.6 * (total === 0 ? 0 : done / total)),
      })
      if (cancelled) throw new Error("cancelled")

      const zip = zipArchive(
        pages.map((p) => ({ name: `page-${p.index + 1}.jpg`, data: dataUrlToBytes(p.dataUrl) })),
      )
      if (cancelled) throw new Error("cancelled")

      const blob = new Blob([zip as unknown as BlobPart], { type: "application/zip" })
      onProgress(1)
      return {
        success: true,
        data: {
          blob,
          fileName: `${baseName(input.file.name)}-images.zip`,
          bytes: blob.size,
          pages: pages.length,
          imageCount: pages.length,
        },
        meta: { bytesIn: input.file.size, bytesOut: blob.size, durationMs: 0 },
      }
    } catch (err) {
      return {
        success: false,
        data: undefined as unknown as PdfToJpgOutput,
        error: {
          code: "pdf_to_jpg_error",
          message: (err as Error).message,
        },
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

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1] ?? ""
  const bin = atob(base64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}