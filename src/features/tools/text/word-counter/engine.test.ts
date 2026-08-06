import { describe, it, expect } from "vitest"
import { countWords } from "./engine"

describe("word counter engine", () => {
  it("counts words, characters and characters without spaces", () => {
    const r = countWords({ text: "Hello world" }).data
    expect(r.words).toBe(2)
    expect(r.characters).toBe(11)
    expect(r.charactersNoSpaces).toBe(10)
  })

  it("does NOT count standalone symbols or dashes as words", () => {
    expect(countWords({ text: "word - word" }).data.words).toBe(2)
    expect(countWords({ text: "- - -" }).data.words).toBe(0)
    expect(countWords({ text: "item 1 • item 2 • item 3" }).data.words).toBe(6)
  })

  it("keeps internal punctuation inside a word", () => {
    expect(countWords({ text: "don't well-known 3.14" }).data.words).toBe(3)
  })

  it("handles empty text", () => {
    const r = countWords({ text: "" }).data
    expect(r.words).toBe(0)
    expect(r.sentences).toBe(0)
    expect(r.paragraphs).toBe(0)
    expect(r.density).toEqual([])
  })

  it("counts sentences correctly", () => {
    expect(countWords({ text: "" }).data.sentences).toBe(0)
    expect(countWords({ text: "Hello world" }).data.sentences).toBe(1)
    expect(countWords({ text: "Hello world. How are you?" }).data.sentences).toBe(2)
    expect(
      countWords({ text: "First. Second! Third?" }).data.sentences,
    ).toBe(3)
    expect(countWords({ text: "Trailing fragment without punctuation" }).data.sentences).toBe(1)
  })

  it("counts paragraphs on blank lines", () => {
    const r = countWords({ text: "Para one.\n\nPara two.\n\n\nPara three." }).data
    expect(r.paragraphs).toBe(3)
  })

  it("computes reading time", () => {
    const r = countWords({ text: Array(200).fill("word").join(" ") }).data
    expect(r.readingTime).toBeCloseTo(60, 1)
  })
})