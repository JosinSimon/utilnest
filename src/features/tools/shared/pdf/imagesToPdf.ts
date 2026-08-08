/**
 * Images → PDF (JPG / PNG / WebP). Reuses pdf-lib, mirroring Document
 * Scanner's embed+drawImage approach but as a shared, pure operation.
 */

import { PDFDocument, degrees } from "pdf-lib"

export type ImageRotation = 0 | 90 | 180 | 270
export type PdfTargetSize = "match" | "A4" | "A5" | "Letter"

export interface PdfImageInput {
  bytes: Uint8Array
  name: string
}

export interface ImagesToPdfOptions {
  /**
   * "match" -> page matches each image's pixel dims (JPG · PNG keep pixels).
   * A paper size -> page is that size and the image is fitted inside.
   */
  pageSize: PdfTargetSize
  rotation: ImageRotation
  /** Margin in PDF points around each image when pageSize is a paper size. */
  margin: number
}

export const PDF_PAPER_PT: Record<Exclude<PdfTargetSize, "match">, [number, number]> = {
  A4: [595.28, 841.89],
  A5: [419.53, 595.28],
  Letter: [612, 792],
}

/** Detect image format from magic bytes. */
export function detectImageKind(bytes: Uint8Array): "jpeg" | "png" {
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50) return "png"
  return "jpeg"
}

export async function imagesToPdf(
  images: ImgInput[],
  opts: ImagesToPdfOptions,
): Promise<Uint8Array> {
  if (images.length === 0) throw new Error("Add at least one image.")
  const doc = await PDFDocument.create()
  const rad = degrees(opts.rotation)

  for (const img of images) {
    const kind = detectImageKind(img.bytes)
    const image = kind === "png" ? await doc.embedPng(img.bytes) : await doc.embedJpg(img.bytes)

    // Page dims in pt.
    let pw: number
    let ph: number
    if (opts.pageSize === "match") {
      pw = image.width
      ph = image.height
    } else {
      ;[pw, ph] = PDF_PAPER_PT[opts.pageSize]
    }

    // Fit the image inside the page (respecting margin) preserving aspect.
    const availW = pw - opts.margin * 2
    const availH = ph - opts.margin * 2
    const scale = Math.min(availW / image.width, availH / image.height)
    const iw = image.width * scale
    const ih = image.height * scale
    const x = opts.margin + (availW - iw) / 2
    const y = opts.margin + (availH - ih) / 2

    const page = doc.addPage([pw, ph])
    page.drawImage(image, {
      x,
      y,
      width: iw,
      height: ih,
      rotate: opts.rotation === 0 ? undefined : rad,
    })
  }
  return doc.save()
}

export interface ImgInput {
  bytes: Uint8Array
  name: string
}