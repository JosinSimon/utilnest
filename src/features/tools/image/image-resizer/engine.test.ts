import { describe, it, expect } from "vitest"
import { resolveDimensions } from "./engine"

describe("resolveDimensions", () => {
  it("uses both dims verbatim when provided", () => {
    expect(resolveDimensions(1200, 800, { width: 300, height: 200 })).toEqual({
      width: 300,
      height: 200,
    })
  })

  it("derives height from width preserving aspect", () => {
    const r = resolveDimensions(1200, 800, { width: 600 })
    expect(r.width).toBe(600)
    expect(r.height).toBe(400)
  })

  it("derives width from height preserving aspect", () => {
    const r = resolveDimensions(1200, 800, { height: 400 })
    expect(r.width).toBe(600)
    expect(r.height).toBe(400)
  })

  it("returns source dims when none given", () => {
    expect(resolveDimensions(1200, 800, {})).toEqual({ width: 1200, height: 800 })
  })

  it("clamps to at least 1px", () => {
    const r = resolveDimensions(1, 1000, { width: 0 })
    expect(r.width).toBeGreaterThanOrEqual(1)
    expect(r.height).toBeGreaterThanOrEqual(1)
  })
})