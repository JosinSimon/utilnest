import type { ImageFormat, ProcessingReport } from "./types"

/**
 * Metadata & EXIF handling (pure byte parsing) plus building the processing
 * report. No DOM / canvas. Decoding actual image pixels belongs to driver.ts.
 */

/** Detect container format (jpeg/png) from leading magic bytes. */
export function detectFormat(data: Uint8Array): ImageFormat | undefined {
  if (data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return "jpeg"
  if (
    data.length >= 4 &&
    data[0] === 0x89 &&
    data[1] === 0x50 &&
    data[2] === 0x4e &&
    data[3] === 0x47
  ) {
    return "png"
  }
  return undefined
}

export interface ImageMetadata {
  width: number
  height: number
  bytes: number
  format?: string
  /** EXIF orientation value (1..8) if present. */
  orientation?: number
  /** DPI stored in file metadata, if any (0 when unknown). */
  dpi?: number
  exifPresent: boolean
}

export interface ReportInput {
  original: ImageMetadata
  final: {
    width: number
    height: number
    bytes: number
    format: ImageFormat
  }
  jpegQuality: number
  presetId?: string
  presetName?: string
  steps?: { label: string; value: string }[]
}

/** Compile a human-visible + machine-readable processing report. */
export function buildProcessingReport(input: ReportInput): ProcessingReport {
  const originalBytes = input.original.bytes || 0
  const compressionRatio =
    originalBytes > 0 ? 1 - input.final.bytes / originalBytes : 0

  return {
    original: {
      width: input.original.width,
      height: input.original.height,
      bytes: originalBytes,
      format: input.original.format,
    },
    final: input.final,
    jpegQuality: input.jpegQuality,
    compressionRatio,
    presetId: input.presetId,
    presetName: input.presetName,
    steps: input.steps,
  }
}

/** Human format of a byte count, e.g. 34816 -> "34.0 KB". */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes <= 0) return "0 B"
  const units = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const value = bytes / Math.pow(1024, i)
  const fixed = value.toFixed(i === 0 ? 0 : decimals)
  return `${fixed} ${units[i]}`
}

// ---- EXIF parsing (pure byte reader) --------------------------------------

const ORIENTATION_TAG = 0x0112
const X_RESOLUTION = 0x011a

/**
 * Extract EXIF orientation (1..8) and DPI from a JPEG byte buffer.
 * Pure: reads a DataView, never touches the DOM.
 */
export function extractJpegExif(buffer: ArrayBuffer | Uint8Array): {
  orientation?: number
  dpi?: number
  hasExifMarker: boolean
} {
  const data = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
  if (data.length < 12 || !(data[0] === 0xff && data[1] === 0xd8)) {
    return { hasExifMarker: false }
  }
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength)

  let offset = 2
  while (offset + 4 <= data.length) {
    if (data[offset] !== 0xff) break
    const code = data[offset + 1]
    if (code === 0xd8 || code === 0xd9) {
      offset += 2
      continue
    }
    const segLen = view.getUint16(offset + 2, false)
    if (segLen < 2) break
    const segEnd = offset + 2 + segLen
    if (code === 0xe1 && segEnd <= data.length) {
      const exif = parseApp1Exif(data, view, offset + 4)
      if (exif) return { orientation: exif.orientation, dpi: exif.dpi, hasExifMarker: true }
    }
    offset = segEnd
  }
  return { hasExifMarker: false }
}

/**
 * Parse an APP1 block. `payloadStart` points at the "Exif\0\0" signature.
 * Returns orientation/DPI if the TIFF IFD0 can be read.
 */
function parseApp1Exif(
  data: Uint8Array,
  view: DataView,
  payloadStart: number,
): { orientation?: number; dpi?: number } | null {
  const sig = payloadStart
  if (
    data[sig] !== 0x45 ||
    data[sig + 1] !== 0x78 ||
    data[sig + 2] !== 0x69 ||
    data[sig + 3] !== 0x66 ||
    data[sig + 4] !== 0x00 ||
    data[sig + 5] !== 0x00
  ) {
    return null // not an EXIF APP1 ("Exif\0\0")
  }
  const tiff = sig + 6
  return parseTiffBlock(data, view, tiff)
}

/** Parse a TIFF header + IFD0. */
function parseTiffBlock(
  data: Uint8Array,
  view: DataView,
  tiffStart: number,
): { orientation?: number; dpi?: number } | null {
  const first = data[tiffStart]
  const little = first === 0x49 && data[tiffStart + 1] === 0x49
  const big = first === 0x4d && data[tiffStart + 1] === 0x4d
  if (!little && !big) return null
  if (view.getUint16(tiffStart + 2, little) !== 42) return null

  const ifd0 = tiffStart + view.getUint32(tiffStart + 4, little)
  const count = view.getUint16(ifd0, little)

  let orientation: number | undefined
  let dpi: number | undefined

  for (let i = 0; i < count; i++) {
    const entry = ifd0 + 2 + i * 12
    if (entry + 12 > data.length) break
    const tag = view.getUint16(entry, little)
    const type = view.getUint16(entry + 2, little)
    if (tag === ORIENTATION_TAG) {
      orientation = view.getUint16(entry + 8, little)
    } else if (tag === X_RESOLUTION && type === 5) {
      // RATIONAL values are stored as a pointer (offset from TIFF start)
      const ptr = view.getUint32(entry + 8, little)
      dpi = readRational(view, tiffStart + ptr, little)
    }
  }
  return { orientation, dpi }
}

function readRational(view: DataView, offset: number, little: boolean): number | undefined {
  try {
    const num = view.getUint32(offset, little)
    const den = view.getUint32(offset + 4, little)
    if (den === 0) return undefined
    return num / den
  } catch {
    return undefined
  }
}

/** Extract width/height from the PNG IHDR chunk (pure, for non-EXIF PNGs). */
export function extractPngSize(buffer: ArrayBuffer | Uint8Array): {
  width?: number
  height?: number
} {
  const data = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
  if (
    data.length < 24 ||
    data[0] !== 0x89 ||
    data[1] !== 0x50 ||
    data[2] !== 0x4e ||
    data[3] !== 0x47
  ) {
    return {}
  }
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength)
  return { width: view.getUint32(16, false), height: view.getUint32(20, false) }
}