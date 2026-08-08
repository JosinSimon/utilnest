import { describe, it, expect } from "vitest"
import { analyzeBorder, rgbDistance, luminance } from "./color"
import { floodFillMask, chromaMask, invertMask, fillEnclosedHoles } from "./mask"
import { erodeMask, featherMask } from "./refine"
import { autocropMask, resizeMask } from "./geometry"
import { removeBackground, replaceBackgroundColor, blurBackground } from "./operators"
import { extractSolidMask, recommendMode, maskStats } from "./pipeline"
import type { AlphaMask, RgbColor } from "./types"

/** Build an RGBA buffer; every pixel gets `bg`, optionally a fg rectangle. */
function makeSolid(
  w: number,
  h: number,
  bg: RgbColor,
  fgRect: { x: number; y: number; w: number; h: number } | null = null,
  fg: RgbColor = [255, 0, 0],
): Uint8ClampedArray {
  const buf = new Uint8ClampedArray(w * h * 4)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 4
      const inRect =
        fgRect &&
        x >= fgRect.x &&
        x < fgRect.x + fgRect.w &&
        y >= fgRect.y &&
        y < fgRect.y + fgRect.h
      const c = inRect ? fg : bg
      buf[o] = c[0]
      buf[o + 1] = c[1]
      buf[o + 2] = c[2]
      buf[o + 3] = 255
    }
  }
  return buf
}

describe("color math", () => {
  it("computes zero distance for identical colors", () => {
    expect(rgbDistance([10, 20, 30], [10, 20, 30])).toBe(0)
  })
  it("computes a sane luminance", () => {
    expect(luminance([255, 255, 255])).toBeGreaterThan(200)
    expect(luminance([0, 0, 0])).toBe(0)
  })
})

describe("detectBackgroundColor from border ring", () => {
  it("picks the dominant border color on a solid-backdrop image", () => {
    const buf = makeSolid(20, 20, [255, 255, 255], { x: 8, y: 8, w: 4, h: 4 }, [10, 10, 10])
    const res = analyzeBorder(buf, { width: 20, height: 20 })
    expect(res.backgroundColor[0]).toBeGreaterThan(200)
    expect(res.backgroundColor[1]).toBeGreaterThan(200)
    expect(res.backgroundColor[2]).toBeGreaterThan(200)
    expect(res.edgeVariance).toBeLessThan(0.1)
    expect(res.borderCoverage).toBeGreaterThan(0.9)
    expect(res.isSolid).toBe(true)
  })
})

describe("flood fill matcher", () => {
  it("removes the uniform background but keeps the interior subject", () => {
    const buf = makeSolid(20, 20, [255, 255, 255], { x: 8, y: 8, w: 4, h: 4 }, [10, 10, 10])
    const mask = floodFillMask(buf, { width: 20, height: 20 }, [255, 255, 255], 32)
    const out = removeBackground(buf, mask)
    expect(out[3]).toBe(0) // corner removed
    const center = (10 * 20 + 10) * 4
    expect(out[center + 3]).toBe(255) // subject kept
  })

  it("removes a fully uniform image entirely", () => {
    const buf = makeSolid(20, 20, [255, 255, 255], null)
    const mask = floodFillMask(buf, { width: 20, height: 20 }, [255, 255, 255], 0)
    const out = removeBackground(buf, mask)
    expect(out[3]).toBe(0)
    expect(out[(19 * 20 + 19) * 4 + 3]).toBe(0)
  })

  it("chroma mode removes a chosen colour across the canvas", () => {
    const buf = makeSolid(20, 20, [0, 255, 0], { x: 8, y: 8, w: 4, h: 4 }, [255, 0, 0])
    const mask = chromaMask(buf, { width: 20, height: 20 }, [0, 255, 0], 16)
    const out = removeBackground(buf, mask)
    expect(out[3]).toBe(0) // green corner removed
    const center = (10 * 20 + 10) * 4
    expect(out[center + 3]).toBe(255) // red kept
  })
})

describe("refine", () => {
  it("erodes background from a mostly-full mask", () => {
    // 5x5: outer ring is background (0), inner 3x3 core is foreground.
    const n = 5
    const m = new Uint8ClampedArray(n * n).fill(255)
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (x === 0 || y === 0 || x === n - 1 || y === n - 1) m[y * n + x] = 0
      }
    }
    const e = erodeMask(m as unknown as AlphaMask, { width: n, height: n }, 1)
    expect(e[(2) * n + 2]).toBe(255) // centre keeps fg
    expect(e[1 * n + 1]).toBe(0) // core corner eroded (window touches ring)
  })

  it("feather produces soft values at edges", () => {
    const m = new Uint8ClampedArray(9)
    m.fill(255)
    m[0] = 0
    const f = featherMask(m as unknown as AlphaMask, { width: 3, height: 3 }, 1)
    expect(f[0]).toBeLessThan(255)
    expect(f).toHaveLength(9)
  })

  it("inverts a mask", () => {
    const m = new Uint8ClampedArray([0, 255, 128])
    const inv = invertMask(m as unknown as AlphaMask)
    expect(inv[0]).toBe(255)
    expect(inv[1]).toBe(0)
  })
})

