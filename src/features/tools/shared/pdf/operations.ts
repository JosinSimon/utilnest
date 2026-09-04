/**
 * Core pdf-lib operations: merge, split, reorder, rotate, protect, unlock.
 * Pure of the DOM — take File/bytes, return Uint8Array PDF bytes.
 *
 * NOTE: pdf-lib does NOT ship PDF encryption. Protect/Unlock lazy-load the
 * zero-dependency `@pdfsmaller/pdf-encrypt` / `pdf-decrypt` (Web Crypto,
 * AES-256 R6) so those two tools stay code-split and the initial bundle is
 * unaffected.
 */

import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib"

export type RotateDeg = 0 | 90 | 180 | 270

export interface PdfBytesSource {
  bytes: Uint8Array
  name?: string
}

export function isPdfBytes(magic: Uint8Array): boolean {
  return (
    magic.length >= 5 &&
    magic[0] === 0x25 &&
    magic[1] === 0x50 &&
    magic[2] === 0x44 &&
    magic[3] === 0x46 &&
    magic[4] === 0x2d
  )
}

/** Merge multiple PDFs, concatenating pages in the given order. */
export async function mergePdfs(inputs: PdfBytesSource[]): Promise<Uint8Array> {
  if (inputs.length === 0) throw new Error("Add at least one PDF file.")
  const merged = await PDFDocument.create()
  for (const input of inputs) {
    if (!isPdfBytes(input.bytes)) throw new Error(`"${input.name ?? "file"}" is not a PDF.`)
    const src = await PDFDocument.load(input.bytes)
    const pages = await merged.copyPages(src, src.getPageIndices())
    pages.forEach((p) => merged.addPage(p))
  }
  return merged.save()
}

/** Build a new PDF from selected 1-based page numbers (any order, dups ok). */
export async function extractPages(
  bytes: Uint8Array,
  selected: number[],
): Promise<Uint8Array> {
  if (selected.length === 0) throw new Error("Select at least one page.")
  const src = await PDFDocument.load(bytes)
  const out = await PDFDocument.create()
  const indices = selected.map((n) => n - 1)
  const pages = await out.copyPages(src, indices)
  pages.forEach((p) => out.addPage(p))
  return out.save()
}

/** Copy all pages in `newOrder` (1-based permutation) into a new PDF. */
export async function reorderPages(bytes: Uint8Array, newOrder: number[]): Promise<Uint8Array> {
  const src = await PDFDocument.load(bytes)
  const total = src.getPageCount()
  for (const n of newOrder) {
    if (n < 1 || n > total) throw new Error(`Page ${n} is out of range (1-${total}).`)
  }
  const out = await PDFDocument.create()
  const pages = await out.copyPages(src, newOrder.map((n) => n - 1))
  pages.forEach((p) => out.addPage(p))
  return out.save()
}

/** Rotate pages (all pages by default, or a 0-based index list) by 90° steps. */
export async function rotatePdf(
  bytes: Uint8Array,
  deg: RotateDeg,
  pageIndices: number[] | null = null,
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(bytes)
  const count = doc.getPageCount()
  const indices = pageIndices ?? Array.from({ length: count }, (_, i) => i)
  for (const idx of indices) {
    if (idx < 0 || idx >= count) throw new Error(`Page ${idx + 1} is out of range.`)
    const page = doc.getPage(idx)
    const current = page.getRotation().angle
    page.setRotation(degrees((current + deg) % 360))
  }
  return doc.save()
}

/** Remove all 1-based pages except `keep` (deletion tool: keep the checked). */
export async function deletePages(bytes: Uint8Array, keep: number[]): Promise<Uint8Array> {
  return extractPages(bytes, keep)
}

/** Protect with a user (open) + optional owner password using AES-256 R6. */
export async function protectPdf(
  bytes: Uint8Array,
  opts: { userPassword: string; ownerPassword?: string },
): Promise<Uint8Array> {
  const { encryptPDF } = await import("@pdfsmaller/pdf-encrypt")
  const owner = opts.ownerPassword?.trim() || opts.userPassword
  return encryptPDF(bytes, opts.userPassword, { ownerPassword: owner })
}

function getQpdfWasmUrl(): string {
  if (typeof window !== "undefined") {
    const base = ((import.meta as unknown) as { env?: { BASE_URL?: string } }).env?.BASE_URL || "/"
    return `${base.replace(/\/$/, "")}/wasm/qpdf.wasm`
  }
  return "public/wasm/qpdf.wasm"
}

/** Check if a PDF document has password protection or encryption */
export async function isPdfEncrypted(bytes: Uint8Array): Promise<boolean> {
  try {
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true })
    return Boolean(doc.context.trailerInfo.Encrypt)
  } catch {
    // If PDFDocument.load fails to parse due to encrypted object streams, it is encrypted
    return true
  }
}

/**
 * Remove password protection (decrypt) with the supplied password using QPDF WebAssembly.
 * Supports all PDF encryption standards: AES-128, AES-256 (R5/R6), RC4, and encrypted object streams.
 */
