import type { FileJob } from "@/features/tools/engine"
import { fileToUint8, probePdf, protectPdf } from "@/features/tools/shared/pdf"

export interface PdfProtectInput {
  file: File
  password: string
  ownerPassword?: string
}

export interface PdfProtectOutput {
  blob: Blob
  fileName: string
  bytes: number
  pageCount: number
  encrypted: boolean
}

export function runPdfProtect(input: PdfProtectInput): FileJob<PdfProtectOutput> {
  let cancelled = false
  let onProgress: (p: number) => void = () => {}

  const promise = (async () => {
    try {
      onProgress(0.1)
      const bytes = await fileToUint8(input.file)
      if (cancelled) throw new Error("cancelled")
      const { pageCount } = await probePdf(bytes)
      onProgress(0.35)

      const encrypted = await protectPdf(bytes, {
        userPassword: input.password,
        ownerPassword: input.ownerPassword,
      })
      if (cancelled) throw new Error("cancelled")

      const blob = new Blob([encrypted as unknown as BlobPart], { type: "application/pdf" })
      onProgress(1)
      return {
        success: true,
        data: {
          blob,
          fileName: `${baseName(input.file.name)}-protected.pdf`,
          bytes: blob.size,
          pageCount,
          encrypted: true,
        },
        meta: { bytesIn: input.file.size, bytesOut: blob.size, durationMs: 0 },
      }
    } catch (err) {
      return {
        success: false,
        data: undefined as unknown as PdfProtectOutput,
        error: { code: "pdf_protect_error", message: (err as Error).message },
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