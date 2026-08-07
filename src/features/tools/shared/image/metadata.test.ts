import { describe, it, expect } from "vitest"
import { extractJpegExif, extractPngSize, formatBytes, detectFormat } from "./metadata"

/** Minimal JPEG with no EXIF (SOI + EOI). */
function minimalJpeg(): Uint8Array {
  return new Uint8Array([0xff, 0xd8, 0xff, 0xd9])
}

/** Build a synthetic JPEG with an EXIF APP1 carrying orientation/DPI. */
function jpegWithExif(orientation: number, xResolution = 300): Uint8Array {
  // Layout: SOI, APP1 (FF E1 len "Exif\0\0" + TIFF)
  const bytes = [0xff, 0xd8]

  const tiff = buildTiff(orientation, xResolution)
  const payload = [0x45, 0x78, 0x69, 0x66, 0x00, 0x00, ...tiff] // "Exif\0\0"+tiff
  const segLen = payload.length + 2 // length doesn't include the 2 length bytes
  bytes.push(0xff, 0xe1, (segLen >> 8) & 0xff, segLen & 0xff, ...payload)
  bytes.push(0xff, 0xd9)
  return new Uint8Array(bytes)
}

function buildTiff(orientation: number, xResolution: number): number[] {
  // TIFF little-endian (II*\0). IFD0 at offset 8.
  const bb: number[] = []
  const push16 = (v: number) => {
    bb.push(v & 0xff, (v >> 8) & 0xff)
  }
  const push32 = (v: number) => {
    bb.push(v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >> 24) & 0xff)
  }
  bb.push(0x49, 0x49, 0x2a, 0x00) // II*\0
  push32(8) // IFD0 offset

  const entries = 3
  push16(entries)
  const dataStart = 8 + 2 + entries * 12 + 4 // header + count + entries + nextIFD

  // orientation (SHORT=3, inline)
  push16(0x0112)
  push16(3)
  push32(1)
  push16(orientation)
  push16(0)

  // x-resolution (RATIONAL=5, pointer to dataStart)
  push16(0x011a)
  push16(5)
  push32(1)
  push32(dataStart)

  // y-resolution (RATIONAL=5, pointer to dataStart+8)
  push16(0x011b)
  push16(5)
  push32(1)
  push32(dataStart + 8)

  push32(0) // next IFD offset
  // rational values
  push32(xResolution)
  push32(1)
  push32(xResolution)
  push32(1)
  return bb
}

describe("metadata EXIF parsing", () => {
  it("returns hasExifMarker false for a JPEG without EXIF", () => {
    const r = extractJpegExif(minimalJpeg())
    expect(r).toEqual({ hasExifMarker: false })
  })

  it("reads orientation 6 from a big-endian-free little-endian TIFF", () => {
    const r = extractJpegExif(jpegWithExif(6, 300))
    expect(r.orientation).toBe(6)
    expect(r.hasExifMarker).toBe(true)
  })

  it("reads orientation 8", () => {
    expect(extractJpegExif(jpegWithExif(8)).orientation).toBe(8)
  })

  it("reads DPI", () => {
    expect(extractJpegExif(jpegWithExif(1, 150)).dpi).toBe(150)
  })
})

describe("metadata PNG", () => {
  it("extracts PNG size from IHDR", () => {
    // PNG sig + IHDR length 13 + 'IHDR' + width(4) height(4) ...
    const data = new Uint8Array(24)
    data.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    data.set([0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52], 8)
    data.set([0, 0, 0x0c, 0x80], 16) // 3200
    data.set([0, 0, 0x09, 0x60], 20) // 2400
    expect(extractPngSize(data)).toEqual({ width: 3200, height: 2400 })
  })
})

describe("metadata format detection", () => {
  it("detects jpeg and png by magic number", () => {
    expect(detectFormat(new Uint8Array([0xff, 0xd8, 0xff]))).toBe("jpeg")
    expect(detectFormat(new Uint8Array([0x89, 0x50, 0x4e, 0x47]) as Uint8Array)).toBe("png")
    expect(detectFormat(new Uint8Array([0x00, 0x01, 0x02]))).toBeUndefined()
  })
})

describe("metadata formatBytes", () => {
  it("formats bytes nicely", () => {
    expect(formatBytes(500)).toBe("500 B")
    expect(formatBytes(34816, 1)).toBe("34.0 KB")
    expect(formatBytes(1024 * 1024)).toBe("1.0 MB")
  })
})