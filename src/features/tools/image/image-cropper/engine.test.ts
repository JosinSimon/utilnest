import { describe, it, expect } from "vitest"
import { fitAspectBox, normalisedAspect, resizeFromCorner, toSourceRect } from "./engine"

describe("toSourceRect", () => {
  it("maps a full 1x1 crop to the whole image", () => {
    const r = toSourceRect({ x: 0, y: 0, width: 1, height: 1 }, 1000, 800)
    expect(r).toEqual({ sx: 0, sy: 0, sWidth: 1000, sHeight: 800 })
  })

  it("maps a centered half crop", () => {
    const r = toSourceRect({ x: 0.25, y: 0.25, width: 0.5, height: 0.5 }, 1000, 800)
    expect(r.sx).toBe(250)
    expect(r.sy).toBe(200)
    expect(r.sWidth).toBe(500)
    expect(r.sHeight).toBe(400)
  })

  it("clamps a crop that exceeds the image bounds", () => {
    const r = toSourceRect({ x: 0.9, y: 0.9, width: 0.5, height: 0.5 }, 100, 100)
    expect(r.sx + r.sWidth).toBeLessThanOrEqual(100)
    expect(r.sy + r.sHeight).toBeLessThanOrEqual(100)
  })

  it("clamps a negative origin to zero", () => {
    const r = toSourceRect({ x: -0.1, y: -0.2, width: 0.5, height: 0.5 }, 100, 100)
    expect(r.sx).toBe(0)
    expect(r.sy).toBe(0)
  })

  it("clamps an origin beyond the image to a valid non-negative crop", () => {
    const r = toSourceRect({ x: 1.2, y: 1.1, width: 0.5, height: 0.5 }, 100, 100)
    expect(r.sx).toBeGreaterThanOrEqual(0)
    expect(r.sy).toBeGreaterThanOrEqual(0)
    expect(r.sWidth).toBeGreaterThanOrEqual(1)
    expect(r.sHeight).toBeGreaterThanOrEqual(1)
    expect(r.sx + r.sWidth).toBeLessThanOrEqual(100)
    expect(r.sy + r.sHeight).toBeLessThanOrEqual(100)
  })
})
describe("crop box geometry", () => {
  const W = 4000
  const H = 3000
  const full = { x: 0, y: 0, width: 1, height: 1 }
  const pxRatio = (r: { width: number; height: number }) => (r.width * W) / (r.height * H)

  it("gives true pixel ratios on a non-square photo", () => {
    for (const ratio of [1, 4 / 3, 3 / 2, 16 / 9]) {
      const box = fitAspectBox(ratio, W, H, full)
      expect(pxRatio(box)).toBeCloseTo(ratio, 6)
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.y).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(1 + 1e-9)
      expect(box.y + box.height).toBeLessThanOrEqual(1 + 1e-9)
    }
    // 1:1 on 4000×3000 is a 3000×3000 square, centred.
    const square = fitAspectBox(1, W, H, full)
    expect(square.width * W).toBeCloseTo(3000, 6)
    expect(square.height * H).toBeCloseTo(3000, 6)
    expect(square.x).toBeCloseTo(0.125, 6)
  })

  it("resizes freely from a corner, keeping the opposite corner fixed", () => {
    const start = { x: 0.2, y: 0.2, width: 0.5, height: 0.5 }
    const r = resizeFromCorner(start, "se", 0.9, 0.6, 0.05, null)
    expect(r).toEqual({ x: 0.2, y: 0.2, width: expect.closeTo(0.7, 6), height: expect.closeTo(0.4, 6) })
    const nw = resizeFromCorner(start, "nw", 0.5, 0.5, 0.05, null)
    expect(nw.x + nw.width).toBeCloseTo(0.7, 6)
    expect(nw.y + nw.height).toBeCloseTo(0.7, 6)
  })

  it("keeps a locked ratio while resizing and stays inside the image", () => {
    const a = normalisedAspect(16 / 9, W, H)
    const start = fitAspectBox(16 / 9, W, H, full)
    const small = resizeFromCorner(start, "se", start.x + 0.3, start.y + 0.9, 0.05, a)
    expect(pxRatio(small)).toBeCloseTo(16 / 9, 6)
    const big = resizeFromCorner({ ...small, x: 0.3, y: 0.3 }, "se", 5, 5, 0.05, a)
    expect(pxRatio(big)).toBeCloseTo(16 / 9, 6)
    expect(big.x + big.width).toBeLessThanOrEqual(1 + 1e-9)
    expect(big.y + big.height).toBeLessThanOrEqual(1 + 1e-9)
  })

  it("never shrinks below the minimum size", () => {
    const r = resizeFromCorner({ x: 0.2, y: 0.2, width: 0.5, height: 0.5 }, "se", 0, 0, 0.05, null)
    expect(r.width).toBeCloseTo(0.05, 6)
    expect(r.height).toBeCloseTo(0.05, 6)
  })
})
