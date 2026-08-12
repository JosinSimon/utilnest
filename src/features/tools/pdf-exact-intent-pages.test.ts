import { describe, expect, it } from "vitest"
import { getToolBySlug } from "@/data/registry"

const compressionPages = [
  ["compress-pdf-below-100kb", "1", 55],
  ["compress-pdf-below-200kb", "1", 60],
  ["compress-pdf-below-500kb", "2", 70],
] as const

describe("Phase 2 PDF exact-intent manifests", () => {
  it.each(compressionPages)("defines %s with compression presets", (slug, level, quality) => {
    const tool = getToolBySlug(slug)

    expect(tool?.category).toBe("pdf")
    expect(tool?.path).toBe("pdf/pdf-compress")
    expect(tool?.preset?.compressionLevel).toBe(level)
    expect(tool?.preset?.quality).toBe(quality)
    expect(tool?.faq.length).toBeGreaterThanOrEqual(4)
    expect(tool?.howTo.length).toBeGreaterThanOrEqual(4)
  })

  it("keeps high-intent PDF converter pages available as SEO hubs", () => {
    expect(getToolBySlug("pdf-to-jpg")?.primaryKeyword).toMatch(/pdf to jpg/i)
    expect(getToolBySlug("images-to-pdf")?.primaryKeyword).toMatch(/images to pdf/i)
  })
})
