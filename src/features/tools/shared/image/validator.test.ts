import { describe, it, expect } from "vitest"
import { validateAgainstPreset, validateGeneric } from "./validator"
import { PRESET_REGISTRY } from "./specs"
import type { ImageCandidate } from "./validator"
import type { OfficialSpecPreset } from "./types"

const preset: OfficialSpecPreset = PRESET_REGISTRY.find((p) => p.id === "ssc-cgl-photo")!

describe("validator preset", () => {
  it("accepts a compliant image", () => {
    const r = validateAgainstPreset(
      { width: 200, height: 230, bytes: 30 * 1024, format: "jpeg" } as ImageCandidate,
      preset,
    )
    expect(r.compliant).toBe(true)
  })

  it("rejects wrong format", () => {
    const r = validateAgainstPreset(
      { width: 200, height: 230, bytes: 30 * 1024, format: "png" } as ImageCandidate,
      preset,
    )
    expect(r.compliant).toBe(false)
    expect(r.issues).toContainEqual(expect.objectContaining({ code: "invalid_format" }))
  })

  it("rejects invalid dimensions", () => {
    const r = validateAgainstPreset(
      { width: 100, height: 120, bytes: 30 * 1024, format: "jpeg" } as ImageCandidate,
      preset,
    )
    expect(r.compliant).toBe(false)
    expect(r.issues).toContainEqual(expect.objectContaining({ code: "invalid_dimensions" }))
  })

  it("rejects file exceeding max", () => {
    const r = validateAgainstPreset(
      { width: 200, height: 230, bytes: 60 * 1024, format: "jpeg" } as ImageCandidate,
      preset,
    )
    expect(r.issues).toContainEqual(expect.objectContaining({ code: "file_too_large" }))
    expect(r.compliant).toBe(false)
  })

  it("rejects file below min", () => {
    const r = validateAgainstPreset(
      { width: 200, height: 230, bytes: 5 * 1024, format: "jpeg" } as ImageCandidate,
      preset,
    )
    expect(r.issues).toContainEqual(expect.objectContaining({ code: "file_too_small" }))
    expect(r.compliant).toBe(false)
  })

  it("yields background warning but stays compliant (informational)", () => {
    const r = validateAgainstPreset(
      {
        width: 200,
        height: 230,
        bytes: 30 * 1024,
        format: "jpeg",
        backgroundBrightness: 0.3,
      } as ImageCandidate,
      preset,
    )
    expect(r.issues).toContainEqual(expect.objectContaining({ code: "background_dark" }))
    // background never flips a compliant result
    expect(r.compliant).toBe(true)
  })
})

describe("validateGeneric", () => {
  it("accepts ok image", () => {
    const r = validateGeneric(
      { width: 400, height: 300, bytes: 30 * 1024, format: "jpeg" } as ImageCandidate,
      { kbMin: 20, kbMax: 50, acceptedFormats: ["jpeg"] },
    )
    expect(r.compliant).toBe(true)
  })

  it("rejects format not allowed", () => {
    const r = validateGeneric(
      { width: 400, height: 300, bytes: 30 * 1024, format: "png" } as ImageCandidate,
      { kbMin: 20, kbMax: 50, acceptedFormats: ["jpeg"] },
    )
    expect(r.compliant).toBe(false)
  })
})