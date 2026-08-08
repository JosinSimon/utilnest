/**
 * Shared, renderer-agnostic PDF helpers.
 *
 * Everything here uses `pdf-lib` (already a dependency, used by Document
 * Scanner). The tools in `pdf/` are thin engines that compose these helpers:
 * merge, split, reorder, rotate, encrypt/decrypt all reduce to pdf-lib calls.
 * PDF rendering (PDF → JPG / thumbnails / compress-by-rasterize) lives in
 * `render.ts` and lazily loads pdf.js so the initial bundle stays small.
 */

import { PDFDocument } from "pdf-lib"

export interface PdfSize {
  width: number
  height: number
  unit: "pt"
}

export interface PageInfo {
  index: number
  width: number
  height: number
  rotation: number
}

export type PdfPasswordMode = "user" | "owner"

export interface PdfProtectOptions {
  userPassword?: string
  ownerPassword?: string
  /** True (default) copies the original first/third-party restriction flags. */
  copyRestrictions: boolean
}

/**
 * Split a page range string like "1-3,5,7-9" into 1-based page indices.
 * Returns only in-bounds indices. Throws `Error` on a malformed token.
 */
export function parsePageRange(spec: string, pageCount: number): number[] {
  const out: number[] = []
  for (const rawToken of spec.split(",")) {
    const token = rawToken.trim()
    if (!token) continue
    const m = /^(\d+)(?:\s*-\s*(\d+))?$/.exec(token)
    if (!m) throw new Error(`Invalid page range "${rawToken}". Use numbers like 1-3,5.`)
    const a = Number(m[1])
    const b = m[2] !== undefined ? Number(m[2]) : a
    if (a < 1 || b < a) throw new Error(`Invalid page range "${rawToken}".`)
    const start = Math.min(a, pageCount)
    const end = Math.min(b, pageCount)
    for (let p = start; p <= end; p++) out.push(p)
  }
  return out
}

/** Load a PDF and return its page count + page sizes (read-only probe). */
export async function probePdf(bytes: Uint8Array): Promise<{
  pageCount: number
  pages: PageInfo[]
  isEncrypted: boolean
}> {
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true })
  const pages = doc.getPages().map((p, index) => {
    const { width, height } = p.getSize()
    return { index, width, height, rotation: p.getRotation().angle }
  })
  return {
    pageCount: pages.length,
    pages,
    isEncrypted: false,
  }
}

/** Read the bytes of a File into a Uint8Array. */
export async function fileToUint8(file: File): Promise<Uint8Array> {
  return new Uint8Array(await file.arrayBuffer())
}

export function pdfFileName(base: string, suffix: string): string {
  const clean = base.toLowerCase().replace(/\.pdf$/i, "")
  return `${clean}-${suffix}.pdf`
}

export function stripPdfExtension(name: string): string {
  return name.replace(/\.pdf$/i, "")
}

export function pageRangeSummary(selected: number[]): string {
  if (selected.length === 0) return "no pages"
  const sorted = [...selected].sort((a, b) => a - b)
  const parts: string[] = []
  let start = sorted[0]
  let prev = sorted[0]
  for (let i = 1; i <= sorted.length; i++) {
    const cur = sorted[i]
    if (cur === prev + 1) {
      prev = cur
      continue
    }
    parts.push(start === prev ? `${start}` : `${start}-${prev}`)
    start = cur
    prev = cur
  }
  return parts.join(", ")
}

export { PDFDocument }
