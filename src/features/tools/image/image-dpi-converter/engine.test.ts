import { describe, it, expect } from "vitest"
import { detectContainer, readDpi, rewriteDpi } from "./engine"

function buildJpeg(withJfif: boolean, dpi: number): Uint8Array {
  // Minimal JPEG: SOI, an APPn non-JFIF segment, then EOI.
  const appn = [0xff, 0xe1, 0x00, 0x08, 0x41, 0x42, 0x43, 0x44]
  const jfif = [
    0xff, 0xe0, 0x00, 0x10, // APP0 marker + length 16
    0x4a, 0x46, 0x49, 0x46, 0x00, // "JFIF\0"
    0x01, 0x01, // version 1.1
    0x01, // units = inch
    0x00, 0x00, 0x00, 0x00, // Xdensity, Ydensity
    0x00, 0x00, // thumbnail 0x0
  ]
  const body = withJfif ? jfif : appn
  const out = new Uint8Array([0xff, 0xd8, ...body, 0xff, 0xd9])
  if (withJfif) {
    out[14] = (dpi >> 8) & 0xff
    out[15] = dpi & 0xff
    out[16] = (dpi >> 8) & 0xff
    out[17] = dpi & 0xff
  }
  return out
}

function buildPng(withPhys: boolean, ppi: number): Uint8Array {
  const ihdrChunk = new Uint8Array([
    0x00, 0x00, 0x00, 0x0d, // length 13
    0x49, 0x48, 0x44, 0x52, // "IHDR"
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1
    0x08, 0x06, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
    0x00, 0x00, 0x00, 0x00, // dummy CRC
  ])
  const iend = [0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0x00, 0x00, 0x00, 0x00]
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
  if (!withPhys) {
    return new Uint8Array([...sig, ...ihdrChunk, ...iend])
  }
  const ppm = Math.round(ppi * 39.3701)
  const phys = [
    0x00, 0x00, 0x00, 0x09, // length 9
    0x70, 0x48, 0x59, 0x73, // "pHYs"
    (ppm >> 24) & 0xff, (ppm >> 16) & 0xff, (ppm >> 8) & 0xff, ppm & 0xff,
    (ppm >> 24) & 0xff, (ppm >> 16) & 0xff, (ppm >> 8) & 0xff, ppm & 0xff,
    0x01, // unit = meter
    0x00, 0x00, 0x00, 0x00, // dummy CRC
  ]
  return new Uint8Array([...sig, ...phys, ...ihdrChunk, ...iend])
}

describe("image-dpi-converter", () => {
  describe("detectContainer", () => {
    it("detects JPEG", () => {
      expect(detectContainer(buildJpeg(true, 300))).toBe("jpeg")
    })
    it("detects PNG", () => {
      expect(detectContainer(buildPng(true, 300))).toBe("png")
    })
    it("returns undefined for unknown bytes", () => {
      expect(detectContainer(new Uint8Array([1, 2, 3]))).toBeUndefined()
    })
  })

  describe("readDpi on JPEG", () => {
    it("reads DPI from a JFIF segment", () => {
      const r = readDpi(buildJpeg(true, 300))
      expect(r).toEqual({ format: "jpeg", dpi: 300 })
    })
    it("reports 0 when no JFIF segment exists", () => {
      expect(readDpi(buildJpeg(false, 0))).toEqual({ format: "jpeg", dpi: 0 })
    })
  })

  describe("readDpi on PNG", () => {
    it("reads DPI from pHYs", () => {
      const r = readDpi(buildPng(true, 150))
      expect(r?.format).toBe("png")
      expect(r?.dpi).toBe(150)
    })
    it("reports 0 when no pHYs chunk exists", () => {
      expect(readDpi(buildPng(false, 0))).toEqual({ format: "png", dpi: 0 })
    })
  })

  describe("rewriteDpi JPEG", () => {
    it("updates existing JFIF density", () => {
      const src = buildJpeg(true, 72)
      const { out, format } = rewriteDpi(src, 600)
      expect(format).toBe("jpeg")
      expect(readDpi(out)).toEqual({ format: "jpeg", dpi: 600 })
      // length preserved when patching in place
    })

    it("inserts a JFIF segment when missing", () => {
      const src = buildJpeg(false, 0)
      const { out } = rewriteDpi(src, 300)
      expect(readDpi(out)!.dpi).toBe(300)
      expect(readDpi(out)!.format).toBe("jpeg")
    })
  })

  describe("rewriteDpi PNG", () => {
    it("updates existing pHYs density", () => {
      const src = buildPng(true, 72)
      const { out, format } = rewriteDpi(src, 300)
      expect(format).toBe("png")
      expect(readDpi(out)!.dpi).toBe(300)
    })

    it("inserts a pHYs chunk when missing", () => {
      const src = buildPng(false, 0)
      const { out } = rewriteDpi(src, 300)
      expect(readDpi(out)!.dpi).toBe(300)
    })
  })

  it("throws for unsupported input", () => {
    expect(() => rewriteDpi(new Uint8Array([1, 2, 3]), 300)).toThrow()
  })
})