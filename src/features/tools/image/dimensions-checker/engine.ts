import type { EngineResult } from "@/features/tools/engine"
import { fail } from "@/features/tools/engine"

export interface DimensionsInfo {
  width: number
  height: number
  bytes: number
  format: string
  aspect: string
  megapixels: number
  /** 0 when unknown. */
  dpi: number
}

function describeAspect(w: number, h: number): string {
  const g = gcd(w, h)
  const a = w / g
  const b = h / g
  return `${a}:${b}`
}

function gcd(a: number, b: number): number {
  let x = a
  let y = b
  while (y) {
    const t = y
    y = x % y
    x = t
  }
  return x
}

/** Read an image's key properties from its file bytes (pure, no DOM). */
export function readImageDimensions(
  data: Uint8Array | ArrayBuffer,
): EngineResult<DimensionsInfo> {
  try {
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data)
    let width: number | undefined
    let height: number | undefined
    let format = "unknown"
    let dpi = 0

    if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      format = "jpeg"
      const { width: w, height: h } = parseJpegDims(bytes)
      width = w
      height = h
      dpi = readJpegDpi(bytes)
    } else if (
      bytes.length >= 8 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    ) {
      format = "png"
      const { width: w, height: h, dpi: d } = parsePng(bytes)
      width = w
      height = h
      dpi = d
    }

    if (!width || !height) {
      return fail("unsupported", "Unsupported or corrupt image. Please upload a JPG or PNG.")
    }

    return {
      success: true,
      data: {
        width,
        height,
        bytes: bytes.length,
        format,
        aspect: describeAspect(width, height),
        megapixels: Math.round(((width * height) / 1e6) * 100) / 100,
        dpi,
      },
      meta: { bytesIn: bytes.length, bytesOut: 0, durationMs: 0 },
    }
  } catch (err) {
    return fail("parse_error", err instanceof Error ? err.message : "Could not read the image.")
  }
}

function parseJpegDims(bytes: Uint8Array): { width: number; height: number } {
  let i = 2
  while (i + 4 <= bytes.length) {
    if (bytes[i] !== 0xff) break
    const marker = bytes[i + 1]
    if (marker === 0xd8 || marker === 0xd9 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2
      continue
    }
    const segLen = (bytes[i + 2] << 8) | bytes[i + 3]
    const isSoF =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc
    if (isSoF && i + 4 + 5 <= bytes.length) {
      const height = (bytes[i + 5] << 8) | bytes[i + 6]
      const width = (bytes[i + 7] << 8) | bytes[i + 8]
      if (width > 0 && height > 0) return { width, height }
    }
    i += 2 + segLen
  }
  throw new Error("Could not read JPEG dimensions.")
}

function readJpegDpi(bytes: Uint8Array): number {
  let i = 2
  while (i + 4 <= bytes.length) {
    if (bytes[i] !== 0xff) break
    const marker = bytes[i + 1]
    if (marker === 0xd8 || marker === 0xd9 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2
      continue
    }
    const segLen = (bytes[i + 2] << 8) | bytes[i + 3]
    const payload = i + 4
    if (marker === 0xe0 && payload + 5 <= bytes.length) {
      const isJfif =
        bytes[payload] === 0x4a &&
        bytes[payload + 1] === 0x46 &&
        bytes[payload + 2] === 0x49 &&
        bytes[payload + 3] === 0x46 &&
        bytes[payload + 4] === 0x00
      if (isJfif) {
        const units = bytes[payload + 7]
        const dpi = (bytes[payload + 8] << 8) | bytes[payload + 9]
        if (units === 1) return dpi
        if (units === 2) return Math.round(dpi * 2.54)
        return 0
      }
    }
    i += 2 + segLen
  }
  return 0
}

function readU32(bytes: Uint8Array, offset: number): number {
  return (
    bytes[offset] * 0x1000000 +
    ((bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3])
  )
}

function parsePng(bytes: Uint8Array): { width: number; height: number; dpi: number } {
  // IHDR is at offset 16: length(4) type(4) data(13) crc(4)
  const width = readU32(bytes, 16)
  const height = readU32(bytes, 20)
  let dpi = 0
  // Scan chunks for pHYs
  let i = 8
  while (i + 8 <= bytes.length) {
    const len = readU32(bytes, i)
    const type =
      String.fromCharCode(bytes[i + 4], bytes[i + 5], bytes[i + 6], bytes[i + 7])
    if (type === "pHYs" && len >= 9) {
      const ppiX = readU32(bytes, i + 8)
      dpi = Math.round(ppiX * 0.0254)
    }
    if (type === "IEND") break
    i += 8 + len + 4
  }
  if (!width || !height) throw new Error("Could not read PNG dimensions.")
  return { width, height, dpi }
}

export type { EngineResult } from "@/features/tools/engine"