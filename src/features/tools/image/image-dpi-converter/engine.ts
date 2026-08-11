import type { FileJob } from "@/features/tools/engine"
import { toArrayBuffer } from "@/features/tools/engine"

export interface DpiInfo {
  format: "jpeg" | "png"
  /** Current DPI, 0 when not set. */
  dpi: number
}

export interface DpiConvertInput {
  file: File
  dpi: number
}

export interface DpiConvertOutput {
  blob: Blob
  fileName: string
  bytes: number
  dpi: number
  format: "jpeg" | "png"
}

// ---------- Pure byte helpers (unit-testable) ----------

function readU16(data: Uint8Array, off: number): number {
  return (data[off] << 8) | data[off + 1]
}

function readU32(data: Uint8Array, off: number): number {
  return data[off] * 0x1000000 + ((data[off + 1] << 16) | (data[off + 2] << 8) | data[off + 3])
}

function writeU16(data: Uint8Array, off: number, v: number): void {
  const u = v & 0xffff
  data[off] = (u >> 8) & 0xff
  data[off + 1] = u & 0xff
}

function writeU32(data: Uint8Array, off: number, v: number): void {
  const u = v >>> 0
  data[off] = (u >>> 24) & 0xff
  data[off + 1] = (u >>> 16) & 0xff
  data[off + 2] = (u >>> 8) & 0xff
  data[off + 3] = u & 0xff
}

/** Detect container format from magic bytes. */
export function detectContainer(data: Uint8Array): "jpeg" | "png" | undefined {
  if (data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return "jpeg"
  if (
    data.length >= 8 &&
    data[0] === 0x89 &&
    data[1] === 0x50 &&
    data[2] === 0x4e &&
    data[3] === 0x47 &&
    data[4] === 0x0d &&
    data[5] === 0x0a &&
    data[6] === 0x1a &&
    data[7] === 0x0a
  ) {
    return "png"
  }
  return undefined
}

// ---------- CRC32 (PNG chunks) ----------

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff
  for (let i = 0; i < bytes.length; i++) {
    c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8)
  }
  return (c ^ 0xffffffff) >>> 0
}

// ---------- JPEG JFIF APP0 ----------

/**
 * If a JFIF APP0 segment exists, return the byte offset of its density units
 * field; otherwise -1. Density layout within the segment payload:
 *   version(2) units(1) Xdensity(2) Ydensity(2) thumbnail...
 * We return the offset of the `units` byte.
 */
function findJfifUnitsOffset(data: Uint8Array): number {
  let i = 2 // skip SOI (FFD8)
  while (i + 4 <= data.length) {
    if (data[i] !== 0xff) break
    const marker = data[i + 1]
    if (marker === 0xd8 || marker === 0xd9 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2 // standalone marker, no length
      continue
    }
    const segLen = readU16(data, i + 2)
    if (segLen < 2) break
    const payload = i + 4
    if (marker === 0xe0 && payload + 5 <= data.length) {
      const isJfif =
        data[payload] === 0x4a && data[payload + 1] === 0x46 && data[payload + 2] === 0x49 && data[payload + 3] === 0x46 && data[payload + 4] === 0x00
      if (isJfif) return payload + 7 // version(2) + jfif(5) -> units byte
    }
    i += 2 + segLen
  }
  return -1
}

function makeJfifApp0(dpi: number): Uint8Array {
  const seg = new Uint8Array([
    0xff, 0xe0, // APP0 marker
    0x00, 0x10, // length = 16
    0x4a, 0x46, 0x49, 0x46, 0x00, // "JFIF\0"
    0x01, 0x01, // version 1.1
    0x01, // units = pixels per inch
    0x00, 0x00, // Xdensity
    0x00, 0x00, // Ydensity
    0x00, 0x00, // thumbnail 0x0
  ])
  writeU16(seg, 12, dpi)
  writeU16(seg, 14, dpi)
  return seg
}

function rewriteJpegDpi(data: Uint8Array, dpi: number): Uint8Array {
  const unitsOff = findJfifUnitsOffset(data)
  if (unitsOff === -1) {
    // Insert APP0 immediately after SOI (offset 2).
    const app0 = makeJfifApp0(dpi)
    const out = new Uint8Array(data.length + app0.length)
    out.set(data.subarray(0, 2), 0)
    out.set(app0, 2)
    out.set(data.subarray(2), 2 + app0.length)
    return out
  }
  const out = new Uint8Array(data)
  out[unitsOff] = 0x01 // dots per inch
  writeU16(out, unitsOff + 1, dpi)
  writeU16(out, unitsOff + 3, dpi)
  return out
}

// ---------- PNG chunks ----------

const PNG_SIG = 8
const TYPE_IHDR = 0x49484452 // "IHDR"
const TYPE_PHYS = 0x70485973 // "pHYs"
const TYPE_IEND = 0x49454e44 // "IEND"

function readChunkHeader(data: Uint8Array, i: number): { len: number; type: number; dataStart: number } {
  const len = (data[i] << 24) | (data[i + 1] << 16) | (data[i + 2] << 8) | data[i + 3]
  const type = (data[i + 4] << 24) | (data[i + 5] << 16) | (data[i + 6] << 8) | data[i + 7]
  return { len, type, dataStart: i + 8 }
}

/**
 * Find the byte offset of the pHYs data (points at the 9-byte data field), or -1.
 */
