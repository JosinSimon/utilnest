import { describe, it, expect } from "vitest"
import { readImageDimensions } from "./engine"

function be32(v: number): number[] {
  return [(v >>> 24) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff]
}

/** Minimal PNG: signature + IHDR (width×height) + optional pHYs + IEND. */
function buildPng(width: number, height: number, dpi?: number): Uint8Array {
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
  const ihdrType = [0x49, 0x48, 0x44, 0x52] // IHDR
  const ihdr = [...[0x00, 0x00, 0x00, 0x0d], ...ihdrType, ...be32(width), ...be32(height), 0x08, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
  const iend = [0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0x00, 0x00, 0x00, 0x00]
  if (!dpi) return new Uint8Array([...sig, ...ihdr, ...iend])
  const ppm = Math.round(dpi * 39.3701)
  const phys = [
    0x00, 0x00, 0x00, 0x09,
    0x70, 0x48, 0x59, 0x73, // pHYs
    ...be32(ppm), ...be32(ppm),
    0x01,
    0x00, 0x00, 0x00, 0x00,
  ]
  return new Uint8Array([...sig, ...ihdr, ...phys, ...iend])
}

function buildJpeg(withJfif: boolean, width: number, height: number, dpi = 300): Uint8Array {
  const jfif = [
    0xff, 0xe0, 0x00, 0x10,
    0x4a, 0x46, 0x49, 0x46, 0x00,
    0x01, 0x01, 0x01,
    (dpi >> 8) & 0xff, dpi & 0xff,
    (dpi >> 8) & 0xff, dpi & 0xff,
    0x00, 0x00,
  ]
  const soF0Seg = [0xff, 0xc0, 0x00, 0x11, 0x08,
    (height >> 8) & 0xff, height & 0xff,
    (width >> 8) & 0xff, width & 0xff,
    0x03,
    0x01, 0x22, 0x00,
    0x02, 0x11, 0x01,
    0x03, 0x11, 0x01,
  ]
  const body = withJfif ? [...jfif, ...soF0Seg] : [...soF0Seg]
  return new Uint8Array([0xff, 0xd8, ...body, 0xff, 0xd9])
}

describe("readImageDimensions", () => {
  it("reads PNG width, height, aspect and dpi", () => {
    const res = readImageDimensions(buildPng(1200, 800, 150))
    expect(res.success).toBe(true)
    const d = res.data
    expect(d.width).toBe(1200)
    expect(d.height).toBe(800)
    expect(d.format).toBe("png")
    expect(d.aspect).toBe("3:2")
    expect(d.dpi).toBe(150)
    expect(d.megapixels).toBe(0.96)
  })

  it("reports dpi 0 for PNG without pHYs", () => {
    const res = readImageDimensions(buildPng(10, 10))
    expect(res.success).toBe(true)
    expect(res.data.dpi).toBe(0)
  })

  it("reads JPEG dimensions and dpi", () => {
    const res = readImageDimensions(buildJpeg(true, 4032, 3024))
    expect(res.success).toBe(true)
    expect(res.data.width).toBe(4032)
    expect(res.data.height).toBe(3024)
    expect(res.data.format).toBe("jpeg")
    expect(res.data.aspect).toBe("4:3")
    expect(res.data.dpi).toBe(300)
  })

  it("reads JPEG without JFIF (dpi 0)", () => {
    const res = readImageDimensions(buildJpeg(false, 640, 480))
    expect(res.success).toBe(true)
    expect(res.data.width).toBe(640)
    expect(res.data.height).toBe(480)
    expect(res.data.dpi).toBe(0)
  })

  it("fails on unsupported bytes", () => {
    const res = readImageDimensions(new Uint8Array([1, 2, 3, 4, 5]))
    expect(res.success).toBe(false)
    expect(res.error?.code).toBe("unsupported")
  })

  it("computed megapixels correctly", () => {
    const res = readImageDimensions(buildPng(1920, 1080))
    expect(res.data.megapixels).toBeCloseTo(2.07)
  })
})