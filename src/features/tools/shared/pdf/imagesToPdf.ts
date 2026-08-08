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

  for (const img of images) {
    const kind = detectImageKind(img.bytes)
    const image = kind === "png" ? await doc.embedPng(img.bytes) : await doc.embedJpg(img.bytes)

    const { rotation, pageSize } = opts

    // For 90° / 270° rotations the image occupies swapped page space — use the
    // transposed dimensions when calculating how to fit within the available area.
    const swapped = rotation === 90 || rotation === 270
    const footW = swapped ? image.height : image.width
    const footH = swapped ? image.width : image.height

    // Page dims in pt.
    let pw: number
    let ph: number
    if (pageSize === "match") {
      // Size the page to match the rotated image footprint (no margin needed).
      pw = footW
      ph = footH
    } else {
      ;[pw, ph] = PDF_PAPER_PT[pageSize]
    }

    // In "match" mode there is no margin — the page is already sized to the image.
    const m = pageSize === "match" ? 0 : opts.margin
    const availW = pw - m * 2
    const availH = ph - m * 2

    // Uniform scale so the rotated image fits within the available area.
    const scale = Math.min(availW / footW, availH / footH)

    // These are the dimensions passed to drawImage (un-rotated, as pdf-lib expects).
    const dw = image.width * scale
    const dh = image.height * scale

    // Center of the available area on the page.
    const cx = m + availW / 2
    const cy = m + availH / 2

    // pdf-lib rotates drawImage CCW around its bottom-left corner (x, y).
    // The user's rotation values are CW degrees, so convert: pdfAngle = (360 - userCW) % 360.
    // Then compute (x, y) so that the visual center of the rotated image lands on (cx, cy).
    //
    // After rotating by A° CCW around (x,y), the image center moves to:
    //   0°  → (x + dw/2,  y + dh/2)
    //   90° → (x - dh/2,  y + dw/2)  [CCW, i.e. user's 270°]
    //  180° → (x - dw/2,  y - dh/2)
    //  270° → (x + dh/2,  y - dw/2)  [CW,  i.e. user's 90°]
    let x: number
    let y: number
    let pdfAngle: number

    if (rotation === 0) {
      pdfAngle = 0
      x = cx - dw / 2
      y = cy - dh / 2
    } else if (rotation === 90) {
      // User: 90° CW → pdf-lib: 270° CCW
      pdfAngle = 270
      // Center of rotated image = (x + dh/2, y - dw/2) → set equal to (cx, cy)
      x = cx - dh / 2
      y = cy + dw / 2
    } else if (rotation === 180) {
      pdfAngle = 180
      // Center = (x - dw/2, y - dh/2)
      x = cx + dw / 2
      y = cy + dh / 2
    } else {
      // rotation === 270: User: 270° CW → pdf-lib: 90° CCW
      pdfAngle = 90
      // Center = (x - dh/2, y + dw/2)
      x = cx + dh / 2
      y = cy - dw / 2
    }

    const page = doc.addPage([pw, ph])
    page.drawImage(image, {
      x,
      y,
      width: dw,
      height: dh,
      rotate: pdfAngle === 0 ? undefined : degrees(pdfAngle),
    })
  }
  return doc.save()
}


export interface ImgInput {
  bytes: Uint8Array
  name: string
}