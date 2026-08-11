import { describe, it, expect } from "vitest"
import { toSourceRect } from "./engine"

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