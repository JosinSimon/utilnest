import { describe, it, expect } from "vitest"
import { PRESET_REGISTRY, getPresetById, presetVerificationText } from "./specs"

describe("preset registry integrity", () => {
  it("has no duplicate ids", () => {
    const ids = PRESET_REGISTRY.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("has non-empty values", () => {
    for (const p of PRESET_REGISTRY) {
      expect(p.exam).toBeTruthy()
      expect(p.organization).toBeTruthy()
      expect(p.dimensions.width).toBeGreaterThan(0)
      expect(p.dimensions.height).toBeGreaterThan(0)
      expect(p.acceptedFormats.length).toBeGreaterThan(0)
      expect(p.preferredFormat).toBeTruthy()
    }
  })

  it("validates kb bounds (min <= max)", () => {
    for (const p of PRESET_REGISTRY) {
      expect(p.kbMin).toBeLessThanOrEqual(p.kbMax)
    }
  })

  it("government presets never allow downscale", () => {
    for (const p of PRESET_REGISTRY) {
      expect(p.allowDownscale).toBe(false)
    }
  })

  it("lookup works", () => {
    expect(getPresetById("neet-ug-photo")?.organization).toBe("National Testing Agency (NTA)")
    expect(getPresetById("missing")).toBeUndefined()
  })

  it("renders awaiting-verification text for unverified presets", () => {
    for (const p of PRESET_REGISTRY) {
      expect(p.verified).toBe(false) // none confirmed against official yet
      expect(presetVerificationText(p)).toBe("Official specification awaiting verification.")
    }
  })
})