import type { FileJob } from "@/features/tools/engine"
import { fileToUint8, probePdf, reorderPages } from "@/features/tools/shared/pdf"

export interface PageManagerInput {
  file: File
  /** Ordered 1-based page numbers to keep, in the order they should appear. */
  keep: number[]
}

export interface PageManagerOutput {
  blob: Blob
  fileName: string
  bytes: number
  pages: number
  deleted: number
}

export function runPageManager(input: PageManagerInput): FileJob<PageManagerOutput> {
  let cancelled = false
  let onProgress: (p: number) => void = () => {}

  const promise = (async () => {
    try {
      onProgress(0.1)
      const bytes = await fileToUint8(input.file)
      if (cancelled) throw new Error("cancelled")
      const { pageCount } = await probePdf(bytes)
      if (input.keep.length === 0) throw new Error("Keep at least one page.")
      if (input.keep.length === pageCount && isIdentity(input.keep)) {
        throw new Error("No changes to apply — reorder or remove a page first.")
      }
      onProgress(0.4)

      const out = await reorderPages(bytes, input.keep)
      if (cancelled) throw new Error("cancelled")

      const blob = new Blob([out as unknown as BlobPart], { type: "application/pdf" })
      onProgress(1)
      return {
        success: true,
        data: {
          blob,
          fileName: `${baseName(input.file.name)}-edited.pdf`,
          bytes: blob.size,
          pages: input.keep.length,
          deleted: pageCount - input.keep.length,
        },
        meta: { bytesIn: input.file.size, bytesOut: blob.size, durationMs: 0 },
      }
    } catch (err) {
      return {
        success: false,
        data: undefined as unknown as PageManagerOutput,
        error: { code: "page_manager_error", message: (err as Error).message },
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

function isIdentity(order: number[]): boolean {
  return order.every((n, i) => n === i + 1)
}

function baseName(name: string): string {
  const dot = name.lastIndexOf(".")
  return dot > 0 ? name.slice(0, dot) : name
}