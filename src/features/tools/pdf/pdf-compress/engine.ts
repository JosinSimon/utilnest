import type { FileJob } from "@/features/tools/engine"
import {
  compressPdf,
  fileToUint8,
  probePdf,
} from "@/features/tools/shared/pdf"

export interface PdfCompressInput {
  file: File
  /** 1 = strong (0.5x), 2 = balanced (0.75x), 3 = light (1x). */
  level: 1 | 2 | 3
  quality: number
}

export interface PdfCompressOutput {
  blob: Blob
  fileName: string
  bytes: number
  savedPercent: number
  pageCount: number
}

export function runPdfCompress(input: PdfCompressInput): FileJob<PdfCompressOutput> {
  let cancelled = false
  let onProgress: (p: number) => void = () => {}

  const promise = (async () => {
    try {
      onProgress(0.1)
      const bytes = await fileToUint8(input.file)
      if (cancelled) throw new Error("cancelled")
      const { pageCount } = await probePdf(bytes)
      if (pageCount > 100) {
        throw new Error("This PDF has more than 100 pages; compression may time out.")
      }
      onProgress(0.2)

      const scale = [0.5, 0.75, 1][input.level - 1] ?? 0.75
      const out = await compressPdf(bytes, {
        scale,
        quality: input.quality,
        onProgress: (done, total) =>
          onProgress(0.25 + 0.6 * (total === 0 ? 0 : done / total)),
      })
      if (cancelled) throw new Error("cancelled")

      const blob = new Blob([out as unknown as BlobPart], { type: "application/pdf" })
      onProgress(1)
      const saved = Math.max(0, input.file.size - blob.size)
      return {
        success: true,
        data: {
          blob,
          fileName: `${baseName(input.file.name)}-compressed.pdf`,
          bytes: blob.size,
          savedPercent: input.file.size === 0 ? 0 : Math.round((saved / input.file.size) * 100),
          pageCount,
        },
        meta: { bytesIn: input.file.size, bytesOut: blob.size, durationMs: 0 },
      }
    } catch (err) {
      return {
        success: false,
        data: undefined as unknown as PdfCompressOutput,
        error: { code: "pdf_compress_error", message: (err as Error).message },
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