function findPhysDataOffset(data: Uint8Array): number {
  let i = PNG_SIG
  while (i + 8 <= data.length) {
    const { len, type, dataStart } = readChunkHeader(data, i)
    if (type === TYPE_PHYS) return dataStart
    if (type === TYPE_IEND) return -1
    i = dataStart + len + 4
  }
  return -1
}

/** Build a full pHYs chunk (length + type + 9 data bytes + CRC). */
function buildPhysChunk(ppi: number): Uint8Array {
  const data = new Uint8Array(9)
  writeU32(data, 0, ppi)
  writeU32(data, 4, ppi)
  data[8] = 1 // unit = meter
  const chunk = new Uint8Array(4 + 4 + 9 + 4)
  chunk[4] = 0x70
  chunk[5] = 0x48
  chunk[6] = 0x59
  chunk[7] = 0x73
  chunk.set(data, 8)
  writeU32(chunk, 0, 9)
  const typeAndData = new Uint8Array(13)
  typeAndData.set(chunk.subarray(4, 8), 0)
  typeAndData.set(data, 4)
  writeU32(chunk, 8 + 9, crc32(typeAndData))
  return chunk
}

function rewritePngDpi(data: Uint8Array, dpi: number): Uint8Array {
  const ppi = Math.round(dpi * 39.3701) // pixels per inch -> pixels per meter
  const exist = findPhysDataOffset(data)

  if (exist !== -1) {
    // Patch the existing pHYs data in place and fix its CRC.
    const out = new Uint8Array(data)
    writeU32(out, exist, ppi)
    writeU32(out, exist + 4, ppi)
    out[exist + 8] = 1
    // CRC covers type(4) + data(9) starting 4 bytes before dataStart.
    const typeAndData = new Uint8Array(13)
    typeAndData.set(out.subarray(exist - 4, exist + 9), 0)
    writeU32(out, exist + 9, crc32(typeAndData))
    return out
  }

  // Insert pHYs right after IHDR so image readers see it early.
  const chunk = buildPhysChunk(ppi)
  let i = PNG_SIG
  while (i + 8 <= data.length) {
    const { len, type, dataStart } = readChunkHeader(data, i)
    if (type === TYPE_IHDR) {
      const ihdrEnd = dataStart + len + 4
      const out = new Uint8Array(data.length + chunk.length)
      out.set(data.subarray(0, ihdrEnd), 0)
      out.set(chunk, ihdrEnd)
      out.set(data.subarray(ihdrEnd), ihdrEnd + chunk.length)
      return out
    }
    i = dataStart + len + 4
  }
  // No IHDR found (defensive) — just append before IEND if present, else return as-is.
  return data
}

// ---------- Public API ----------

/** Read the current DPI (0 if unknown). */
export function readDpi(data: Uint8Array): DpiInfo | undefined {
  const fmt = detectContainer(data)
  if (fmt === "jpeg") {
    const unitsOff = findJfifUnitsOffset(data)
    if (unitsOff === -1) return { format: "jpeg", dpi: 0 }
    const units = data[unitsOff]
    const dpi = readU16(data, unitsOff + 1)
    if (units === 1) return { format: "jpeg", dpi }
    if (units === 2) return { format: "jpeg", dpi: Math.round(dpi * 2.54) }
    return { format: "jpeg", dpi: 0 }
  }
  if (fmt === "png") {
    const off = findPhysDataOffset(data)
    if (off === -1) return { format: "png", dpi: 0 }
    const ppiX = readU32(data, off)
    return { format: "png", dpi: Math.round(ppiX * 0.0254) }
  }
  return undefined
}

/** Rewrite an image's DPI metadata without resampling pixels. */
export function rewriteDpi(data: Uint8Array, dpi: number): { out: Uint8Array; format: "jpeg" | "png" } {
  const fmt = detectContainer(data)
  if (fmt === "jpeg") return { out: rewriteJpegDpi(data, dpi), format: "jpeg" }
  if (fmt === "png") return { out: rewritePngDpi(data, dpi), format: "png" }
  throw new Error("Unsupported format. Please upload a JPG or PNG image.")
}

export function runDpiConvert(input: DpiConvertInput): FileJob<DpiConvertOutput> {
  let cancelled = false
  let onProgress: (p: number) => void = () => {}
  const promise = (async () => {
    try {
      onProgress(0.1)
      const bytesIn = input.file.size
      const data = new Uint8Array(await input.file.arrayBuffer())
      const { out, format } = rewriteDpi(data, input.dpi)
      onProgress(1)
      if (cancelled) throw new Error("cancelled")
      const base = input.file.name.replace(/\.[^/.]+$/, "")
      const part = new Uint8Array(out)
      return {
        success: true,
        data: {
          blob: new Blob([part], { type: format === "png" ? "image/png" : "image/jpeg" }),
          fileName: `${base}-${input.dpi}dpi.${format === "png" ? "png" : "jpg"}`,
          bytes: out.length,
          format,
          dpi: input.dpi,
        },
        meta: { bytesIn, bytesOut: out.length, durationMs: 0 },
      }
    } catch (err) {
      return {
        success: false,
        data: undefined as unknown as DpiConvertOutput,
        meta: { bytesIn: 0, bytesOut: 0, durationMs: 0 },
        error: { code: "dpi_error", message: (err as Error).message },
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

export { toArrayBuffer }