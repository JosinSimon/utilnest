import { describe, it, expect } from "vitest"
import { PRESET_REGISTRY, getPresetById } from "./specs"
import { presetPixels } from "./presetPipeline"
import { dimensionsToPixels } from "./geometry"

describe("presetPipeline presetPixels", () => {
  it("returns px presets as-is", () => {
    const p = getPresetById("ssc-cgl-photo")!
    expect(presetPixels(p)).toEqual({ width: 200, height: 230 })
  })

  it("resolves cm presets at the given DPI", () => {
    const p = getPresetById("passport-photo")!
    expect(p.dimensions.unit).toBe("cm")
    const px = presetPixels(p, 300)
    const expected = dimensionsToPixels(p.dimensions, 300)
    expect(px).toEqual(expected)
    // 3.5cm at 300 dpi ≈ 413, 4.5cm at 300 dpi ≈ 531
    expect(Math.round(px.width)).toBe(413)
    expect(Math.round(px.height)).toBe(531)
  })

  it("scales with DPI", () => {
    const p = getPresetById("pan-photo")!
    const at150 = presetPixels(p, 150)
    const at300 = presetPixels(p, 300)
    expect(Math.round(at300.width / at150.width)).toBe(2)
  })
})

describe("new presets added for phase 2 tools", () => {
  it("includes passport, aadhaar and pan presets", () => {
    for (const id of ["passport-photo", "aadhaar-photo", "pan-photo", "pan-signature"]) {
      const p = getPresetById(id)
      expect(p).toBeDefined()
      expect(p!.verified).toBe(true)
      expect(p!.allowDownscale).toBe(false)
    }
  })

  it("uses cm dimensions for physical-document presets", () => {
    for (const id of ["passport-photo", "aadhaar-photo", "pan-photo"]) {
      expect(getPresetById(id)!.dimensions.unit).toBe("cm")
    }
  })

  it("registry is still internally consistent", () => {
    const ids = new Set<string>()
    for (const p of PRESET_REGISTRY) {
      expect(ids.has(p.id)).toBe(false)
      ids.add(p.id)
      expect(p.kbMin).toBeLessThanOrEqual(p.kbMax)
      expect(p.acceptedFormats.length).toBeGreaterThan(0)
      expect(p.preferredFormat).toBeTruthy()
    }
  })
})
