import { describe, expect, it } from "vitest"
import { layoutWatermark, POSITIONS, type Box } from "./engine"

const IMG = { w: 1000, h: 800 }
const logo: Box = { width: 200, height: 100 }
const text: Box = { width: 300, height: 48 }
const M = 24

const overlaps = (a: { x: number; y: number }, ab: Box, b: { x: number; y: number }, bb: Box) =>
  a.x < b.x + bb.width && b.x < a.x + ab.width && a.y < b.y + bb.height && b.y < a.y + ab.height

describe("layoutWatermark", () => {
  it("never overlaps logo and text, in every position", () => {
    for (const position of POSITIONS) {
      const l = layoutWatermark(IMG.w, IMG.h, logo, text, position, M)
      expect(overlaps(l.logo!, logo, l.text!, text), position).toBe(false)
      // Both stay inside the image.
      for (const [p, b] of [[l.logo!, logo], [l.text!, text]] as const) {
        expect(p.x).toBeGreaterThanOrEqual(0)
        expect(p.y).toBeGreaterThanOrEqual(0)
        expect(p.x + b.width).toBeLessThanOrEqual(IMG.w)
        expect(p.y + b.height).toBeLessThanOrEqual(IMG.h)
      }
    }
  })

  it("stacks the logo above the text and aligns them to the chosen edge", () => {
    const br = layoutWatermark(IMG.w, IMG.h, logo, text, "bottom-right", M)
    expect(br.logo!.y).toBeLessThan(br.text!.y)
    expect(br.logo!.x + logo.width).toBe(IMG.w - M)
    expect(br.text!.x + text.width).toBe(IMG.w - M)
    expect(br.text!.y + text.height).toBe(IMG.h - M)

    const tl = layoutWatermark(IMG.w, IMG.h, logo, text, "top-left", M)
    expect(tl.logo).toEqual({ x: M, y: M })
    expect(tl.text!.x).toBe(M)

    const c = layoutWatermark(IMG.w, IMG.h, logo, text, "center", M)
    expect(c.logo!.x + logo.width / 2).toBe(IMG.w / 2)
    expect(c.text!.x + text.width / 2).toBe(IMG.w / 2)
  })

  it("places a single item exactly as before", () => {
    const onlyText = layoutWatermark(IMG.w, IMG.h, null, text, "bottom-right", M)
    expect(onlyText.logo).toBeUndefined()
    expect(onlyText.text).toEqual({ x: IMG.w - text.width - M, y: IMG.h - text.height - M })
    const onlyLogo = layoutWatermark(IMG.w, IMG.h, logo, null, "top-left", M)
    expect(onlyLogo.logo).toEqual({ x: M, y: M })
    expect(onlyLogo.text).toBeUndefined()
  })
})
