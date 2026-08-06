import { describe, it, expect } from "vitest"
import { countWords } from "./engine"

describe("word counter engine", () => {
  it("counts words, characters and characters without spaces", () => {
    const r = countWords({ text: "Hello world" }).data
    expect(r.words).toBe(2)
    expect(r.characters).toBe(11)
    expect(r.charactersNoSpaces).toBe(10)
  })

  it("handles empty text", () => {
    const r = countWords({ text: "" }).data
    expect(r.words).toBe(0)
    expect(r.sentences).toBe(0)
    expect(r.paragraphs).toBe(0)
    expect(r.density).toEqual([])
  })

  it("counts sentences and paragraphs", () => {
    const r = countWords({ text: "First sentence. Second sentence!\n\nNew paragraph." }).data
    expect(r.sentences).toBeGreaterThanOrEqual(2)
    expect(r.paragraphs).toBe(2)
  })

  it("computes reading time", () => {
    const r = countWords({ text: Array(200).fill("word").join(" ") }).data
    expect(r.readingTime).toBeCloseTo(60, 1)
  })
})