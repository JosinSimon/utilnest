import { describe, it, expect } from "vitest"
import { countLines } from "./engine"

function stats(text: string) {
  return countLines({ text }).data
}

describe("line-counter engine", () => {
  it("counts a single line", () => {
    const r = stats("hello")
    expect(r.lineCount).toBe(1)
    expect(r.nonEmptyLineCount).toBe(1)
    expect(r.blankLineCount).toBe(0)
  })

  it("counts multiple lines", () => {
    const r = stats("a\nb\nc")
    expect(r.lineCount).toBe(3)
  })

  it("counts empty text as zero", () => {
    const r = stats("")
    expect(r.lineCount).toBe(0)
  })

  it("handles CRLF line endings", () => {
    const r = stats("a\r\nb\r\nc")
    expect(r.lineCount).toBe(3)
  })

  it("does not count a single trailing newline as a new line", () => {
    const r = stats("a\nb\n")
    expect(r.lineCount).toBe(2)
  })

  it("counts blank lines in the middle", () => {
    const r = stats("a\n\nb")
    expect(r.lineCount).toBe(3)
    expect(r.blankLineCount).toBe(1)
    expect(r.nonEmptyLineCount).toBe(2)
  })

  it("counts whitespace-only lines as blanks", () => {
    const r = stats("a\n   \nb")
    expect(r.lineCount).toBe(3)
    expect(r.blankLineCount).toBe(1)
  })

  it("reports longest line length", () => {
    const r = stats("a\nlongest\nb")
    expect(r.longestLineLength).toBe(7)
  })

  it("reports average line length", () => {
    const r = stats("aa\nbbb\nc") // lengths 2,3,1 → 6/3 = 2
    expect(r.averageLineLength).toBe(2)
  })

  it("counts characters in the input", () => {
    const r = stats("abc\nd")
    expect(r.characterCount).toBe(5)
  })

  it("is deterministic", () => {
    expect(countLines({ text: "x\ny" })).toEqual(countLines({ text: "x\ny" }))
  })
})