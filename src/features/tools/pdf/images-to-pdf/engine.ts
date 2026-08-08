import type { FileJob } from "@/features/tools/engine"
import {
  fileToUint8,
  imagesToPdf,
  probePdf,
  type ImageRotation,
  type PdfTargetSize,
} from "@/features/tools/shared/pdf"

export interface ImagesToPdfInput {
  files: File[]
  pageSize: PdfTargetSize
  rotation: ImageRotation
  margin: number
}

export interface ImagesToPdfOutput {
  blob: Blob
  fileName: string
  bytes: number
  pages: number
  imageCount: number
}

export function runImagesToPdf(input: ImagesToPdfInput): FileJob<ImagesToPdfOutput> {
  let cancelled = false
  let onProgress: (p: number) => void = () => {}

  const promise = (async () => {
    try {
      if (input.files.length === 0) throw new Error("Add at least one image.")
      onProgress(0.05)
      const sources = await Promise.all(input.files.map((f) => fileToUint8(f)))
      if (cancelled) throw new Error("cancelled")
      onProgress(0.3)

      const bytes = await imagesToPdf(
        sources.map((b, i) => ({ bytes: b, name: input.files[i].name })),
        {
          pageSize: input.pageSize,
          rotation: input.rotation,
          margin: input.margin,
        },
      )
      if (cancelled) throw new Error("cancelled")

      const { pageCount } = await probePdf(bytes)
      const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" })
      onProgress(1)
      return {
        success: true,
        data: {
          blob,
          fileName: "images.pdf",
          bytes: blob.size,
          pages: pageCount,
          imageCount: input.files.length,
        },
        meta: {
          bytesIn: input.files.reduce((s, f) => s + f.size, 0),
          bytesOut: blob.size,
          durationMs: 0,
        },
      }
    } catch (err) {
      return {
        success: false,
        data: undefined as unknown as ImagesToPdfOutput,
        error: { code: "images_to_pdf_error", message: (err as Error).message },
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