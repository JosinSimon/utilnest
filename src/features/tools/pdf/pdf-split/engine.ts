import type { FileJob } from "@/features/tools/engine"
import {
  extractPages,
  fileToUint8,
  probePdf,
  zipArchive,
} from "@/features/tools/shared/pdf"

export interface PdfSplitInput {
  file: File
  /** 1-based boundary pages "before which" to cut, e.g. [3] → [1-2],[3..end]. */
  atPages?: number[]
  /** Alternative: split into single-page PDFs when true. */
  singlePages?: boolean
}

export interface PdfSplitOutput {
  blob: Blob
  fileName: string
  bytes: number
  partCount: number
}

export function runPdfSplit(input: PdfSplitInput): FileJob<PdfSplitOutput> {
  let cancelled = false
  let onProgress: (p: number) => void = () => {}

  const promise = (async () => {
    try {
      onProgress(0.1)
      const bytes = await fileToUint8(input.file)
      if (cancelled) throw new Error("cancelled")
      const { pageCount } = await probePdf(bytes)

      const parts: { bytes: Uint8Array; name: string }[] = []
      if (input.singlePages) {
        for (let page = 1; page <= pageCount; page++) {
          if (cancelled) throw new Error("cancelled")
          parts.push({
            bytes: await extractPages(bytes, [page]),
            name: `${stripExt(input.file.name)}-page-${page}.pdf`,
          })
          onProgress(0.3 + (0.6 * page) / pageCount)
        }
      } else {
        const cuts = [...new Set((input.atPages ?? []).map((n) => Math.min(Math.max(Math.trunc(n), 1), pageCount + 1)))]
          .filter((n) => n > 1 && n <= pageCount)
          .sort((a, b) => a - b)
        if (cuts.length === 0) {
          throw new Error("Pick at least one split point or use single-page mode.")
        }
        const ranges = [[1, cuts[0] - 1]]
        for (let i = 1; i < cuts.length; i++) {
          ranges.push([cuts[i - 1], cuts[i] - 1])
        }
        ranges.push([cuts[cuts.length - 1], pageCount])
        for (let i = 0; i < ranges.length; i++) {
          if (cancelled) throw new Error("cancelled")
          const [lo, hi] = ranges[i]
          const sel: number[] = []
          for (let p = lo; p <= hi; p++) sel.push(p)
          parts.push({
            bytes: await extractPages(bytes, sel),
            name: `${stripExt(input.file.name)}-part-${String(i + 1).padStart(2, "0")}.pdf`,
          })
          onProgress(0.1 + (0.6 * (i + 1)) / ranges.length)
        }
      }

      if (cancelled) throw new Error("cancelled")
      const zip = zipArchive(parts.map((p) => ({ name: p.name, data: p.bytes })))
      if (cancelled) throw new Error("cancelled")

      const blob = new Blob([zip as unknown as BlobPart], { type: "application/zip" })
      onProgress(1)
      const fileName = `${stripExt(input.file.name)}-split.zip`
      return {
        success: true,
        data: { blob, fileName, bytes: blob.size, partCount: parts.length },
        meta: { bytesIn: input.file.size, bytesOut: blob.size, durationMs: 0 },
      }
    } catch (err) {
      return {
        success: false,
        data: undefined as unknown as PdfSplitOutput,
        error: { code: "pdf_split_error", message: (err as Error).message },
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

function stripExt(name: string): string {
  const dot = name.lastIndexOf(".")
  return dot > 0 ? name.slice(0, dot) : name
}