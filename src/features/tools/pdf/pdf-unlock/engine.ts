import type { FileJob } from "@/features/tools/engine"
import { fileToUint8, probePdf, unlockPdf } from "@/features/tools/shared/pdf"

export interface PdfUnlockInput {
  file: File
  password: string
}

export interface PdfUnlockOutput {
  blob: Blob
  fileName: string
  bytes: number
  pageCount: number
}

export function runPdfUnlock(input: PdfUnlockInput): FileJob<PdfUnlockOutput> {
  let cancelled = false
  let onProgress: (p: number) => void = () => {}

  const promise = (async () => {
    try {
      onProgress(0.15)
      const bytes = await fileToUint8(input.file)
      if (cancelled) throw new Error("cancelled")

      const decrypted = await unlockPdf(bytes, input.password)
      if (cancelled) throw new Error("cancelled")

      const { pageCount } = await probePdf(decrypted)
      const blob = new Blob([decrypted as unknown as BlobPart], { type: "application/pdf" })
      onProgress(1)
      return {
        success: true,
        data: {
          blob,
          fileName: `${baseName(input.file.name)}-unlocked.pdf`,
          bytes: blob.size,
          pageCount,
        },
        meta: { bytesIn: input.file.size, bytesOut: blob.size, durationMs: 0 },
      }
    } catch (err) {
      const message = (err as Error).message
      return {
        success: false,
        data: undefined as unknown as PdfUnlockOutput,
        error: {
          code: "pdf_unlock_error",
          message: /password/i.test(message) ? message : "Could not unlock this PDF.",
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