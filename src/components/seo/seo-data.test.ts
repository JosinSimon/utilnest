import { describe, expect, it } from "vitest"
import { headForRoute } from "@/app/prerender-head"
import { seoTitleFor, seoTitleForCategory } from "@/data/derive"
import { getToolBySlug, allTools } from "@/data/registry"
import { categories, categoryBySlug } from "@/data/categories"
import { categorySeoData, toolSeoData } from "./seo-data"

describe("SEO data", () => {
  it("builds clean tool titles without duplicated type words", () => {
    const emi = getToolBySlug("emi-calculator")
    const pdf = getToolBySlug("pdf-compress")

    expect(emi).toBeDefined()
    expect(pdf).toBeDefined()
    expect(seoTitleFor(emi!)).toBe("EMI Calculator India - Home, Car & Personal Loan EMI | UtilNest")
    expect(seoTitleFor(pdf!)).toBe("PDF Compressor Online Free - Compress PDF in Browser | UtilNest")
    expect(seoTitleFor(emi!)).not.toMatch(/calculator calculator/i)
    expect(seoTitleFor(pdf!)).not.toMatch(/generator generator|compress pdf generator/i)
  })

  it("builds clean category titles", () => {
    const image = categoryBySlug("image")
    const pdf = categoryBySlug("pdf")

    expect(image).toBeDefined()
    expect(pdf).toBeDefined()
    expect(seoTitleForCategory(image!)).toBe("Free Image Tools Online - Resize, Compress, Convert JPG/PNG | UtilNest")
    expect(seoTitleForCategory(pdf!)).toBe("Free PDF Tools Online - Compress, Merge, Split & Convert | UtilNest")
  })

  it("includes category FAQ schema in prerendered category head", () => {
    const head = headForRoute({ path: "/category/image", kind: "category", categorySlug: "image" })

    expect(head).toContain('"@type":"FAQPage"')
    expect(head).toContain("Are all image tools on UtilNest 100% free?")
  })

  it("uses a real shared OG image instead of missing per-page image paths", () => {
    const emi = getToolBySlug("emi-calculator")!
    const image = categoryBySlug("image")!

    expect(toolSeoData(emi).og.image).toBe("https://utilnest.in/og/default.png")
    expect(categorySeoData(image).og.image).toBe("https://utilnest.in/og/default.png")
  })

  it("keeps every tool title and description clean for search snippets", () => {
    for (const tool of allTools) {
      const data = toolSeoData(tool)

      expect(data.title).toContain("| UtilNest")
      expect(data.title).not.toMatch(/\b(calculator|converter|generator|utility) \1\b/i)
      expect(data.title).not.toMatch(/ generator - Free Online Tool| utility - Free Online Tool| calculator - Free Online Tool/i)
      expect(data.title.length).toBeGreaterThanOrEqual(25)
      expect(data.title.length).toBeLessThanOrEqual(75)
      expect(data.description.length).toBeGreaterThanOrEqual(50)
      expect(data.description.length).toBeLessThanOrEqual(165)
      expect(data.canonical).toBe(`https://utilnest.in/category/${tool.category}/${tool.slug}`)
      expect(data.robots).toBe("index, follow")
    }
  })

  it("keeps every category indexable with clean title, FAQ schema, and canonical", () => {
    for (const category of categories) {
      const data = categorySeoData(category)
      const head = headForRoute({
        path: `/category/${category.slug}`,
        kind: "category",
        categorySlug: category.slug,
      })

      expect(data.title).toContain("| UtilNest")
      expect(data.title).not.toMatch(/\[object Object\]|Images Tools|Calculators & Tools/i)
      expect(data.canonical).toBe(`https://utilnest.in/category/${category.slug}`)
      expect(head).toContain('"@type":"FAQPage"')
    }
  })
})