export async function unlockPdf(bytes: Uint8Array, password: string): Promise<Uint8Array> {
  const isEncrypted = await isPdfEncrypted(bytes)
  if (!isEncrypted) {
    throw new Error("This PDF is not password-protected.")
  }

  const { default: createQpdf } = await import("@neslinesli93/qpdf-wasm")

  let capturedErr = ""
  const origError = console.error
  const wasmUrl = getQpdfWasmUrl()

  console.error = (...args: unknown[]) => {
    capturedErr += args.map((a) => String(a)).join(" ") + "\n"
    origError(...args)
  }

  let qpdf: any
  try {
    qpdf = await (createQpdf as unknown as (opts: Record<string, unknown>) => Promise<any>)({
      locateFile: () => wasmUrl,
      print: () => {},
      printErr: (msg: string) => {
        capturedErr += msg + "\n"
      },
    })
  } finally {
    console.error = origError
  }

  const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`
  const inPath = `/in_${id}.pdf`
  const outPath = `/out_${id}.pdf`

  try {
    ;(qpdf.FS as unknown as { writeFile: (path: string, data: Uint8Array) => void }).writeFile(
      inPath,
      bytes,
    )

    // Try user's exact password first, then common variations (e.g. trimmed, uppercase/lowercase for bank statements)
    const candidates = Array.from(
      new Set([
        password,
        password.trim(),
        password.trim().toUpperCase(),
        password.trim().toLowerCase(),
      ]),
    ).filter((p) => p.length > 0)

    let decrypted: Uint8Array | null = null

    for (const candidate of candidates) {
      try {
        ;(qpdf.FS as unknown as { unlink: (path: string) => void }).unlink(outPath)
      } catch {}

      capturedErr = ""
      console.error = (...args: unknown[]) => {
        capturedErr += args.map((a) => String(a)).join(" ") + "\n"
        origError(...args)
      }

      try {
        const args = [
          "--warning-exit-0",
          "--decrypt",
          `--password=${candidate}`,
          inPath,
          outPath,
        ]
        qpdf.callMain(args)
      } catch {
        // callMain may throw ExitStatus
      } finally {
        console.error = origError
      }

      try {
        const data = (
          qpdf.FS as unknown as { readFile: (path: string) => Uint8Array }
        ).readFile(outPath)
        if (data && data.length > 0) {
          decrypted = data
          break
        }
      } catch {}
    }

    if (decrypted && decrypted.length > 0) {
      return decrypted
    }

    // If none of the candidates succeeded in decrypting:
    if (/not encrypted/i.test(capturedErr)) {
      throw new Error("This PDF is not password-protected.")
    }
    if (/invalid password/i.test(capturedErr) || /password/i.test(capturedErr)) {
      throw new Error("Incorrect password. Please verify the password and try again.")
    }
    if (/damaged|corrupt/i.test(capturedErr)) {
      throw new Error("Could not unlock this PDF because the file appears to be damaged.")
    }

    throw new Error(
      capturedErr.trim() || "Incorrect password. Please verify the password and try again.",
    )
  } finally {
    try {
      ;(qpdf.FS as unknown as { unlink: (path: string) => void }).unlink(inPath)
    } catch {}
    try {
      ;(qpdf.FS as unknown as { unlink: (path: string) => void }).unlink(outPath)
    } catch {}
  }
}


export interface TextWatermarkOptions {
  text: string
  /** Watermark color as hex, e.g. "#dc262b" (no default grey). */
  color?: string
  /** Font size relative to page's short side (default 0.045). */
  scale?: number
  /** Approximate number of stamps along the diagonal (default 4). */
  tiles?: number
  opacity?: number
}

/**
 * Stamp a diagonal text watermark across every page. Draws with an embedded
 * font so non-ASCII text (e.g. §, ©, accents) renders reliably.
 */
export async function watermarkPdf(
  bytes: Uint8Array,
  opts: TextWatermarkOptions,
): Promise<Uint8Array> {
  const text = opts.text.trim()
  if (!text) throw new Error("Watermark text is empty.")

  const doc = await PDFDocument.load(bytes)
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const [r, g, b] = hexToRgb(opts.color ?? "#9ca3af")
  const color = rgb(r, g, b)

  for (const page of doc.getPages()) {
    const { width, height } = page.getSize()
    const short = Math.min(width, height)
    const fontSize = (opts.scale ?? 0.055) * short
    const opacity = clamp(opts.opacity ?? 0.18, 0.05, 1)
    const textW = font.widthOfTextAtSize(text, fontSize)

    // Diagonal tiling: iterate a grid covering the page when rotated 45°.
    // `tiles` (default 4) controls how many stamps run along the diagonal.
    const tiles = clamp(opts.tiles ?? 4, 1, 30)
    const diag = Math.hypot(width, height)
    const cell = diag / tiles
    const cols = Math.ceil((width + height) / (cell * Math.SQRT2)) + 1
    const rows = cols
    const step = cell

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        // Coordinate on the page (before rotation about their own center).
        const cx = ((col - (rows - 1) / 2) * step) + width / 2
        const cy = ((row - (cols - 1) / 2) * step) + height / 2
        if (cx < -diag || cx > width + diag || cy < -diag || cy > height + diag) continue

        page.drawText(text, {
          x: cx - textW / 2,
          y: cy - fontSize / 2,
          size: fontSize,
          font,
          color,
          opacity,
          rotate: degrees(-45),
        })
      }
    }
  }

  return doc.save()
}

/** Clamp to [min, max]. */
function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v))
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace(/^#/, "")
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean
  const int = parseInt(full, 16)
  if (Number.isNaN(int)) return [0.61, 0.64, 0.69]
  return [
    ((int >> 16) & 0xff) / 255,
    ((int >> 8) & 0xff) / 255,
    (int & 0xff) / 255,
  ]
}
