import type { FileJob } from "@/features/tools/engine"
import { mergePdfs, fileToUint8, probePdf } from "@/features/tools/shared/pdf"

export interface PdfMergeInput {
  files: File[]
}

export interface PdfMergeOutput {
  blob: Blob
  fileName: string
  bytes: number
  pages: number
  sourceCount: number
}

export function runPdfMerge(input: PdfMergeInput): FileJob<PdfMergeOutput> {
  let cancelled = false
  let onProgress: (p: number) => void = () => {}

  const promise = (async () => {
    try {
      onProgress(0.05)
      const bytesIn = input.files.reduce((s, f) => s + f.size, 0)

      const sources = await Promise.all(input.files.map((f) => fileToUint8(f)))
      if (cancelled) throw new Error("cancelled")
      onProgress(0.4)

      const pdfBytes = await mergePdfs(
        sources.map((bytes, i) => ({ bytes, name: input.files[i].name })),
      )
      if (cancelled) throw new Error("cancelled")

      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" })
      onProgress(1)
      return {
        success: true,
        data: {
          blob,
          fileName: "merged.pdf",
          bytes: blob.size,
          pages: (await probePdf(pdfBytes)).pageCount,
          sourceCount: input.files.length,
        },
        meta: { bytesIn, bytesOut: blob.size, durationMs: 0 },
      }
    } catch (err) {
      return {
        success: false,
        data: undefined as unknown as PdfMergeOutput,
        error: { code: "pdf_merge_error", message: (err as Error).message },
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