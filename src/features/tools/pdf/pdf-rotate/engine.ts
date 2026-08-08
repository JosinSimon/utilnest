import type { FileJob } from "@/features/tools/engine"
import { fileToUint8, probePdf, rotatePdf, type RotateDeg } from "@/features/tools/shared/pdf"

export interface PdfRotateInput {
  file: File
  degrees: RotateDeg
  /** 1-based pages to rotate (null = all pages). */
  pages?: number[] | null
}

export interface PdfRotateOutput {
  blob: Blob
  fileName: string
  bytes: number
  pageCount: number
  affected: number
}

export function runPdfRotate(input: PdfRotateInput): FileJob<PdfRotateOutput> {
  let cancelled = false
  let onProgress: (p: number) => void = () => {}

  const promise = (async () => {
    try {
      onProgress(0.1)
      const bytes = await fileToUint8(input.file)
      if (cancelled) throw new Error("cancelled")
      const { pageCount } = await probePdf(bytes)
      onProgress(0.35)

      const affected =
        input.degrees % 360 === 0
          ? 0
          : input.pages ? input.pages.length
          : pageCount

      const rotated = await rotatePdf(
        bytes,
        input.degrees,
        input.pages ? input.pages.map((p) => p - 1) : null,
      )
      if (cancelled) throw new Error("cancelled")

      const blob = new Blob([rotated as unknown as BlobPart], { type: "application/pdf" })
      onProgress(1)
      return {
        success: true,
        data: {
          blob,
          fileName: `${baseName(input.file.name)}-rotated.pdf`,
          bytes: blob.size,
          pageCount,
          affected,
        },
        meta: { bytesIn: input.file.size, bytesOut: blob.size, durationMs: 0 },
      }
    } catch (err) {
      return {
        success: false,
        data: undefined as unknown as PdfRotateOutput,
        error: { code: "pdf_rotate_error", message: (err as Error).message },
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