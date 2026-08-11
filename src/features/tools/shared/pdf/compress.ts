/**
 * Compress a PDF by re-rasterizing pages with pdf.js and re-embedding them as
 * JPEGs. Options trade file size vs fidelity:
 *   - compressScale: 0.5 / 0.75 / 1   (/viewport scale)
 *   - quality (JPEG 0..1)
 * This is the classic "PDF recompress" approach and the biggest lever for
 * image-heavy PDFs. Text-heavy PDFs already use object streams from pdf-lib;
 * a light pass that just re-saves with pdf-lib is applied first.
 */

import { PDFDocument } from "pdf-lib"
import { renderPdfToJpgs } from "./render"

export interface CompressOptions {
  /** Scale factor applied to the page's base DPI (1 = 72dpi). */
  scale: number
  /** JPEG quality for rasterized pages, 0..1 (default 0.8). */
  quality: number
  onProgress?: (done: number, total: number) => void
}

export async function compressPdf(
  bytes: Uint8Array,
  opts: CompressOptions,
): Promise<Uint8Array> {
  const rendered = await renderPdfToJpgs(bytes, {
    scale: opts.scale,
    quality: opts.quality,
    onProgress: opts.onProgress,
  })
  const out = await PDFDocument.create()
  for (const page of rendered) {
    const jpg = await embedJpegDataUrl(out, page.dataUrl)
    const scale = opts.scale && opts.scale > 0 ? opts.scale : 1
    const physWidth = page.width / scale
    const physHeight = page.height / scale
    const p = out.addPage([physWidth, physHeight])
    p.drawImage(jpg, { x: 0, y: 0, width: physWidth, height: physHeight })
  }
  return out.save()
}

async function embedJpegDataUrl(
  doc: PDFDocument,
  dataUrl: string,
): Promise<import("pdf-lib").PDFImage> {
  const base64 = dataUrl.split(",")[1]!
  const bin = atob(base64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return doc.embedJpg(bytes)
}