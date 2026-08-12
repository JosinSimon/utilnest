import { describe, expect, it } from "vitest"
import { getToolBySlug } from "@/data/registry"

const phaseOnePages = [
  ["compress-image-to-50kb", "image", 50, undefined, undefined],
  ["compress-image-to-100kb", "image", 100, undefined, undefined],
  ["resize-signature-140x60", "government", 20, 140, 60],
  ["resize-photo-200x230", "government", 50, 200, 230],
] as const

describe("Phase 1 exact-intent page manifests", () => {
  it.each(phaseOnePages)("defines %s with exact presets", (slug, category, targetKb, width, height) => {
    const tool = getToolBySlug(slug)

    expect(tool).toBeDefined()
    expect(tool?.category).toBe(category)
    expect(tool?.preset?.targetKb).toBe(targetKb)
    expect(tool?.preset?.width).toBe(width)
    expect(tool?.preset?.height).toBe(height)
    expect(tool?.faq.length).toBeGreaterThanOrEqual(4)
    expect(tool?.howTo.length).toBeGreaterThanOrEqual(3)
    expect(tool?.sections.length).toBeGreaterThanOrEqual(3)
  })

  it("defines exam exact-intent pages with focused preset ids", () => {
    expect(getToolBySlug("neet-photo-size-2026")?.preset?.presetIds).toEqual([
      "neet-ug-photo",
      "neet-ug-signature",
    ])
    expect(getToolBySlug("ibps-photo-signature-resize")?.preset?.presetIds).toEqual([
      "ibps-po-photo",
      "ibps-signature",
    ])
    expect(getToolBySlug("ssc-signature-resize")?.preset?.presetIds).toEqual(["ssc-cgl-signature"])
  })

  it("defines high-intent image converter pages with output presets", () => {
    expect(getToolBySlug("jpg-to-png")?.preset?.outputFormat).toBe("png")
    expect(getToolBySlug("png-to-jpg")?.preset?.outputFormat).toBe("jpeg")
    expect(getToolBySlug("webp-to-png")?.preset?.outputFormat).toBe("png")
    expect(getToolBySlug("jpg-to-webp")?.preset?.outputFormat).toBe("webp")
  })
})
