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

/**
 * Convert a WebP image to JPEG using the browser canvas.
 * pdf-lib only supports JPEG and PNG, so WebP must be normalised first.
 * Returns the original bytes unchanged for JPEG/PNG.
 */
async function normalizeImageBytes(
  bytes: Uint8Array,
  name: string,
): Promise<{ bytes: Uint8Array; name: string }> {
  // WebP magic: "RIFF" at 0-3, "WEBP" at 8-11
  const isWebp =
    bytes.length >= 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50

  if (!isWebp) return { bytes, name }

  const blob = new Blob([bytes as unknown as BlobPart], { type: "image/webp" })
  const bitmap = await createImageBitmap(blob)
  const canvas = document.createElement("canvas")
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas 2D unavailable — cannot convert WebP.")
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, bitmap.width, bitmap.height)
  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()

  const jpegBlob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("WebP → JPEG conversion failed."))),
      "image/jpeg",
      0.92,
    ),
  )
  const newName = name.replace(/\.webp$/i, ".jpg")
  return { bytes: new Uint8Array(await jpegBlob.arrayBuffer()), name: newName }
}

export function runImagesToPdf(input: ImagesToPdfInput): FileJob<ImagesToPdfOutput> {
  let cancelled = false
  let onProgress: (p: number) => void = () => {}

  const promise = (async () => {
    try {
      if (input.files.length === 0) throw new Error("Add at least one image.")
      onProgress(0.05)

      // Read all files and normalise WebP → JPEG so pdf-lib can embed them.
      const rawSources = await Promise.all(input.files.map((f) => fileToUint8(f)))
      if (cancelled) throw new Error("cancelled")
      onProgress(0.15)

      const sources = await Promise.all(
        rawSources.map((b, i) => normalizeImageBytes(b, input.files[i].name)),
      )
      if (cancelled) throw new Error("cancelled")
      onProgress(0.3)

      const pdfBytes = await imagesToPdf(sources, {
        pageSize: input.pageSize,
        rotation: input.rotation,
        margin: input.margin,
      })
      if (cancelled) throw new Error("cancelled")

      const { pageCount } = await probePdf(pdfBytes)
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" })
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