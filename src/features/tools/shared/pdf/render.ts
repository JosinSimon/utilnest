/**
 * PDF rendering layer — lazy pdfjs (pdfjs-dist). Used by PDF-to-JPG, thumbnails
 * and Compress. pdf.js is ~5MB with its worker, so it is imported on demand
 * and the initial bundle never touches it.
 */

export interface RenderPage {
  index: number
  dataUrl: string
  width: number
  height: number
}

export interface RenderOptions {
  /** Viewport scale (1.0 ≈ 72 dpi; 2.0 renders roughly 150-dpi output). */
  scale: number
  /** Minimal JPEG quality 0..1 (default 0.9; PNG ignores). */
  quality?: number
  /** Render these 0-based page indices (default: all pages). */
  pageIndices?: number[]
  onProgress?: (rendered: number, total: number) => void
}

let workerWired = false

async function loadPdfjs() {
  const pdfjs = (await import("pdfjs-dist/legacy/build/pdf.mjs")) as unknown as {
    getDocument: (opts: {
      data: Uint8Array
      disableWorker?: boolean
    }) => { promise: Promise<PdfDocumentLike> }
    GlobalWorkerOptions: { workerSrc: string }
  }
  if (!workerWired && typeof document !== "undefined") {
    // Vite emits the worker asset at build time; point pdf.js at it.
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
      import.meta.url,
    ).toString()
    workerWired = true
  }
  return pdfjs
}

interface PdfDocumentLike {
  numPages: number
  getPage(n: number): Promise<PdfPageLike>
  destroy(): Promise<void>
}

interface PdfPageLike {
  getViewport(opts: { scale: number }): { width: number; height: number }
  render(args: { canvasContext: CanvasRenderingContext2D | null; viewport: unknown }): {
    promise: Promise<unknown>
  }
  cleanup(): void
}

async function renderTo(
  bytes: Uint8Array,
  mime: string,
  opts: RenderOptions & { quality: number },
): Promise<RenderPage[]> {
  const pdfjs = await loadPdfjs()
  const doc = await pdfjs
    .getDocument({ data: bytes, disableWorker: false })
    .promise

  const indices = opts.pageIndices ?? Array.from({ length: doc.numPages }, (_, i) => i)
  const out: RenderPage[] = []

  for (const idx of indices) {
    if (typeof document === "undefined") {
      throw new Error("PDF rendering requires a browser canvas.")
    }
    const page = await doc.getPage(idx + 1)
    const viewport = page.getViewport({ scale: opts.scale })
    const canvas = document.createElement("canvas")
    canvas.width = Math.ceil(viewport.width)
    canvas.height = Math.ceil(viewport.height)
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Canvas 2D context unavailable.")
    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise

    out.push({
      index: idx,
      dataUrl: canvas.toDataURL(mime, opts.quality),
      width: Math.ceil(viewport.width),
      height: Math.ceil(viewport.height),
    })
    opts.onProgress?.(out.length, indices.length)
    page.cleanup()
  }
  await doc.destroy()
  return out
}

/** Render PDF pages to JPEG data URLs (PDF-to-JPG output). */
export function renderPdfToJpgs(
  bytes: Uint8Array,
  opts: Omit<RenderOptions, "quality"> & { quality?: number },
): Promise<RenderPage[]> {
  return renderTo(bytes, "image/jpeg", { ...opts, quality: opts.quality ?? 1 })
}

/** Render PDF pages to PNG data URLs (page thumbnails / previews). */
export function renderPdfToPngs(
  bytes: Uint8Array,
  opts: Omit<RenderOptions, "quality">,
): Promise<RenderPage[]> {
  return renderTo(bytes, "image/png", { ...opts, quality: 1 })
}