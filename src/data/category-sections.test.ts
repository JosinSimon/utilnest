import { describe, expect, it } from "vitest"
import { categorySections } from "./category-sections"
import { allTools, getToolById } from "./registry"

describe("category sections", () => {
  it("groups image and government tools into curated sections", () => {
    expect(categorySections.image?.length).toBeGreaterThanOrEqual(3)
    expect(categorySections.government?.length).toBeGreaterThanOrEqual(2)
  })

  it("references only existing tool ids", () => {
    for (const sections of Object.values(categorySections)) {
      for (const section of sections) {
        for (const toolId of section.toolIds) {
          expect(getToolById(toolId), `${section.title} references ${toolId}`).toBeDefined()
        }
      }
    }
  })

  it("does not drop tools from grouped categories", () => {
    for (const [category, sections] of Object.entries(categorySections)) {
      const sectionToolIds = new Set(sections.flatMap((s) => s.toolIds))
      const categoryTools = allTools.filter((t) => t.category === category)
      for (const tool of categoryTools) {
        expect(sectionToolIds.has(tool.id), `${tool.id} missing from ${category} sections`).toBe(true)
      }
    }
  })
})
