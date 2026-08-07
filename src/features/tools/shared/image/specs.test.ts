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
    for (const p of PRESET_REGISTRY.filter((x) => !x.verified)) {
      expect(presetVerificationText(p)).toBe("Official specification awaiting verification.")
    }
  })

  it("verified presets carry a real source, notification year and lastVerified", () => {
    const verifiedPresets = PRESET_REGISTRY.filter((p) => p.verified)
    expect(verifiedPresets.length).toBeGreaterThan(0)
    for (const p of verifiedPresets) {
      expect(p.sourceUrl).toBeTruthy()
      expect(p.notificationYear).toBeTruthy()
      expect(/^\d{4}-\d{2}-\d{2}$/.test(p.lastVerified ?? "")).toBe(true)
      expect(presetVerificationText(p)).not.toBe("Official specification awaiting verification.")
    }
  })

  it("NEET and IBPS are the verified exam presets as of 2026", () => {
    expect(getPresetById("neet-ug-photo")?.verified).toBe(true)
    expect(getPresetById("neet-ug-signature")?.verified).toBe(true)
    expect(getPresetById("ibps-po-photo")?.verified).toBe(true)
    expect(getPresetById("ibps-signature")?.verified).toBe(true)
  })

  it("NEET signature is 10-100 KB per the official bulletin", () => {
    expect(getPresetById("neet-ug-signature")?.kbMin).toBe(10)
    expect(getPresetById("neet-ug-signature")?.kbMax).toBe(100)
  })
})