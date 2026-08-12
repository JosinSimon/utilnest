import { describe, expect, it } from "vitest"
import { getToolBySlug } from "@/data/registry"
import { seoTitleFor } from "@/data/derive"

const emiPages = [
  ["home-loan-emi-calculator", 5000000, 8.5, 20],
  ["car-loan-emi-calculator", 1000000, 9.5, 5],
  ["personal-loan-emi-calculator", 500000, 13, 3],
] as const

describe("Phase 3 finance exact-intent manifests", () => {
  it.each(emiPages)(
    "defines %s reusing the EMI calculator with loan presets",
    (slug, principal, rate, tenure) => {
      const tool = getToolBySlug(slug)

      expect(tool?.category).toBe("finance")
      expect(tool?.path).toBe("finance/emi-calculator")
      expect(tool?.engine).toBe("calculator")
      expect(tool?.privacyNote).toBe("none")
      expect(tool?.schemaType).toBe("Calculator")
      expect(tool?.preset?.defaultPrincipal).toBe(principal)
      expect(tool?.preset?.defaultAnnualRate).toBe(rate)
      expect(tool?.preset?.defaultTenureYears).toBe(tenure)
      expect(tool?.faq.length).toBeGreaterThanOrEqual(4)
      expect(tool?.howTo.length).toBeGreaterThanOrEqual(4)
      expect(tool?.sections.length).toBeGreaterThanOrEqual(3)
    },
  )

  it("defines reverse-gst-calculator reusing the GST calculator in reverse mode", () => {
    const tool = getToolBySlug("reverse-gst-calculator")

    expect(tool?.category).toBe("finance")
    expect(tool?.path).toBe("finance/gst-calculator")
    expect(tool?.engine).toBe("calculator")
    expect(tool?.privacyNote).toBe("none")
    expect(tool?.schemaType).toBe("Calculator")
    expect(tool?.preset?.gstMode).toBe("reverse")
    expect(tool?.preset?.defaultGstRate).toBe(18)
    expect(tool?.faq.length).toBeGreaterThanOrEqual(4)
    expect(tool?.howTo.length).toBeGreaterThanOrEqual(4)
    expect(tool?.sections.length).toBeGreaterThanOrEqual(3)
  })

  it("gives each exact page a unique SEO title", () => {
    const titles = emiPages.map(([slug]) => seoTitleFor(getToolBySlug(slug)!))
    titles.push(seoTitleFor(getToolBySlug("reverse-gst-calculator")!))
    expect(new Set(titles).size).toBe(titles.length)
  })

  it("keeps generic finance calculators as SEO hubs", () => {
    expect(getToolBySlug("emi-calculator")?.primaryKeyword).toMatch(/emi calculator/i)
    expect(getToolBySlug("gst-calculator")?.primaryKeyword).toMatch(/gst calculator/i)
  })

  it("keeps income tax page targeting FY 2026-27", () => {
    const tool = getToolBySlug("income-tax-calculator")!
    const haystack = [
      tool.primaryKeyword,
      tool.shortDescription,
      ...tool.keywords,
      ...tool.sections.map((s) => `${s.heading} ${s.body}`),
      ...tool.faq.map((f) => `${f.question} ${f.answer}`),
      ...tool.searchAliases,
      seoTitleFor(tool),
    ].join(" ")

    expect(haystack).toMatch(/fy 2026-27/i)
  })
})