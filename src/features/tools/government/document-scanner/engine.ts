import { PDFDocument } from "pdf-lib"

export interface ScanInput {
  files: File[]
  /** Page size in points: "A4" letterboxed, or "auto" fit exactly. */
  pageSize: "A4" | "auto"
  /** Rotate every image by this many degrees before embedding. */
  rotation?: 0 | 90 | 180 | 270
}

export interface ScanOutput {
  pdf: Blob
  fileName: string
  pages: number
  bytes: number
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error(`Could not load ${file.name}.`))
    }
    img.src = url
  })
}

async function fileToJpeg(
  file: File,
  rotation: number,
): Promise<{ bytes: ArrayBuffer; width: number; height: number }> {
  const img = await loadImage(file)
  const swaps = rotation === 90 || rotation === 270
  const w = swaps ? img.height : img.width
  const h = swaps ? img.width : img.height
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas not supported.")

  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, w, h)
  ctx.save()
  ctx.translate(w / 2, h / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.drawImage(img, -img.width / 2, -img.height / 2)
  ctx.restore()

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b ?? new Blob()), "image/jpeg", 0.92),
  )
  return { bytes: await blob.arrayBuffer(), width: w, height: h }
}

/** Convert one or more image files into a single PDF. Runs entirely in-browser. */
export async function createPdf(input: ScanInput): Promise<ScanOutput> {
  const { files, pageSize, rotation = 0 } = input
  const doc = await PDFDocument.create()
  const A4: [number, number] = [595.28, 841.89]

  for (const file of files) {
    const { bytes } = await fileToJpeg(file, rotation)
    const image = await doc.embedJpg(bytes)

    if (pageSize === "auto") {
      const page = doc.addPage([image.width, image.height])
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height })
    } else {
      const scale = Math.min(A4[0] / image.width, A4[1] / image.height)
      const drawW = image.width * scale
      const drawH = image.height * scale
      const page = doc.addPage(A4)
      page.drawImage(image, {
        x: (A4[0] - drawW) / 2,
        y: (A4[1] - drawH) / 2,
        width: drawW,
        height: drawH,
      })
    }
  }

  const pdfBytes = await doc.save()
  const pdf = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" })
  return {
    pdf,
    fileName: "scanned-document.pdf",
    pages: files.length,
    bytes: pdfBytes.byteLength,
  }
}