describe("fill enclosed holes", () => {
  it("fills a background hole not connected to the border", () => {
    const w = 5
    const m = new Uint8ClampedArray(w * w)
    m.fill(255)
    // draw a background ring along the border
    for (let x = 0; x < w; x++) {
      m[x] = 0
      m[(w - 1) * w + x] = 0
    }
    for (let y = 0; y < w; y++) {
      m[y * w] = 0
      m[y * w + w - 1] = 0
    }
    m[2 * w + 2] = 0 // centre hole
    const out = fillEnclosedHoles(m as unknown as AlphaMask, { width: w, height: w })
    expect(out[2 * w + 2]).toBe(255)
    expect(out[0]).toBe(0) // border stays background
  })
})

describe("geometry", () => {
  it("autocrops to the full canvas when everything is foreground", () => {
    const m = new Uint8ClampedArray(100).fill(255)
    const box = autocropMask(m as unknown as AlphaMask, { width: 10, height: 10 })
    expect(box).toEqual({ x: 0, y: 0, width: 10, height: 10 })
  })

  it("resizes a mask to the target dimensions", () => {
    const m = new Uint8ClampedArray(100)
    m[0] = 255
    m[99] = 255
    const r = resizeMask(m as unknown as AlphaMask, { width: 10, height: 10 }, { width: 20, height: 20 })
    expect(r.length).toBe(400)
  })

  it("autocrop returns null when there is no foreground", () => {
    const m = new Uint8ClampedArray(16).fill(0)
    expect(autocropMask(m as unknown as AlphaMask, { width: 4, height: 4 })).toBeNull()
  })
})

describe("operators", () => {
  const mask = new Uint8ClampedArray(16).fill(255)
  mask[0] = 0

  it("removeBackground writes the mask into alpha", () => {
    const buf = makeSolid(4, 4, [0, 0, 0], null)
    const out = removeBackground(buf, mask as unknown as AlphaMask)
    expect(out[3]).toBe(0)
    expect(out[(1 * 4 + 1) * 4 + 3]).toBe(255)
  })

  it("replaceBackgroundColor blends the edge pixel", () => {
    const buf = makeSolid(4, 4, [0, 0, 0], null)
    const out = replaceBackgroundColor(buf, mask as unknown as AlphaMask, [255, 255, 255])
    expect(out[0]).toBeGreaterThanOrEqual(220) // near-white after blend
    expect(out[3]).toBe(255)
  })

  it("blurBackground yields a fully opaque image", () => {
    const buf = makeSolid(4, 4, [0, 0, 0], null)
    const out = blurBackground(buf, { width: 4, height: 4 }, mask as unknown as AlphaMask, 2)
    expect(out[3]).toBe(255)
  })
})

describe("pipeline", () => {
  it("recommends solid for a solid-backdrop photo", () => {
    const buf = makeSolid(16, 16, [255, 255, 255], { x: 6, y: 6, w: 4, h: 4 }, [10, 10, 10])
    const rec = recommendMode(buf, { width: 16, height: 16 })
    expect(rec.recommendedMode).toBe("solid")
  })

  it("recommends ai for a noisy/complex backdrop", () => {
    const w = 16
    const h = 16
    const buf = new Uint8ClampedArray(w * h * 4)
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const o = (y * w + x) * 4
        buf[o] = (x * 17) % 256
        buf[o + 1] = (y * 29) % 256
        buf[o + 2] = (x + y) % 2 === 0 ? 0 : 255
        buf[o + 3] = 255
      }
    }
    const rec = recommendMode(buf, { width: w, height: h })
    expect(rec.recommendedMode).toBe("ai")
  })

  it("extractSolidMask returns mask and stats for a solid backdrop", () => {
    const buf = makeSolid(20, 20, [255, 255, 255], { x: 8, y: 8, w: 4, h: 4 }, [10, 10, 10])
    const res = extractSolidMask(buf, { width: 20, height: 20 })
    expect(res.analysis.isSolid).toBe(true)
    expect(res.mask.length).toBe(400)
    expect(res.stats.foregroundRatio).toBeGreaterThan(0)
    expect(res.stats.foregroundRatio).toBeLessThan(1)
  })

  it("maskStats splits fg/bg", () => {
    const m = new Uint8ClampedArray([255, 0, 255, 0])
    const s = maskStats(m as unknown as AlphaMask)
    expect(s.foregroundRatio).toBe(0.5)
    expect(s.backgroundRatio).toBe(0.5)
  })
})